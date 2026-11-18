import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import {
  APK_MIME_TYPE,
  DOWNLOAD_PATH_PREFIX,
  MAX_APK_BYTES,
  isValidProductSlug,
} from '@/lib/downloads';

/**
 * Issues short-lived client tokens for direct-to-Blob APK uploads. The file
 * bytes never pass through a Vercel Function, so the 4.5 MB body limit does
 * not apply.
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
        // Check again here: this callback is the actual gate for token issuing.
        if (!(await isAdmin())) throw new Error('Not authenticated.');

        const slug = clientPayload ?? '';
        if (!isValidProductSlug(slug)) throw new Error('Invalid product.');
        if (!pathname.startsWith(`${DOWNLOAD_PATH_PREFIX}${slug}/`)) {
          throw new Error('Invalid upload path.');
        }
        if (!pathname.toLowerCase().endsWith('.apk')) throw new Error('Only APK files are allowed.');

        return {
          allowedContentTypes: [APK_MIME_TYPE],
          maximumSizeInBytes: MAX_APK_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ slug }),
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
