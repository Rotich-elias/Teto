import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { getSection, resetContent, saveContent, SECTION_KEYS, type SectionKey } from '@/lib/content';

type Props = { params: Promise<{ section: string }> };

function sectionKey(section: string): SectionKey | null {
  return SECTION_KEYS.find((item) => item === section) ?? null;
}

export async function GET(_request: Request, { params }: Props) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const key = sectionKey((await params).section);
  if (!key) return NextResponse.json({ error: 'Unknown section.' }, { status: 404 });

  return NextResponse.json({ value: await getSection(key) });
}

export async function PUT(request: Request, { params }: Props) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const key = sectionKey((await params).section);
  if (!key) return NextResponse.json({ error: 'Unknown section.' }, { status: 404 });

  let value: unknown;
  try {
    value = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  try {
    const saved = await saveContent(key, value);
    return NextResponse.json({ ok: true, value: saved });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not save content.' },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const key = sectionKey((await params).section);
  if (!key) return NextResponse.json({ error: 'Unknown section.' }, { status: 404 });

  try {
    await resetContent(key);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not reset content.' },
      { status: 500 },
    );
  }
}
