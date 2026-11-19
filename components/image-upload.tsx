'use client';

import { upload } from '@vercel/blob/client';
import { useRef, useState } from 'react';
import { Icon } from '@/components/icon';

const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const MAX_BYTES = 10 * 1024 * 1024;

function readableSize(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Image picker that uploads straight to Vercel Blob and records it in the media library. */
export function ImageUpload({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (url: string) => void;
  id?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError('');

    if (!ACCEPTED.includes(file.type)) {
      setError('Choose a PNG, JPEG, WebP or GIF image.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`Images must be under ${readableSize(MAX_BYTES)}.`);
      return;
    }

    setBusy(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-150);
      const blob = await upload(`images/${Date.now()}-${safeName}`, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/blob-token',
        clientPayload: JSON.stringify({ kind: 'image' }),
        contentType: file.type,
        onUploadProgress: () => undefined,
      });

      // Record the asset so it shows up in the media library.
      await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: blob.url,
          pathname: blob.pathname,
          fileName: file.name,
          contentType: blob.contentType ?? file.type,
          sizeBytes: file.size,
        }),
      });

      onChange(blob.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The upload failed.');
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <input
          id={id}
          ref={input}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif"
          onChange={(event) => handleFile(event.target.files?.[0])}
          className="field-input max-w-xs py-2 text-xs"
          disabled={busy}
        />
        {value && (
          <button type="button" onClick={() => onChange('')} className="btn-secondary px-3 py-2 text-xs">
            Clear image
          </button>
        )}
      </div>

      {value && (
        // Blob URLs are not Next.js-optimised here; a plain img keeps the
        // preview instant and works for both local paths and remote URLs.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Selected image preview" className="h-28 w-44 rounded-xl border border-line object-cover" />
      )}

      {busy && <p className="field-hint">Uploading image…</p>}
      {error && <p className="field-error">{error}</p>}
      {!value && <p className="field-hint">Leave blank to use the site default image.</p>}
    </div>
  );
}
