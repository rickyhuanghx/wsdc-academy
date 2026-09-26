'use client';

// Pre-diagnostic intake form (src/app/for/diagnostic/[token]/page.tsx).
//
// The family has already paid for the diagnostic session. Before it, the
// student confirms the basics we took at checkout, says what they want from
// coaching, does two short written argument tasks, and tells us when they are
// free. Four short sections, nothing scored on the page: the coach reads the
// answers before the session. See src/app/api/diagnostic-intake/route.ts.

import { useMemo, useState } from 'react';
import {
  AGES,
  CASE_MIN_WORDS,
  CASE_MAX_CHARS,
  DAYS,
  EXPERIENCE,
  FORMATS_TRIED,
  GOALS,
  MOTIONS,
  REBUTTAL_MAX_CHARS,
  REBUTTAL_PROMPT,
  SIDES,
  TIME_SPENT,
  WINDOWS,
  wordCount,
  type DiagnosticInvite,
} from '@/lib/diagnostic-intake';
import { GRADE_LEVELS } from '@/data/programs';
import { DIAL_CODES, needsDialCode, normalizePhone, phoneProblem, withDialCode } from '@/lib/phone';
import { useViewerTimezone } from '@/components/TimezoneSelect';
import { CONTACT_EMAIL } from '@/lib/site';
import { trackEvent } from '@/lib/analytics';

const inputClass =
  'mt-1.5 w-full rounded-sm border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:border-signal-500 focus:outline-none';
const labelClass = 'block text-sm font-semibold text-navy-900';
const helpClass = 'mt-1.5 text-xs text-navy-500';
const errClass = 'mt-1.5 text-sm text-signal-600';
const chipBase = 'rounded-sm border px-4 py-2.5 text-left text-sm transition';
const chipOn = 'border-signal-500 bg-signal-50 text-navy-900';
const chipOff = 'border-navy-200 text-navy-600 hover:border-navy-400';

interface Fields {
  studentName: string;
  age: string;
  grade: string;
  school: string;
  experience: string;
  competitions: string;
  notes: string;
  motion: string;
  side: string;
  caseText: string;
  rebuttalText: string;
  speechUrl: string;
  timeSpent: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  studentEmail: string;
}

type Errors = Partial<Record<keyof Fields | 'goals' | 'days' | 'windows', string>>;

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

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

export function DiagnosticIntakeForm({ invite }: { invite: DiagnosticInvite }) {
  const [fields, setFields] = useState<Fields>({
    studentName: invite.studentName,
    age: '',
    grade: invite.grade,
    school: invite.school,
    experience: '',
    competitions: '',
    notes: '',
    motion: '',
    side: '',
    caseText: '',
    rebuttalText: '',
    speechUrl: '',
    timeSpent: '',
    parentName: invite.parentName,
    parentEmail: invite.parentEmail,
    parentPhone: invite.parentPhone,
    studentEmail: '',
  });
  const [formatsTried, setFormatsTried] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [windows, setWindows] = useState<string[]>([]);
  const { zone, setZone, options: zoneOptions } = useViewerTimezone();
  const tzOffset = useMemo(() => offsetLabel(zone), [zone]);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState('');

  const caseWords = wordCount(fields.caseText);

  const set =
    (key: keyof Fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFields((f) => ({ ...f, [key]: value }));
      setErrors((er) => ({ ...er, [key]: undefined }));
    };

  function validate(): Errors {
    const er: Errors = {};
    if (!fields.studentName.trim()) er.studentName = 'Please enter your name.';
    if (!fields.age) er.age = 'Please choose an age.';
    if (!fields.grade) er.grade = 'Please choose a grade.';
    if (!fields.experience) er.experience = 'Please pick one.';
    if (goals.length === 0) er.goals = 'Pick at least one.';
    if (!fields.motion) er.motion = 'Please choose a motion.';
    if (!fields.side) er.side = 'Please choose a side.';
    if (caseWords < CASE_MIN_WORDS)
      er.caseText = `Please write at least ${CASE_MIN_WORDS} words (you have ${caseWords}).`;
    if (!fields.rebuttalText.trim()) er.rebuttalText = 'Please write a short response.';
    if (!fields.parentName.trim()) er.parentName = 'Please enter a name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.parentEmail.trim()))
      er.parentEmail = 'Please enter a valid email address.';
    if (fields.studentEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.studentEmail.trim()))
      er.studentEmail = 'Please enter a valid email address, or leave it blank.';
    const phoneMsg = phoneProblem(fields.parentPhone);
    if (phoneMsg) er.parentPhone = phoneMsg;
    if (days.length === 0) er.days = 'Pick at least one day.';
    if (windows.length === 0) er.windows = 'Pick at least one time of day.';
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
      const res = await fetch('/api/diagnostic-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          token: invite.token,
          parentPhone: normalizePhone(fields.parentPhone),
          formatsTried,
          goals,
          days,
          windows,
          timezone: `${zone.replace(/_/g, ' ')}${tzOffset ? ` (${tzOffset})` : ''}`,
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
          website_url: honeypot,
        }),
      });
      const body: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || body.ok === false) {
        throw new Error(body.error || 'Something went wrong. Please try again.');
      }
      trackEvent('lead_form_submitted', { form_endpoint: '/api/diagnostic-intake' });
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
        <h1 className="font-display text-2xl font-semibold text-navy-900">
          Thank you, {invite.studentFirst}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-navy-600">
          Your answers and both written tasks are with us. Your coach will read them before the
          session, and we will email within one working day to confirm a time.
        </p>
        <p className="mt-5 text-xs text-navy-500">
          Need to change something? Email{' '}
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

      {/* ---------- 1. About you ---------- */}
      <section className="rounded-sm border border-navy-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-500">1 of 4</p>
        <h2 className="mt-1 font-display text-xl font-semibold text-navy-900">About you</h2>
        <p className="mt-1 text-sm leading-relaxed text-navy-600">
          We took most of this at checkout. Check it and fix anything that is wrong.
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="studentName" className={labelClass}>
              Your name <span className="text-signal-500">*</span>
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
            {errors.studentName && <p className={errClass}>{errors.studentName}</p>}
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
            {errors.age && <p className={errClass}>{errors.age}</p>}
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
            {errors.grade && <p className={errClass}>{errors.grade}</p>}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="school" className={labelClass}>
              School
            </label>
            <input
              id="school"
              type="text"
              maxLength={200}
              value={fields.school}
              onChange={set('school')}
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2" data-error={Boolean(errors.experience)}>
            <p className={labelClass}>
              Debating so far <span className="text-signal-500">*</span>
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {EXPERIENCE.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => {
                    setFields((f) => ({ ...f, experience: l.value }));
                    setErrors((er) => ({ ...er, experience: undefined }));
                  }}
                  className={`${chipBase} ${fields.experience === l.value ? chipOn : chipOff}`}
                  aria-pressed={fields.experience === l.value}
                >
                  <span className="block font-semibold">{l.value}</span>
                  <span className="mt-0.5 block text-xs text-navy-500">{l.help}</span>
                </button>
              ))}
            </div>
            {errors.experience && <p className={errClass}>{errors.experience}</p>}
          </div>

          <div className="sm:col-span-2">
            <p className={labelClass}>
              Formats you have tried <span className="font-normal text-navy-500">(optional)</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {FORMATS_TRIED.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormatsTried((cur) => toggle(cur, f))}
                  className={`${chipBase} px-4 py-2 ${formatsTried.includes(f) ? chipOn : chipOff}`}
                  aria-pressed={formatsTried.includes(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 2. What you want ---------- */}
      <section className="rounded-sm border border-navy-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-500">2 of 4</p>
        <h2 className="mt-1 font-display text-xl font-semibold text-navy-900">What you want from coaching</h2>

        <div className="mt-5" data-error={Boolean(errors.goals)}>
          <p className={labelClass}>
            Pick everything that applies <span className="text-signal-500">*</span>
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {GOALS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setGoals((cur) => toggle(cur, g));
                  setErrors((er) => ({ ...er, goals: undefined }));
                }}
                className={`${chipBase} ${goals.includes(g) ? chipOn : chipOff}`}
                aria-pressed={goals.includes(g)}
              >
                {g}
              </button>
            ))}
          </div>
          {errors.goals && <p className={errClass}>{errors.goals}</p>}
        </div>

        <div className="mt-5">
          <label htmlFor="competitions" className={labelClass}>
            Competitions or deadlines on the horizon{' '}
            <span className="font-normal text-navy-500">(optional)</span>
          </label>
          <textarea
            id="competitions"
            rows={3}
            maxLength={1500}
            placeholder="A tournament and its month, a team trial, an application deadline. If nothing is planned, leave this blank."
            value={fields.competitions}
            onChange={set('competitions')}
            className={inputClass}
          />
        </div>

        <div className="mt-5">
          <label htmlFor="notes" className={labelClass}>
            Anything else the coach should know{' '}
            <span className="font-normal text-navy-500">(optional)</span>
          </label>
          <textarea
            id="notes"
            rows={3}
            maxLength={2000}
            placeholder="What you find hardest, what you enjoy, previous coaching."
            value={fields.notes}
            onChange={set('notes')}
            className={inputClass}
          />
        </div>
      </section>

      {/* ---------- 3. Two short tasks ---------- */}
      <section className="rounded-sm border border-navy-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-500">3 of 4</p>
        <h2 className="mt-1 font-display text-xl font-semibold text-navy-900">Two short written tasks</h2>
        <p className="mt-1 text-sm leading-relaxed text-navy-600">
          No research, no right answer. The coach wants to see how you think before you meet, so
          write it the way you would say it. Twenty to thirty minutes is plenty.
        </p>

        <div className="mt-6 border-t border-navy-100 pt-5">
          <h3 className="font-semibold text-navy-900">Task 1: build one argument</h3>
          <p className="mt-1 text-sm leading-relaxed text-navy-600">
            Choose a motion and a side. Then write your single strongest argument: what you are
            claiming, why it is true, and why it matters. Aim for 100 to 200 words.
          </p>

          <div className="mt-4" data-error={Boolean(errors.motion)}>
            <p className={labelClass}>
              Motion <span className="text-signal-500">*</span>
            </p>
            <div className="mt-2 grid gap-2">
              {MOTIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setFields((f) => ({ ...f, motion: m }));
                    setErrors((er) => ({ ...er, motion: undefined }));
                  }}
                  className={`${chipBase} ${fields.motion === m ? chipOn : chipOff}`}
                  aria-pressed={fields.motion === m}
                >
                  {m}
                </button>
              ))}
            </div>
            {errors.motion && <p className={errClass}>{errors.motion}</p>}
          </div>

          <div className="mt-4" data-error={Boolean(errors.side)}>
            <p className={labelClass}>
              Side <span className="text-signal-500">*</span>
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {SIDES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setFields((f) => ({ ...f, side: s }));
                    setErrors((er) => ({ ...er, side: undefined }));
                  }}
                  className={`${chipBase} ${fields.side === s ? chipOn : chipOff}`}
                  aria-pressed={fields.side === s}
                >
                  {s}
                </button>
              ))}
            </div>
            {errors.side && <p className={errClass}>{errors.side}</p>}
          </div>

          <div className="mt-4">
            <label htmlFor="caseText" className={labelClass}>
              Your argument <span className="text-signal-500">*</span>
            </label>
            <textarea
              id="caseText"
              rows={9}
              maxLength={CASE_MAX_CHARS}
              value={fields.caseText}
              onChange={set('caseText')}
              aria-invalid={Boolean(errors.caseText)}
              className={inputClass}
            />
            {errors.caseText ? (
              <p className={errClass}>{errors.caseText}</p>
            ) : (
              <p className={helpClass}>
                {caseWords} {caseWords === 1 ? 'word' : 'words'}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-navy-100 pt-5">
          <h3 className="font-semibold text-navy-900">Task 2: respond to an argument</h3>
          <p className="mt-1 text-sm leading-relaxed text-navy-600">
            Someone on the other side has just said this. Reply in three to five sentences, as if
            you disagreed. Find the weakest point and go after it.
          </p>
          <blockquote className="mt-3 border-l-2 border-signal-500 pl-4 text-sm italic leading-relaxed text-navy-800">
            “{REBUTTAL_PROMPT}”
          </blockquote>
          <div className="mt-4">
            <label htmlFor="rebuttalText" className={labelClass}>
              Your response <span className="text-signal-500">*</span>
            </label>
            <textarea
              id="rebuttalText"
              rows={5}
              maxLength={REBUTTAL_MAX_CHARS}
              value={fields.rebuttalText}
              onChange={set('rebuttalText')}
              aria-invalid={Boolean(errors.rebuttalText)}
              className={inputClass}
            />
            {errors.rebuttalText && <p className={errClass}>{errors.rebuttalText}</p>}
          </div>
        </div>

        <div className="mt-6 grid gap-5 border-t border-navy-100 pt-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="speechUrl" className={labelClass}>
              If you like: record yourself{' '}
              <span className="font-normal text-navy-500">(optional)</span>
            </label>
            <input
              id="speechUrl"
              type="url"
              inputMode="url"
              maxLength={500}
              placeholder="https://drive.google.com/..."
              value={fields.speechUrl}
              onChange={set('speechUrl')}
              className={inputClass}
            />
            <p className={helpClass}>
              A two-minute phone video of you delivering the argument from Task 1, shared as a link
              (Google Drive, unlisted YouTube, Loom). It helps the coach hear you as well as read you.
            </p>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="timeSpent" className={labelClass}>
              Roughly how long did the tasks take?{' '}
              <span className="font-normal text-navy-500">(optional)</span>
            </label>
            <select id="timeSpent" value={fields.timeSpent} onChange={set('timeSpent')} className={inputClass}>
              <option value="">Select…</option>
              {TIME_SPENT.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ---------- 4. When and how to reach you ---------- */}
      <section className="rounded-sm border border-navy-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-500">4 of 4</p>
        <h2 className="mt-1 font-display text-xl font-semibold text-navy-900">When are you free?</h2>
        <p className="mt-1 text-sm leading-relaxed text-navy-600">
          The session is 60 minutes on Zoom. Pick everything that could work; more options means a
          faster match.
        </p>

        <div className="mt-5">
          <label htmlFor="intake-tz" className={labelClass}>
            Your timezone
          </label>
          <select id="intake-tz" value={zone} onChange={(e) => setZone(e.target.value)} className={inputClass}>
            {zoneOptions.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
          <p className={helpClass}>
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
          {errors.days && <p className={errClass}>{errors.days}</p>}
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
          {errors.windows && <p className={errClass}>{errors.windows}</p>}
        </div>

        <div className="mt-6 grid gap-5 border-t border-navy-100 pt-5 sm:grid-cols-2">
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
            {errors.parentName && <p className={errClass}>{errors.parentName}</p>}
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
              value={fields.parentPhone}
              onChange={set('parentPhone')}
              aria-invalid={Boolean(errors.parentPhone)}
              className={inputClass}
            />
            {errors.parentPhone ? (
              <div>
                <p className={errClass}>{errors.parentPhone}</p>
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
              <p className={helpClass}>Start with your country code, e.g. +41 or +1.</p>
            )}
          </div>

          <div>
            <label htmlFor="parentEmail" className={labelClass}>
              Parent email <span className="text-signal-500">*</span>
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
            {errors.parentEmail && <p className={errClass}>{errors.parentEmail}</p>}
          </div>

          <div>
            <label htmlFor="studentEmail" className={labelClass}>
              Your own email <span className="font-normal text-navy-500">(optional)</span>
            </label>
            <input
              id="studentEmail"
              type="email"
              maxLength={254}
              value={fields.studentEmail}
              onChange={set('studentEmail')}
              aria-invalid={Boolean(errors.studentEmail)}
              className={inputClass}
            />
            {errors.studentEmail ? (
              <p className={errClass}>{errors.studentEmail}</p>
            ) : (
              <p className={helpClass}>So the Zoom link can go straight to you as well.</p>
            )}
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
          {submitting ? 'Sending…' : 'Send to my coach'}
        </button>
        <p className="mt-2 text-xs text-navy-500">We confirm a session time within one working day.</p>
      </div>
    </form>
  );
}
