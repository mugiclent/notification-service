import amqplib from 'amqplib';
import type { Channel, ChannelModel } from 'amqplib';
import { config } from '../config/index.js';
import { startSmsSubscriber } from '../subscribers/sms.subscriber.js';
import { startMailSubscriber } from '../subscribers/mail.subscriber.js';

let connection: ChannelModel;
let smsChannel: Channel;
let mailChannel: Channel;

/**
 * Topology (asserted idempotently on startup):
 *
 *  notifications exchange (topic)
 *    ├── sms  queue  ←── routing key: sms.notifications  (DLX → notifications.dlx)
 *    └── mail queue  ←── routing key: mail.notifications (DLX → notifications.dlx)
 *
 *  notifications.dlx exchange (fanout) — dead-letter sink
 *    └── notifications.dead queue ←── all rejected messages land here
 *
 * Two channels — one per queue — so SMS retries don't block mail delivery.
 * Each channel has prefetch(1): holds exactly one UNACKED message at a time.
 * If the process crashes mid-retry, the broker requeues the unacked message.
 *
 * NOTE: If sms/mail queues were previously created WITHOUT x-dead-letter-exchange,
 * they must be deleted in the RabbitMQ management UI before restarting, then
 * restart the rabbitmq container to recreate them from definitions.json.
 * Queue arguments are immutable once declared.
 */
export const initRabbitMQ = async (): Promise<void> => {
  connection = await amqplib.connect(config.rabbitmq.url);

  smsChannel  = await connection.createChannel();
  mailChannel = await connection.createChannel();

  // Independent prefetch budgets — SMS retry sleep won't block mail processing
  await smsChannel.prefetch(1);
  await mailChannel.prefetch(1);

  // Assert topology (idempotent — safe if already created by user-service or definitions.json)
  for (const ch of [smsChannel, mailChannel]) {
    await ch.assertExchange('notifications.dlx', 'fanout', { durable: true });
    await ch.assertQueue('notifications.dead', { durable: true });
    await ch.bindQueue('notifications.dead', 'notifications.dlx', '');
    await ch.assertExchange('notifications', 'topic', { durable: true });
  }

  await smsChannel.assertQueue('sms', {
    durable: true,
    arguments: { 'x-dead-letter-exchange': 'notifications.dlx' },
  });
  await mailChannel.assertQueue('mail', {
    durable: true,
    arguments: { 'x-dead-letter-exchange': 'notifications.dlx' },
  });

  await startSmsSubscriber(smsChannel);
  await startMailSubscriber(mailChannel);

  console.warn('[rabbitmq] Connected — smsChannel and mailChannel consuming');
};

export const closeRabbitMQ = async (): Promise<void> => {
  await smsChannel?.close();
  await mailChannel?.close();
  await connection?.close();
};
