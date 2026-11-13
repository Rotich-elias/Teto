import { NextResponse } from 'next/server';
import { validateContact, type ContactFields } from '@/lib/contact';
import { sendContactEmails } from '@/lib/contact-mail';
import { rateLimit } from '@/lib/rate-limit';
import { findService } from '@/lib/site';
import { verifyTurnstile } from '@/lib/turnstile';

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

export async function POST(request: Request) {
  let payload: Partial<ContactFields>;
  try {
    payload = (await request.json()) as Partial<ContactFields>;
  } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: accept and discard so bots do not learn the field is trapped.
  if (typeof payload.companyWebsite === 'string' && payload.companyWebsite.trim() !== '') {
    return NextResponse.json({ message: 'Thank you — your message has been received.' }, { status: 201 });
  }

  const ip = clientIp(request);
  if (!rateLimit(`contact:${ip}`)) {
    return NextResponse.json(
      { message: 'Too many messages from this connection. Please wait an hour or email us directly.' },
      { status: 429 },
    );
  }

  const result = validateContact(payload);
  if (result.errors) {
    return NextResponse.json(
      { message: 'Please check the highlighted fields and try again.', errors: result.errors },
      { status: 422 },
    );
  }

  const verified = await verifyTurnstile(payload.turnstileToken, ip);
  if (!verified) {
    return NextResponse.json(
      {
        message: 'Please complete the verification challenge and try again.',
        errors: { turnstile: 'Verification failed. Please try again.' },
      },
      { status: 422 },
    );
  }

  const serviceName = findService(result.data.service)?.name ?? result.data.service;

  try {
    await sendContactEmails(result.data, serviceName);
  } catch (error) {
    // The enquiry passed validation; a mail outage must not show as a failure.
    console.error('Contact notification failed.', error);
  }

  return NextResponse.json(
    { message: 'Thank you — your message has been received. We will get back to you as soon as we can.' },
    { status: 201 },
  );
}
