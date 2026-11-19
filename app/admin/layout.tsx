import type { Metadata } from 'next';
import { AdminNav } from '@/components/admin-nav';

export const metadata: Metadata = {
  title: 'Admin | Teto Technologies',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
