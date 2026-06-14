import { config } from '../config/index.js';
import { prisma } from '../models/index.js';
import { withRetry } from '../utils/retry.js';
import type { SmsEvent } from '../types/events.js';
import { renderSms } from '../templates/sms/index.js';

interface ItecSmsResponse {
  status: number;
  message: string;
}

// itecsms.rw only routes bare MSISDNs (250XXXXXXXXX). It still answers 200 /
// "sent successfully" for a "+250…" or "07…" number but silently drops it, so we
// must normalise the recipient before sending.
const toMsisdn = (phone: string): string => {
  const digits = phone.replace(/\D/g, ''); // strip "+", spaces, dashes
  if (digits.startsWith('250')) return digits;
  if (digits.startsWith('0')) return `250${digits.slice(1)}`; // 07… → 2507…
  return digits;
};

// itecsms silently drops (200 "sent" but never delivered) any message containing a
// character outside the GSM 03.38 alphabet — e.g. "→", or "û" in the French month
// "août". Fold the message to a GSM-safe form: keep supported characters (incl. GSM
// accents like é/è/à/ç), transliterate other accented letters to ASCII (û→u, â→a),
// substitute known symbols, and drop anything else.
const GSM_CHARS = new Set([
  ...' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\n\r',
  ...'£¥¤€§¿¡',
  ...'èéùìòÇØøÅåÆæßÉÄÖÑÜàäöñü',
]);

const SYMBOL_SUBS: Record<string, string> = {
  '→': '>', '←': '<', '↔': '-', '–': '-', '—': '-', '…': '...',
  '’': "'", '‘': "'", '“': '"', '”': '"', '«': '"', '»': '"', ' ': ' ',
};

const toGsmSafe = (text: string): string =>
  [...text]
    .map((ch) => {
      if (GSM_CHARS.has(ch)) return ch;
      if (ch in SYMBOL_SUBS) return SYMBOL_SUBS[ch];
      const folded = ch.normalize('NFD').replace(/[̀-ͯ]/g, '');
      return [...folded].every((c) => GSM_CHARS.has(c)) ? folded : '';
    })
    .join('');

const sendViaItecSms = async (
  phoneNumber: string,
  message: string,
): Promise<void> => {
  const res = await fetch(config.itecsms.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      key: config.itecsms.apiKey,
      message: toGsmSafe(message),
      recipients: [toMsisdn(phoneNumber)],
    }),
  });

  // Parse defensively. The provider is expected to return a JSON body with its
  // own `status` field, but an empty or non-JSON body (gateway error page, blank
  // 200) must surface as a tagged delivery error — never an unhandled JSON.parse
  // crash, which `withRetry` would otherwise treat as a retryable failure.
  const raw = await res.text();
  let data: Partial<ItecSmsResponse> = {};
  try {
    if (raw) data = JSON.parse(raw) as ItecSmsResponse;
  } catch {
    /* non-JSON body — handled by the failure path below */
  }

  if (data.status === 200) return;

  // Retry only transient transport failures (429 / 5xx); a malformed response or
  // a business rejection won't be fixed by retrying.
  const detail = data.message ?? (raw ? raw.slice(0, 200) : 'empty response body');
  const err = Object.assign(
    new Error(`itecsms.rw error: HTTP ${res.status}${data.status !== undefined ? ` / status ${data.status}` : ''} — ${detail}`),
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

    let deliveryError: (Error & { attempts?: number }) | undefined;

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
      deliveryError = e;
    }

    // Logging is best-effort — a transient DB/PgBouncer failure must not nack
    // a message that was already delivered (or already failed delivery).
    try {
      await prisma.notificationLog.create({
        data: {
          channel: 'sms',
          type: event.type,
          recipient,
          status: deliveryError ? 'dead' : 'sent',
          attempts,
          error: lastError,
          payload: event as object,
        },
      });
    } catch (logErr) {
      console.error('[sms.service] Failed to write notification log', logErr);
    }

    if (deliveryError) throw deliveryError;
  },
};
