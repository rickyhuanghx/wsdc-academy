'use client';

// Midterm check-in paper (/for/self-report). Rendered only after the password
// cookie is set, and only in the browser (see SelfReportPaper.tsx). Three parts from src/lib/self-report.ts: skills self-report,
// quiz, motion analysis, then an optional reflection. Nothing is marked on the
// page: the quiz key lives server-side only, and the student sees a plain
// "received" screen. A draft is kept in localStorage while they write, so a
// refresh mid-paper loses nothing, and is cleared once the server has it.

import { useEffect, useState } from 'react';
import { GRADE_LEVELS } from '@/data/programs';
import {
  ALL_SKILLS,
  CORE_SKILLS,
  EXPLAIN_MAX_CHARS,
  MOTIONS,
  MOTION_ANSWER_MAX_CHARS,
  MOTION_PROMPTS,
  PART_A_NOTE,
  PART_C_NOTE,
  QUIZ_QUESTIONS,
  RATING_SCALE,
  REFLECTIONS,
  REFLECTION_MAX_CHARS,
  SELF_REPORT_CLASSES,
  SUPPORTING_SKILLS,
  type OptionKey,
  type SelfReportSubmission,
} from '@/lib/self-report';
import { CONTACT_EMAIL } from '@/lib/site';

const DRAFT_KEY = 'wsdc-self-report-draft-v1';

const inputClass =
  'mt-1.5 w-full rounded-sm border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 focus:border-signal-500 focus:outline-none';
const labelClass = 'block text-sm font-semibold text-navy-900';
const helpClass = 'mt-1.5 text-xs text-navy-500';
const errClass = 'mt-1.5 text-sm text-signal-600';
const choiceBase = 'rounded-sm border text-left text-sm transition';
const choiceOn = 'border-signal-500 bg-signal-50 text-navy-900';
const choiceOff = 'border-navy-200 text-navy-700 hover:border-navy-400';
const cardClass = 'rounded-sm border border-navy-200 bg-white p-6 sm:p-8';

const EMPTY: SelfReportSubmission = {
  studentName: '',
  grade: '',
  className: '',
  email: '',
  ratings: {},
  explains: {},
  quiz: {},
  motion: '',
  motionAnswers: {},
  reflections: {},
};

function loadDraft(): SelfReportSubmission | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SelfReportSubmission>;
    return { ...EMPTY, ...parsed };
  } catch {
    return null;
  }
}

export function SelfReportQuiz() {
  // Client-only component, so the draft can be read in the initializer.
  const [form, setForm] = useState<SelfReportSubmission>(() => loadDraft() ?? EMPTY);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState('');
  const [done, setDone] = useState(false);

  // Autosave the draft on every change until the server has the paper.
  useEffect(() => {
    if (done) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      // Private mode or storage blocked: the paper still works, just without the safety net.
    }
  }, [form, done]);

  function clearError(key: string) {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }
  function setTop<K extends 'studentName' | 'grade' | 'className' | 'email' | 'motion'>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearError(key);
  }
  function setIn<K extends 'ratings' | 'explains' | 'quiz' | 'motionAnswers' | 'reflections'>(
    group: K,
    id: string,
    value: SelfReportSubmission[K][string],
  ) {
    setForm((prev) => ({ ...prev, [group]: { ...prev[group], [id]: value } }));
    clearError(`${group}.${id}`);
    clearError(group);
  }

  function validate(): Record<string, string> {
    const er: Record<string, string> = {};
    if (!form.studentName.trim()) er.studentName = 'Your name, please.';
    if (!form.grade) er.grade = 'Pick your grade.';
    if (!form.className) er.className = 'Pick your class.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = 'That email does not look right.';

    const unrated = ALL_SKILLS.filter((s) => !form.ratings[s.id]).length;
    if (unrated) er.ratings = `${unrated} skill${unrated === 1 ? '' : 's'} still need a rating.`;
    for (const s of CORE_SKILLS) {
      if (!form.explains[s.id]?.trim()) er[`explains.${s.id}`] = 'One or two sentences, please.';
    }
    const unanswered = QUIZ_QUESTIONS.filter((q) => !form.quiz[q.id]).length;
    if (unanswered) er.quiz = `${unanswered} question${unanswered === 1 ? '' : 's'} still need an answer.`;

    if (!form.motion) er.motion = 'Choose one motion.';
    for (const p of MOTION_PROMPTS) {
      if (!form.motionAnswers[p.id]?.trim()) er[`motionAnswers.${p.id}`] = 'A line or two, please.';
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
          ...form,
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
          website_url: honeypot,
        }),
      });
      const body: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || body.ok === false) {
        throw new Error(body.error || 'Something went wrong. Please try again.');
      }
      setDone(true);
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setFailed(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    const first = form.studentName.trim().split(/\s+/)[0] || 'there';
    return (
      <div className={cardClass} role="status">
        <h2 className="font-display text-2xl font-semibold text-navy-900">Thank you, {first}</h2>
        <p className="mt-3 text-sm leading-relaxed text-navy-600">
          Your check-in is saved. Your coach will read and mark it, then go through it with you in class,
          so you can close this page now.
        </p>
        <p className="mt-5 text-xs leading-relaxed text-navy-500">
          Questions? Email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-signal-500 underline underline-offset-4">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  const ratingButtons = (id: string) => (
    <div className="mt-2.5 grid grid-cols-4 gap-1.5 sm:gap-2" role="radiogroup">
      {RATING_SCALE.map((s) => {
        const on = form.ratings[id] === s.value;
        return (
          <button
            key={s.value}
            type="button"
            role="radio"
            aria-checked={on}
            title={s.label}
            onClick={() => setIn('ratings', id, s.value)}
            className={`${choiceBase} flex flex-col items-center gap-1 px-1 py-2 text-center text-xs sm:px-2 ${on ? choiceOn : choiceOff}`}
          >
            <span className="font-mono text-sm font-semibold">{s.value}</span>
            <span className="hidden leading-tight sm:block">{s.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-10" noValidate>
      {/* Who */}
      <section className={cardClass}>
        <h2 className="font-display text-xl font-semibold text-navy-900">Before you start</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="sr-name" className={labelClass}>
              Your name
            </label>
            <input
              id="sr-name"
              type="text"
              autoComplete="name"
              value={form.studentName}
              onChange={(e) => setTop('studentName', e.target.value)}
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
              value={form.grade}
              onChange={(e) => setTop('grade', e.target.value)}
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
              value={form.className}
              onChange={(e) => setTop('className', e.target.value)}
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
            <label htmlFor="sr-email" className={labelClass}>
              Email <span className="font-normal text-navy-500">(optional)</span>
            </label>
            <input
              id="sr-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setTop('email', e.target.value)}
              aria-invalid={errors.email ? 'true' : undefined}
              className={inputClass}
            />
            <p className={helpClass}>Yours or a parent&apos;s, in case your coach wants to follow up.</p>
            {errors.email && <p className={errClass}>{errors.email}</p>}
          </div>
        </div>
        <p className="mt-5 text-xs leading-relaxed text-navy-500">
          Your answers are saved in this browser as you type, so a refresh will not lose them. Nothing is
          sent until you press the button at the end.
        </p>
      </section>

      {/* Part A */}
      <section className={cardClass} data-error={errors.ratings ? 'true' : undefined}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-500">Part A · 10 minutes</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-navy-900">Skills self-report</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy-600">
          Rate every statement from 1 to 4. For the nine core skills, also write one or two sentences to
          explain.
        </p>
        <p className="mt-3 border-l-2 border-signal-500 pl-3 text-sm italic text-navy-700">{PART_A_NOTE}</p>
        <ol className="mt-4 space-y-1 text-xs text-navy-600">
          {RATING_SCALE.map((s) => (
            <li key={s.value}>
              <span className="mr-2 font-mono font-semibold text-navy-900">{s.value}</span>
              {s.label}
            </li>
          ))}
        </ol>

        <h3 className="mt-8 border-t border-navy-100 pt-6 font-display text-lg font-semibold text-navy-900">
          Core skills: rate, then explain
        </h3>
        <ol className="mt-5 space-y-8">
          {CORE_SKILLS.map((s, i) => (
            <li key={s.id}>
              <p className="text-sm font-semibold text-navy-900">
                <span className="mr-2 font-mono text-signal-500">A{i + 1}</span>
                <span className="font-bold">{s.name}:</span> {s.text}
              </p>
              {ratingButtons(s.id)}
              <label htmlFor={`sr-explain-${s.id}`} className="mt-3 block text-sm text-navy-700">
                <span className="font-semibold text-navy-900">Explain:</span> {s.explain}
              </label>
              <textarea
                id={`sr-explain-${s.id}`}
                rows={3}
                maxLength={EXPLAIN_MAX_CHARS}
                value={form.explains[s.id] ?? ''}
                onChange={(e) => setIn('explains', s.id, e.target.value)}
                aria-invalid={errors[`explains.${s.id}`] ? 'true' : undefined}
                className={inputClass}
              />
              {errors[`explains.${s.id}`] && <p className={errClass}>{errors[`explains.${s.id}`]}</p>}
            </li>
          ))}
        </ol>

        <h3 className="mt-10 border-t border-navy-100 pt-6 font-display text-lg font-semibold text-navy-900">
          Supporting skills: rate only
        </h3>
        <ol className="mt-5 space-y-6">
          {SUPPORTING_SKILLS.map((s, i) => (
            <li key={s.id}>
              <p className="text-sm font-semibold text-navy-900">
                <span className="mr-2 font-mono text-signal-500">A{CORE_SKILLS.length + i + 1}</span>
                {s.text}
              </p>
              {ratingButtons(s.id)}
            </li>
          ))}
        </ol>
        {errors.ratings && <p className={`${errClass} mt-6`}>{errors.ratings}</p>}
      </section>

      {/* Part B */}
      <section className={cardClass} data-error={errors.quiz ? 'true' : undefined}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-500">Part B · 10 minutes</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-navy-900">Quiz</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy-600">
          Sixteen questions, easy to hard. Pick one answer for each.
        </p>
        <ol className="mt-6 space-y-8">
          {QUIZ_QUESTIONS.map((q, i) => (
            <li key={q.id}>
              <p className="text-sm font-semibold text-navy-900">
                <span className="mr-2 font-mono text-signal-500">{i + 1}</span>
                {q.text}
              </p>
              {q.quote && <p className="mt-2 border-l-2 border-navy-200 pl-3 text-sm italic text-navy-700">&ldquo;{q.quote}&rdquo;</p>}
              <div className="mt-3 grid gap-2" role="radiogroup" aria-label={q.text}>
                {q.options.map((o) => {
                  const on = form.quiz[q.id] === o.key;
                  return (
                    <button
                      key={o.key}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setIn('quiz', q.id, o.key as OptionKey)}
                      className={`${choiceBase} flex gap-3 px-3.5 py-2.5 ${on ? choiceOn : choiceOff}`}
                    >
                      <span className="font-mono font-semibold">{o.key}</span>
                      <span>{o.text}</span>
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
        {errors.quiz && <p className={`${errClass} mt-6`}>{errors.quiz}</p>}
      </section>

      {/* Part C */}
      <section className={cardClass} data-error={errors.motion ? 'true' : undefined}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-500">Part C · 10 minutes</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-navy-900">Motion analysis</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy-600">{PART_C_NOTE}</p>

        <h3 className="mt-6 text-sm font-semibold text-navy-900">Choose one motion</h3>
        <div className="mt-2.5 grid gap-2" role="radiogroup" aria-label="Choose one motion">
          {MOTIONS.map((m, i) => {
            const on = form.motion === m;
            return (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setTop('motion', m)}
                className={`${choiceBase} flex gap-3 px-3.5 py-2.5 ${on ? choiceOn : choiceOff}`}
              >
                <span className="font-mono font-semibold">{i + 1}</span>
                <span>{m}</span>
              </button>
            );
          })}
        </div>
        {errors.motion && <p className={errClass}>{errors.motion}</p>}

        <h3 className="mt-8 text-sm font-semibold text-navy-900">Answer every prompt</h3>
        <ol className="mt-4 space-y-6">
          {MOTION_PROMPTS.map((p) => (
            <li key={p.id}>
              <label htmlFor={`sr-${p.id}`} className="block text-sm text-navy-700">
                <span className="mr-2 font-mono text-signal-500">{p.id.toUpperCase()}</span>
                <span className="font-semibold text-navy-900">{p.name}:</span> {p.text}
              </label>
              <textarea
                id={`sr-${p.id}`}
                rows={3}
                maxLength={MOTION_ANSWER_MAX_CHARS}
                value={form.motionAnswers[p.id] ?? ''}
                onChange={(e) => setIn('motionAnswers', p.id, e.target.value)}
                aria-invalid={errors[`motionAnswers.${p.id}`] ? 'true' : undefined}
                className={inputClass}
              />
              {errors[`motionAnswers.${p.id}`] && <p className={errClass}>{errors[`motionAnswers.${p.id}`]}</p>}
            </li>
          ))}
        </ol>
      </section>

      {/* Reflection */}
      <section className={cardClass}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-500">Optional · 1 minute</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-navy-900">Open reflection</h2>
        <div className="mt-5 space-y-5">
          {REFLECTIONS.map((r) => (
            <div key={r.id}>
              <label htmlFor={`sr-${r.id}`} className={labelClass}>
                {r.label}
              </label>
              <textarea
                id={`sr-${r.id}`}
                rows={2}
                maxLength={REFLECTION_MAX_CHARS}
                value={form.reflections[r.id] ?? ''}
                onChange={(e) => setIn('reflections', r.id, e.target.value)}
                className={inputClass}
              />
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
        <p className="mt-2 text-xs text-navy-500">Check your answers first: you can only send once.</p>
      </div>
    </form>
  );
}
