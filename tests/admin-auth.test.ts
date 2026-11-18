import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  adminConfigured,
  createAdminSession,
  verifyAdminPassword,
  verifyAdminSession,
} from '@/lib/admin-auth';

const PASSWORD = 'a-strong-password';
const SECRET = '0123456789abcdef0123456789abcdef';

const originalPassword = process.env.ADMIN_PASSWORD;
const originalSecret = process.env.ADMIN_SESSION_SECRET;

beforeEach(() => {
  process.env.ADMIN_PASSWORD = PASSWORD;
  process.env.ADMIN_SESSION_SECRET = SECRET;
});

afterEach(() => {
  if (originalPassword === undefined) delete process.env.ADMIN_PASSWORD;
  else process.env.ADMIN_PASSWORD = originalPassword;

  if (originalSecret === undefined) delete process.env.ADMIN_SESSION_SECRET;
  else process.env.ADMIN_SESSION_SECRET = originalSecret;
});

describe('adminConfigured', () => {
  it('requires both the password and the signing secret', () => {
    expect(adminConfigured()).toBe(true);
    delete process.env.ADMIN_SESSION_SECRET;
    expect(adminConfigured()).toBe(false);
  });
});

describe('verifyAdminPassword', () => {
  it('accepts the exact password and rejects everything else', () => {
    expect(verifyAdminPassword(PASSWORD)).toBe(true);
    expect(verifyAdminPassword('wrong')).toBe(false);
    expect(verifyAdminPassword('')).toBe(false);
  });
});

describe('admin sessions', () => {
  it('creates a token that verifies', () => {
    const now = 1_700_000_000_000;
    const token = createAdminSession(now);
    expect(verifyAdminSession(token, now + 1000)).toBe(true);
  });

  it('rejects a token with a modified payload or signature', () => {
    const token = createAdminSession(1_700_000_000_000);
    const tampered = `${token.slice(0, -2)}zz`;
    expect(verifyAdminSession(tampered, 1_700_000_000_000)).toBe(false);
  });

  it('rejects expired and malformed tokens', () => {
    const now = 1_700_000_000_000;
    const token = createAdminSession(now);
    expect(verifyAdminSession(token, now + 8 * 24 * 60 * 60 * 1000)).toBe(false);
    expect(verifyAdminSession('not-a-token', now)).toBe(false);
    expect(verifyAdminSession(undefined, now)).toBe(false);
  });

  it('rejects tokens signed with a different secret', () => {
    const token = createAdminSession(1_700_000_000_000);
    process.env.ADMIN_SESSION_SECRET = 'a-completely-different-secret';
    expect(verifyAdminSession(token, 1_700_000_000_000)).toBe(false);
  });
});
