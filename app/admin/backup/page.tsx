import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminBackup } from '@/components/admin-backup';
import { PageHero } from '@/components/page-hero';
import { isAdmin } from '@/lib/admin-auth';
import { listChanges } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Backup & history | Admin | Teto Technologies',
    description: 'Export, import and review site content changes.',
    path: '/admin/backup',
  }),
  robots: { index: false, follow: false },
};

export default async function BackupPage() {
  if (!(await isAdmin())) redirect('/admin/login');
  const changes = await listChanges(50);

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Backup & change history"
        lead="Keep a copy of your content, restore an earlier export, and see what changed on the site."
        compact
      />
      <div className="container-page py-12">
        <AdminBackup changes={changes} />
      </div>
    </>
  );
}
