import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import {
  advertsConfigured,
  createAdvert,
  deleteAdvert,
  listAdverts,
  parseAdvertInput,
  updateAdvert,
} from '@/lib/adverts';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}

function notConfigured() {
  return NextResponse.json(
    { error: 'Advert storage is not configured. Check DATABASE_URL.' },
    { status: 503 },
  );
}

function failure(error: unknown, fallback: string) {
  return NextResponse.json(
    { error: error instanceof Error ? error.message : fallback },
    { status: 400 },
  );
}

function parseId(value: unknown): number | null {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

async function readBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function GET() {
  if (!(await isAdmin())) return unauthorized();
  if (!advertsConfigured()) return notConfigured();

  try {
    return NextResponse.json({ adverts: await listAdverts() });
  } catch (error) {
    console.error('Could not list adverts.', error);
    return NextResponse.json({ error: 'Could not load adverts.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  if (!advertsConfigured()) return notConfigured();

  const body = await readBody(request);
  if (!body) return failure(new Error('Invalid JSON.'), 'Invalid JSON.');

  let input;
  try {
    input = parseAdvertInput(body);
  } catch (error) {
    return failure(error, 'Invalid advert.');
  }

  try {
    return NextResponse.json({ advert: await createAdvert(input) }, { status: 201 });
  } catch (error) {
    console.error('Could not save advert.', error);
    return NextResponse.json({ error: 'Could not save the advert.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  if (!advertsConfigured()) return notConfigured();

  const body = await readBody(request);
  if (!body) return failure(new Error('Invalid JSON.'), 'Invalid JSON.');

  const id = parseId(body.id);
  if (id === null) return failure(new Error('Unknown advert.'), 'Unknown advert.');

  let input;
  try {
    input = parseAdvertInput(body);
  } catch (error) {
    return failure(error, 'Invalid advert.');
  }

  try {
    const advert = await updateAdvert(id, input);
    if (!advert) return NextResponse.json({ error: 'Advert not found.' }, { status: 404 });
    return NextResponse.json({ advert });
  } catch (error) {
    console.error('Could not update advert.', error);
    return NextResponse.json({ error: 'Could not update the advert.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  if (!advertsConfigured()) return notConfigured();

  const id = parseId(new URL(request.url).searchParams.get('id'));
  if (id === null) return failure(new Error('Unknown advert.'), 'Unknown advert.');

  try {
    const advert = await deleteAdvert(id);
    if (!advert) return NextResponse.json({ error: 'Advert not found.' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Could not delete advert.', error);
    return NextResponse.json({ error: 'Could not delete the advert.' }, { status: 500 });
  }
}
