import { countRecentContactMessages, databaseConfigured } from '@/lib/db';

/**
 * In-memory rate limiter. Resets whenever the serverless instance recycles and
 * is not shared between instances, so it is a fast local speed bump. Use
 * `contactRateLimit()` for the contact endpoint, which also consults the
 * database when one is configured.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);
  return true;
}

/**
 * Contact-form rate limit: the in-memory limiter as a fast path, plus a count
 * of stored submissions for the same IP so the limit holds across instances.
 * Fails open (allows the request) if the database check errors.
 */
export async function contactRateLimit(ip: string, limit = 5, windowMs = 60 * 60 * 1000): Promise<boolean> {
  if (!rateLimit(`contact:${ip}`, limit, windowMs)) return false;

  if (databaseConfigured()) {
    try {
      const recent = await countRecentContactMessages(ip, Math.round(windowMs / 60000));
      if (recent >= limit) return false;
    } catch (error) {
      console.error('Rate-limit database check failed; allowing request.', error);
    }
  }

  return true;
}
