import { services } from '@/lib/site';

export type ContactFields = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  consent: boolean;
  /** Honeypot: real users never see or fill this. */
  companyWebsite: string;
  /** Cloudflare Turnstile response token, when the challenge is enabled. */
  turnstileToken: string;
};

export type ContactData = {
  name: string;
  email: string;
  phone: string | null;
  service: string;
  message: string;
};

export type ValidationResult = { data: ContactData; errors: null } | { data: null; errors: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\-\s.]{7,40}$/;

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Validate a contact submission. Mirrors the rules that used to live in the
 * Laravel `ContactRequest`, returning a flat field -> message map so the
 * client can highlight the offending inputs.
 */
export function validateContact(
  input: Partial<ContactFields>,
  availableServices: { slug: string }[] = services,
): ValidationResult {
  const name = str(input.name);
  const email = str(input.email);
  const phone = str(input.phone);
  const service = str(input.service);
  const message = str(input.message);
  const errors: Record<string, string> = {};

  if (!name) errors.name = 'Please tell us your name.';
  else if (name.length < 2) errors.name = 'Please enter at least 2 characters for your name.';
  else if (name.length > 120) errors.name = 'Please keep your name under 120 characters.';

  if (!email) errors.email = 'Please enter your email address so we can reply.';
  else if (email.length > 190 || !EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';

  if (phone && !PHONE_RE.test(phone)) errors.phone = 'Please enter a valid phone number, for example +254 7XX XXX XXX.';

  if (!service) errors.service = 'Please choose the service you are interested in.';
  else if (!availableServices.some((item) => item.slug === service)) errors.service = 'Please choose one of the listed services.';

  if (!message) errors.message = 'Please tell us a little about your project.';
  else if (message.length < 10) errors.message = 'Please give us at least 10 characters so we can help.';
  else if (message.length > 5000) errors.message = 'Please keep your message under 5,000 characters.';

  if (input.consent !== true) errors.consent = 'Please confirm that we may use your details to respond to this enquiry.';

  if (Object.keys(errors).length > 0) return { data: null, errors };

  return { data: { name, email, phone: phone || null, service, message }, errors: null };
}
