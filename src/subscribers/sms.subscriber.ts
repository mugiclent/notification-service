import type { Channel, ConsumeMessage } from 'amqplib';
import type { SmsEvent } from '../types/events.js';
import { SmsService } from '../services/sms.service.js';

export const startSmsSubscriber = async (channel: Channel): Promise<void> => {
  await channel.consume('sms', (msg: ConsumeMessage | null) => {
    if (!msg) return; // consumer cancelled by broker

    // Parse synchronously before going async so we can nack on bad JSON immediately
    let event: SmsEvent;
    try {
      event = JSON.parse(msg.content.toString()) as SmsEvent;
    } catch {
      console.error('[sms.subscriber] Malformed JSON — nacking to DLX');
      channel.nack(msg, false, false);
      return;
    }

    // Intentionally not awaited at the outer level — amqplib's consume callback
    // is synchronous. We manage ack/nack ourselves inside the promise chain.
    void (async () => {
      try {
        await SmsService.handle(event);
        try { channel.ack(msg); } catch { /* channel closed; broker requeues */ }
      } catch (err) {
        // SmsService.handle() already logged and exhausted retries.
        console.error('[sms.subscriber] Delivery failed — sending to DLX', {
          type: event.type,
          error: (err as Error).message,
        });
        // Channel may have closed while the handler was running (broker restart).
        // Swallow the nack error — the broker already requeued the unacked message.
        try { channel.nack(msg, false, false); } catch { /* channel closed */ }
      }
    })();
  });

  console.warn('[sms.subscriber] Consuming from sms queue');
};
