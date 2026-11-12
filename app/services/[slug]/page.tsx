import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/breadcrumb';
import { Cta } from '@/components/cta';
import { Icon } from '@/components/icon';
import { SectionHeading } from '@/components/section-heading';
import { ServiceCard } from '@/components/service-card';
import { OrTodo } from '@/components/todo';
import { pageMetadata } from '@/lib/metadata';
import { company, findService, services } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<'/services/[slug]'>): Promise<Metadata> {
  const service = findService((await params).slug);
  if (!service) return {};
  return pageMetadata({ title: service.metaTitle, description: service.metaDescription, path: `/services/${service.slug}` });
}

export default async function ServicePage({ params }: PageProps<'/services/[slug]'>) {
  const service = findService((await params).slug);
  if (!service) notFound();

  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  const quoteHref = `/contact?service=${service.slug}`;

  return (
    <>
      <section className="relative overflow-hidden border-b border-line/60">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full hero-glow blur-3xl" />

        <div className="container-page relative py-12 sm:py-16">
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: '/services', label: 'Services' },
            ]}
            current={service.name}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
            <div>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-600/10 dark:bg-primary-500/10 dark:text-primary-300">
                <Icon name={service.icon} className="h-7 w-7" />
              </span>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">{service.name}</h1>

              <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink-soft">
                {service.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={quoteHref} className="btn-primary">
                  Get a Quote
                  <Icon name="arrow-right" className="h-4 w-4" />
                </Link>
                <Link href="/services" className="btn-secondary">
                  All services
                </Link>
              </div>
            </div>

            <aside className="card p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-muted">At a glance</h2>
              <ul className="mt-4 space-y-3">
                {service.features.map((feature) => (
                  <li key={feature.title} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                    <span>{feature.title}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-line pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">Typical stack</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {service.tech.map((tool) => (
                    <span key={tool} className="rounded-md bg-surface-sunken px-2.5 py-1 text-xs font-semibold text-ink-soft">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="container-page py-14 sm:py-16">
        <SectionHeading
          eyebrow="What's included"
          title="The work behind the deliverable."
          text="Scope is agreed in writing before we start. These are the areas we usually cover."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {service.features.map((feature) => (
            <div key={feature.title} className="card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                <Icon name="check-circle" className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface-sunken">
        <div className="container-page grid gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow="Deliverables" title="What you end up with." />
            <ul className="mt-6 space-y-3">
              {service.deliverables.map((deliverable) => (
                <li key={deliverable} className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                  <span>{deliverable}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="text-base font-bold">Working with Teto</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Every engagement starts with a short discovery conversation. If we are not the right fit, we will say so rather than stretch the scope.
            </p>
            <div className="mt-5 space-y-3 border-t border-line pt-5 text-sm text-ink-soft">
              <p className="flex items-start gap-2.5">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                <span>Based in Kenya, working with clients locally and internationally.</span>
              </p>
              <p className="flex items-start gap-2.5">
                <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                <span>
                  <OrTodo value={company.hours} label="business hours" />
                </span>
              </p>
            </div>
            <Link href={quoteHref} className="btn-primary mt-6 w-full">
              Start a conversation
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-page py-14 sm:py-16">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionHeading eyebrow="Related" title="Other services" />
            <Link href="/services" className="btn-link">
              View all services <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ServiceCard key={item.slug} service={item} />
            ))}
          </div>
        </section>
      )}

      <Cta />
    </>
  );
}
