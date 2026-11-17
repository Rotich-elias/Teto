import { ContactForm } from '@/components/contact-form';
import { Icon } from '@/components/icon';
import { PageHero } from '@/components/page-hero';
import { Schema } from '@/components/schema';
import { OrTodo, Todo } from '@/components/todo';
import { pageMetadata } from '@/lib/metadata';
import { company, findService, services, telHref, whatsappHref } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Contact Teto Technologies | Get a Quote',
  description:
    'Tell Teto Technologies about your website, mobile app, M-Pesa integration, network or ICT support project. Get a practical reply from a Kenyan team.',
  path: '/contact',
});

const statusBanners: Record<string, { tone: 'success' | 'error'; title: string; text: string }> = {
  sent: {
    tone: 'success',
    title: 'Message sent',
    text: 'Thank you — your message has been received. We will get back to you as soon as we can.',
  },
  invalid: { tone: 'error', title: 'Could not send', text: 'Please check your details and try again.' },
  rate: {
    tone: 'error',
    title: 'Too many messages',
    text: 'Too many messages from this connection. Please wait an hour or email us directly.',
  },
  verify: { tone: 'error', title: 'Verification failed', text: 'We could not verify the challenge. Please try again.' },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string | string[]; status?: string | string[] }>;
}) {
  const params = await searchParams;
  const requested = Array.isArray(params.service) ? params.service[0] : params.service;
  const selectedService = requested && findService(requested) ? requested : '';
  const statusParam = Array.isArray(params.status) ? params.status[0] : params.status;
  const banner = statusParam ? statusBanners[statusParam] : undefined;
  const turnstileSiteKey = process.env.TURNSTILE_ENABLED === 'true' ? process.env.TURNSTILE_SITE_KEY : undefined;
  const whatsapp = whatsappHref();

  return (
    <>
      <Schema localBusiness />

      <PageHero
        eyebrow="Contact"
        title="Let's talk about your project."
        lead="Tell us what you are trying to build or fix. A short, specific message gets you a more useful reply."
        compact
      />

      <section className="container-page py-12 sm:py-16">
        {banner ? (
          <div
            role={banner.tone === 'success' ? 'status' : 'alert'}
            aria-live="polite"
            className={`mb-8 flex items-start gap-3 rounded-2xl border p-4 sm:p-5 ${
              banner.tone === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200'
                : 'border-red-200 bg-red-50 text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200'
            }`}
          >
            <Icon
              name={banner.tone === 'success' ? 'check-circle' : 'alert'}
              className="mt-0.5 h-5 w-5 shrink-0"
            />
            <div>
              <p className="text-sm font-bold">{banner.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed">{banner.text}</p>
            </div>
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <ContactForm services={services.map(({ slug, name }) => ({ slug, name }))} selectedService={selectedService} turnstileSiteKey={turnstileSiteKey} />

          <aside className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-bold">Prefer a direct conversation?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Email, call or send a WhatsApp message any time — we are available 24/7.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-start gap-3 rounded-xl border border-line p-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                    <Icon name="mail" className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Email</p>
                    {company.email ? (
                      <a
                        href={`mailto:${company.email}`}
                        className="mt-0.5 block break-all text-sm font-semibold text-ink hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        {company.email}
                      </a>
                    ) : (
                      <div className="mt-1">
                        <Todo label="company email address" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-line p-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                    <Icon name="phone" className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Phone</p>
                    {company.phone ? (
                      <a
                        href={telHref(company.phone)}
                        className="mt-0.5 block text-sm font-semibold text-ink hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        {company.phone}
                      </a>
                    ) : (
                      <div className="mt-1">
                        <Todo label="phone number" />
                      </div>
                    )}
                  </div>
                </div>

                {whatsapp ? (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 rounded-xl border border-line p-3.5 transition hover:border-[#25D366]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#25D366]/10 text-[#128C7E] dark:text-[#25D366]">
                        <Icon name="whatsapp" className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-xs font-semibold uppercase tracking-wider text-ink-muted">WhatsApp</span>
                        <span className="block text-sm font-semibold text-ink">Chat with us</span>
                      </span>
                    </span>
                    <Icon name="arrow-up-right" className="h-4 w-4 text-ink-muted" />
                  </a>
                ) : (
                  <div className="rounded-xl border border-dashed border-line p-3.5">
                    <Todo label="WhatsApp number" />
                  </div>
                )}
              </div>

              <div className="mt-5 border-t border-line pt-4 text-sm text-ink-soft">
                <p className="flex items-start gap-2.5">
                  <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                  <span>
                    <OrTodo value={company.hours} label="business hours" />
                  </span>
                </p>
                <p className="mt-2 flex items-start gap-2.5">
                  <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                  <span>
                    <OrTodo value={company.address} label="physical address" />
                  </span>
                </p>
              </div>
            </div>

            <div className="card overflow-hidden">
              {company.mapEmbedUrl ? (
                <iframe
                  src={company.mapEmbedUrl}
                  title={`Map showing the ${company.name} location`}
                  className="aspect-video h-auto w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="relative h-64 overflow-hidden bg-surface-sunken dot-grid">
                  <div className="absolute inset-0 grid place-items-center p-6 text-center">
                    <div>
                      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-surface-raised text-primary-700 shadow-sm dark:text-primary-300">
                        <Icon name="pin" className="h-6 w-6" />
                      </span>
                      <p className="mt-3 text-sm font-semibold text-ink">Map placeholder</p>
                      <p className="mt-1 text-xs text-ink-muted">Add a physical address and map embed URL.</p>
                      <div className="mt-3">
                        <Todo label="map embed URL" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-line bg-surface-raised p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-muted">What happens next</h2>
              <ol className="mt-4 space-y-3 text-sm text-ink-soft">
                <li className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-50 text-xs font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                    1
                  </span>
                  <span>We read your message and check whether we are the right fit.</span>
                </li>
                <li className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-50 text-xs font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                    2
                  </span>
                  <span>We reply with questions, a call or a short scope.</span>
                </li>
                <li className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-50 text-xs font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                    3
                  </span>
                  <span>If it fits, we agree the work and start.</span>
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
