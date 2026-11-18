import { NextResponse } from 'next/server';
import { downloadsConfigured, getActiveDownload } from '@/lib/downloads';

/**
 * Stable public URL for a product's current APK, e.g.
 * `/download/deadlines-notes`. It redirects to the Blob download URL, so
 * uploading a new version never requires a code change or redeploy.
 */
export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const productsUrl = new URL('/products', request.url);

  if (downloadsConfigured()) {
    try {
      const download = await getActiveDownload(slug);
      if (download) {
        const response = NextResponse.redirect(download.download_url, 302);
        response.headers.set('Cache-Control', 'no-store');
        return response;
      }
    } catch (error) {
      console.error('Download lookup failed.', error);
    }
  }

  // No file (or no database yet): send visitors back to the products page.
  return NextResponse.redirect(productsUrl, 302);
}
