import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  adminConfigured,
  adminCookieOptions,
  createAdminSession,
  verifyAdminPassword,
} from '@/lib/admin-auth';
import { rateLimit } from '@/lib/rate-limit';

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** Exchange the admin password for a signed, httpOnly session cookie. */
export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: 'Admin login is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET.' },
      { status: 503 },
    );
  }

  if (!rateLimit(`admin-login:${clientIp(request)}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Please wait 15 minutes.' }, { status: 429 });
  }

  let password = '';
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminSession(), adminCookieOptions);
  return response;
}
