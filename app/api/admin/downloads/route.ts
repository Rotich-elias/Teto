import { del, head } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import {
  APK_MIME_TYPE,
  deleteDownload,
  downloadsConfigured,
  getActiveDownload,
  isDownloadsBlobUrl,
  isValidApkFileName,
  isValidApkSize,
  isValidProductSlug,
  normalizeVersion,
  upsertDownload,
  withDownloadParam,
} from '@/lib/downloads';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}

function notConfigured() {
  return NextResponse.json(
    { error: 'Download storage is not configured. Check BLOB_READ_WRITE_TOKEN and DATABASE_URL.' },
    { status: 503 },
  );
}

/** Confirm a completed Blob upload and make it the active download. */
export async function POST(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  if (!downloadsConfigured()) return notConfigured();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const slug = typeof body.slug === 'string' ? body.slug : '';
  const fileName = typeof body.fileName === 'string' ? body.fileName : '';
  const sizeBytes = typeof body.sizeBytes === 'number' ? body.sizeBytes : NaN;
  const contentType = typeof body.contentType === 'string' ? body.contentType : '';
  const blobUrl = typeof body.blobUrl === 'string' ? body.blobUrl : '';

  if (!isValidProductSlug(slug)) {
    return NextResponse.json({ error: 'Unknown product.' }, { status: 400 });
  }
  if (!isValidApkFileName(fileName)) {
    return NextResponse.json({ error: 'The file must be an APK with a safe file name.' }, { status: 400 });
  }
  if (!isValidApkSize(sizeBytes)) {
    return NextResponse.json({ error: 'Invalid file size.' }, { status: 400 });
  }
  if (contentType !== APK_MIME_TYPE) {
    return NextResponse.json({ error: 'Only Android APK files are allowed.' }, { status: 400 });
  }
  if (!isDownloadsBlobUrl(blobUrl, slug)) {
    return NextResponse.json({ error: 'Unexpected upload location.' }, { status: 400 });
  }

  // Verify the blob really exists in our store and matches what was uploaded.
  // Client-supplied metadata is never trusted on its own.
  let blob;
  try {
    blob = await head(blobUrl);
  } catch {
    return NextResponse.json({ error: 'The uploaded file could not be verified.' }, { status: 400 });
  }

  if (!isDownloadsBlobUrl(blob.url, slug) || blob.size !== sizeBytes || blob.contentType !== APK_MIME_TYPE) {
    return NextResponse.json({ error: 'The uploaded file did not match the APK details.' }, { status: 400 });
  }

  try {
    const previous = await getActiveDownload(slug);
    const download = await upsertDownload({
      slug,
      fileName,
      version: normalizeVersion(body.version),
      sizeBytes,
      contentType,
      blobUrl: blob.url,
      downloadUrl: blob.downloadUrl || withDownloadParam(blob.url),
      blobPathname: blob.pathname,
    });

    // Remove the old file so replaced versions do not accumulate in Blob.
    if (previous && previous.blob_url !== blob.url) {
      try {
        await del(previous.blob_url);
      } catch (error) {
        console.error('Could not delete the previous APK from Blob.', error);
      }
    }

    return NextResponse.json({ download }, { status: 201 });
  } catch (error) {
    console.error('Could not save download metadata.', error);
    return NextResponse.json({ error: 'Could not save the download. Check the database.' }, { status: 500 });
  }
}

/** Remove a download and its stored file. */
export async function DELETE(request: Request) {
  if (!(await isAdmin())) return unauthorized();
  if (!downloadsConfigured()) return notConfigured();

  const slug = new URL(request.url).searchParams.get('slug') ?? '';
  if (!isValidProductSlug(slug)) {
    return NextResponse.json({ error: 'Unknown product.' }, { status: 400 });
  }

  try {
    const removed = await deleteDownload(slug);
    if (!removed) {
      return NextResponse.json({ error: 'No download is configured for that product.' }, { status: 404 });
    }

    try {
      await del(removed.blob_url);
    } catch (error) {
      console.error('Could not delete the APK from Blob.', error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Could not delete download metadata.', error);
    return NextResponse.json({ error: 'Could not remove the download.' }, { status: 500 });
  }
}
