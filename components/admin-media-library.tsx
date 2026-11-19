'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/icon';
import type { MediaAsset } from '@/lib/admin-data';

function formatBytes(bytes: number): string {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export function AdminMediaLibrary({ initial }: { initial: MediaAsset[] }) {
  const router = useRouter();
  const [media, setMedia] = useState(initial);
  const [copied, setCopied] = useState('');
  const [busy, setBusy] = useState('');

  async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    window.setTimeout(() => setCopied(''), 1500);
  }

  async function remove(pathname: string) {
    if (!window.confirm('Delete this image from storage and the media library?')) return;
    setBusy(pathname);
    try {
      const response = await fetch(`/api/admin/media?pathname=${encodeURIComponent(pathname)}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not delete the image.');
      setMedia((current) => current.filter((item) => item.pathname !== pathname));
      router.refresh();
    } finally {
      setBusy('');
    }
  }

  if (media.length === 0) {
    return (
      <div className="card border-dashed p-8 text-center">
        <p className="text-sm font-semibold">No uploaded images yet.</p>
        <p className="mt-2 text-sm text-ink-soft">
          Use the image picker in any editor — for example the <a href="/admin/content/portfolio" className="text-primary-700 underline dark:text-primary-300">portfolio editor</a>. Uploaded images are collected here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {media.map((item) => (
        <div key={item.id} className="card overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.url} alt={item.file_name} className="h-40 w-full bg-surface-sunken object-cover" />
          <div className="space-y-2 p-4">
            <p className="truncate text-sm font-bold" title={item.file_name}>
              {item.file_name}
            </p>
            <p className="text-xs text-ink-muted">
              {formatBytes(item.size_bytes)} · {new Date(item.uploaded_at).toLocaleDateString()}
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => copy(item.url)} className="btn-secondary px-3 py-1.5 text-xs">
                <Icon name={copied === item.url ? 'check' : 'layers'} className="h-3.5 w-3.5" />
                {copied === item.url ? 'Copied' : 'Copy URL'}
              </button>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-secondary px-3 py-1.5 text-xs">
                Open
              </a>
              <button
                type="button"
                onClick={() => remove(item.pathname)}
                disabled={busy === item.pathname}
                className="px-2 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-50 dark:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
