import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { exportContent } from '@/lib/content';

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const content = await exportContent();
  return new NextResponse(JSON.stringify(content, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="teto-content-${new Date().toISOString().slice(0, 10)}.json"`,
      'Cache-Control': 'no-store',
    },
  });
}
