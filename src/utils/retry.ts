/** Delays in ms for attempts 2 and 3 (attempt 1 is immediate). */
const BACKOFF_MS = [0, 2_000, 8_000] as const;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Execute `fn` up to `maxAttempts` times with exponential backoff.
 *
 * - Returns `{ result, attempts }` on success.
 * - Throws the last error after all attempts are exhausted.
 *
 * Errors tagged with `retryable: false` are re-thrown immediately without
 * further attempts (e.g. HTTP 4xx from a provider — bad data won't fix itself).
 * All other errors are retried (5xx, 429, network failures).
 *
 * The caller is responsible for tagging provider errors:
 *   Object.assign(err, { retryable: false })
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
): Promise<{ result: T; attempts: number }> => {
  let lastError: Error = new Error('Unknown error');

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (attempt > 1) {
      await sleep(BACKOFF_MS[attempt - 1] ?? 8_000);
    }

    try {
      const result = await fn();
      return { result, attempts: attempt };
    } catch (err) {
      const e = err as Error & { retryable?: boolean };
      lastError = e;

      // Unrecoverable — propagate immediately without further retries
      if (e.retryable === false) {
        throw e;
      }

      console.warn(`[retry] Attempt ${attempt}/${maxAttempts} failed: ${e.message}`);
    }
  }

  throw lastError;
};
