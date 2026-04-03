import { Resend } from 'resend';
import { config } from '../config/index.js';
import { prisma } from '../models/index.js';
import { withRetry } from '../utils/retry.js';
import type { MailEvent } from '../types/events.js';
import { renderMail } from '../templates/mail/index.js';

const resend = new Resend(config.resend.apiKey);

/**
 * Determine whether a Resend error is retryable.
 * The Resend SDK error objects expose a `statusCode` property for HTTP errors.
 * 4xx (except 429) = unrecoverable. 429 and 5xx = retryable. No statusCode = network error (retryable).
 */
const isResendRetryable = (err: unknown): boolean => {
  const e = err as { statusCode?: number };
  if (typeof e.statusCode === 'number') {
    return e.statusCode === 429 || e.statusCode >= 500;
  }
  return true; // network errors have no statusCode
};

const sendViaResend = async (
  to: string,
  subject: string,
  html: string,
): Promise<string> => {
  type ResendResult = {
    data: { id: string } | null;
    error: { message: string; statusCode?: number } | null;
  };

  let result: ResendResult;
  try {
    result = (await resend.emails.send({
      from: config.resend.from,
      to,
      subject,
      html,
    })) as ResendResult;
  } catch (err) {
    // Network-level error (no HTTP response)
    const e = err as Error;
    throw Object.assign(new Error(e.message), { retryable: true });
  }

  if (result.error) {
    throw Object.assign(
      new Error(result.error.message),
      { retryable: isResendRetryable(result.error) },
    );
  }

  return result.data!.id;
};

export const MailService = {
  async handle(event: MailEvent): Promise<void> {
    const { subject, html } = renderMail(event);
    const recipient = event.email;
    let providerRef: string | undefined;
    let attempts = 0;
    let lastError: string | undefined;

    try {
      const { result, attempts: a } = await withRetry(
        () => sendViaResend(recipient, subject, html),
        3,
      );
      attempts = a;
      providerRef = result;
    } catch (err) {
      const e = err as Error;
      lastError = e.message;
      attempts = 3;

      await prisma.notificationLog.create({
        data: {
          channel: 'mail',
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
        channel: 'mail',
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
