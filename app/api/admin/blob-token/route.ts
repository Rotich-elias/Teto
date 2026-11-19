import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import {
  APK_MIME_TYPE,
  DOWNLOAD_PATH_PREFIX,
  MAX_APK_BYTES,
  isValidProductSlug,
} from '@/lib/downloads';

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

type Payload = { kind: 'apk'; slug: string } | { kind: 'image' };

function parsePayload(clientPayload: string | null): Payload | null {
  if (!clientPayload) return null;
  try {
    const value = JSON.parse(clientPayload) as Partial<Payload>;
    if (value?.kind === 'image') return { kind: 'image' };
    if (value?.kind === 'apk' && typeof value.slug === 'string') return { kind: 'apk', slug: value.slug };
  } catch {
    // Legacy payload: the download form used to send the slug as plain text.
    if (isValidProductSlug(clientPayload)) return { kind: 'apk', slug: clientPayload };
  }
  return null;
}

/**
 * Issues short-lived client tokens for direct-to-Blob uploads. File bytes
 * never pass through a Vercel Function, so the 4.5 MB body limit does not
 * apply. APKs are capped at 100 MB and images at 10 MB.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  try {
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!(await isAdmin())) throw new Error('Not authenticated.');

        const payload = parsePayload(clientPayload);
        if (!payload) throw new Error('Invalid upload type.');

        if (payload.kind === 'apk') {
          const { slug } = payload;
          if (!isValidProductSlug(slug)) throw new Error('Invalid product.');
          if (!pathname.startsWith(`${DOWNLOAD_PATH_PREFIX}${slug}/`)) throw new Error('Invalid upload path.');
          if (!pathname.toLowerCase().endsWith('.apk')) throw new Error('Only APK files are allowed.');

          return {
            allowedContentTypes: [APK_MIME_TYPE],
            maximumSizeInBytes: MAX_APK_BYTES,
            addRandomSuffix: true,
            tokenPayload: JSON.stringify(payload),
          };
        }

        if (!pathname.startsWith('images/')) throw new Error('Invalid image path.');
        if (!/\.(png|jpe?g|webp|gif)$/i.test(pathname)) throw new Error('Unsupported image format.');

        return {
          allowedContentTypes: IMAGE_TYPES,
          maximumSizeInBytes: MAX_IMAGE_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify(payload),
        };
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload rejected.' },
      { status: 400 },
    );
  }
}
