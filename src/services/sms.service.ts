import { config } from '../config/index.js';
import { prisma } from '../models/index.js';
import { withRetry } from '../utils/retry.js';
import type { SmsEvent } from '../types/events.js';
import { renderSms } from '../templates/sms/index.js';

interface BulkSmsSuccessResponse {
  trackId: string;
  smsCount: number;
  message: string;
}

const sendViaBulkSms = async (
  phoneNumber: string,
  message: string,
): Promise<BulkSmsSuccessResponse> => {
  const res = await fetch(config.bulksms.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apiKey: config.bulksms.apiKey,
    },
    body: JSON.stringify({
      senderId: config.bulksms.senderId,
      recipients: [phoneNumber],
      message,
    }),
  });

  if (res.status === 201) {
    return res.json() as Promise<BulkSmsSuccessResponse>;
  }

  let body = '';
  try {
    body = await res.text();
  } catch { /* ignore */ }

  const err = Object.assign(
    new Error(`bulksms.rw HTTP ${res.status}: ${body}`),
    {
      // 4xx (except 429) = unrecoverable client error — bad phone, inactive key, etc.
      // 429 = rate limited — retryable
      // 5xx = server error — retryable
      retryable: res.status === 429 || res.status >= 500,
    },
  );

  throw err;
};

export const SmsService = {
  async handle(event: SmsEvent): Promise<void> {
    const message = renderSms(event);
    const recipient = event.phone_number;
    let providerRef: string | undefined;
    let attempts = 0;
    let lastError: string | undefined;

    try {
      const { result, attempts: a } = await withRetry(
        () => sendViaBulkSms(recipient, message),
        3,
      );
      attempts = a;
      providerRef = result.trackId;
    } catch (err) {
      const e = err as Error;
      lastError = e.message;
      attempts = 3;

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
        provider_ref: providerRef,
        payload: event as object,
      },
    });
  },
};
