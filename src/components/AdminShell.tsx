import Link from 'next/link';
import { lockAdmin, unlockAdmin } from '@/app/admin/actions';
import { isAdminConfigured } from '@/lib/admin-auth';
import { CONTACT_EMAIL } from '@/lib/site';

// Shared chrome for the coach desk. Server component: renders the unlock
// form when the viewer is not in, otherwise the page body with a small
// header and a lock button.

const inputClass =
  'mt-1.5 w-full rounded-sm border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:border-signal-500 focus:outline-none';

export function AdminUnlock({ error }: { error?: string }) {
  const message =
    error === 'key'
      ? 'That key is not right.'
      : error === 'slow'
        ? 'Too many tries. Wait a minute and try again.'
        : error === 'closed'
          ? 'The desk is not set up: ADMIN_KEY is not configured on the server.'
          : '';
  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-500">Coach desk</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900">Enter the desk key</h1>
        {isAdminConfigured() ? (
          <form action={unlockAdmin} className="mt-6 rounded-sm border border-navy-200 bg-white p-6">
            <label htmlFor="admin-key" className="block text-sm font-semibold text-navy-900">
              Key
            </label>
            <input id="admin-key" name="key" type="password" autoComplete="off" className={inputClass} />
            {message && (
              <p className="mt-2 text-sm text-signal-600" role="alert">
                {message}
              </p>
            )}
            <button
              type="submit"
              className="mt-5 w-full rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition hover:bg-signal-600 sm:w-auto"
            >
              Open the desk
            </button>
            <p className="mt-4 text-xs text-navy-500">Stays unlocked in this browser for 30 days.</p>
          </form>
        ) : (
          <p className="mt-6 rounded-sm border border-navy-200 bg-white p-6 text-sm text-navy-600">
            The desk is not set up yet. Set the ADMIN_KEY environment variable on the host, redeploy, then
            come back. Submissions still arrive by email at {CONTACT_EMAIL}.
          </p>
        )}
      </div>
    </section>
  );
}

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-cream py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-navy-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-500">
              <Link href="/admin/self-reports" className="hover:underline">
                Coach desk
              </Link>
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-900">{title}</h1>
          </div>
          <form action={lockAdmin}>
            <button type="submit" className="text-sm font-semibold text-navy-600 underline underline-offset-4 hover:text-signal-500">
              Lock desk
            </button>
          </form>
        </div>
        {children}
      </div>
    </section>
  );
}
