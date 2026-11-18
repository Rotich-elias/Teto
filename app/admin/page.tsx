import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Admin | Teto Technologies',
    description: 'Private administration area.',
    path: '/admin',
  }),
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  redirect('/admin/downloads');
}
