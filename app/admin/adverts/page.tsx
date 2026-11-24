import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminAdvertsForm } from '@/components/admin-adverts-form';
import { PageHero } from '@/components/page-hero';
import { isAdmin } from '@/lib/admin-auth';
import { advertsConfigured, listAdverts, type Advert } from '@/lib/adverts';
import { getProducts } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'App adverts | Admin | Teto Technologies',
    description: 'Manage the popup adverts shown in the app.',
    path: '/admin/adverts',
  }),
  robots: { index: false, follow: false },
};

export default async function AdminAdvertsPage() {
  if (!(await isAdmin())) redirect('/admin/login');

  let adverts: Advert[] = [];
  let notice = '';

  if (!advertsConfigured()) {
    notice = 'Set DATABASE_URL to store adverts.';
  } else {
    try {
      adverts = await listAdverts();
    } catch (error) {
      console.error('Could not list adverts.', error);
      notice = 'Could not load adverts. Check the database connection and run npm run db:migrate.';
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
        title="App adverts"
        lead="Publish, schedule and retract the popups shown when the app launches."
      />
      <div className="container-page space-y-6 py-14">
        {notice && (
          <p className="card border-amber-500/50 p-4 text-sm font-medium text-ink-soft" role="status">
            {notice}
          </p>
        )}
        <AdminAdvertsForm products={options} adverts={adverts} />
      </div>
    </>
  );
}
