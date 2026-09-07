'use client';

// Waitlist / interest form for tournaments. With a `slug` it joins that
// tournament's waitlist through /api/tournaments/waitlist (which forwards to
// ClassDesk). Without one ("generic" mode on the empty listing) the same route
// records interest with the team by email instead.
//
// Owner constraint: only parent name/email/phone and student name, date of
// birth, grade, school. Nothing else.

import { useState } from 'react';
import { GRADE_LEVELS } from '@/data/programs';
import { CONTACT_EMAIL } from '@/lib/site';
import { trackEvent } from '@/lib/analytics';

const inputClass =
  'mt-1.5 w-full rounded-md border border-navy-200 bg-cream px-3.5 py-2.5 text-sm text-navy-900 focus:border-signal-500 focus:outline-none';
const labelClass = 'block text-sm font-semibold text-navy-900';

export function WaitlistForm({
  slug,
  tournamentName,
  generic = false,
}: {
  slug?: string;
  tournamentName?: string;
  /** Interest form for when nothing is open: no DOB/school required. */
  generic?: boolean;
}) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? '').trim();
    const payload = {
      slug: slug ?? '',
      website_url: get('website_url'),
      parentName: get('parentName'),
      parentEmail: get('parentEmail'),
      parentPhone: get('parentPhone'),
      studentName: get('studentName'),
      dob: get('dob'),
      grade: get('grade'),
      school: get('school'),
    };
    try {
      const res = await fetch('/api/tournaments/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (res.ok && data.ok !== false) {
        trackEvent('lead_form_submitted', { form_endpoint: '/api/tournaments/waitlist' });
        setStatus('success');
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-navy-100 bg-white p-6">
        <p className="font-semibold text-navy-900">
          {generic ? 'Thanks, you are on the list.' : 'You are on the waitlist.'}
        </p>
        <p className="mt-2 text-sm text-navy-600">
          {generic
            ? 'We will email you when the next tournament opens for registration.'
            : `We will email you if a place opens up${tournamentName ? ` for ${tournamentName}` : ''}.`}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-navy-100 bg-white p-6">
      {/* Honeypot: humans never see this field */}
      <input
        type="text"
        name="website_url"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <div>
        <label htmlFor="wl-parentName" className={labelClass}>
          Parent/guardian name <span className="text-signal-500">*</span>
        </label>
        <input id="wl-parentName" name="parentName" type="text" required maxLength={200} className={inputClass} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="wl-parentEmail" className={labelClass}>
            Email <span className="text-signal-500">*</span>
          </label>
          <input id="wl-parentEmail" name="parentEmail" type="email" required maxLength={254} className={inputClass} />
        </div>
        <div>
          <label htmlFor="wl-parentPhone" className={labelClass}>
            Phone
          </label>
          <input id="wl-parentPhone" name="parentPhone" type="tel" maxLength={50} className={inputClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="wl-studentName" className={labelClass}>
            Student name <span className="text-signal-500">*</span>
          </label>
          <input id="wl-studentName" name="studentName" type="text" required maxLength={200} className={inputClass} />
        </div>
        <div>
          <label htmlFor="wl-grade" className={labelClass}>
            Grade <span className="text-signal-500">*</span>
          </label>
          <select id="wl-grade" name="grade" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select…
            </option>
            {GRADE_LEVELS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!generic && (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="wl-dob" className={labelClass}>
              Date of birth <span className="text-signal-500">*</span>
            </label>
            <input id="wl-dob" name="dob" type="date" required max={today} className={inputClass} />
          </div>
          <div>
            <label htmlFor="wl-school" className={labelClass}>
              School <span className="text-signal-500">*</span>
            </label>
            <input id="wl-school" name="school" type="text" required maxLength={200} placeholder="School name" className={inputClass} />
          </div>
        </div>
      )}

      {status === 'error' && (
        <p className="rounded-md border border-signal-500 bg-signal-500/5 p-3 text-sm text-signal-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full rounded-md bg-signal-500 px-7 py-3.5 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
      >
        {status === 'submitting' ? 'Sending…' : generic ? 'Tell me when one opens' : 'Join the waitlist'}
      </button>
      <p className="text-xs text-navy-500">
        Questions? Write to{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </form>
  );
}
