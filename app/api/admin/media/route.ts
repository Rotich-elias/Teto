import { del, head } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { addMedia, listMedia, removeMedia } from '@/lib/admin-data';
import { databaseConfigured } from '@/lib/db';
import { isImagesBlobUrl } from '@/lib/downloads';

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  return NextResponse.json({ media: await listMedia() });
}

/** Record an image after a direct-to-Blob browser upload. */
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  if (!databaseConfigured()) return NextResponse.json({ error: 'DATABASE_URL is not configured.' }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const url = typeof body.url === 'string' ? body.url : '';
  const pathname = typeof body.pathname === 'string' ? body.pathname : '';
  const fileName = typeof body.fileName === 'string' ? body.fileName : '';
  const contentType = typeof body.contentType === 'string' ? body.contentType : '';
  const sizeBytes = typeof body.sizeBytes === 'number' ? body.sizeBytes : NaN;

  if (!isImagesBlobUrl(url) || !pathname.startsWith('images/')) {
    return NextResponse.json({ error: 'Unexpected image location.' }, { status: 400 });
  }
  if (!Number.isInteger(sizeBytes) || sizeBytes <= 0 || sizeBytes > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'Invalid image size.' }, { status: 400 });
  }

  try {
    const blob = await head(url);
    if (blob.pathname !== pathname || blob.size !== sizeBytes) {
      return NextResponse.json({ error: 'The uploaded image could not be verified.' }, { status: 400 });
    }

    await addMedia({
      pathname: blob.pathname,
      url: blob.url,
      file_name: fileName.slice(0, 200) || blob.pathname.split('/').pop() || 'image',
      content_type: blob.contentType ?? contentType,
      size_bytes: blob.size,
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not record the image.' },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const pathname = new URL(request.url).searchParams.get('pathname') ?? '';
  if (!pathname.startsWith('images/') || !/^[\w./-]+$/.test(pathname)) {
    return NextResponse.json({ error: 'Invalid image path.' }, { status: 400 });
  }

  try {
    const removed = await removeMedia(pathname);
    if (removed) {
      try {
        await del(removed.url);
      } catch (error) {
        console.error('Could not delete the image from Blob.', error);
      }
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not remove the image.' },
      { status: 500 },
    );
  }
}
