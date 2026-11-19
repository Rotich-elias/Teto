import Link from 'next/link';
import { AnimatedBackground } from '@/components/animated-background';
import { HeroArt } from '@/components/hero-art';
import { Icon } from '@/components/icon';
import { Cta } from '@/components/cta';
import { Schema } from '@/components/schema';
import { SectionHeading } from '@/components/section-heading';
import { WorkCard } from '@/components/work-card';
import {
  getCompany,
  getHomepage,
  getPortfolio,
  getProcessSteps,
  getServices,
  getSeo,
  getTech,
  getValues,
} from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

export async function generateMetadata() {
  const seo = await getSeo();
  return pageMetadata({
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    path: '/',
  });
}

export default async function HomePage() {
  const [company, h, portfolio, processSteps, services, tech, values] = await Promise.all([
    getCompany(),
    getHomepage(),
    getPortfolio(),
    getProcessSteps(),
    getServices(),
    getTech(),
    getValues(),
  ]);

  return (
    <>
      <Schema localBusiness />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line/60">
        <AnimatedBackground tone="light" />

        <div className="container-page relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10 lg:py-24">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3.5 py-1.5 text-xs font-semibold text-ink-soft shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-600" />
              </span>
              {h.eyebrow}
            </p>

            <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.1rem]">
              {h.title.replace(h.highlight, '').trim()}{' '}
              <span className="relative inline-block whitespace-nowrap text-primary-700 dark:text-primary-300">
                {h.highlight}
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-full text-accent-500"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M3 8.5c38-5 84-6.5 194-3" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              {h.lead}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/contact" className="btn-primary">
                Get a Quote
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
              <Link href="/portfolio" className="btn-secondary">
                View Our Work
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-ink-soft">
              {h.bullets.map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Icon name="check" className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-up-delay">
            <HeroArt />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="container-page py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={h.servicesEyebrow}
            title={h.servicesTitle}
            text={h.servicesText}
          />
          <Link href="/services" className="btn-link shrink-0">
            All services
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 border-t border-line">
          {services.map((service, index) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group grid grid-cols-1 items-baseline gap-2 border-b border-line py-6 transition-colors hover:bg-surface-raised md:grid-cols-[1fr_1.6fr_auto] md:gap-8 md:px-4"
            >
              <span className="flex items-center gap-3">
                <span className="w-6 shrink-0 font-display text-xs font-extrabold text-ink-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-600/10 dark:bg-primary-500/10 dark:text-primary-300">
                  <Icon name={service.icon} className="h-5 w-5" />
                </span>
                <span className="text-lg font-bold text-ink transition-colors group-hover:text-primary-700 dark:group-hover:text-primary-300">
                  {service.name}
                </span>
              </span>

              <span className="max-w-2xl text-sm leading-relaxed text-ink-soft">{service.short}</span>

              <span className="hidden self-center text-ink-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary-700 md:block dark:group-hover:text-primary-300">
                <Icon name="arrow-right" className="h-5 w-5" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/contact"
            className="group inline-flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-primary-600/40 bg-primary-50/60 px-5 py-4 text-sm font-semibold text-primary-800 transition hover:border-primary-600 dark:bg-primary-500/5 dark:text-primary-200"
          >
            <Icon name="spark" className="h-5 w-5" />
            Not sure where to start? Tell us what you are trying to solve.
            <Icon name="arrow-right" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Why Teto — dark band */}
      <section className="relative overflow-hidden bg-primary-950 text-white">
        <AnimatedBackground tone="dark" mask={false} />

        <div className="container-page relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-200">
              <span className="block h-px w-6 bg-accent-400" />
              {h.whyEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">{h.whyTitle}</h2>
            <p className="mt-4 text-base leading-relaxed text-primary-100/80">{h.whyText}</p>

            <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
              <div>
                <dt className="font-display text-3xl font-extrabold text-white">{services.length}</dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary-200">{h.statLabel}</dd>
              </div>
              <div>
                <dt className="font-display text-3xl font-extrabold text-white">{company.founded ?? '—'}</dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary-200">{h.foundedLabel}</dd>
              </div>
              <div>
                <dt className="font-display text-3xl font-extrabold text-white">{h.location}</dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary-200">{h.locationLabel}</dd>
              </div>
            </dl>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="flex items-start gap-3 text-sm leading-relaxed text-primary-100/85">
                <Icon name="quote" className="mt-0.5 h-5 w-5 shrink-0 text-accent-400" />
                <span>{h.quote}</span>
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-primary-200">
                  <Icon name={value.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-white">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-primary-100/75">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container-page py-16 sm:py-20 lg:py-24">
        <SectionHeading
          eyebrow={h.processEyebrow}
          title={h.processTitle}
          text={h.processText}
        />

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {processSteps.map((step) => (
            <li key={step.step} className="relative rounded-2xl border border-line bg-surface-raised p-5 lg:border-0 lg:bg-transparent lg:p-0">
              <div className="flex items-center gap-3 lg:block">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-primary-600/20 bg-primary-50 font-display text-sm font-extrabold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                  {step.step}
                </span>
                <span className="hidden h-px flex-1 bg-line lg:mt-5 lg:block" aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-base font-bold lg:mt-4">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Featured work */}
      <section className="border-y border-line bg-surface-sunken">
        <div className="container-page py-16 sm:py-20 lg:py-24">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow={h.workEyebrow}
              title={h.workTitle}
              text={h.workText}
            />
            <Link href="/portfolio" className="btn-link shrink-0">
              View all work
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {portfolio.map((project, index) => (
              <WorkCard key={index} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Tech */}
      <section className="container-page py-16 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="eyebrow">{h.techEyebrow}</p>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">{h.techTitle}</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink-soft">{h.techText}</p>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tech.map((tool) => (
            <li key={tool.name} className="flex items-center gap-3 rounded-xl border border-line bg-surface-raised px-4 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-sunken font-display text-xs font-extrabold text-primary-700 dark:text-primary-300">
                {tool.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink">{tool.name}</span>
                <span className="block truncate text-[0.7rem] text-ink-muted">{tool.hint}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Cta />
    </>
  );
}
