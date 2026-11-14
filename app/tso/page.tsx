import { Cta } from '@/components/cta';
import { Icon } from '@/components/icon';
import { PageHero } from '@/components/page-hero';
import { SectionHeading } from '@/components/section-heading';
import { Todo } from '@/components/todo';
import { pageMetadata } from '@/lib/metadata';
import { tso } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'TSO — Take Schools Online | Teto Technologies',
  description:
    'TSO (Take Schools Online) is a Teto Technologies initiative to bring senior secondary schools online — a school website, digital communication, student records and M-Pesa fee payments.',
  path: '/tso',
});

export default function TsoPage() {
  return (
    <>
      <PageHero eyebrow="Flagship initiative" title="TSO — Take Schools Online" lead={tso.lead} glow="accent">
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

      {/* Planned scope */}
      <section className="border-y border-line bg-surface-sunken">
        <div className="container-page py-14 sm:py-16">
          <SectionHeading
            eyebrow="Planned scope"
            title="What TSO will do."
            text="The starting scope for the platform. The final feature list is confirmed with each school."
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

          <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            Draft scope — <Todo label="confirm the TSO feature list" />
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

            <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-primary-100/85">
              <Todo label="launch timeline" />
              <Todo label="reference to borrow ideas from" />
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

      <Cta
        title="Want TSO at your school?"
        text="Tell us about your school and what you want online first. We will walk you through what TSO can do."
        button="Talk to us"
      />
    </>
  );
}
