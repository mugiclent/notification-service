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
        try { channel.ack(msg); } catch { /* channel closed; broker requeues */ }
      } catch (err) {
        console.error('[mail.subscriber] Delivery failed — sending to DLX', {
          type: event.type,
          error: (err as Error).message,
        });
        // Channel may have closed while the handler was running (broker restart).
        // Swallow the nack error — the broker already requeued the unacked message.
        try { channel.nack(msg, false, false); } catch { /* channel closed */ }
      }
    })();
  });

  console.warn('[mail.subscriber] Consuming from mail queue');
};
