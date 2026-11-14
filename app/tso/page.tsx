import { ContactForm } from '@/components/contact-form';
import { Icon } from '@/components/icon';
import { PageHero } from '@/components/page-hero';
import { SectionHeading } from '@/components/section-heading';
import { Todo } from '@/components/todo';
import { pageMetadata } from '@/lib/metadata';
import { services, tso } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'TSO — Take Schools Online | Teto Technologies',
  description:
    'TSO (Take Schools Online) is a Teto Technologies programme that gives senior secondary schools a professionally built website, digital communication with parents, student records and M-Pesa fee payments.',
  path: '/tso',
});

export default function TsoPage() {
  const turnstileSiteKey = process.env.TURNSTILE_ENABLED === 'true' ? process.env.TURNSTILE_SITE_KEY : undefined;

  return (
    <>
      <PageHero eyebrow="TSO — Take Schools Online" title="Give your school a digital home." lead={tso.lead} glow="accent">
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent-600/40 bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-900 dark:border-accent-400/40 dark:bg-accent-500/10 dark:text-accent-200">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
            {tso.status}
          </span>
          {tso.audiences.map((audience) => (
            <span key={audience} className="rounded-full border border-line bg-surface-raised px-3 py-1 text-xs font-semibold text-ink-soft">
              {audience}
            </span>
          ))}
        </div>
      </PageHero>

      {/* Why it matters */}
      <section className="container-page py-14 sm:py-16">
        <SectionHeading
          eyebrow="Why it matters"
          title="Schools are part of the online world, whether or not they are in it."
          text="Parents, students and partners search online first. TSO gives a school a presence and the tools to run on."
        />

        <ul className="mt-8 grid gap-4 lg:grid-cols-3">
          {tso.why.map((point, index) => (
            <li key={index} className="card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-50 font-display text-sm font-extrabold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{point}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-surface-sunken">
        <div className="container-page py-14 sm:py-16">
          <SectionHeading
            eyebrow="How it works"
            title="From an enquiry to a live website."
            text="Most schools go from a first enquiry to a live website in about three weeks. We handle the complexity so your school can focus on teaching."
          />

          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {tso.steps.map((step) => (
              <li key={step.step} className="card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-primary-600/20 bg-primary-50 font-display text-sm font-extrabold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                  {step.step}
                </span>
                <h3 className="mt-4 text-base font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 dark:text-primary-300">
                  <Icon name="clock" className="h-3.5 w-3.5" />
                  {step.duration}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What TSO includes */}
      <section className="container-page py-14 sm:py-16">
        <SectionHeading
          eyebrow="What TSO includes"
          title="A website and the systems behind it."
          text="The starting scope for the programme. The final feature list is confirmed with each school."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tso.features.map((feature) => (
            <div key={feature.title} className="card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                <Icon name={feature.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Package */}
      <section className="border-y border-line bg-surface-sunken">
        <div className="container-page py-14 sm:py-16">
          <SectionHeading
            eyebrow="Package"
            title="One package, fully managed."
            text="A complete, professionally built school website. The price is confirmed with each school."
          />

          <div className="card mt-10 grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
            <div>
              <h3 className="text-xl font-extrabold">{tso.plan.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{tso.plan.tagline}</p>

              <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                {tso.plan.price ? (
                  <span className="font-display text-3xl font-extrabold">{tso.plan.price}</span>
                ) : (
                  <Todo label={`${tso.plan.name} package price`} />
                )}
                <span className="text-sm text-ink-muted">{tso.plan.priceNote}</span>
              </div>

              <div className="mt-6">
                <a href="#enrol" className="btn-primary">
                  {tso.plan.cta}
                  <Icon name="arrow-right" className="h-4 w-4" />
                </a>
              </div>
            </div>

            <ul className="grid gap-3 text-sm text-ink-soft sm:grid-cols-2">
              {tso.plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            The package name and price are a draft — <Todo label="confirm the TSO package and price" />
          </p>
        </div>
      </section>

      {/* Focus — dark band */}
      <section className="relative overflow-hidden bg-primary-950 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] dot-grid" />
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full accent-glow" />

        <div className="container-page relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-200">
              <span className="block h-px w-6 bg-accent-400" />
              Focus
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Built for senior secondary schools.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-primary-100/80">
              TSO starts with senior secondary schools, where students, parents and the wider community expect information to be easy
              to find — and where records, results and fees have to be handled carefully.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-primary-200">
                <Icon name="shield" className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-white">Run by the team that builds it</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-100/75">
                The same team that builds your website handles the hosting, payments and network behind it.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-primary-200">
                <Icon name="payments" className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-white">M-Pesa, from day one</h3>
              <p className="mt-2 text-sm leading-relaxed text-primary-100/75">
                Fee and activity payments collected through M-Pesa Daraja and recorded against each student.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enrol */}
      <section id="enrol" className="container-page scroll-mt-24 py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div>
            <SectionHeading
              eyebrow="Enrol"
              title="Enrol your school."
              text="Tell us about your school and what you want online first. We reply within two business days."
            />

            <div className="mt-8">
              <ContactForm
                services={services.map(({ slug, name }) => ({ slug, name }))}
                selectedService="web-development"
                turnstileSiteKey={turnstileSiteKey}
                title="TSO enrolment"
                intro="Share your school details and what you need online. Your message goes straight to our team."
              />
            </div>
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="card p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink-muted">What happens next</h2>
              <ol className="mt-4 space-y-4 text-sm text-ink-soft">
                {tso.steps.map((step) => (
                  <li key={step.step} className="flex gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-50 text-xs font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                      {Number(step.step)}
                    </span>
                    <span>
                      <span className="block font-semibold text-ink">{step.title}</span>
                      <span className="mt-0.5 block text-ink-muted">{step.duration}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
