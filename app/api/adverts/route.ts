import { NextResponse } from 'next/server';
import { getActiveAdverts } from '@/lib/adverts';
import { isValidProductSlug } from '@/lib/downloads';

export const dynamic = 'force-dynamic';

// Adverts are admin-managed and must appear on the next launch. Never let a
// CDN serve an older empty feed after an advert is published.
const responseHeaders = {
  'Cache-Control': 'no-store',
  'Access-Control-Allow-Origin': '*',
};

/** Public feed read by the app on launch. Never contains admin-only fields. */
export async function GET(request: Request) {
  const appSlug = new URL(request.url).searchParams.get('app') ?? '';
  if (!isValidProductSlug(appSlug)) {
    return NextResponse.json(
      { error: 'Unknown app.' },
      { status: 400, headers: responseHeaders },
    );
  }

  try {
    const adverts = await getActiveAdverts(appSlug);
    return NextResponse.json({ adverts }, { headers: responseHeaders });
  } catch (error) {
    // The app is offline-first: a broken feed must never break its launch.
    console.error('Could not load active adverts.', error);
    return NextResponse.json({ adverts: [] }, { headers: responseHeaders });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: responseHeaders });
}
