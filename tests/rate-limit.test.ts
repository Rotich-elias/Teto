import { describe, expect, it } from 'vitest';
import { rateLimit } from '@/lib/rate-limit';

function uniqueKey(): string {
  return `test:${Math.random().toString(36).slice(2)}`;
}

describe('rateLimit', () => {
  it('allows requests up to the limit and then blocks', () => {
    const key = uniqueKey();

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(rateLimit(key, 5)).toBe(true);
    }

    expect(rateLimit(key, 5)).toBe(false);
  });

  it('tracks keys independently', () => {
    const first = uniqueKey();
    const second = uniqueKey();

    for (let attempt = 0; attempt < 5; attempt += 1) {
      rateLimit(first, 5);
    }

    expect(rateLimit(first, 5)).toBe(false);
    expect(rateLimit(second, 5)).toBe(true);
  });
});
