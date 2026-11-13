import Link from 'next/link';
import { Breadcrumb } from '@/components/breadcrumb';
import { Todo } from '@/components/todo';
import { pageMetadata } from '@/lib/metadata';
import { company } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Terms of Use | Teto Technologies',
  description: 'The basic terms that apply when you use the Teto Technologies website.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <>
      <section className="border-b border-line/60">
        <div className="container-page py-12 sm:py-16">
          <Breadcrumb items={[{ href: '/', label: 'Home' }]} current="Terms of Use" />

          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">Terms of Use</h1>
          <p className="mt-4 text-sm text-ink-muted">
            Last updated: <Todo label="terms effective date" />
          </p>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <div className="prose-teto mx-auto max-w-3xl">
          <div className="mb-8 rounded-xl border border-dashed border-accent-600/60 bg-accent-50 p-4 text-sm text-accent-900 dark:border-accent-400/50 dark:bg-accent-500/10 dark:text-accent-200">
            <p className="font-semibold">Draft for legal review.</p>
            <p className="mt-1">
              These are basic website terms, not a client contract. The owner should have them reviewed before launch.
            </p>
          </div>

          <p>
            These terms apply to your use of <Link href="/">teto.co.ke</Link>, operated by {company.name}. By using the site, you
            agree to them. If you do not agree, please do not use the site.
          </p>

          <h2>Use of the site</h2>
          <p>
            You may use this site for lawful purposes only. You must not attempt to gain unauthorised access to the site or its
            systems, interfere with its operation, submit malicious code, or use the contact form to send spam, unlawful content or
            misleading information.
          </p>

          <h2>Information on the site</h2>
          <p>
            The content on this site is provided for general information. It is not a binding offer, quotation or professional
            advice. Project scope, fees, timelines and deliverables are agreed separately in writing.
          </p>
          <p>
            We try to keep information accurate and current, but we do not guarantee that every page is complete, accurate or up to
            date. Portfolio entries marked as placeholders are not descriptions of real projects.
          </p>

          <h2>Intellectual property</h2>
          <p>
            Unless stated otherwise, the text, design, graphics and code of this site belong to {company.name} or are used with
            permission. You may view and print pages for your own reference, but you may not copy, republish or sell the content
            without our written permission.
          </p>

          <h2>Third-party links</h2>
          <p>
            The site may link to third-party websites or services. We do not control them and are not responsible for their content,
            availability or privacy practices.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the extent permitted by Kenyan law, {company.name} is not liable for indirect or consequential loss arising from your
            use of this site. Nothing in these terms limits liability that cannot lawfully be limited.
          </p>

          <h2>Privacy</h2>
          <p>
            How we handle personal data is described in our <Link href="/privacy">Privacy Policy</Link>.
          </p>

          <h2>Governing law</h2>
          <p>These terms are governed by the laws of Kenya, and the Kenyan courts have jurisdiction over any dispute.</p>

          <h2>Changes</h2>
          <p>
            We may update these terms from time to time. The effective date at the top of the page will be updated when we do.
            Continued use of the site after a change means you accept the updated terms.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms:{' '}
            {company.email ? <a href={`mailto:${company.email}`}>{company.email}</a> : <Todo label="company email address" />}
          </p>
        </div>
      </section>
    </>
  );
}
