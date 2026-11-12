import Link from 'next/link';
import { Cta } from '@/components/cta';
import { Icon } from '@/components/icon';
import { PageHero } from '@/components/page-hero';
import { pageMetadata } from '@/lib/metadata';
import { services } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Software, Payments & Network Services | Teto Technologies',
  description:
    'Explore Teto Technologies services: web development, Flutter mobile apps, M-Pesa Daraja integration, MikroTik networking and ICT support in Kenya.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Software, payments and networks — built to work together."
        lead="We keep the team small and the scope honest. Each engagement starts with the problem, not a template."
      >
        <nav aria-label="Jump to a service" className="mt-8 flex flex-wrap gap-2">
          {services.map((service) => (
            <a
              key={service.slug}
              href={`#${service.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3.5 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-primary-600 hover:text-primary-700 dark:hover:text-primary-300"
            >
              <Icon name={service.icon} className="h-3.5 w-3.5" />
              {service.name}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="container-page">
        {services.map((service, index) => (
          <article key={service.slug} id={service.slug} className="scroll-mt-24 border-b border-line py-14 last:border-b-0 sm:py-16">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-600/10 dark:bg-primary-500/10 dark:text-primary-300">
                    <Icon name={service.icon} className="h-6 w-6" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">{String(index + 1).padStart(2, '0')}</span>
                </div>

                <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">{service.name}</h2>

                <div className="mt-4 space-y-4 text-base leading-relaxed text-ink-soft">
                  {service.intro.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <Link href={`/services/${service.slug}`} className="btn-link mt-6">
                  Full {service.name.toLowerCase()} details
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
              </div>

              <div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <div key={feature.title} className="rounded-xl border border-line bg-surface-raised p-4">
                      <div className="flex items-start gap-2.5">
                        <Icon name="check-circle" className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                        <div>
                          <h3 className="text-sm font-bold text-ink">{feature.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{feature.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Tech:</span>
                  {service.tech.map((tool) => (
                    <span key={tool} className="rounded-md bg-surface-sunken px-2.5 py-1 text-xs font-semibold text-ink-soft">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Cta
        title="Not sure which service fits?"
        text="Describe the problem in a short message. We will tell you what we would do first — and whether we are the right team for it."
      />
    </>
  );
}
