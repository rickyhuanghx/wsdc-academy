'use client';

// Student self-report quiz (/for/self-report). Rendered only after the
// password cookie is set. Three parts: who you are, fifteen 1-to-5 statements
// grouped by the WSDC ballot areas, three reflections. Scored on the client
// for the instant result and again on the server for the stored record; both
// use scoreSelfReport() from src/lib/self-report.ts.

import { useMemo, useState } from 'react';
import { GRADE_LEVELS } from '@/data/programs';
import {
  REFLECTION_MAX_CHARS,
  SELF_REPORT_AREAS,
  SELF_REPORT_CLASSES,
  SELF_REPORT_EXPERIENCE,
  SELF_REPORT_QUESTIONS,
  SELF_REPORT_REFLECTIONS,
  SELF_REPORT_SCALE,
  describeBand,
  scoreSelfReport,
  type SelfReportScore,
} from '@/lib/self-report';
import { CONTACT_EMAIL } from '@/lib/site';

const inputClass =
  'mt-1.5 w-full rounded-sm border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:border-signal-500 focus:outline-none';
const labelClass = 'block text-sm font-semibold text-navy-900';
const helpClass = 'mt-1.5 text-xs text-navy-500';
const errClass = 'mt-1.5 text-sm text-signal-600';
const scaleBase =
  'flex flex-1 flex-col items-center gap-1 rounded-sm border px-1 py-2 text-center text-xs transition sm:px-2';
const scaleOn = 'border-signal-500 bg-signal-50 text-navy-900';
const scaleOff = 'border-navy-200 text-navy-600 hover:border-navy-400';

interface Identity {
  studentName: string;
  grade: string;
  className: string;
  experience: string;
  email: string;
}

type Reflections = Record<(typeof SELF_REPORT_REFLECTIONS)[number]['id'], string>;

const EMPTY_IDENTITY: Identity = { studentName: '', grade: '', className: '', experience: '', email: '' };
const EMPTY_REFLECTIONS: Reflections = { wentWell: '', improve: '', forCoach: '' };

export function SelfReportQuiz() {
  const [identity, setIdentity] = useState<Identity>(EMPTY_IDENTITY);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [reflections, setReflections] = useState<Reflections>(EMPTY_REFLECTIONS);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState('');
  const [result, setResult] = useState<SelfReportScore | null>(null);

  const answered = useMemo(() => Object.keys(answers).length, [answers]);

  function setField<K extends keyof Identity>(key: K, value: Identity[K]) {
    setIdentity((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function answer(id: string, value: number) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => {
      if (!prev.answers) return prev;
      const next = { ...prev };
      delete next.answers;
      return next;
    });
  }

  function validate(): Record<string, string> {
    const er: Record<string, string> = {};
    if (!identity.studentName.trim()) er.studentName = 'Your name, please.';
    if (!identity.grade) er.grade = 'Pick your grade.';
    if (!identity.className) er.className = 'Pick your class.';
    if (!identity.experience) er.experience = 'Pick one.';
    if (identity.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.email)) er.email = 'That email does not look right.';
    const missing = SELF_REPORT_QUESTIONS.filter((q) => !answers[q.id]).length;
    if (missing > 0) er.answers = `${missing} statement${missing === 1 ? '' : 's'} still need an answer.`;
    for (const r of SELF_REPORT_REFLECTIONS) {
      if (r.required && !reflections[r.id].trim()) er[r.id] = 'A sentence or two is enough.';
    }
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
      const res = await fetch('/api/self-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...identity,
          answers,
          ...reflections,
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
          website_url: honeypot,
        }),
      });
      const body: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || body.ok === false) {
        throw new Error(body.error || 'Something went wrong. Please try again.');
      }
      setResult(scoreSelfReport(answers));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setFailed(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    const first = identity.studentName.trim().split(/\s+/)[0] || 'there';
    return (
      <div className="rounded-sm border border-navy-200 bg-white p-6 sm:p-8" role="status">
        <h2 className="font-display text-2xl font-semibold text-navy-900">Thank you, {first}</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy-600">
          Your coach has your answers. Here is how you rated yourself, weighted the way a World Schools
          ballot is (content 40, style 40, strategy 20).
        </p>

        <div className="mt-6 flex items-baseline gap-3">
          <span className="font-display text-5xl font-bold text-signal-500">{result.overall}</span>
          <span className="text-sm text-navy-500">out of 100, by your own account</span>
        </div>

        <ul className="mt-6 space-y-5">
          {result.areas.map((a) => (
            <li key={a.id}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-semibold text-navy-900">
                  {a.name} <span className="font-normal text-navy-500">({a.weight}%)</span>
                </span>
                <span className="font-mono text-navy-700">{a.average.toFixed(1)} / 5</span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-sm bg-navy-100">
                <div className="h-2 rounded-sm bg-signal-500" style={{ width: `${a.percent}%` }} />
              </div>
              <p className="mt-1.5 text-xs text-navy-500">{describeBand(a.percent)}</p>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-xs leading-relaxed text-navy-500">
          A self-rating is a starting point, not a verdict. Your coach will set it next to what they see
          in your rounds and talk it through with you in class. Questions? Email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-signal-500 underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-10" noValidate>
      {/* Part 1: who */}
      <section className="rounded-sm border border-navy-200 bg-white p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-navy-900">1. About you</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="sr-name" className={labelClass}>
              Your name
            </label>
            <input
              id="sr-name"
              type="text"
              autoComplete="name"
              value={identity.studentName}
              onChange={(e) => setField('studentName', e.target.value)}
              aria-invalid={errors.studentName ? 'true' : undefined}
              className={inputClass}
            />
            {errors.studentName && <p className={errClass}>{errors.studentName}</p>}
          </div>
          <div>
            <label htmlFor="sr-grade" className={labelClass}>
              Grade
            </label>
            <select
              id="sr-grade"
              value={identity.grade}
              onChange={(e) => setField('grade', e.target.value)}
              aria-invalid={errors.grade ? 'true' : undefined}
              className={inputClass}
            >
              <option value="">Choose…</option>
              {GRADE_LEVELS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {errors.grade && <p className={errClass}>{errors.grade}</p>}
          </div>
          <div>
            <label htmlFor="sr-class" className={labelClass}>
              Your class
            </label>
            <select
              id="sr-class"
              value={identity.className}
              onChange={(e) => setField('className', e.target.value)}
              aria-invalid={errors.className ? 'true' : undefined}
              className={inputClass}
            >
              <option value="">Choose…</option>
              {SELF_REPORT_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.className && <p className={errClass}>{errors.className}</p>}
          </div>
          <div className="sm:col-span-2">
            <span className={labelClass}>How long have you been debating?</span>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4" data-error={errors.experience ? 'true' : undefined}>
              {SELF_REPORT_EXPERIENCE.map((opt) => {
                const on = identity.experience === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setField('experience', opt)}
                    className={`rounded-sm border px-3 py-2.5 text-sm transition ${on ? scaleOn : scaleOff}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {errors.experience && <p className={errClass}>{errors.experience}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="sr-email" className={labelClass}>
              Email <span className="font-normal text-navy-500">(optional)</span>
            </label>
            <input
              id="sr-email"
              type="email"
              autoComplete="email"
              value={identity.email}
              onChange={(e) => setField('email', e.target.value)}
              aria-invalid={errors.email ? 'true' : undefined}
              className={inputClass}
            />
            <p className={helpClass}>Yours or a parent&apos;s, in case your coach wants to follow up.</p>
            {errors.email && <p className={errClass}>{errors.email}</p>}
          </div>
        </div>
      </section>

      {/* Part 2: statements */}
      <section className="rounded-sm border border-navy-200 bg-white p-6 sm:p-8" data-error={errors.answers ? 'true' : undefined}>
        <h2 className="font-display text-xl font-semibold text-navy-900">2. Rate yourself</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy-600">
          For each statement, pick how often it is true of you in a real round. Think about your last few
          debates, not your best one.
        </p>
        <p className="mt-2 font-mono text-xs text-navy-500">
          {answered} of {SELF_REPORT_QUESTIONS.length} answered
        </p>

        {SELF_REPORT_AREAS.map((area, areaIndex) => (
          <fieldset key={area.id} className="mt-8 border-t border-navy-100 pt-6">
            <legend className="font-display text-lg font-semibold text-navy-900">
              {area.name} <span className="text-sm font-normal text-navy-500">({area.weight}% of the ballot)</span>
            </legend>
            <p className="mt-1 text-sm text-navy-600">{area.intro}</p>
            <ol className="mt-5 space-y-6">
              {SELF_REPORT_QUESTIONS.filter((q) => q.area === area.id).map((q, i) => {
                const n = areaIndex * 5 + i + 1;
                return (
                  <li key={q.id}>
                    <p className="text-sm font-semibold text-navy-900">
                      <span className="mr-2 font-mono text-signal-500">{String(n).padStart(2, '0')}</span>
                      {q.text}
                    </p>
                    <div className="mt-2.5 flex gap-1.5 sm:gap-2" role="radiogroup" aria-label={q.text}>
                      {SELF_REPORT_SCALE.map((s) => {
                        const on = answers[q.id] === s.value;
                        return (
                          <button
                            key={s.value}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => answer(q.id, s.value)}
                            className={`${scaleBase} ${on ? scaleOn : scaleOff}`}
                          >
                            <span className="font-mono text-sm font-semibold">{s.value}</span>
                            <span className="hidden leading-tight sm:block">{s.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ol>
          </fieldset>
        ))}
        <p className="mt-6 text-xs text-navy-500 sm:hidden">
          1 = not yet · 2 = sometimes · 3 = about half the time · 4 = most rounds · 5 = every round
        </p>
        {errors.answers && <p className={errClass}>{errors.answers}</p>}
      </section>

      {/* Part 3: reflections */}
      <section className="rounded-sm border border-navy-200 bg-white p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-navy-900">3. In your own words</h2>
        <div className="mt-5 space-y-6">
          {SELF_REPORT_REFLECTIONS.map((r) => (
            <div key={r.id}>
              <label htmlFor={`sr-${r.id}`} className={labelClass}>
                {r.label}
                {!r.required && <span className="font-normal text-navy-500"> (optional)</span>}
              </label>
              <textarea
                id={`sr-${r.id}`}
                rows={4}
                maxLength={REFLECTION_MAX_CHARS}
                value={reflections[r.id]}
                onChange={(e) => {
                  const value = e.target.value;
                  setReflections((prev) => ({ ...prev, [r.id]: value }));
                  setErrors((prev) => {
                    if (!prev[r.id]) return prev;
                    const next = { ...prev };
                    delete next[r.id];
                    return next;
                  });
                }}
                aria-invalid={errors[r.id] ? 'true' : undefined}
                className={inputClass}
              />
              <p className={helpClass}>{r.help}</p>
              {errors[r.id] && <p className={errClass}>{errors[r.id]}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website_url">Website</label>
        <input id="website_url" name="website_url" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

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
        <p className="mt-2 text-xs text-navy-500">You will see your own scores straight away.</p>
      </div>
    </form>
  );
}
