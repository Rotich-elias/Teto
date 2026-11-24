'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/icon';
import { ImageUpload } from '@/components/image-upload';
import type { Advert } from '@/lib/adverts';

type ProductOption = { slug: string; name: string };

type FormState = {
  appSlug: string;
  title: string;
  body: string;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl: string;
  startsAt: string;
  endsAt: string;
  active: boolean;
};

function emptyForm(products: ProductOption[]): FormState {
  return {
    appSlug: products[0]?.slug ?? '',
    title: '',
    body: '',
    imageUrl: '',
    ctaLabel: '',
    ctaUrl: '',
    startsAt: '',
    endsAt: '',
    active: true,
  };
}

/** `datetime-local` inputs use the browser's timezone, not UTC. */
function toLocalInput(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toIso(local: string): string {
  if (!local) return '';
  const time = Date.parse(local);
  if (!Number.isFinite(time)) return '';
  return new Date(time).toISOString();
}

function payloadFromForm(form: FormState) {
  return {
    appSlug: form.appSlug,
    title: form.title,
    body: form.body,
    imageUrl: form.imageUrl,
    ctaLabel: form.ctaLabel,
    ctaUrl: form.ctaUrl,
    startsAt: toIso(form.startsAt),
    endsAt: toIso(form.endsAt),
    active: form.active,
  };
}

function payloadFromAdvert(advert: Advert) {
  return {
    appSlug: advert.app_slug,
    title: advert.title,
    body: advert.body,
    imageUrl: advert.image_url ?? '',
    ctaLabel: advert.cta_label ?? '',
    ctaUrl: advert.cta_url ?? '',
    startsAt: advert.starts_at ?? '',
    endsAt: advert.ends_at ?? '',
    active: advert.active,
  };
}

export function AdminAdvertsForm({
  products,
  adverts,
}: {
  products: ProductOption[];
  adverts: Advert[];
}) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(() => emptyForm(products));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(
    payload: ReturnType<typeof payloadFromForm>,
    id: number | null,
  ): Promise<boolean> {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/adverts', {
        method: id === null ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id === null ? payload : { id, ...payload }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? 'Could not save the advert.');

      setError(false);
      setMessage(id === null ? 'Advert published. It will appear on the next app launch.' : 'Advert updated.');
      setForm(emptyForm(products));
      setEditingId(null);
      router.refresh();
      return true;
    } catch (caught) {
      setError(true);
      setMessage(caught instanceof Error ? caught.message : 'Could not save the advert.');
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.appSlug) {
      setError(true);
      setMessage('Choose an app first.');
      return;
    }
    if (toIso(form.startsAt) === '' && form.startsAt) {
      setError(true);
      setMessage('The start date is not valid.');
      return;
    }
    if (toIso(form.endsAt) === '' && form.endsAt) {
      setError(true);
      setMessage('The end date is not valid.');
      return;
    }
    await save(payloadFromForm(form), editingId);
  }

  function startEditing(advert: Advert) {
    setEditingId(advert.id);
    setForm({
      ...payloadFromAdvert(advert),
      imageUrl: advert.image_url ?? '',
      startsAt: toLocalInput(advert.starts_at),
      endsAt: toLocalInput(advert.ends_at),
    });
    setError(false);
    setMessage(`Editing “${advert.title}”. Save to apply the changes.`);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm(products));
    setError(false);
    setMessage('');
  }

  async function toggleActive(advert: Advert) {
    setBusyId(advert.id);
    const ok = await save({ ...payloadFromAdvert(advert), active: !advert.active }, advert.id);
    if (ok) {
      // Save clears the form; keep the list action's feedback instead.
      setMessage(advert.active ? 'Advert paused.' : 'Advert activated.');
    }
    setBusyId(null);
  }

  async function handleDelete(advert: Advert) {
    if (!window.confirm(`Delete “${advert.title}”? This cannot be undone.`)) return;

    setBusyId(advert.id);
    setMessage('');
    try {
      const response = await fetch(`/api/admin/adverts?id=${advert.id}`, { method: 'DELETE' });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? 'Could not delete the advert.');
      setError(false);
      setMessage('Advert deleted.');
      if (editingId === advert.id) cancelEditing();
      router.refresh();
    } catch (caught) {
      setError(true);
      setMessage(caught instanceof Error ? caught.message : 'Could not delete the advert.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold">{editingId === null ? 'New advert' : 'Edit advert'}</h2>
        <p className="mt-1 text-sm text-ink-soft">
          The popup appears once on launch for each app that matches, until this advert is paused or deleted.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5 p-6">
        <div>
          <label htmlFor="advert-app" className="field-label">
            App
          </label>
          <select
            id="advert-app"
            value={form.appSlug}
            onChange={(event) => update('appSlug', event.target.value)}
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
          <p className="field-hint">Use the product slug that the app requests, e.g. deadlines-notes.</p>
        </div>

        <div>
          <label htmlFor="advert-title" className="field-label">
            Title
          </label>
          <input
            id="advert-title"
            type="text"
            value={form.title}
            onChange={(event) => update('title', event.target.value)}
            className="field-input"
            placeholder="e.g. New study planner available"
            maxLength={120}
            required
          />
        </div>

        <div>
          <label htmlFor="advert-body" className="field-label">
            Message
          </label>
          <textarea
            id="advert-body"
            value={form.body}
            onChange={(event) => update('body', event.target.value)}
            className="field-input min-h-28"
            placeholder="What should people see in the popup?"
            maxLength={1000}
            required
          />
        </div>

        <div>
          <span className="field-label">Image</span>
          <ImageUpload value={form.imageUrl} onChange={(url) => update('imageUrl', url)} id="advert-image" />
          <p className="field-hint">Optional banner shown above the message. PNG, JPEG, WebP or GIF up to 10 MB.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="advert-cta-label" className="field-label">
              Button label <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <input
              id="advert-cta-label"
              type="text"
              value={form.ctaLabel}
              onChange={(event) => update('ctaLabel', event.target.value)}
              className="field-input"
              placeholder="Learn more"
              maxLength={40}
            />
          </div>
          <div>
            <label htmlFor="advert-cta-url" className="field-label">
              Button link <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <input
              id="advert-cta-url"
              type="url"
              value={form.ctaUrl}
              onChange={(event) => update('ctaUrl', event.target.value)}
              className="field-input"
              placeholder="https://teto.co.ke/products"
              maxLength={2000}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="advert-starts" className="field-label">
              Start <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <input
              id="advert-starts"
              type="datetime-local"
              value={form.startsAt}
              onChange={(event) => update('startsAt', event.target.value)}
              className="field-input"
            />
          </div>
          <div>
            <label htmlFor="advert-ends" className="field-label">
              End <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <input
              id="advert-ends"
              type="datetime-local"
              value={form.endsAt}
              onChange={(event) => update('endsAt', event.target.value)}
              className="field-input"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(event) => update('active', event.target.checked)}
            className="h-4 w-4"
          />
          Active (outside the scheduled window, if set)
        </label>

        {message && (
          <p
            className={error ? 'field-error' : 'text-sm font-medium text-primary-700 dark:text-primary-300'}
            role={error ? 'alert' : 'status'}
          >
            {error && <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />}
            <span>{message}</span>
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving || !form.appSlug} className="btn-primary">
            {saving ? 'Saving…' : editingId === null ? 'Publish advert' : 'Save changes'}
          </button>
          {editingId !== null && (
            <button type="button" onClick={cancelEditing} disabled={saving} className="btn-secondary">
              Cancel editing
            </button>
          )}
        </div>
      </form>

      <div className="card overflow-hidden">
        <h2 className="border-b border-line px-6 py-4 text-lg font-bold">Existing adverts</h2>
        {adverts.length === 0 ? (
          <p className="px-6 py-6 text-sm text-ink-soft">No adverts yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {adverts.map((advert) => (
              <li key={advert.id} className="flex flex-wrap items-start justify-between gap-4 px-6 py-4">
                <div className="flex min-w-0 gap-4">
                  {advert.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={advert.image_url}
                      alt=""
                      className="h-16 w-24 shrink-0 rounded-lg border border-line object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{advert.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-ink-muted">{advert.body}</p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {advert.app_slug} ·{' '}
                      <span className={advert.active ? 'font-semibold text-primary-700 dark:text-primary-300' : ''}>
                        {advert.active ? 'Active' : 'Paused'}
                      </span>
                      {advert.starts_at ? ` · from ${new Date(advert.starts_at).toLocaleString()}` : ''}
                      {advert.ends_at ? ` · until ${new Date(advert.ends_at).toLocaleString()}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => startEditing(advert)} className="btn-link">
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleActive(advert)}
                    disabled={busyId === advert.id}
                    className="btn-link disabled:opacity-60"
                  >
                    {advert.active ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(advert)}
                    disabled={busyId === advert.id}
                    className="text-sm font-semibold text-red-700 hover:underline disabled:opacity-60 dark:text-red-400"
                  >
                    Delete
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
