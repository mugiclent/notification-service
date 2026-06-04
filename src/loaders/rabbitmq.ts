import amqplib from 'amqplib';
import type { Channel, ChannelModel } from 'amqplib';
import { config } from '../config/index.js';
import { startSmsSubscriber } from '../subscribers/sms.subscriber.js';
import { startMailSubscriber } from '../subscribers/mail.subscriber.js';

const RETRY_DELAY_MS = 3_000;

let connection: ChannelModel;
let smsChannel: Channel;
let mailChannel: Channel;
let isShuttingDown = false;
let isReconnecting = false;
let isReconnectingChannel = false;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ── Health state ──────────────────────────────────────────────────────────────

type RabbitHealth = { ok: boolean; error?: string };
let rabbitHealth: RabbitHealth = { ok: false, error: 'not yet connected' };

export const getRabbitMQHealth = (): RabbitHealth => rabbitHealth;

// ── Channel setup ─────────────────────────────────────────────────────────────

/**
 * Inbox/command pattern topology:
 *
 *  notifications exchange (topic) — pre-defined in definitions.json, checked not asserted
 *    ├── sms  queue  ←── routing key: sms.notifications  (DLX → notifications.dlx)
 *    └── mail queue  ←── routing key: mail.notifications (DLX → notifications.dlx)
 *
 *  notifications.dlx exchange (fanout) — pre-defined, dead-letter sink
 *    └── notifications.dead queue ←── all rejected messages land here
 *
 * Two channels — one per queue — so SMS retries don't block mail delivery.
 * Each channel has prefetch(1): holds exactly one UNACKED message at a time.
 * If the process crashes mid-retry the broker requeues the unacked message.
 */
const setupChannels = async (): Promise<void> => {
  smsChannel  = await connection.createChannel();
  mailChannel = await connection.createChannel();

  await smsChannel.prefetch(1);
  await mailChannel.prefetch(1);

  // Verify pre-defined exchanges exist (broker asserts from definitions.json at startup).
  // checkExchange throws if absent — we do NOT recreate exchanges.
  await smsChannel.checkExchange('notifications');
  await smsChannel.checkExchange('notifications.dlx');

  // Dead-letter sink — owned by this service
  await smsChannel.assertQueue('notifications.dead', { durable: true });
  await smsChannel.bindQueue('notifications.dead', 'notifications.dlx', '');

  // Inbox queues
  await smsChannel.assertQueue('sms', {
    durable: true,
    arguments: { 'x-dead-letter-exchange': 'notifications.dlx' },
  });
  await smsChannel.bindQueue('sms', 'notifications', 'sms.notifications');

  await mailChannel.assertQueue('mail', {
    durable: true,
    arguments: { 'x-dead-letter-exchange': 'notifications.dlx' },
  });
  await mailChannel.bindQueue('mail', 'notifications', 'mail.notifications');

  await startSmsSubscriber(smsChannel);
  await startMailSubscriber(mailChannel);

  rabbitHealth = { ok: true };
  console.warn('[rabbitmq] Connected — smsChannel and mailChannel consuming');

  // Channel-level error/close handlers — a broker-forced channel close (e.g. a
  // protocol error) doesn't take down the whole connection, but it does kill the
  // consumer. Recreate channels without triggering a full reconnect.
  for (const [name, ch] of [['sms', smsChannel], ['mail', mailChannel]] as [string, Channel][]) {
    ch.on('error', (err: Error) => {
      console.warn(`[rabbitmq] ${name}Channel error:`, err.message);
      // 'close' fires after 'error' — reconnect logic lives in the close handler
    });

    ch.on('close', () => {
      // If the connection is gone, scheduleReconnect already owns recovery — skip
      if (isShuttingDown || isReconnecting || isReconnectingChannel) return;
      isReconnectingChannel = true;
      rabbitHealth = { ok: false, error: `${name}Channel closed — re-creating` };
      console.warn(`[rabbitmq] ${name}Channel closed — re-creating in ${RETRY_DELAY_MS / 1000}s`);
      setTimeout(() => {
        void setupChannels()
          .catch((err: Error) => {
            // Connection is gone — scheduleReconnect will do a full reconnect
            console.warn('[rabbitmq] Failed to re-create channels:', err.message);
          })
          .finally(() => {
            isReconnectingChannel = false;
          });
      }, RETRY_DELAY_MS);
    });
  }
};

// ── Connection setup ──────────────────────────────────────────────────────────

const setup = async (): Promise<void> => {
  // Connect with indefinite retry
  for (let attempt = 1; ; attempt++) {
    try {
      connection = await amqplib.connect(config.rabbitmq.url);
      break;
    } catch {
      console.warn(`[rabbitmq] Broker not ready (attempt ${attempt}) — retrying in ${RETRY_DELAY_MS / 1000}s`);
      await sleep(RETRY_DELAY_MS);
    }
  }

  // Register connection handlers immediately after connect — before any channel work.
  // If anything below throws and the connection closes, scheduleReconnect fires and
  // the isReconnecting guard prevents a concurrent second attempt.
  connection.on('close', scheduleReconnect);
  connection.on('error', (err: Error) => {
    // 'close' always fires after 'error' — reconnect logic lives in scheduleReconnect
    console.warn('[rabbitmq] Connection error:', err.message);
  });

  await setupChannels();
};

/**
 * Called when the connection closes unexpectedly. Retries setup() indefinitely
 * until the broker is back. isReconnecting prevents concurrent attempts.
 */
const scheduleReconnect = (): void => {
  if (isShuttingDown || isReconnecting) return;
  isReconnecting = true;
  rabbitHealth = { ok: false, error: 'connection lost — reconnecting' };
  console.warn('[rabbitmq] Connection lost — reconnecting...');

  void (async () => {
    for (;;) {
      await sleep(RETRY_DELAY_MS);
      try {
        await setup();
        isReconnecting = false;
        return;
      } catch (err) {
        console.warn('[rabbitmq] Reconnect attempt failed:', (err as Error).message);
        // Close the leaked connection if setup got one but failed during channel setup.
        // The close event fires but isReconnecting guards it from double-entry.
        try { await connection?.close(); } catch { /* already closed */ }
      }
    }
  })();
};

// ── Public lifecycle ──────────────────────────────────────────────────────────

export const initRabbitMQ = async (): Promise<void> => {
  await setup();
};

export const closeRabbitMQ = async (): Promise<void> => {
  isShuttingDown = true;
  await smsChannel?.close();
  await mailChannel?.close();
  await connection?.close();
};
