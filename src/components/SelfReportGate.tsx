'use client';

// Password step for the self-report quiz (/for/self-report). Posts the
// password to /api/self-report/unlock; on success the route sets an httpOnly
// cookie and router.refresh() re-renders the server page with the quiz.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CONTACT_EMAIL } from '@/lib/site';

export function SelfReportGate() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setError('Enter the password your coach sent you.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/self-report/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const body: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) {
        throw new Error(body.error || 'That password is not right.');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-sm border border-navy-200 bg-white p-6 sm:p-8" noValidate>
      <h2 className="font-display text-xl font-semibold text-navy-900">Enter the password</h2>
      <p className="mt-2 text-sm leading-relaxed text-navy-600">
        This page is for current students. Your coach sent the password with the link.
      </p>
      <label htmlFor="self-report-password" className="mt-5 block text-sm font-semibold text-navy-900">
        Password
      </label>
      <input
        id="self-report-password"
        type="password"
        autoComplete="off"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-invalid={error ? 'true' : undefined}
        className="mt-1.5 w-full rounded-sm border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:border-signal-500 focus:outline-none"
      />
      {error && (
        <p className="mt-2 text-sm text-signal-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="mt-5 w-full rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
      >
        {busy ? 'Checking…' : 'Open the quiz'}
      </button>
      <p className="mt-4 text-xs text-navy-500">
        Lost the password? Email{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-signal-500 underline underline-offset-4">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </form>
  );
}
