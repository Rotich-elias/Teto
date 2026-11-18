'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icon } from '@/components/icon';

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? 'Could not sign in.');

      setPassword('');
      router.push('/admin/downloads');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6 sm:p-8">
      <div>
        <label htmlFor="admin-password" className="field-label">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="field-input"
          placeholder="Enter the admin password"
        />
      </div>

      {error && (
        <p className="field-error" role="alert">
          <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-primary w-full">
        {busy ? 'Signing in…' : 'Sign in'}
        <Icon name="arrow-right" className="h-4 w-4" />
      </button>
    </form>
  );
}
