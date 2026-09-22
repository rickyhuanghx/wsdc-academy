'use client';

// Unlisted 1-on-1 coaching request form (src/app/coaching-1on1/page.tsx).
//
// Staff send the URL to a family; the family ranks the coaches they would like
// and ticks the windows they are free. The submission lands in the WSDC inbox
// and in Supabase. Families reaching this form have already settled on 1-on-1
// coaching, so the page never mentions a fee: it exists to fix who teaches and
// when. No live slot booking — the follow-up is manual. See
// src/app/api/coaching-1on1/route.ts.

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  DAYS,
  FORMATS,
  LEVELS,
  NO_PREFERENCE,
  WINDOWS,
  oneOnOneCoaches,
} from '@/lib/coaching-request';
import { GRADE_LEVELS } from '@/data/programs';
import { DIAL_CODES, needsDialCode, normalizePhone, phoneProblem, withDialCode } from '@/lib/phone';
import { useViewerTimezone } from '@/components/TimezoneSelect';
import { CONTACT_EMAIL } from '@/lib/site';
import { trackEvent } from '@/lib/analytics';

const inputClass =
  'mt-1.5 w-full rounded-sm border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:border-signal-500 focus:outline-none';
const labelClass = 'block text-sm font-semibold text-navy-900';
const chipBase = 'rounded-sm border px-4 py-2.5 text-left text-sm transition';
const chipOn = 'border-signal-500 bg-signal-50 text-navy-900';
const chipOff = 'border-navy-200 text-navy-600 hover:border-navy-400';

const AGES = ['9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];

interface Fields {
  studentName: string;
  age: string;
  grade: string;
  level: string;
  format: string;
  goal: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  videoUrl: string;
  notes: string;
}

const EMPTY: Fields = {
  studentName: '',
  age: '',
  grade: '',
  level: '',
  format: '',
  goal: '',
  parentName: '',
  parentEmail: '',
  parentPhone: '',
  videoUrl: '',
  notes: '',
};

type Errors = Partial<Record<keyof Fields | 'days' | 'windows' | 'coach', string>>;

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

// Rendered on the server for the anchor zone and again on the client for the
// detected one, exactly as the schedule views do.
function offsetLabel(zone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en', {
      timeZone: zone,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date());
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
  } catch {
    return '';
  }
}

export function CoachingRequestForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [days, setDays] = useState<string[]>([]);
  const [windows, setWindows] = useState<string[]>([]);
  // Ordered coach preference by slug: ranked[0] is the first choice. Empty
  // while nobody is picked, and cleared when they tick "no preference".
  const [ranked, setRanked] = useState<string[]>([]);
  const [noPreference, setNoPreference] = useState(false);
  const { zone, setZone, options: zoneOptions } = useViewerTimezone();
  const tzOffset = useMemo(() => offsetLabel(zone), [zone]);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState('');

  const set =
    (key: keyof Fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFields((f) => ({ ...f, [key]: value }));
      setErrors((er) => ({ ...er, [key]: undefined }));
    };

  // Ranked coaches float to the top in the chosen order; the rest keep the
  // roster order below them.
  const orderedCoaches = [
    ...ranked
      .map((slug) => oneOnOneCoaches.find((c) => c.slug === slug))
      .filter((c): c is (typeof oneOnOneCoaches)[number] => Boolean(c)),
    ...oneOnOneCoaches.filter((c) => !ranked.includes(c.slug)),
  ];

  function addRank(slug: string) {
    setRanked((cur) => (cur.includes(slug) ? cur : [...cur, slug]));
    setNoPreference(false);
    setErrors((er) => ({ ...er, coach: undefined }));
  }

  function removeRank(slug: string) {
    setRanked((cur) => cur.filter((s) => s !== slug));
  }

  function moveRank(slug: string, delta: number) {
    setRanked((cur) => {
      const i = cur.indexOf(slug);
      const j = i + delta;
      if (i < 0 || j < 0 || j >= cur.length) return cur;
      const next = [...cur];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function validate(): Errors {
    const er: Errors = {};
    if (!fields.studentName.trim()) er.studentName = "Please enter the student's name.";
    if (!fields.age) er.age = 'Please choose an age.';
    if (!fields.grade) er.grade = 'Please choose a grade.';
    if (!fields.level) er.level = 'Please pick a level.';
    if (!fields.format) er.format = 'Please pick a focus.';
    if (!fields.parentName.trim()) er.parentName = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.parentEmail.trim()))
      er.parentEmail = 'Please enter a valid email address.';
    const phoneMsg = phoneProblem(fields.parentPhone);
    if (phoneMsg) er.parentPhone = phoneMsg;
    if (days.length === 0) er.days = 'Pick at least one day.';
    if (windows.length === 0) er.windows = 'Pick at least one time of day.';
    if (!noPreference && ranked.length === 0)
      er.coach = 'Rank at least one coach, or tick "No preference".';
    return er;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFailed('');
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length > 0) {
      const first = document.querySelector('[aria-invalid="true"], [data-error="true"]');
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/coaching-1on1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          parentPhone: normalizePhone(fields.parentPhone),
          days,
          windows,
          // Ordered slugs: the first entry is the first choice. Empty when they
          // ticked "no preference" — the flag below is what the server reads then.
          coachRanking: noPreference ? [] : ranked,
          noPreference,
          timezone: `${zone.replace(/_/g, ' ')}${tzOffset ? ` (${tzOffset})` : ''}`,
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
          website_url: honeypot,
        }),
      });
      const body: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || body.ok === false) {
        throw new Error(body.error || 'Something went wrong. Please try again.');
      }
      trackEvent('lead_form_submitted', { form_endpoint: '/api/coaching-1on1' });
      setDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setFailed(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-sm border border-navy-200 bg-white p-8 text-center" role="status">
        <h1 className="font-display text-2xl font-semibold text-navy-900">Request received</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-navy-600">
          Thank you. We have your details and will be in touch within one working day to confirm
          your coach and a time.
        </p>
        <p className="mt-5 text-xs text-navy-500">
          If it is urgent, email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {/* Honeypot: bots fill this, people never see it. */}
      <input
        type="text"
        name="website_url"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {/* ---------- Student ---------- */}
      <section className="rounded-sm border border-navy-200 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-navy-900">The student</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="studentName" className={labelClass}>
              Student name <span className="text-signal-500">*</span>
            </label>
            <input
              id="studentName"
              type="text"
              maxLength={200}
              value={fields.studentName}
              onChange={set('studentName')}
              aria-invalid={Boolean(errors.studentName)}
              className={inputClass}
            />
            {errors.studentName && <p className="mt-1.5 text-sm text-signal-600">{errors.studentName}</p>}
          </div>

          <div>
            <label htmlFor="age" className={labelClass}>
              Age <span className="text-signal-500">*</span>
            </label>
            <select
              id="age"
              value={fields.age}
              onChange={set('age')}
              aria-invalid={Boolean(errors.age)}
              className={inputClass}
            >
              <option value="">Select…</option>
              {AGES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            {errors.age && <p className="mt-1.5 text-sm text-signal-600">{errors.age}</p>}
          </div>

          <div>
            <label htmlFor="grade" className={labelClass}>
              Grade <span className="text-signal-500">*</span>
            </label>
            <select
              id="grade"
              value={fields.grade}
              onChange={set('grade')}
              aria-invalid={Boolean(errors.grade)}
              className={inputClass}
            >
              <option value="">Select…</option>
              {GRADE_LEVELS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {errors.grade && <p className="mt-1.5 text-sm text-signal-600">{errors.grade}</p>}
          </div>

          <div className="sm:col-span-2" data-error={Boolean(errors.level)}>
            <p className={labelClass}>
              Where are they now? <span className="text-signal-500">*</span>
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {LEVELS.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => {
                    setFields((f) => ({ ...f, level: l.value }));
                    setErrors((er) => ({ ...er, level: undefined }));
                  }}
                  className={`${chipBase} ${fields.level === l.value ? chipOn : chipOff}`}
                  aria-pressed={fields.level === l.value}
                >
                  <span className="block font-semibold">{l.value}</span>
                  <span className="mt-0.5 block text-xs text-navy-500">{l.help}</span>
                </button>
              ))}
            </div>
            {errors.level && <p className="mt-1.5 text-sm text-signal-600">{errors.level}</p>}
          </div>

          <div className="sm:col-span-2" data-error={Boolean(errors.format)}>
            <p className={labelClass}>
              What should the sessions focus on? <span className="text-signal-500">*</span>
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {FORMATS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setFields((cur) => ({ ...cur, format: f }));
                    setErrors((er) => ({ ...er, format: undefined }));
                  }}
                  className={`${chipBase} ${fields.format === f ? chipOn : chipOff}`}
                  aria-pressed={fields.format === f}
                >
                  {f}
                </button>
              ))}
            </div>
            {errors.format && <p className="mt-1.5 text-sm text-signal-600">{errors.format}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="goal" className={labelClass}>
              What are they working towards?{' '}
              <span className="font-normal text-navy-500">(optional)</span>
            </label>
            <input
              id="goal"
              type="text"
              maxLength={300}
              placeholder="A tournament, a squad trial, or just getting more confident on their feet"
              value={fields.goal}
              onChange={set('goal')}
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-navy-500">
              A date or a tournament name helps us pace the sessions.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Availability ---------- */}
      <section className="rounded-sm border border-navy-200 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-navy-900">When are you free to meet?</h2>
        <p className="mt-1 text-sm leading-relaxed text-navy-600">
          Pick everything that could work. More options means a faster match.
        </p>

        <div className="mt-5">
          <label htmlFor="coaching-tz" className={labelClass}>
            Your timezone
          </label>
          <select
            id="coaching-tz"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className={inputClass}
          >
            {zoneOptions.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-navy-500">
            The times below are read in{' '}
            <strong className="font-semibold text-navy-900">{zone.replace(/_/g, ' ')}</strong>
            {tzOffset ? ` (${tzOffset})` : ''}.
          </p>
        </div>

        <div className="mt-5" data-error={Boolean(errors.days)}>
          <p className={labelClass}>
            Days <span className="text-signal-500">*</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setDays((cur) => toggle(cur, d));
                  setErrors((er) => ({ ...er, days: undefined }));
                }}
                className={`${chipBase} px-4 py-2 ${days.includes(d) ? chipOn : chipOff}`}
                aria-pressed={days.includes(d)}
              >
                {d}
              </button>
            ))}
          </div>
          {errors.days && <p className="mt-1.5 text-sm text-signal-600">{errors.days}</p>}
        </div>

        <div className="mt-5" data-error={Boolean(errors.windows)}>
          <p className={labelClass}>
            Time of day <span className="text-signal-500">*</span>
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {WINDOWS.map((w) => (
              <button
                key={w.value}
                type="button"
                onClick={() => {
                  setWindows((cur) => toggle(cur, w.value));
                  setErrors((er) => ({ ...er, windows: undefined }));
                }}
                className={`${chipBase} ${windows.includes(w.value) ? chipOn : chipOff}`}
                aria-pressed={windows.includes(w.value)}
              >
                <span className="block font-semibold">{w.value}</span>
                <span className="mt-0.5 block text-xs text-navy-500">{w.range}</span>
              </button>
            ))}
          </div>
          {errors.windows && <p className="mt-1.5 text-sm text-signal-600">{errors.windows}</p>}
        </div>
      </section>

      {/* ---------- Coach ranking ---------- */}
      <section className="rounded-sm border border-navy-200 bg-white p-6" data-error={Boolean(errors.coach)}>
        <h2 className="font-display text-xl font-semibold text-navy-900">
          Choose your coaches in order of preference <span className="text-signal-500">*</span>
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-navy-600">
          Rank as many as you like. Availability varies, so if your first choice cannot make your
          times we go straight to your next one. You do not have to rank everybody.
        </p>

        <div className={`mt-5 space-y-3 ${noPreference ? 'opacity-50' : ''}`}>
          {orderedCoaches.map((c) => {
            const rank = ranked.indexOf(c.slug);
            const isRanked = rank >= 0;
            return (
              <div
                key={c.slug}
                className={`flex gap-4 rounded-sm border p-4 transition ${
                  isRanked ? 'border-signal-500 bg-signal-50' : 'border-navy-200'
                }`}
              >
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <Image
                    src={c.image}
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  {isRanked && (
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 text-xs font-semibold text-white"
                      aria-hidden="true"
                    >
                      {rank + 1}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy-900">
                    {c.name}
                    {isRanked && (
                      <span className="font-normal text-signal-600"> (choice {rank + 1})</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-signal-500">
                    {c.role}
                  </p>
                  <ul className="mt-2.5 space-y-1.5 text-sm text-navy-600">
                    {c.credentials.map((credential) => (
                      <li key={credential} className="flex gap-2">
                        <span className="mt-0.5 text-signal-500">•</span>
                        {credential}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {isRanked ? (
                      <>
                        <button
                          type="button"
                          disabled={noPreference || rank === 0}
                          onClick={() => moveRank(c.slug, -1)}
                          aria-label={`Move ${c.name} up`}
                          className="rounded-sm border border-navy-200 px-3 py-1.5 text-sm text-navy-600 transition hover:border-navy-400 disabled:opacity-40 disabled:hover:border-navy-200"
                        >
                          Move up
                        </button>
                        <button
                          type="button"
                          disabled={noPreference || rank === ranked.length - 1}
                          onClick={() => moveRank(c.slug, 1)}
                          aria-label={`Move ${c.name} down`}
                          className="rounded-sm border border-navy-200 px-3 py-1.5 text-sm text-navy-600 transition hover:border-navy-400 disabled:opacity-40 disabled:hover:border-navy-200"
                        >
                          Move down
                        </button>
                        <button
                          type="button"
                          disabled={noPreference}
                          onClick={() => removeRank(c.slug)}
                          aria-label={`Remove ${c.name} from your ranking`}
                          className="rounded-sm border border-navy-200 px-3 py-1.5 text-sm text-navy-500 transition hover:border-navy-400 disabled:opacity-40"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled={noPreference}
                        onClick={() => addRank(c.slug)}
                        className="rounded-sm border border-signal-500 px-3 py-1.5 text-sm font-semibold text-signal-600 transition hover:bg-signal-50 disabled:opacity-40"
                      >
                        Add to my ranking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-sm border border-navy-200 px-4 py-3 transition hover:border-navy-400">
          <input
            type="checkbox"
            checked={noPreference}
            onChange={(e) => {
              const on = e.target.checked;
              setNoPreference(on);
              if (on) setRanked([]);
              setErrors((er) => ({ ...er, coach: undefined }));
            }}
            className="mt-1 h-4 w-4 shrink-0 accent-signal-500"
          />
          <span>
            <span className="block font-semibold text-navy-900">{NO_PREFERENCE}</span>
            <span className="mt-0.5 block text-xs text-navy-500">
              Match us with whoever fits the schedule and the format best.
            </span>
          </span>
        </label>

        {errors.coach && <p className="mt-3 text-sm text-signal-600">{errors.coach}</p>}
      </section>

      {/* ---------- Contact ---------- */}
      <section className="rounded-sm border border-navy-200 bg-white p-6">
        <h2 className="font-display text-xl font-semibold text-navy-900">How we reach you</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="parentName" className={labelClass}>
              Parent / guardian name <span className="text-signal-500">*</span>
            </label>
            <input
              id="parentName"
              type="text"
              maxLength={200}
              autoComplete="name"
              value={fields.parentName}
              onChange={set('parentName')}
              aria-invalid={Boolean(errors.parentName)}
              className={inputClass}
            />
            {errors.parentName && <p className="mt-1.5 text-sm text-signal-600">{errors.parentName}</p>}
          </div>

          <div>
            <label htmlFor="parentPhone" className={labelClass}>
              Phone (WhatsApp preferred) <span className="text-signal-500">*</span>
            </label>
            <input
              id="parentPhone"
              type="tel"
              maxLength={50}
              autoComplete="tel"
              placeholder="+1 347 817 8056"
              value={fields.parentPhone}
              onChange={set('parentPhone')}
              aria-invalid={Boolean(errors.parentPhone)}
              className={inputClass}
            />
            {errors.parentPhone ? (
              <div>
                <p className="mt-1.5 text-sm text-signal-600">{errors.parentPhone}</p>
                {needsDialCode(fields.parentPhone) && (
                  <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Add a country code">
                    {DIAL_CODES.map((d) => (
                      <button
                        key={d.code}
                        type="button"
                        className="rounded-full border border-navy-200 px-3 py-1 text-xs text-navy-600 transition hover:border-navy-400"
                        onClick={() => {
                          setFields((f) => ({ ...f, parentPhone: withDialCode(f.parentPhone, d.code) }));
                          setErrors((er) => ({ ...er, parentPhone: undefined }));
                        }}
                      >
                        {d.code} {d.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-1.5 text-xs text-navy-500">Start with your country code, e.g. +1 or +971.</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="parentEmail" className={labelClass}>
              Email <span className="text-signal-500">*</span>
            </label>
            <input
              id="parentEmail"
              type="email"
              maxLength={254}
              autoComplete="email"
              value={fields.parentEmail}
              onChange={set('parentEmail')}
              aria-invalid={Boolean(errors.parentEmail)}
              className={inputClass}
            />
            {errors.parentEmail && <p className="mt-1.5 text-sm text-signal-600">{errors.parentEmail}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="videoUrl" className={labelClass}>
              Link to a recent speech or ballot{' '}
              <span className="font-normal text-navy-500">(optional)</span>
            </label>
            <input
              id="videoUrl"
              type="url"
              inputMode="url"
              maxLength={500}
              placeholder="https://drive.google.com/..."
              value={fields.videoUrl}
              onChange={set('videoUrl')}
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-navy-500">
              A phone recording is fine. It helps the coach pitch the first session correctly.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="notes" className={labelClass}>
              Anything else we should know?{' '}
              <span className="font-normal text-navy-500">(optional)</span>
            </label>
            <textarea
              id="notes"
              rows={3}
              maxLength={2000}
              placeholder="Previous coaching, tournaments already entered, school commitments."
              value={fields.notes}
              onChange={set('notes')}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {failed && (
        <p className="rounded-sm border border-signal-500 bg-signal-50 p-3 text-sm text-signal-600" role="alert">
          {failed}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-sm bg-signal-500 px-7 py-3.5 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
        >
          {submitting ? 'Sending…' : 'Send request'}
        </button>
        <p className="mt-2 text-xs text-navy-500">We reply within one working day.</p>
      </div>
    </form>
  );
}
