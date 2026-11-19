import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminMediaLibrary } from '@/components/admin-media-library';
import { PageHero } from '@/components/page-hero';
import { isAdmin } from '@/lib/admin-auth';
import { listMedia } from '@/lib/admin-data';
import { pageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Media library | Admin | Teto Technologies',
    description: 'Images uploaded for site content.',
    path: '/admin/media',
  }),
  robots: { index: false, follow: false },
};

export default async function MediaPage() {
  if (!(await isAdmin())) redirect('/admin/login');
  const media = await listMedia();

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Media library"
        lead="Every image uploaded through the editors is available here to copy, reuse or delete."
        compact
      />
      <div className="container-page py-12">
        <AdminMediaLibrary initial={media} />
      </div>
    </>
  );
}
