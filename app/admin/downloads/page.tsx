import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminDownloadsForm } from '@/components/admin-downloads-form';
import { PageHero } from '@/components/page-hero';
import { isAdmin } from '@/lib/admin-auth';
import { getProducts } from '@/lib/content';
import {
  MAX_APK_BYTES,
  downloadsConfigured,
  listDownloads,
  type AppDownload,
} from '@/lib/downloads';
import { pageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Downloads | Admin | Teto Technologies',
    description: 'Manage app downloads.',
    path: '/admin/downloads',
  }),
  robots: { index: false, follow: false },
};

export default async function AdminDownloadsPage() {
  if (!(await isAdmin())) redirect('/admin/login');

  let downloads: AppDownload[] = [];
  let notice = '';

  if (!downloadsConfigured()) {
    notice = 'Set DATABASE_URL to store download information.';
  } else {
    try {
      downloads = await listDownloads();
    } catch (error) {
      console.error('Could not list app downloads.', error);
      notice = 'Could not load existing downloads. Check the database connection and run npm run db:migrate.';
    }
  }

  const products = await getProducts();
  const options = products
    .filter((product) => Boolean(product.slug))
    .map((product) => ({ slug: product.slug!, name: product.name ?? product.slug! }));

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="App downloads"
        lead="Upload and replace the APK files linked from the products page."
      />
      <div className="container-page space-y-6 py-14">
        {notice && (
          <p className="card border-amber-500/50 p-4 text-sm font-medium text-ink-soft" role="status">
            {notice}
          </p>
        )}
        <AdminDownloadsForm products={options} downloads={downloads} maxBytes={MAX_APK_BYTES} />
      </div>
    </>
  );
}
