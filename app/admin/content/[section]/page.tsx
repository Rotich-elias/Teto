import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { AdminEditor } from '@/components/admin-editor';
import { PageHero } from '@/components/page-hero';
import { isAdmin } from '@/lib/admin-auth';
import { contentFields, toEditorDoc } from '@/lib/admin-fields';
import { getSection, sectionLabels, SECTION_KEYS, type SectionKey } from '@/lib/content';
import { pageMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const key = SECTION_KEYS.find((item) => item === section);
  return {
    ...pageMetadata({
      title: key ? `${sectionLabels[key]} | Admin | Teto Technologies` : 'Admin | Teto Technologies',
      description: 'Edit site content.',
      path: `/admin/content/${section}`,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function ContentEditorPage({ params }: Props) {
  if (!(await isAdmin())) redirect('/admin/login');

  const { section } = await params;
  if (!SECTION_KEYS.some((item) => item === section)) notFound();
  const key = section as SectionKey;

  const value = await getSection(key);
  const initial = toEditorDoc(key, value);

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title={sectionLabels[key]}
        lead="Edit the values used by the public website. Save to update the site immediately."
        compact
      />
      <div className="container-page py-12">
        <AdminEditor section={key} fields={contentFields[key]} initial={initial} />
      </div>
    </>
  );
}
