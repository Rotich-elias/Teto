import { NextResponse } from 'next/server';
import { validateContact, type ContactFields } from '@/lib/contact';
import { sendContactEmails } from '@/lib/contact-mail';
import { databaseConfigured, saveContactMessage } from '@/lib/db';
import { contactRateLimit } from '@/lib/rate-limit';
import { findService } from '@/lib/site';
import { verifyTurnstile } from '@/lib/turnstile';

/** Outcome shown to no-JavaScript users as `/contact?status=<outcome>`. */
type Outcome = 'sent' | 'invalid' | 'rate' | 'verify';

const SUCCESS_MESSAGE = 'Thank you — your message has been received. We will get back to you as soon as we can.';

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function wantsJson(request: Request): boolean {
  return (request.headers.get('content-type') ?? '').includes('application/json');
}

/** Accept either a JSON body (the React form) or a form-encoded POST (no JS). */
async function parseFields(request: Request): Promise<Partial<ContactFields> | null> {
  try {
    if (wantsJson(request)) {
      return (await request.json()) as Partial<ContactFields>;
    }

    const form = await request.formData();
    return {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''),
      service: String(form.get('service') ?? ''),
      message: String(form.get('message') ?? ''),
      consent: form.get('consent') != null,
      companyWebsite: String(form.get('company_website') ?? ''),
      turnstileToken: String(form.get('cf-turnstile-response') ?? ''),
    };
  } catch {
    return null;
  }
}

function redirect(request: Request, outcome: Outcome): NextResponse {
  const url = new URL('/contact', request.url);
  url.searchParams.set('status', outcome);
  url.hash = 'enquiry';
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const jsonMode = wantsJson(request);
  const fields = await parseFields(request);

  const respond = (outcome: Outcome, message: string, status: number, errors?: Record<string, string>) => {
    if (jsonMode) {
      return NextResponse.json(errors ? { message, errors } : { message }, { status });
    }
    return redirect(request, outcome);
  };

  if (!fields) {
    return respond('invalid', 'Invalid request.', 400);
  }

  // Honeypot: accept and discard so bots do not learn the field is trapped.
  if (typeof fields.companyWebsite === 'string' && fields.companyWebsite.trim() !== '') {
    return respond('sent', SUCCESS_MESSAGE, 201);
  }

  const ip = clientIp(request);
  if (!(await contactRateLimit(ip))) {
    return respond('rate', 'Too many messages from this connection. Please wait an hour or email us directly.', 429);
  }

  const result = validateContact(fields);
  if (result.errors) {
    return respond('invalid', 'Please check the highlighted fields and try again.', 422, result.errors);
  }

  const verified = await verifyTurnstile(fields.turnstileToken, ip);
  if (!verified) {
    return respond('verify', 'Please complete the verification challenge and try again.', 422, {
      turnstile: 'Verification failed. Please try again.',
    });
  }

  const serviceName = findService(result.data.service)?.name ?? result.data.service;

  // Store the enquiry first so a mail outage cannot lose it.
  try {
    if (databaseConfigured()) {
      await saveContactMessage(result.data, {
        ip,
        userAgent: (request.headers.get('user-agent') ?? '').slice(0, 500),
      });
    } else {
      console.warn('Contact message not stored: DATABASE_URL is not configured.');
    }
  } catch (error) {
    console.error('Failed to store contact message.', error);
  }

  try {
    await sendContactEmails(result.data, serviceName);
  } catch (error) {
    // The enquiry passed validation; a mail outage must not show as a failure.
    console.error('Contact notification failed.', error);
  }

  return respond('sent', SUCCESS_MESSAGE, 201);
}
