import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PageHero } from '@/components/page-hero';
import { isAdmin } from '@/lib/admin-auth';
import { findPlaceholders, sectionLabels } from '@/lib/content';
import { type SectionKey } from '@/lib/content-sections';
import { databaseConfigured } from '@/lib/db';
import { pageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Site readiness | Admin | Teto Technologies',
    description: 'Check which site settings and content still need attention.',
    path: '/admin/status',
  }),
  robots: { index: false, follow: false },
};

export default async function StatusPage() {
  if (!(await isAdmin())) redirect('/admin/login');

  const placeholders = await findPlaceholders();
  const groups = new Map<SectionKey, string[]>();
  for (const item of placeholders) {
    const labels = groups.get(item.section) ?? [];
    labels.push(item.label);
    groups.set(item.section, labels);
  }

  const checks = [
    { label: 'Database connection (DATABASE_URL)', ok: databaseConfigured(), hint: 'Needed for content, downloads and the message inbox.' },
    { label: 'Blob store (BLOB_READ_WRITE_TOKEN)', ok: Boolean(process.env.BLOB_READ_WRITE_TOKEN), hint: 'Needed for APK and image uploads.' },
    { label: 'Admin password (ADMIN_PASSWORD)', ok: Boolean(process.env.ADMIN_PASSWORD), hint: 'Needed to sign in here.' },
    {
      label: 'Session secret (ADMIN_SESSION_SECRET)',
      ok: (process.env.ADMIN_SESSION_SECRET ?? '').length >= 32,
      hint: 'Use a random string of at least 32 characters.',
    },
    { label: 'Production origin (NEXT_PUBLIC_SITE_URL)', ok: Boolean(process.env.NEXT_PUBLIC_SITE_URL), hint: 'Used for canonical URLs and the sitemap.' },
    { label: 'Contact email delivery (RESEND_API_KEY)', ok: Boolean(process.env.RESEND_API_KEY), hint: 'Optional: the inbox still stores messages without it.' },
  ];

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Site readiness"
        lead="A quick check of what is configured and which content still shows a TODO placeholder on the public site."
        compact
      />
      <div className="container-page space-y-8 py-12">
        <section className="card overflow-hidden">
          <div className="border-b border-line p-6">
            <h2 className="text-lg font-bold">Configuration</h2>
            <p className="mt-1 text-sm text-ink-soft">Secrets are only checked for presence — their values are never shown.</p>
          </div>
          <ul className="divide-y divide-line">
            {checks.map((check) => (
              <li key={check.label} className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm">
                <span className="font-semibold">{check.label}</span>
                <span className={check.ok ? 'text-xs font-bold text-primary-700 dark:text-primary-300' : 'text-xs font-bold text-amber-700 dark:text-amber-400'}>
                  {check.ok ? 'Ready' : check.hint}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-bold">Content to complete</h2>
          {groups.size === 0 ? (
            <p className="mt-4 text-sm font-semibold text-primary-700 dark:text-primary-300">
              No TODO placeholders remain — the site content is complete.
            </p>
          ) : (
            <div className="mt-4 space-y-5">
              {[...groups.entries()].map(([section, labels]) => (
                <div key={section}>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
                    <h3 className="text-sm font-bold">{sectionLabels[section]}</h3>
                    <Link href={`/admin/content/${section}`} className="btn-link text-xs">
                      Edit section
                    </Link>
                  </div>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-ink-soft">
                    {labels.map((label, index) => (
                      <li key={`${label}-${index}`}>{label}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
