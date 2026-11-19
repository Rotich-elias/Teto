'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/icon';
import type { AdminMessage } from '@/lib/admin-data';

export function AdminMessageInbox({ initial }: { initial: AdminMessage[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initial);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [open, setOpen] = useState<number | null>(initial[0]?.id ?? null);
  const [busy, setBusy] = useState<number | null>(null);

  async function markRead(id: number, read: boolean) {
    setBusy(id);
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read }),
      });
      if (!response.ok) throw new Error('Could not update the message.');
      setMessages((current) => current.map((item) => (item.id === id ? { ...item, read } : item)));
      if (read && unreadOnly) setMessages((current) => current.filter((item) => item.id !== id));
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: number) {
    if (!window.confirm('Delete this enquiry permanently?')) return;
    setBusy(id);
    try {
      const response = await fetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not delete the message.');
      setMessages((current) => current.filter((item) => item.id !== id));
      if (open === id) setOpen(null);
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  const visible = unreadOnly ? messages.filter((item) => !item.read) : messages;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={unreadOnly} onChange={(event) => setUnreadOnly(event.target.checked)} />
          Unread only
        </label>
        <p className="text-sm text-ink-muted">{visible.length} messages</p>
      </div>

      {visible.length === 0 ? (
        <div className="card border-dashed p-8 text-center text-sm text-ink-soft">No messages to show.</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <ul className="card divide-y divide-line overflow-hidden">
            {visible.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setOpen(item.id)}
                  className={`w-full px-4 py-3 text-left transition hover:bg-surface-sunken ${open === item.id ? 'bg-surface-sunken' : ''}`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-bold">{item.name}</span>
                    {!item.read && <span className="h-2 w-2 shrink-0 rounded-full bg-accent-500" aria-label="Unread" />}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-ink-muted">{item.service}</span>
                  <span className="mt-1 block truncate text-xs text-ink-soft">{item.message}</span>
                  <span className="mt-1 block text-[0.65rem] text-ink-muted">{new Date(item.created_at).toLocaleString()}</span>
                </button>
              </li>
            ))}
          </ul>

          {(() => {
            const selected = visible.find((item) => item.id === open);
            if (!selected) {
              return <div className="card hidden p-6 text-sm text-ink-soft lg:block">Choose a message to read it.</div>;
            }
            return (
              <div className="card space-y-4 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
                  <div>
                    <h2 className="text-lg font-bold">{selected.name}</h2>
                    <p className="text-sm text-ink-soft">
                      <a href={`mailto:${selected.email}`} className="hover:underline">
                        {selected.email}
                      </a>
                      {selected.phone ? <> · {selected.phone}</> : null}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {selected.service} · {new Date(selected.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-surface-sunken px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ink-muted">
                    {selected.read ? 'Read' : 'Unread'}
                  </span>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{selected.message}</p>

                <div className="flex flex-wrap gap-2 border-t border-line pt-4">
                  {!selected.read && (
                    <button type="button" onClick={() => markRead(selected.id, true)} disabled={busy === selected.id} className="btn-primary px-3 py-1.5 text-xs">
                      <Icon name="check" className="h-3.5 w-3.5" /> Mark as read
                    </button>
                  )}
                  {selected.read && (
                    <button type="button" onClick={() => markRead(selected.id, false)} disabled={busy === selected.id} className="btn-secondary px-3 py-1.5 text-xs">
                      Mark unread
                    </button>
                  )}
                  <a href={`mailto:${selected.email}`} className="btn-secondary px-3 py-1.5 text-xs">
                    Reply by email
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(selected.id)}
                    disabled={busy === selected.id}
                    className="px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
