import { databaseConfigured, getSql } from '@/lib/db';

/**
 * App downloads are stored in two places:
 *  - the APK bytes live in Vercel Blob under `downloads/<slug>/...`
 *  - this table keeps the current URL plus display metadata
 *
 * Keeping the metadata in Postgres means a new upload changes the download
 * without editing code or redeploying the site.
 */

export const APK_MIME_TYPE = 'application/vnd.android.package-archive';
export const MAX_APK_BYTES = 100 * 1024 * 1024; // 100 MB
export const DOWNLOAD_PATH_PREFIX = 'downloads/';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PUBLIC_BLOB_HOST = /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/i;

export type AppDownload = {
  id: number;
  product_slug: string;
  file_name: string;
  version: string | null;
  size_bytes: number;
  content_type: string;
  blob_url: string;
  download_url: string;
  blob_pathname: string;
  uploaded_at: string;
};

export type DownloadInput = {
  slug: string;
  fileName: string;
  version: string | null;
  sizeBytes: number;
  contentType: string;
  blobUrl: string;
  downloadUrl: string;
  blobPathname: string;
};

export function isValidProductSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && slug.length <= 60;
}

export function isValidApkFileName(fileName: string): boolean {
  return (
    fileName.length > 4 &&
    fileName.length <= 200 &&
    /\.apk$/i.test(fileName) &&
    !fileName.includes('/') &&
    !fileName.includes('\\') &&
    !fileName.includes('..')
  );
}

export function isValidApkSize(sizeBytes: number): boolean {
  return Number.isInteger(sizeBytes) && sizeBytes > 0 && sizeBytes <= MAX_APK_BYTES;
}

export function normalizeVersion(version: unknown): string | null {
  if (typeof version !== 'string') return null;
  const trimmed = version.trim();
  return trimmed ? trimmed.slice(0, 60) : null;
}

/** Recognise a public Blob URL from our own store, with a downloads pathname. */
export function isDownloadsBlobUrl(url: string, slug?: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' || !PUBLIC_BLOB_HOST.test(parsed.hostname)) return false;
    if (!parsed.pathname.startsWith(`/${DOWNLOAD_PATH_PREFIX}`)) return false;
    if (slug && !parsed.pathname.startsWith(`/${DOWNLOAD_PATH_PREFIX}${slug}/`)) return false;
    return parsed.pathname.toLowerCase().endsWith('.apk');
  } catch {
    return false;
  }
}

/** Blob's `download=1` query parameter makes browsers save the file. */
export function withDownloadParam(url: string): string {
  const parsed = new URL(url);
  parsed.searchParams.set('download', '1');
  return parsed.toString();
}

/** True when the site has a database configured for download metadata. */
export function downloadsConfigured(): boolean {
  return databaseConfigured();
}

export async function getActiveDownload(slug: string): Promise<AppDownload | null> {
  if (!isValidProductSlug(slug)) return null;

  const rows = (await getSql().query(
    `SELECT * FROM app_downloads WHERE product_slug = $1 LIMIT 1`,
    [slug],
  )) as AppDownload[];

  return rows[0] ?? null;
}

export async function listDownloads(): Promise<AppDownload[]> {
  return (await getSql().query(
    `SELECT * FROM app_downloads ORDER BY product_slug`,
  )) as AppDownload[];
}

export async function upsertDownload(input: DownloadInput): Promise<AppDownload> {
  const rows = (await getSql().query(
    `INSERT INTO app_downloads
       (product_slug, file_name, version, size_bytes, content_type, blob_url, download_url, blob_pathname)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (product_slug) DO UPDATE SET
       file_name = EXCLUDED.file_name,
       version = EXCLUDED.version,
       size_bytes = EXCLUDED.size_bytes,
       content_type = EXCLUDED.content_type,
       blob_url = EXCLUDED.blob_url,
       download_url = EXCLUDED.download_url,
       blob_pathname = EXCLUDED.blob_pathname,
       uploaded_at = now()
     RETURNING *`,
    [
      input.slug,
      input.fileName,
      input.version,
      input.sizeBytes,
      input.contentType,
      input.blobUrl,
      input.downloadUrl,
      input.blobPathname,
    ],
  )) as AppDownload[];

  return rows[0]!;
}

export async function deleteDownload(slug: string): Promise<AppDownload | null> {
  const rows = (await getSql().query(
    `DELETE FROM app_downloads WHERE product_slug = $1 RETURNING *`,
    [slug],
  )) as AppDownload[];

  return rows[0] ?? null;
}
