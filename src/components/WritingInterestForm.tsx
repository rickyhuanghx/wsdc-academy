'use client';

// Interest form for the homepage "Interested in writing competitions?" section.
// Posts to /api/writing-interest, which forwards to ClassDesk server-side (the
// browser CSP blocks classroomdesk.com) and falls back to an admin email when
// ClassDesk is unavailable, so a submission never disappears.

import { useState } from 'react';
import { GRADE_LEVELS } from '@/data/programs';
import { CONTACT_EMAIL } from '@/lib/site';
import { getAdCampaign, getAdClickId, trackEvent } from '@/lib/analytics';

export interface WritingInterestOption {
  slug: string;
  shortName: string;
  tag: string;
}

const inputClass =
  'mt-1.5 w-full rounded-sm border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:border-signal-500 focus:outline-none';
const labelClass = 'block text-sm font-semibold text-navy-900';

function listNames(names: string[]): string {
  if (names.length <= 1) return names.join('');
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

export function WritingInterestForm({ options }: { options: WritingInterestOption[] }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [chosen, setChosen] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? '').trim();
    const competitionSlugs = fd.getAll('competitions').map(String);

    if (competitionSlugs.length === 0) {
      setError('Tick at least one competition so we know what to send you.');
      setStatus('error');
      return;
    }
    const parentEmail = get('parentEmail');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)) {
      setError('Please enter a valid email address; it is where the details go.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    const payload = {
      website_url: get('website_url'),
      competitionSlugs,
      parentName: get('parentName'),
      parentEmail,
      parentPhone: get('parentPhone'),
      studentName: get('studentName'),
      grade: get('grade'),
      // Ad / campaign attribution captured on landing (analytics.ts); the
      // server keeps only well-formed, non-empty values.
      attribution: { gclid: getAdClickId(), ...getAdCampaign() },
    };
    try {
      const res = await fetch('/api/writing-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (res.ok && data.ok !== false) {
        trackEvent('lead_form_submitted', { form_endpoint: '/api/writing-interest' });
        setChosen(competitionSlugs);
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
    const names = options.filter((o) => chosen.includes(o.slug)).map((o) => o.shortName);
    return (
      <div className="rounded-sm border border-navy-200 bg-white p-6" role="status">
        <p className="font-display text-xl font-semibold text-navy-900">Thanks. We&apos;ll be in touch about {listNames(names)}.</p>
        <p className="mt-2 text-sm leading-relaxed text-navy-600">
          A coach from Atlantic Ivy will email you the dates, the fit for your student&apos;s grade, and
          how preparation works.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-sm border border-navy-200 bg-white p-6">
      {/* Honeypot: humans never see this field */}
      <input
        type="text"
        name="website_url"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      <fieldset>
        <legend className={labelClass}>
          Which competitions? <span className="text-signal-500">*</span>
        </legend>
        <ul className="mt-2 grid gap-2 sm:grid-cols-2">
          {options.map((o) => (
            <li key={o.slug}>
              <label className="flex cursor-pointer items-start gap-2.5 text-sm text-navy-800">
                <input
                  type="checkbox"
                  name="competitions"
                  value={o.slug}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-signal-500"
                />
                <span>
                  {o.shortName}
                  <span className="ml-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy-400">{o.tag}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="wi-parentName" className={labelClass}>
            Parent/guardian name
          </label>
          <input id="wi-parentName" name="parentName" type="text" maxLength={200} autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="wi-parentEmail" className={labelClass}>
            Email <span className="text-signal-500">*</span>
          </label>
          <input id="wi-parentEmail" name="parentEmail" type="email" required maxLength={254} autoComplete="email" className={inputClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="wi-parentPhone" className={labelClass}>
            Phone
          </label>
          <input id="wi-parentPhone" name="parentPhone" type="tel" maxLength={50} autoComplete="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="wi-studentName" className={labelClass}>
            Student name
          </label>
          <input id="wi-studentName" name="studentName" type="text" maxLength={200} className={inputClass} />
        </div>
      </div>

      <div className="sm:max-w-[50%] sm:pr-2.5">
        <label htmlFor="wi-grade" className={labelClass}>
          Grade
        </label>
        <select id="wi-grade" name="grade" defaultValue="" className={inputClass}>
          <option value="">Select…</option>
          {GRADE_LEVELS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {status === 'error' && (
        <p className="rounded-sm border border-signal-500 bg-signal-50 p-3 text-sm text-signal-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full rounded-sm bg-signal-500 px-7 py-3.5 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
      >
        {status === 'submitting' ? 'Sending…' : 'Send me the details'}
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
