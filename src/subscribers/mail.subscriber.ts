import type { Channel, ConsumeMessage } from 'amqplib';
import type { MailEvent } from '../types/events.js';
import { MailService } from '../services/mail.service.js';

export const startMailSubscriber = async (channel: Channel): Promise<void> => {
  await channel.consume('mail', (msg: ConsumeMessage | null) => {
    if (!msg) return; // consumer cancelled by broker

    let event: MailEvent;
    try {
      event = JSON.parse(msg.content.toString()) as MailEvent;
    } catch {
      console.error('[mail.subscriber] Malformed JSON — nacking to DLX');
      channel.nack(msg, false, false);
      return;
    }

    void (async () => {
      try {
        await MailService.handle(event);
        channel.ack(msg);
      } catch (err) {
        console.error('[mail.subscriber] Delivery failed — sending to DLX', {
          type: event.type,
          error: (err as Error).message,
        });
        channel.nack(msg, false, false);
      }
    })();
  });

  console.warn('[mail.subscriber] Consuming from mail queue');
};
