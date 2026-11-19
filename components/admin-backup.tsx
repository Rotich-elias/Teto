'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { sectionLabels } from '@/lib/content-sections';

type Change = { id: number; section: string; action: string; changed_at: string };

function labelFor(section: string): string {
  return sectionLabels[section as keyof typeof sectionLabels] ?? section;
}

export function AdminBackup({ changes }: { changes: Change[] }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function importFile(file: File | undefined) {
    if (!file) return;
    if (!window.confirm('Import this backup? Sections present in the file will replace the current site content.')) {
      if (fileInput.current) fileInput.current.value = '';
      return;
    }

    setBusy(true);
    setMessage('');
    setError('');
    try {
      const payload = JSON.parse(await file.text()) as unknown;
      const response = await fetch('/api/admin/content/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string; sections?: number };
      if (!response.ok) throw new Error(data.error ?? 'Import failed.');
      setMessage(`Imported ${data.sections ?? 0} sections. The site has been updated.`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Import failed.');
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  return (
    <div className="space-y-8">
      <div className="card space-y-5 p-6">
        <div>
          <h2 className="text-lg font-bold">Export content</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Download every editable section as a JSON backup. Store it somewhere safe before a large edit or migration.
          </p>
        </div>
        <a href="/api/admin/content/export" className="btn-primary">
          Download backup
        </a>
      </div>

      <div className="card space-y-5 p-6">
        <div>
          <h2 className="text-lg font-bold">Import content</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Restore a backup exported from this site. Only recognised sections are imported; each one is validated before
            anything is written. APK files and uploaded images are not included — use the media library and downloads pages
            for those.
          </p>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          onChange={(event) => importFile(event.target.files?.[0])}
          disabled={busy}
          className="field-input max-w-md py-2 text-sm"
        />
        {busy && <p className="field-hint">Importing…</p>}
        {message && <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">{message}</p>}
        {error && <p className="field-error">{error}</p>}
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-line p-6">
          <h2 className="text-lg font-bold">Change history</h2>
          <p className="mt-1 text-sm text-ink-soft">The last 50 content saves, resets and imports.</p>
        </div>
        {changes.length === 0 ? (
          <p className="p-6 text-sm text-ink-soft">No changes have been recorded yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {changes.map((change) => (
              <li key={change.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm">
                <span className="font-semibold">{labelFor(change.section)}</span>
                <span className="text-xs text-ink-muted">
                  {change.action} · {new Date(change.changed_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
