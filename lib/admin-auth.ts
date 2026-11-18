import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

/**
 * Minimal admin session for the download manager. A password from the
 * environment is exchanged for an HMAC-signed, expiring cookie — no user
 * database or third-party auth provider is needed for a single admin.
 */

export const ADMIN_COOKIE = 'teto_admin_session';

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

type Session = {
  sub: 'admin';
  iat: number;
  exp: number;
};

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET?.trim() ?? '';
}

/** True when both the password and signing secret have been supplied. */
export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && sessionSecret());
}

/** Constant-time comparison so the password is not leaked through timing. */
export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const supplied = Buffer.from(password, 'utf8');
  const stored = Buffer.from(expected, 'utf8');
  if (supplied.length !== stored.length) return false;

  return timingSafeEqual(supplied, stored);
}

function base64url(value: Buffer): string {
  return value.toString('base64url');
}

/** Create a signed session token. `now` is injectable for tests. */
export function createAdminSession(now = Date.now()): string {
  const secret = sessionSecret();
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set.');

  const payload: Session = {
    sub: 'admin',
    iat: now,
    exp: now + SESSION_TTL_SECONDS * 1000,
  };

  const body = base64url(Buffer.from(JSON.stringify(payload), 'utf8'));
  const signature = base64url(createHmac('sha256', secret).update(body).digest());
  return `${body}.${signature}`;
}

/** Verify signature, shape and expiry. `now` is injectable for tests. */
export function verifyAdminSession(token: string | undefined, now = Date.now()): boolean {
  const secret = sessionSecret();
  if (!token || !secret) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [body, signature] = parts as [string, string];

  const expected = createHmac('sha256', secret).update(body).digest();
  let supplied: Buffer;
  try {
    supplied = Buffer.from(signature, 'base64url');
  } catch {
    return false;
  }
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Partial<Session>;
    return payload.sub === 'admin' && typeof payload.exp === 'number' && payload.exp > now;
  } catch {
    return false;
  }
}

/** Read and verify the admin cookie in a Server Component or Route Handler. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifyAdminSession(store.get(ADMIN_COOKIE)?.value);
}

/** Attributes shared by the login and logout responses. */
export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_TTL_SECONDS,
};
