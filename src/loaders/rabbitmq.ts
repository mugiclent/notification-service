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

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

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
 * The `notifications` exchange is the command inbox router for this service.
 * Publishers (user-service, trip-service, etc.) address commands here using a
 * routing key that identifies the delivery channel (sms.*, mail.*, push.*).
 * This service owns its queues and bindings; it only checks the exchange exists.
 *
 * Two channels — one per queue — so SMS retries don't block mail delivery.
 * Each channel has prefetch(1): holds exactly one UNACKED message at a time.
 * If the process crashes mid-retry, the broker requeues the unacked message.
 *
 * NOTE: If sms/mail queues were previously created WITHOUT x-dead-letter-exchange,
 * they must be deleted in the RabbitMQ management UI before restarting.
 * Queue arguments are immutable once declared.
 */
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

  // Register handlers immediately after connect — before any channel work.
  // This way, if anything below throws and we close the connection, scheduleReconnect
  // fires and the isReconnecting guard prevents a double-reconnect.
  connection.on('close', scheduleReconnect);
  connection.on('error', (err: Error) => {
    // 'close' always fires after 'error' — reconnect logic lives in scheduleReconnect
    console.warn('[rabbitmq] Connection error:', err.message);
  });

  smsChannel  = await connection.createChannel();
  mailChannel = await connection.createChannel();

  // Independent prefetch budgets — SMS retry sleep won't block mail processing
  await smsChannel.prefetch(1);
  await mailChannel.prefetch(1);

  // Verify pre-defined exchanges exist (broker asserts these from definitions.json at startup).
  // checkExchange throws a channel error if the exchange is absent — we do NOT recreate it.
  await smsChannel.checkExchange('notifications');
  await smsChannel.checkExchange('notifications.dlx');

  // Dead-letter sink — owned by this service, not pre-defined in definitions.json
  await smsChannel.assertQueue('notifications.dead', { durable: true });
  await smsChannel.bindQueue('notifications.dead', 'notifications.dlx', '');

  // Inbox queues — this service declares and owns these, bound to the notifications exchange
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

  console.warn('[rabbitmq] Connected — smsChannel and mailChannel consuming');
};

/**
 * Called when the connection closes unexpectedly. Retries setup() indefinitely
 * until the broker is back. isReconnecting prevents concurrent attempts.
 */
const scheduleReconnect = (): void => {
  if (isShuttingDown || isReconnecting) return;
  isReconnecting = true;
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
        // setup() got a connection but failed during channel/topology setup — close
        // the leaked connection. The close event fires but isReconnecting guards it.
        try { await connection?.close(); } catch { /* already closed */ }
      }
    }
  })();
};

export const initRabbitMQ = async (): Promise<void> => {
  await setup();
};

export const closeRabbitMQ = async (): Promise<void> => {
  isShuttingDown = true;
  await smsChannel?.close();
  await mailChannel?.close();
  await connection?.close();
};
