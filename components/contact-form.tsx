'use client';

import Script from 'next/script';
import { useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/icon';

type ServiceOption = { slug: string; name: string };

const initialFields = { name: '', email: '', phone: '', service: '', message: '', consent: false };

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {required && (
          <>
            <span className="text-red-600 dark:text-red-400" aria-hidden="true">
              {' '}
              *
            </span>
            <span className="sr-only">(required)</span>
          </>
        )}
      </label>

      {children}

      {hint && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error">
          <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export function ContactForm({
  services,
  selectedService,
  turnstileSiteKey,
}: {
  services: ServiceOption[];
  selectedService: string;
  turnstileSiteKey?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const [fields, setFields] = useState({ ...initialFields, service: selectedService });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update<K extends keyof typeof initialFields>(key: K, value: (typeof initialFields)[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    setSending(true);
    setSuccess(false);
    setFailed(false);
    setFeedback('');
    setErrors({});

    const honeypot = formRef.current?.elements.namedItem('company_website') as HTMLInputElement | null;
    const turnstile = formRef.current?.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...fields,
          companyWebsite: honeypot?.value ?? '',
          turnstileToken: turnstile?.value ?? '',
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { message?: string; errors?: Record<string, string> };

      if (response.ok) {
        setSending(false);
        setSuccess(true);
        setFeedback(payload.message ?? 'Thank you — your message has been sent.');
        setFields({ ...initialFields, service: selectedService });
        formRef.current?.reset();
        window.setTimeout(() => successRef.current?.focus(), 0);
        return;
      }

      setSending(false);
      setFailed(true);
      if (response.status === 422 && payload.errors) setErrors(payload.errors);
      setFeedback(payload.message ?? 'Please check the highlighted fields and try again.');
    } catch {
      setSending(false);
      setFailed(true);
      setFeedback('We could not reach the server. Check your connection and try again, or email us directly.');
    }
  }

  function reset() {
    setSuccess(false);
    setFailed(false);
    setFeedback('');
    setErrors({});
    setFields({ ...initialFields, service: selectedService });
    formRef.current?.reset();
  }

  const invalid = (name: string) => (errors[name] ? 'true' : undefined);

  return (
    <div id="enquiry" className="card scroll-mt-24 p-5 sm:p-8">
      {success ? (
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 outline-none dark:border-emerald-500/30 dark:bg-emerald-500/10"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            <Icon name="check-circle" className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-xl font-bold text-emerald-950 dark:text-emerald-100">Message sent</h2>
          <p className="mt-2 text-sm leading-relaxed text-emerald-900 dark:text-emerald-200">{feedback}</p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-900 dark:text-emerald-200">
            If it is urgent, use WhatsApp or email below.
          </p>
          <button type="button" className="btn-secondary mt-5" onClick={reset}>
            Send another message
          </button>
        </div>
      ) : (
        <form ref={formRef} action="/api/contact" method="post" onSubmit={submit} noValidate className="relative">
          <h2 className="text-xl font-bold">Project enquiry</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Fields marked <span className="text-red-600 dark:text-red-400">*</span> are required.
          </p>

          {/* Honeypot: hidden from people, tempting to bots. */}
          <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="company_website">Company website</label>
            <input type="text" id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field id="name" label="Your name" required error={errors.name}>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="e.g. Jane Wanjiku"
                className="field-input"
                value={fields.name}
                aria-invalid={invalid('name')}
                onChange={(event) => update('name', event.target.value)}
              />
            </Field>

            <Field id="email" label="Email address" required error={errors.email}>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="you@company.co.ke"
                className="field-input"
                value={fields.email}
                aria-invalid={invalid('email')}
                onChange={(event) => update('email', event.target.value)}
              />
            </Field>

            <Field
              id="phone"
              label="Phone number"
              hint="Optional. Include the country code if you are outside Kenya."
              error={errors.phone}
            >
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+254 7XX XXX XXX"
                className="field-input"
                value={fields.phone}
                aria-invalid={invalid('phone')}
                onChange={(event) => update('phone', event.target.value)}
              />
            </Field>

            <Field id="service" label="Service you are interested in" required error={errors.service}>
              <select
                id="service"
                name="service"
                required
                className="field-input"
                value={fields.service}
                aria-invalid={invalid('service')}
                onChange={(event) => update('service', event.target.value)}
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.slug} value={service.slug}>
                    {service.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-5">
            <Field
              id="message"
              label="Tell us about the project"
              required
              hint="A few sentences is enough to start."
              error={errors.message}
            >
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                placeholder="What are you trying to build or fix? Include any deadline, budget range or existing systems we should know about."
                className="field-input"
                value={fields.message}
                aria-invalid={invalid('message')}
                onChange={(event) => update('message', event.target.value)}
              />
            </Field>
          </div>

          <div className="mt-5">
            <label htmlFor="consent" className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
              <input
                type="checkbox"
                id="consent"
                name="consent"
                checked={fields.consent}
                required
                aria-invalid={invalid('consent')}
                onChange={(event) => update('consent', event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-line bg-surface-raised text-primary-700 focus:ring-primary-600"
              />
              <span>
                I agree that Teto Technologies may use the details I have provided to respond to this enquiry, as described in the{' '}
                <a
                  href="/privacy"
                  className="font-semibold text-primary-700 underline decoration-primary-300 underline-offset-2 dark:text-primary-300"
                >
                  Privacy Policy
                </a>
                .
                <span className="text-red-600 dark:text-red-400" aria-hidden="true">
                  {' '}
                  *
                </span>
              </span>
            </label>
            {errors.consent && (
              <p className="field-error">
                <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{errors.consent}</span>
              </p>
            )}
          </div>

          {turnstileSiteKey && (
            <div className="mt-5">
              <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
              <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />
              {errors.turnstile && (
                <p className="field-error mt-2">
                  <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errors.turnstile}</span>
                </p>
              )}
            </div>
          )}

          <div aria-live="polite" aria-atomic="true" className="mt-5">
            {failed && feedback && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                <Icon name="alert" className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{feedback}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" className="btn-primary" disabled={sending}>
              {sending ? 'Sending…' : 'Send message'}
              {!sending && <Icon name="arrow-right" className="h-4 w-4" />}
            </button>

            <p className="text-xs leading-relaxed text-ink-muted">We use your details only to reply to this enquiry.</p>
          </div>
        </form>
      )}
    </div>
  );
}
