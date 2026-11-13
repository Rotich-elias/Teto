/**
 * Best-effort in-memory rate limiter for the contact endpoint.
 *
 * This resets whenever the serverless instance recycles and is not shared
 * between instances, so it is a speed bump rather than a hard guarantee.
 * Put a real limiter (e.g. Upstash Redis) in front of it for production
 * abuse protection.
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
