'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon, iconNames, type IconName } from '@/components/icon';
import { ImageUpload } from '@/components/image-upload';
import { fromEditorDoc, toEditorDoc, type FieldDef } from '@/lib/admin-fields';
import type { SectionKey } from '@/lib/content-sections';

type Path = (string | number)[];
type Doc = Record<string, unknown>;

function getAt(doc: unknown, path: Path): unknown {
  let current: unknown = doc;
  for (const part of path) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string | number, unknown>)[part];
  }
  return current;
}

function setAt(doc: Doc, path: Path, value: unknown): Doc {
  if (path.length === 0) return value as Doc;
  const clone = (Array.isArray(doc) ? [...doc] : { ...doc }) as Record<string | number, unknown>;
  let cursor = clone;
  for (let index = 0; index < path.length - 1; index += 1) {
    const part = path[index]!;
    const next = cursor[part];
    cursor[part] = Array.isArray(next) ? [...next] : next && typeof next === 'object' ? { ...next } : {};
    cursor = cursor[part] as Record<string | number, unknown>;
  }
  cursor[path[path.length - 1]!] = value;
  return clone as Doc;
}

const inputClass = 'field-input';
const labelClass = 'field-label';

function MoveButtons({
  index,
  total,
  onMove,
}: {
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
}) {
  return (
    <span className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onMove(-1)}
        disabled={index === 0}
        aria-label="Move up"
        className="rounded-md border border-line px-2 py-1 text-xs disabled:opacity-30"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={() => onMove(1)}
        disabled={index === total - 1}
        aria-label="Move down"
        className="rounded-md border border-line px-2 py-1 text-xs disabled:opacity-30"
      >
        ↓
      </button>
    </span>
  );
}

export function AdminEditor({
  section,
  fields,
  initial,
  canReset = true,
}: {
  section: SectionKey;
  fields: FieldDef[];
  initial: Doc;
  canReset?: boolean;
}) {
  const router = useRouter();
  const [doc, setDoc] = useState<Doc>(initial);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const update = (path: Path, value: unknown) => setDoc((current) => setAt(current, path, value));

  function leaf(field: Extract<FieldDef, { type: 'text' | 'textarea' | 'url' | 'image' | 'icon' }>, base: Path) {
    const path = [...base, field.key];
    const raw = getAt(doc, path);
    const value = raw == null ? '' : String(raw);
    const id = path.join('-');

    if (field.type === 'image') {
      return <ImageUpload id={id} value={value} onChange={(url) => update(path, url)} />;
    }

    if (field.type === 'icon') {
      return (
        <select id={id} value={value || 'web'} onChange={(event) => update(path, event.target.value)} className={inputClass}>
          {iconNames.map((name: IconName) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      );
    }

    const change = (next: string) => update(path, field.nullable && next.trim() === '' ? null : next);

    if (field.type === 'textarea') {
      return (
        <textarea
          id={id}
          value={value}
          maxLength={field.maxLength}
          rows={4}
          onChange={(event) => change(event.target.value)}
          className={inputClass}
        />
      );
    }

    return (
      <input
        id={id}
        type="text"
        value={value}
        maxLength={field.maxLength}
        onChange={(event) => change(event.target.value)}
        className={inputClass}
      />
    );
  }

  function renderFields(list: FieldDef[], base: Path = []): React.ReactNode {
    return list.map((field) => {
      const path = [...base, field.key];
      const id = path.join('-');

      if (field.type === 'group') {
        return (
          <fieldset key={id} className="space-y-4 rounded-2xl border border-line p-5">
            <legend className="px-2 text-sm font-bold">{field.label}</legend>
            {renderFields(field.fields, path)}
          </fieldset>
        );
      }

      if (field.type === 'stringList') {
        const items = Array.isArray(getAt(doc, path)) ? (getAt(doc, path) as unknown[]) : [];
        return (
          <div key={id} className="space-y-2">
            <label className={labelClass}>{field.label}</label>
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  value={String(item ?? '')}
                  onChange={(event) => update([...path, index], event.target.value)}
                  className={inputClass}
                  aria-label={`${field.label} ${index + 1}`}
                />
                <MoveButtons
                  index={index}
                  total={items.length}
                  onMove={(direction) => {
                    const next = [...items];
                    const other = index + direction;
                    [next[index], next[other]] = [next[other]!, next[index]!];
                    update(path, next);
                  }}
                />
                <button
                  type="button"
                  onClick={() => update(path, items.filter((_, i) => i !== index))}
                  className="text-xs font-semibold text-red-700 dark:text-red-400"
                  aria-label={`Remove ${field.label} ${index + 1}`}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => update(path, [...items, field.template ?? ''])}
              className="btn-secondary px-3 py-1.5 text-xs"
            >
              + Add
            </button>
            {field.hint && <p className="field-hint">{field.hint}</p>}
          </div>
        );
      }

      if (field.type === 'objectList') {
        const items = Array.isArray(getAt(doc, path)) ? (getAt(doc, path) as Doc[]) : [];
        return (
          <div key={id} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <label className={labelClass}>{field.label}</label>
              <button
                type="button"
                onClick={() => update(path, [...items, structuredClone(field.template ?? {})])}
                className="btn-secondary px-3 py-1.5 text-xs"
              >
                + Add
              </button>
            </div>
            {field.hint && <p className="field-hint -mt-2">{field.hint}</p>}

            {items.map((item, index) => (
              <div key={index} className="space-y-4 rounded-2xl border border-line bg-surface-sunken/40 p-5">
                <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
                  <p className="text-sm font-bold">{String(item.name ?? item.title ?? item.slug ?? `Item ${index + 1}`)}</p>
                  <div className="flex items-center gap-3">
                    {field.reorderable && (
                      <MoveButtons
                        index={index}
                        total={items.length}
                        onMove={(direction) => {
                          const next = [...items];
                          const other = index + direction;
                          [next[index], next[other]] = [next[other]!, next[index]!];
                          update(path, next);
                        }}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => update(path, items.filter((_, i) => i !== index))}
                      className="text-xs font-semibold text-red-700 dark:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                {renderFields(field.fields, [...path, index])}
              </div>
            ))}

            {items.length === 0 && <p className="rounded-xl border border-dashed border-line p-5 text-sm text-ink-muted">Nothing added yet.</p>}
          </div>
        );
      }

      if (field.type === 'select') {
        const value = String(getAt(doc, path) ?? field.options[0] ?? '');
        return (
          <div key={id}>
            <label htmlFor={id} className={labelClass}>
              {field.label}
            </label>
            <select id={id} value={value} onChange={(event) => update(path, event.target.value)} className={inputClass}>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      }

      return (
        <div key={id}>
          <label htmlFor={id} className={labelClass}>
            {field.label}
          </label>
          {leaf(field, base)}
          {field.hint && <p className="field-hint">{field.hint}</p>}
        </div>
      );
    });
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setError('');

    let payload: unknown = fromEditorDoc(section, doc);
    if (jsonMode) {
      try {
        payload = JSON.parse(jsonText);
      } catch {
        setError('The JSON is not valid. Fix it or switch back to the form.');
        setBusy(false);
        return;
      }
    }

    try {
      const response = await fetch(`/api/admin/content/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? 'Could not save.');

      setMessage('Saved. The public site has been updated.');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    if (!window.confirm('Reset this section to its built-in default values?')) return;
    setBusy(true);
    setMessage('');
    setError('');
    try {
      const response = await fetch(`/api/admin/content/${section}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not reset this section.');
      const defaults = (await (await fetch(`/api/admin/content/${section}`)).json()) as { value: unknown };
      setDoc(toEditorDoc(section, defaults.value));
      setMessage('Reset to defaults.');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not reset.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="card space-y-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <p className="text-sm text-ink-soft">Changes go live as soon as you save — no redeploy needed.</p>
          <button
            type="button"
            onClick={() => {
              if (!jsonMode) setJsonText(JSON.stringify(fromEditorDoc(section, doc), null, 2));
              setJsonMode(!jsonMode);
            }}
            className="btn-secondary px-3 py-1.5 text-xs"
          >
            {jsonMode ? 'Use the form' : 'Edit as JSON'}
          </button>
        </div>

        {jsonMode ? (
          <textarea
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            rows={24}
            spellCheck={false}
            className="field-input font-mono text-xs"
            aria-label="Section JSON"
          />
        ) : (
          renderFields(fields)
        )}
      </div>

      {message && (
        <p className="flex items-center gap-2 text-sm font-semibold text-primary-700 dark:text-primary-300" role="status">
          <Icon name="check-circle" className="h-4 w-4" /> {message}
        </p>
      )}
      {error && (
        <p className="field-error" role="alert">
          <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" /> <span>{error}</span>
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={busy} className="btn-primary">
          <Icon name="check" className="h-4 w-4" />
          {busy ? 'Saving…' : 'Save changes'}
        </button>
        {canReset && (
          <button type="button" onClick={reset} disabled={busy} className="btn-secondary">
            Reset section to defaults
          </button>
        )}
      </div>
    </form>
  );
}
