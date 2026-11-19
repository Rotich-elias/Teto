import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { importContent } from '@/lib/content';

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  try {
    const count = await importContent(payload);
    return NextResponse.json({ ok: true, sections: count });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not import content.' },
      { status: 400 },
    );
  }
}
