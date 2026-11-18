'use client';

import { upload } from '@vercel/blob/client';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Icon } from '@/components/icon';
import { APK_MIME_TYPE, type AppDownload } from '@/lib/downloads';

type ProductOption = { slug: string; name: string };

type Status = 'idle' | 'uploading' | 'success' | 'error';

function formatBytes(bytes: number): string {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return '—';
  if (value < 1024) return `${value} B`;
  const units = ['KB', 'MB', 'GB'];
  let scaled = value / 1024;
  let unit = 0;
  while (scaled >= 1024 && unit < units.length - 1) {
    scaled /= 1024;
    unit += 1;
  }
  return `${scaled.toFixed(scaled >= 10 ? 0 : 1)} ${units[unit]}`;
}

export function AdminDownloadsForm({
  products,
  downloads,
  maxBytes,
}: {
  products: ProductOption[];
  downloads: AppDownload[];
  maxBytes: number;
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [slug, setSlug] = useState(
    products.find((product) => downloads.some((download) => download.product_slug === product.slug))?.slug ??
      products[0]?.slug ??
      '',
  );
  const [file, setFile] = useState<File | null>(null);
  const [version, setVersion] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [removing, setRemoving] = useState<string | null>(null);

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('idle');
    setMessage('');
    setProgress(0);

    if (!slug) {
      setStatus('error');
      setMessage('Choose a product first.');
      return;
    }
    if (!file) {
      setStatus('error');
      setMessage('Choose an APK file to upload.');
      return;
    }
    if (!/\.apk$/i.test(file.name)) {
      setStatus('error');
      setMessage('Only .apk files can be uploaded.');
      return;
    }
    if (file.size > maxBytes) {
      setStatus('error');
      setMessage(`That file is larger than the ${formatBytes(maxBytes)} limit.`);
      return;
    }

    setStatus('uploading');
    try {
      // A safe pathname inside this product's folder in the Blob store.
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-200);
      const blob = await upload(`downloads/${slug}/${safeName}`, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/blob-token',
        clientPayload: slug,
        contentType: APK_MIME_TYPE,
        multipart: file.size > 5 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });

      const response = await fetch('/api/admin/downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          fileName: file.name,
          version,
          sizeBytes: file.size,
          contentType: blob.contentType,
          blobUrl: blob.url,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? 'Could not save the upload.');

      setStatus('success');
      setMessage(`${file.name} is now the live download for this product.`);
      setFile(null);
      setVersion('');
      if (fileInput.current) fileInput.current.value = '';
      router.refresh();
    } catch (caught) {
      setStatus('error');
      setMessage(caught instanceof Error ? caught.message : 'The upload failed.');
    }
  }

  async function handleRemove(productSlug: string) {
    if (!window.confirm('Remove this download? The stored APK will be deleted too.')) return;

    setRemoving(productSlug);
    setMessage('');
    try {
      const response = await fetch(`/api/admin/downloads?slug=${encodeURIComponent(productSlug)}`, {
        method: 'DELETE',
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? 'Could not remove the download.');

      setStatus('success');
      setMessage('Download removed.');
      router.refresh();
    } catch (caught) {
      setStatus('error');
      setMessage(caught instanceof Error ? caught.message : 'Could not remove the download.');
    } finally {
      setRemoving(null);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Upload an app</h2>
          <p className="mt-1 text-sm text-ink-soft">
            The file goes straight to storage and becomes the download on the products page.
          </p>
        </div>
        <button type="button" onClick={handleLogout} className="btn-secondary text-sm">
          Sign out
        </button>
      </div>

      <form onSubmit={handleUpload} className="card space-y-5 p-6">
        <div>
          <label htmlFor="product-slug" className="field-label">
            Product
          </label>
          <select
            id="product-slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className="field-input"
            required
          >
            {products.length === 0 && <option value="">No products configured</option>}
            {products.map((product) => (
              <option key={product.slug} value={product.slug}>
                {product.name}
              </option>
            ))}
          </select>
          <p className="field-hint">The public link will be /download/{slug || 'product-slug'}.</p>
        </div>

        <div>
          <label htmlFor="apk-file" className="field-label">
            APK file
          </label>
          <input
            id="apk-file"
            ref={fileInput}
            type="file"
            accept=".apk,application/vnd.android.package-archive"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="field-input"
            required
          />
          <p className="field-hint">Maximum {formatBytes(maxBytes)}. Android packages (.apk) only.</p>
        </div>

        <div>
          <label htmlFor="apk-version" className="field-label">
            Version <span className="font-normal text-ink-muted">(optional)</span>
          </label>
          <input
            id="apk-version"
            type="text"
            value={version}
            onChange={(event) => setVersion(event.target.value)}
            className="field-input"
            placeholder="e.g. 1.0.24"
            maxLength={60}
          />
        </div>

        {status === 'uploading' && (
          <div aria-live="polite">
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
              <div className="h-full bg-primary-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="field-hint">Uploading… {progress}%</p>
          </div>
        )}

        {message && (
          <p
            className={status === 'error' ? 'field-error' : 'text-sm font-medium text-primary-700 dark:text-primary-300'}
            role={status === 'error' ? 'alert' : 'status'}
          >
            {status === 'error' && <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />}
            <span>{message}</span>
          </p>
        )}

        <button type="submit" disabled={status === 'uploading' || !slug} className="btn-primary">
          <Icon name="download" className="h-4 w-4" />
          {status === 'uploading' ? 'Uploading…' : 'Upload APK'}
        </button>
      </form>

      <div className="card overflow-hidden">
        <h2 className="border-b border-line px-6 py-4 text-lg font-bold">Current downloads</h2>
        {downloads.length === 0 ? (
          <p className="px-6 py-6 text-sm text-ink-soft">No APKs uploaded yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {downloads.map((download) => (
              <li key={download.product_slug} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{download.file_name}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {download.product_slug}
                    {download.version ? ` · v${download.version}` : ''} · {formatBytes(download.size_bytes)} ·{' '}
                    {new Date(download.uploaded_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <a href={`/download/${download.product_slug}`} className="btn-link">
                    Open link
                    <Icon name="arrow-up-right" className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemove(download.product_slug)}
                    disabled={removing === download.product_slug}
                    className="text-sm font-semibold text-red-700 hover:underline disabled:opacity-60 dark:text-red-400"
                  >
                    {removing === download.product_slug ? 'Removing…' : 'Remove'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
