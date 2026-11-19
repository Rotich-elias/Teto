import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PageHero } from '@/components/page-hero';
import { isAdmin } from '@/lib/admin-auth';
import {
  findPlaceholders,
  getCompany,
  getPortfolio,
  getProducts,
  getServices,
  listChanges,
  sectionLabels,
} from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Admin | Teto Technologies',
    description: 'Private administration area.',
    path: '/admin',
  }),
  robots: { index: false, follow: false },
};

const shortcuts = [
  { href: '/admin/content/products', label: 'Add or edit products', text: 'Apps, download links and store links.' },
  { href: '/admin/content/portfolio', label: 'Add or edit portfolio items', text: 'Case studies with images and results.' },
  { href: '/admin/downloads', label: 'Upload an APK', text: 'Replace the Deadlines & Notes download.' },
  { href: '/admin/content/company', label: 'Update contact details', text: 'Email, phone, WhatsApp, address and hours.' },
  { href: '/admin/messages', label: 'Read enquiries', text: 'Messages captured from the contact form.' },
  { href: '/admin/backup', label: 'Back up content', text: 'Export, import and review recent changes.' },
];

export default async function AdminPage() {
  if (!(await isAdmin())) redirect('/admin/login');

  const [placeholders, changes, company, portfolio, products, services] = await Promise.all([
    findPlaceholders(),
    listChanges(8),
    getCompany(),
    getPortfolio(),
    getProducts(),
    getServices(),
  ]);

  const stats = [
    { label: 'Products', value: products.length },
    { label: 'Case studies', value: portfolio.length },
    { label: 'Services', value: services.length },
    { label: 'Items to complete', value: placeholders.length },
  ];

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Site overview"
        lead={`Signed in as the administrator of ${company.name}. Edit anything below and changes appear on the site immediately.`}
        compact
      />

      <div className="container-page space-y-10 py-12">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-5">
              <dt className="text-xs font-bold uppercase tracking-wider text-ink-muted">{stat.label}</dt>
              <dd className="mt-1 font-display text-3xl font-extrabold">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <section>
          <h2 className="text-lg font-bold">Quick actions</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shortcuts.map((item) => (
              <Link key={item.href} href={item.href} className="card p-5 transition hover:border-primary-600">
                <p className="font-bold">{item.label}</p>
                <p className="mt-1 text-sm text-ink-soft">{item.text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Still to complete</h2>
              <a href="/admin/backup" className="btn-link text-xs">
                Manage
              </a>
            </div>
            {placeholders.length === 0 ? (
              <p className="mt-4 text-sm text-primary-700 dark:text-primary-300">Everything is filled in. No TODO placeholders remain.</p>
            ) : (
              <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto text-sm text-ink-soft">
                {placeholders.slice(0, 20).map((item, index) => (
                  <li key={`${item.section}-${item.label}-${index}`} className="flex items-center justify-between gap-3 border-b border-line pb-2">
                    <span>{item.label}</span>
                    <Link href={`/admin/content/${item.section}`} className="shrink-0 text-xs font-semibold text-primary-700 dark:text-primary-300">
                      {sectionLabels[item.section]}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold">Recent changes</h2>
            {changes.length === 0 ? (
              <p className="mt-4 text-sm text-ink-soft">No edits recorded yet.</p>
            ) : (
              <ul className="mt-4 space-y-3 text-sm">
                {changes.map((change) => (
                  <li key={change.id} className="flex items-center justify-between gap-3 border-b border-line pb-2">
                    <span className="font-semibold">{sectionLabels[change.section as keyof typeof sectionLabels] ?? change.section}</span>
                    <span className="text-xs text-ink-muted">
                      {change.action} · {new Date(change.changed_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
