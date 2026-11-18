import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from '@/components/admin-login-form';
import { PageHero } from '@/components/page-hero';
import { isAdmin } from '@/lib/admin-auth';
import { pageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Admin sign in | Teto Technologies',
    description: 'Private administration area.',
    path: '/admin/login',
  }),
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect('/admin/downloads');

  return (
    <>
      <PageHero eyebrow="Admin" title="Sign in" lead="Manage the app files offered on the products page." />
      <div className="container-page max-w-xl py-14">
        <AdminLoginForm />
      </div>
    </>
  );
}
