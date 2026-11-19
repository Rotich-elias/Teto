import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminMessageInbox } from '@/components/admin-message-inbox';
import { PageHero } from '@/components/page-hero';
import { isAdmin } from '@/lib/admin-auth';
import { listMessages, unreadMessageCount } from '@/lib/admin-data';
import { pageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Message inbox | Admin | Teto Technologies',
    description: 'Enquiries submitted through the contact form.',
    path: '/admin/messages',
  }),
  robots: { index: false, follow: false },
};

export default async function MessagesPage() {
  if (!(await isAdmin())) redirect('/admin/login');

  const [messages, unread] = await Promise.all([listMessages(), unreadMessageCount()]);

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Message inbox"
        lead={`${unread} unread ${unread === 1 ? 'enquiry' : 'enquiries'}. Messages are stored in Neon before notification email is attempted.`}
        compact
      />
      <div className="container-page py-12">
        <AdminMessageInbox initial={messages} />
      </div>
    </>
  );
}
