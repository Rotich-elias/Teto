import Link from 'next/link';
import { Breadcrumb } from '@/components/breadcrumb';
import { OrTodo, Todo } from '@/components/todo';
import { getCompany } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata({
  title: 'Privacy Policy | Teto Technologies',
  description:
    'How Teto Technologies collects, uses and protects personal data submitted through teto.co.ke, in line with the Kenya Data Protection Act.',
  path: '/privacy',
});

const sections = [
  { id: 'who-we-are', label: 'Who we are' },
  { id: 'what-we-collect', label: 'What we collect' },
  { id: 'why', label: 'Why we use it' },
  { id: 'retention', label: 'How long we keep it' },
  { id: 'sharing', label: 'Who we share it with' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'rights', label: 'Your rights' },
  { id: 'contact', label: 'Contact' },
];

export default async function PrivacyPage() {
  const company = await getCompany();

  return (
    <>
      <section className="border-b border-line/60">
        <div className="container-page py-12 sm:py-16">
          <Breadcrumb items={[{ href: '/', label: 'Home' }]} current="Privacy Policy" />

          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-ink-muted">
            Last updated: 1 November 2026
          </p>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.28fr_0.72fr] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <nav aria-label="On this page" className="mt-6 hidden lg:block">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">On this page</p>
              <ul className="mt-3 space-y-2 text-sm">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-ink-soft hover:text-primary-700 dark:hover:text-primary-300">
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="prose-teto">
            <p>
              This policy explains how {company.name} handles personal data when you visit{' '}
              <Link href="/">teto.co.ke</Link> or contact us. It is intended to align with the Kenya Data Protection Act, 2019.
            </p>

            <h2 id="who-we-are">Who we are</h2>
            <p>
              {company.name} is a technology company based in Kenya. For the purposes of the Act, we are the data controller for the
              personal data described below.
            </p>
            <p>
              Registered name: <OrTodo value={company.legalName} label="registered business name" />
              <br />
              Registration number: <OrTodo value={company.registrationNumber} label="business registration number" />
            </p>

            <h2 id="what-we-collect">What we collect</h2>
            <p>When you use the contact form, we collect:</p>
            <ul>
              <li>your name;</li>
              <li>your email address;</li>
              <li>your phone number, if you provide it;</li>
              <li>the service you select;</li>
              <li>the message you write;</li>
              <li>your IP address and browser user-agent string, recorded with the submission for security and spam prevention.</li>
            </ul>
            <p>
              We do not ask for payment details, identification documents or sensitive personal data through this website. Please do
              not include such information in your enquiry.
            </p>

            <h2 id="why">Why we use it</h2>
            <p>We use this information only to:</p>
            <ul>
              <li>respond to your enquiry and communicate with you about it;</li>
              <li>prepare a scope, quotation or proposal if the project proceeds;</li>
              <li>protect the website from spam, abuse and fraudulent submissions;</li>
              <li>keep basic business records and meet legal obligations.</li>
            </ul>
            <p>
              Our legal basis is your consent, which you give by ticking the consent box before submitting the form. You can withdraw
              consent at any time by contacting us, although this will not affect any processing that already took place.
            </p>

            <h2 id="retention">How long we keep it</h2>
            <p>
              We keep enquiry records only while we need them to handle your request and maintain reasonable business records. As
              soon as they are no longer needed, we discard or anonymise them.
            </p>

            <h2 id="sharing">Who we share it with</h2>
            <p>
              We do not sell personal data. We may share it with service providers that help us run the website and email, such as our
              hosting provider and email provider, strictly for those purposes. If Cloudflare Turnstile is enabled, Cloudflare
              processes technical data to verify that a submission is not automated.
            </p>
            <p>We may also disclose information where required by law or to protect our legal rights.</p>

            <h2 id="cookies">Cookies and analytics</h2>
            <p>
              This site does not use advertising or analytics cookies. It sets a session cookie that is required for security,
              including protecting forms against cross-site request forgery. If Cloudflare Turnstile is enabled, Cloudflare may set a
              cookie as part of its bot check.
            </p>
            <p>
              Because we do not use non-essential cookies, no cookie consent banner is shown. If analytics are added later, this
              policy and the site will be updated to request consent first.
            </p>

            <h2 id="security">Security</h2>
            <p>
              The site is served over HTTPS. Access to stored enquiries is restricted, and we apply input validation, rate limiting
              and spam controls to the contact form. No system is completely secure, but we take reasonable technical and
              organisational measures to protect the data we hold.
            </p>

            <h2 id="rights">Your rights</h2>
            <p>Under the Kenya Data Protection Act, you have the right to:</p>
            <ul>
              <li>be informed about how your data is used;</li>
              <li>access the personal data we hold about you;</li>
              <li>request correction of inaccurate data;</li>
              <li>request deletion of data that is no longer needed;</li>
              <li>object to or restrict certain processing;</li>
              <li>lodge a complaint with the Office of the Data Protection Commissioner (ODPC).</li>
            </ul>
            <p>To exercise any of these rights, contact us using the details below.</p>

            <h2 id="contact">Contact</h2>
            <p>
              For privacy questions or data requests:{' '}
              {company.dataEmail ? (
                <a href={`mailto:${company.dataEmail}`}>{company.dataEmail}</a>
              ) : (
                <Todo label="data protection contact email" />
              )}
            </p>
            <p>
              Postal address: <OrTodo value={company.address} label="physical address" />
            </p>

            <h2>Changes to this policy</h2>
            <p>
              We may update this policy when our services or legal obligations change. The effective date at the top of this page
              will be updated when we do.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
