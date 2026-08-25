'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';
import { fetchTrialPrefill, submitTrial, type TrialFields, type TrialPrefill } from '@/lib/trial';

// Token-only trial form. Staff mint the link in ClassDesk (Trial Desk sheet
// row id = token); without a valid one this page shows "not found" and
// nothing else. No public trial request exists by design (/trial 301s to
// /consultation).

const inputClass =
  'w-full rounded-sm border border-navy-200 bg-cream px-4 py-2.5 text-navy-900 focus:border-signal-500 focus:outline-none';
const labelClass = 'mb-1.5 block text-sm font-semibold text-navy-900';
const linkClass = 'font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600';
const chipBase = 'flex items-start gap-3 rounded-sm border px-4 py-3 transition-colors';
const chipOn = 'border-signal-500/50 bg-signal-500/5';
const chipOff = 'cursor-pointer border-navy-200 hover:border-signal-400';

const EMPTY_FIELDS: TrialFields = {
  studentName: '',
  age: '',
  grade: '',
  school: '',
  experience: '',
  parentName: '',
  parentEmail: '',
  parentPhone: '',
  goals: '',
  preferredDays: '',
  preferredWindows: '',
  heardAbout: '',
  notes: '',
};

// Same ten skills as the enrollment form (kept identical so trial and
// enrollment data line up); the trial asks for three, not five.
const GOAL_OPTIONS = [
  'Building clear, structured arguments',
  'Rebuttal: answering the other side directly',
  'Confident delivery and stage presence',
  'Thinking on their feet in impromptu rounds',
  'Research and judging evidence',
  'Spotting weak logic and hidden assumptions',
  'Careful listening and note-taking in rounds',
  'Working as a three-speaker team',
  'Following world news and current affairs',
  'Writing cases before tournaments',
];
const GOALS_TO_PICK = 3;

const EXPERIENCE_OPTIONS = [
  { value: 'None yet', help: 'First time trying anything like this' },
  { value: 'Some', help: 'A club, a class, or a school round or two' },
  { value: 'Competitive', help: 'Has competed at a regional or national tournament' },
];

const DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WINDOW_OPTIONS = ['Morning (9–12)', 'Afternoon (12–5)', 'Evening (5–8)'];

// "Where did you find out about us?" — one pick; "Other" asks for a note.
// Stored in the sheet as the option text, or "Other: <what they typed>".
const HEARD_OPTIONS = [
  'Referral from a friend or family',
  'Online search (Google etc.)',
  'School recommendation',
  'Instagram',
  'Advertisement',
  'AI recommendation (ChatGPT etc.)',
  'Other',
];
const HEARD_OTHER = 'Other';
function parseHeard(value: string): { choice: string; other: string } {
  const v = (value || '').trim();
  if (!v) return { choice: '', other: '' };
  if (HEARD_OPTIONS.includes(v) && v !== HEARD_OTHER) return { choice: v, other: '' };
  return { choice: HEARD_OTHER, other: v.replace(/^Other:\s*/i, '') };
}

const splitList = (s: string, allowed: string[]) =>
  (s || '').split('; ').map((x) => x.trim()).filter((x) => allowed.includes(x));

type Status = 'loading' | 'invalid' | 'error' | 'ready' | 'submitting' | 'done';

function TrialForm() {
  const token = useSearchParams().get('ref') || '';
  const [status, setStatus] = useState<Status>(token ? 'loading' : 'invalid');
  const [prefill, setPrefill] = useState<TrialPrefill | null>(null);
  const [fields, setFields] = useState<TrialFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<Partial<Record<keyof TrialFields, string>>>({});
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [goals, setGoals] = useState<string[]>([]);
  const [goalsError, setGoalsError] = useState('');
  const [days, setDays] = useState<string[]>([]);
  const [windows, setWindows] = useState<string[]>([]);
  const [heardChoice, setHeardChoice] = useState('');
  const [heardOther, setHeardOther] = useState('');
  const [heardError, setHeardError] = useState('');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetchTrialPrefill(token)
      .then((p) => {
        if (cancelled) return;
        if (!p.found) {
          setStatus('invalid');
          return;
        }
        setPrefill(p);
        setWasSubmitted(Boolean(p.submitted));
        setFields({
          studentName: p.studentName || '',
          age: p.age || '',
          grade: p.grade || '',
          school: p.school || '',
          experience: p.experience || '',
          parentName: p.parentName || '',
          parentEmail: p.parentEmail || '',
          parentPhone: p.parentPhone || '',
          goals: p.goals || '',
          preferredDays: p.preferredDays || '',
          preferredWindows: p.preferredWindows || '',
          heardAbout: p.heardAbout || '',
          notes: p.notes || '',
        });
        setGoals(splitList(p.goals || '', GOAL_OPTIONS));
        setDays(splitList(p.preferredDays || '', DAY_OPTIONS));
        setWindows(splitList(p.preferredWindows || '', WINDOW_OPTIONS));
        const heard = parseHeard(p.heardAbout || '');
        setHeardChoice(heard.choice);
        setHeardOther(heard.other);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const set = (key: keyof TrialFields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const toggleIn = (list: string[], setList: (v: string[]) => void, value: string, max?: number) => {
    if (list.includes(value)) setList(list.filter((x) => x !== value));
    else if (!max || list.length < max) setList([...list, value]);
  };

  const timeFixed = Boolean(prefill?.trialTime);

  const validate = (): boolean => {
    const next: Partial<Record<keyof TrialFields, string>> = {};
    if (!fields.studentName.trim()) next.studentName = 'Please enter the student’s name.';
    if (!fields.age.trim()) next.age = 'Please enter an age or birth year.';
    if (!fields.parentName.trim()) next.parentName = 'Please enter the parent or guardian’s name.';
    const phone = fields.parentPhone.trim();
    if (!phone) next.parentPhone = 'Please enter a phone number with country code.';
    else if (!/^\+\d[\d\s().-]{6,}$/.test(phone)) next.parentPhone = 'Please include the country code, e.g. +1 347 817 8056.';
    const email = fields.parentEmail.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.parentEmail = 'Please check the email address.';
    setErrors(next);
    let ok = Object.keys(next).length === 0;
    if (goals.length !== GOALS_TO_PICK) {
      setGoalsError(`Please pick ${GOALS_TO_PICK}. You have ${goals.length} so far.`);
      ok = false;
    }
    if (!heardChoice) {
      setHeardError('Please tell us where you found out about us.');
      ok = false;
    } else if (heardChoice === HEARD_OTHER && !heardOther.trim()) {
      setHeardError('Please tell us where — a few words is enough.');
      ok = false;
    }
    return ok;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      const res = await submitTrial(token, {
        ...fields,
        goals: goals.join('; '),
        preferredDays: timeFixed ? '' : days.join('; '),
        preferredWindows: timeFixed ? '' : windows.join('; '),
        heardAbout: heardChoice === HEARD_OTHER ? `Other: ${heardOther.trim()}` : heardChoice,
      });
      if (res.ok) {
        setStatus('done');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="py-24 text-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-signal-500"
          aria-hidden
        />
        <p className="mt-4 text-navy-600">Loading your trial&hellip;</p>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="mb-4 font-display text-3xl font-semibold tracking-tight text-navy-900 md:text-4xl">
          We couldn&rsquo;t find this trial
        </h1>
        <p className="mb-2 text-navy-600">
          This page only opens from the link our team sent you. Try opening it again from your message.
        </p>
        <p className="text-navy-600">
          Would like to arrange a trial? Write to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            {CONTACT_EMAIL}
          </a>{' '}
          and we&rsquo;ll set one up.
        </p>
      </div>
    );
  }

  if (status === 'done') {
    const first = fields.studentName.trim().split(' ')[0];
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-sm border border-navy-200 bg-white">
          <svg
            className="h-7 w-7 text-signal-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mb-4 font-display text-3xl font-semibold tracking-tight text-navy-900 md:text-4xl">
          All set for the trial
        </h1>
        <p className="mb-2 text-navy-600">
          Thank you. Your coach will read this before meeting{' '}
          {first ? <span className="font-semibold text-navy-900">{first}</span> : 'your child'}.
        </p>
        <p className="text-navy-600">
          {timeFixed
            ? 'We will send the class link and anything to prepare closer to the day.'
            : 'We will confirm the day and time with you on WhatsApp, then send the class link.'}{' '}
          If anything changes, reopen this link to update your details.
        </p>
      </div>
    );
  }

  const firstName = fields.studentName.trim() ? fields.studentName.trim().split(' ')[0] : 'your child';

  return (
    <>
      <div className="mb-10 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-navy-500">
          Free trial class
        </p>
        <h1 className="mb-3 font-display text-4xl font-semibold tracking-tight text-navy-900 md:text-5xl">
          Before the <span className="text-signal-500">trial</span>
        </h1>
        <p className="mx-auto max-w-lg text-navy-600">
          Two minutes of details so the coach can make the most of{' '}
          {prefill?.studentName ? (
            <span className="font-semibold text-navy-900">{prefill.studentName}</span>
          ) : (
            'your child'
          )}
          &rsquo;s first session.
        </p>
      </div>

      <div className="mb-8 rounded-sm border border-navy-200 bg-white p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-navy-500">
          Your trial
        </p>
        <p className="font-display text-xl font-semibold text-navy-900 md:text-2xl">
          {prefill?.courseName || 'Trial class'}
        </p>
        <p className="mt-1.5 text-navy-600">
          {timeFixed
            ? `${prefill?.trialTime}${prefill?.timezone ? ` ${prefill.timezone}` : ''}`
            : 'Day and time to be confirmed — tell us what suits you below.'}
        </p>
        <p className="mt-3 text-sm text-navy-500">
          Set by our team. If this looks wrong, reply on WhatsApp or write to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>

      {wasSubmitted && (
        <div className="mb-8 rounded-sm border border-navy-100 bg-navy-50 px-5 py-4 text-sm text-navy-600">
          We already received this form. Feel free to update anything below and submit again.
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="rounded-sm border border-navy-200 bg-white p-6 md:p-8">
        <fieldset disabled={status === 'submitting'} className="space-y-8">
          <div>
            <h2 className="mb-1 font-display text-xl font-semibold text-navy-900">Student</h2>
            <p className="mb-5 text-sm text-navy-500">Who will be attending the trial.</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="studentName" className={labelClass}>
                  Student&rsquo;s full name <span className="text-signal-500">*</span>
                </label>
                <input
                  id="studentName"
                  type="text"
                  autoComplete="name"
                  value={fields.studentName}
                  onChange={set('studentName')}
                  aria-invalid={Boolean(errors.studentName)}
                  className={inputClass}
                />
                {errors.studentName && (
                  <p className="mt-1.5 text-sm text-signal-600">{errors.studentName}</p>
                )}
              </div>
              <div>
                <label htmlFor="age" className={labelClass}>
                  Age or birth year <span className="text-signal-500">*</span>
                </label>
                <input
                  id="age"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 12 or 2014"
                  value={fields.age}
                  onChange={set('age')}
                  aria-invalid={Boolean(errors.age)}
                  className={inputClass}
                />
                {errors.age && <p className="mt-1.5 text-sm text-signal-600">{errors.age}</p>}
              </div>
              <div>
                <label htmlFor="grade" className={labelClass}>
                  Grade / year
                </label>
                <input
                  id="grade"
                  type="text"
                  placeholder="e.g. Grade 7"
                  value={fields.grade}
                  onChange={set('grade')}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="school" className={labelClass}>
                  School
                </label>
                <input
                  id="school"
                  type="text"
                  autoComplete="organization"
                  value={fields.school}
                  onChange={set('school')}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <p className={labelClass}>Experience so far</p>
                <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Experience so far">
                  {EXPERIENCE_OPTIONS.map((opt) => {
                    const checked = fields.experience === opt.value;
                    return (
                      <label key={opt.value} className={`${chipBase} ${checked ? chipOn : chipOff}`}>
                        <input
                          type="radio"
                          name="experience"
                          value={opt.value}
                          checked={checked}
                          onChange={() => setFields((f) => ({ ...f, experience: opt.value }))}
                          className="mt-0.5 h-4 w-4 flex-none accent-signal-500"
                        />
                        <span className="text-sm leading-snug">
                          <span className="block font-semibold text-navy-900">{opt.value}</span>
                          <span className="mt-0.5 block text-xs text-navy-500">{opt.help}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-navy-100 pt-8">
            <h2 className="mb-1 font-display text-xl font-semibold text-navy-900">
              What matters most to you
            </h2>
            <p className="mb-5 text-sm text-navy-500">
              Choose the three things you most want {firstName} to get out of this. The coach shapes
              the trial around them.
            </p>
            <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Goals">
              {GOAL_OPTIONS.map((goal) => {
                const checked = goals.includes(goal);
                const atLimit = !checked && goals.length >= GOALS_TO_PICK;
                return (
                  <label
                    key={goal}
                    className={`${chipBase} ${
                      checked ? chipOn : atLimit ? 'border-navy-200 opacity-50' : chipOff
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={atLimit}
                      onChange={() => {
                        setGoalsError('');
                        toggleIn(goals, setGoals, goal, GOALS_TO_PICK);
                      }}
                      className="mt-0.5 h-4 w-4 flex-none accent-signal-500"
                    />
                    <span className="text-sm leading-snug text-navy-900">{goal}</span>
                  </label>
                );
              })}
            </div>
            <p aria-live="polite" className={`mt-3 text-sm ${goalsError ? 'text-signal-600' : 'text-navy-500'}`}>
              {goalsError || `${goals.length} of ${GOALS_TO_PICK} picked`}
            </p>
          </div>

          {!timeFixed && (
            <div className="border-t border-navy-100 pt-8">
              <h2 className="mb-1 font-display text-xl font-semibold text-navy-900">When suits you</h2>
              <p className="mb-5 text-sm text-navy-500">
                Pick any days and times that work; we will confirm one on WhatsApp. Times are in your
                local time.
              </p>
              <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Preferred days">
                {DAY_OPTIONS.map((d) => {
                  const on = days.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleIn(days, setDays, d)}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                        on
                          ? 'border-signal-500 bg-signal-500 text-white'
                          : 'border-navy-200 text-navy-900 hover:border-signal-400'
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
              <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Preferred times">
                {WINDOW_OPTIONS.map((w) => {
                  const on = windows.includes(w);
                  return (
                    <label key={w} className={`${chipBase} ${on ? chipOn : chipOff}`}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggleIn(windows, setWindows, w)}
                        className="mt-0.5 h-4 w-4 flex-none accent-signal-500"
                      />
                      <span className="text-sm leading-snug text-navy-900">{w}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border-t border-navy-100 pt-8">
            <h2 className="mb-1 font-display text-xl font-semibold text-navy-900">
              Parent or guardian
            </h2>
            <p className="mb-5 text-sm text-navy-500">
              How we reach you with the time and the class link.
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="parentName" className={labelClass}>
                  Full name <span className="text-signal-500">*</span>
                </label>
                <input
                  id="parentName"
                  type="text"
                  value={fields.parentName}
                  onChange={set('parentName')}
                  aria-invalid={Boolean(errors.parentName)}
                  className={inputClass}
                />
                {errors.parentName && (
                  <p className="mt-1.5 text-sm text-signal-600">{errors.parentName}</p>
                )}
              </div>
              <div>
                <label htmlFor="parentPhone" className={labelClass}>
                  Phone (WhatsApp preferred) <span className="text-signal-500">*</span>
                </label>
                <input
                  id="parentPhone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 347 817 8056"
                  value={fields.parentPhone}
                  onChange={set('parentPhone')}
                  aria-invalid={Boolean(errors.parentPhone)}
                  className={inputClass}
                />
                {errors.parentPhone ? (
                  <p className="mt-1.5 text-sm text-signal-600">{errors.parentPhone}</p>
                ) : (
                  <p className="mt-1.5 text-sm text-navy-500">Include the country code.</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="parentEmail" className={labelClass}>
                  Email
                </label>
                <input
                  id="parentEmail"
                  type="email"
                  autoComplete="email"
                  value={fields.parentEmail}
                  onChange={set('parentEmail')}
                  aria-invalid={Boolean(errors.parentEmail)}
                  className={inputClass}
                />
                {errors.parentEmail && (
                  <p className="mt-1.5 text-sm text-signal-600">{errors.parentEmail}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="notes" className={labelClass}>
                  Anything the coach should know?
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Interests, nerves, anything else useful."
                  value={fields.notes}
                  onChange={set('notes')}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <p className={labelClass}>
                  Where did you find out about us? <span aria-hidden>*</span>
                </p>
                <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Where did you find out about us?">
                  {HEARD_OPTIONS.map((opt) => {
                    const checked = heardChoice === opt;
                    return (
                      <label key={opt} className={`${chipBase} ${checked ? chipOn : chipOff}`}>
                        <input
                          type="radio"
                          name="heardAbout"
                          value={opt}
                          checked={checked}
                          onChange={() => {
                            setHeardChoice(opt);
                            setHeardError('');
                          }}
                          className="mt-0.5 h-4 w-4 flex-none accent-signal-500"
                        />
                        <span className="text-sm leading-snug text-navy-900">{opt}</span>
                      </label>
                    );
                  })}
                </div>
                {heardChoice === HEARD_OTHER && (
                  <input
                    type="text"
                    aria-label="Please specify where you found out about us"
                    placeholder="Please specify"
                    value={heardOther}
                    onChange={(e) => {
                      setHeardOther(e.target.value);
                      setHeardError('');
                    }}
                    className={`${inputClass} mt-3`}
                  />
                )}
                {heardError && <p className="mt-1.5 text-sm text-signal-600">{heardError}</p>}
              </div>
            </div>
          </div>

          {status === 'error' && (
            <div className="rounded-sm border border-signal-200 bg-signal-50 px-5 py-4 text-sm text-signal-600">
              Something went wrong sending your details. Please try again, or email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>
              .
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98] disabled:opacity-60"
          >
            {status === 'submitting' ? 'Sending…' : 'Send to the coach'}
          </button>
        </fieldset>
      </form>

      <p className="mt-6 text-center text-sm text-navy-500">
        Your details go only to the {SITE_NAME} teaching team and are never shared.
      </p>
    </>
  );
}

export default function TrialFormPage() {
  return (
    <section className="min-h-[70vh] bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <TrialForm />
        </Suspense>
      </div>
    </section>
  );
}
