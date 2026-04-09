import { config } from '../config/index.js';
import { prisma } from '../models/index.js';
import { withRetry } from '../utils/retry.js';
import type { SmsEvent } from '../types/events.js';
import { renderSms } from '../templates/sms/index.js';

interface ItecSmsResponse {
  status: number;
  message: string;
}

const sendViaItecSms = async (
  phoneNumber: string,
  message: string,
): Promise<void> => {
  const res = await fetch(config.itecsms.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: config.itecsms.apiKey,
      message,
      recipients: [phoneNumber],
    }),
  });

  const data = await res.json() as ItecSmsResponse;

  if (data.status === 200) return;

  const err = Object.assign(
    new Error(`itecsms.rw error ${data.status}: ${data.message}`),
    { retryable: res.status === 429 || res.status >= 500 },
  );

  throw err;
};

export const SmsService = {
  async handle(event: SmsEvent): Promise<void> {
    const message = renderSms(event);
    const recipient = event.phone_number;
    let attempts = 0;
    let lastError: string | undefined;

    try {
      const { attempts: a } = await withRetry(
        () => sendViaItecSms(recipient, message),
        3,
      );
      attempts = a;
    } catch (err) {
      const e = err as Error & { attempts?: number };
      lastError = e.message;
      attempts = e.attempts ?? 3;

      await prisma.notificationLog.create({
        data: {
          channel: 'sms',
          type: event.type,
          recipient,
          status: 'dead',
          attempts,
          error: lastError,
          payload: event as object,
        },
      });

      throw e;
    }

    await prisma.notificationLog.create({
      data: {
        channel: 'sms',
        type: event.type,
        recipient,
        status: 'sent',
        attempts,
        payload: event as object,
      },
    });
  },
};
