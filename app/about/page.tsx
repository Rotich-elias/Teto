import { Cta } from '@/components/cta';
import { Icon } from '@/components/icon';
import { PageHero } from '@/components/page-hero';
import { SectionHeading } from '@/components/section-heading';
import { OrTodo, Todo } from '@/components/todo';
import { pageMetadata } from '@/lib/metadata';
import { company, values } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'About Teto Technologies | Kenyan Software & Networking Company',
  description:
    'Teto Technologies is a Kenyan technology company delivering custom software, mobile apps, M-Pesa integrations and network infrastructure.',
  path: '/about',
});

const companyDetails: { label: string; value: string | null; todo: string }[] = [
  { label: 'Registered name', value: company.legalName, todo: 'registered business name' },
  { label: 'Registration number', value: company.registrationNumber, todo: 'business registration number' },
  { label: 'Founder', value: company.founder, todo: 'founder name' },
  { label: 'Founded', value: company.founded, todo: 'founding year' },
  { label: 'Location', value: company.address, todo: 'physical address' },
  { label: 'Business hours', value: company.hours, todo: 'business hours' },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A Kenyan technology company built around delivery."
        lead="We combine full-stack development with hands-on networking experience, so your systems are built well and run reliably."
        glow="accent"
      />

      <section className="container-page py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Our story" title="Software and infrastructure, from the same team." />

            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-soft">
              <p>{company.description}</p>
              <p>We combine full-stack development with hands-on networking experience, so your systems are built well and run reliably.</p>
              <p>
                That combination matters in practice: a payment integration is only useful if the callback is handled correctly, the
                server stays up and someone can diagnose a failed transaction. A hotspot is only useful if the billing, vouchers and
                support behind it work too.
              </p>
              <p>We work in clear stages, document what we build and keep the scope honest.</p>
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-accent-600/60 bg-accent-50 p-4 text-sm text-accent-900 dark:border-accent-400/50 dark:bg-accent-500/10 dark:text-accent-200">
              <p className="font-semibold">Owner-supplied history goes here.</p>
              <p className="mt-1 flex flex-wrap items-center gap-2">
                <Todo label="founding year" />
                <Todo label="real mission statement" />
              </p>
            </div>
          </div>

          <aside className="card h-fit p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-muted">Company details</h2>
            <dl className="mt-4 space-y-4 text-sm">
              {companyDetails.map((item) => (
                <div key={item.label}>
                  <dt className="font-semibold text-ink">{item.label}</dt>
                  <dd className="mt-1 text-ink-soft">
                    <OrTodo value={item.value} label={item.todo} />
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className="border-y border-line bg-surface-sunken">
        <div className="container-page py-14 sm:py-16">
          <SectionHeading
            eyebrow="What we value"
            title="How we approach the work."
            text="These are working principles, not posters on a wall."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                  <Icon name={value.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Cta title="Want to work with us?" text="Send a short description of the problem. We will reply with practical next steps." />
    </>
  );
}
