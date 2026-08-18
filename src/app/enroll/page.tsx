'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';
import {
  fetchEnrollmentPrefill,
  submitEnrollment,
  type EnrollmentFields,
  type EnrollmentPrefill,
} from '@/lib/enrollment';

const inputClass =
  'w-full rounded-sm border border-navy-200 bg-cream px-4 py-2.5 text-navy-900 focus:border-signal-500 focus:outline-none';
const labelClass = 'mb-1.5 block text-sm font-semibold text-navy-900';
const linkClass = 'font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600';

const EMPTY_FIELDS: EnrollmentFields = {
  studentName: '',
  age: '',
  grade: '',
  school: '',
  experience: '',
  parentName: '',
  parentEmail: '',
  parentPhone: '',
  notes: '',
  skills: '',
  heardAbout: '',
};

// Ten skills World Schools debate training works on, spanning case
// construction, rebuttal, delivery, and the team dimension of the format.
// Parents pick the five they care about most.
const SKILL_OPTIONS = [
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
const SKILLS_TO_PICK = 5;

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

type Status = 'loading' | 'invalid' | 'error' | 'ready' | 'submitting' | 'done';

function EnrollForm() {
  const token = useSearchParams().get('ref') || '';
  const [status, setStatus] = useState<Status>(token ? 'loading' : 'invalid');
  const [prefill, setPrefill] = useState<EnrollmentPrefill | null>(null);
  const [fields, setFields] = useState<EnrollmentFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<Partial<Record<keyof EnrollmentFields, string>>>({});
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillsError, setSkillsError] = useState('');
  const [heardChoice, setHeardChoice] = useState('');
  const [heardOther, setHeardOther] = useState('');
  const [heardError, setHeardError] = useState('');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    fetchEnrollmentPrefill(token)
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
          notes: p.parentNotes || '',
          skills: p.skills || '',
          heardAbout: p.heardAbout || '',
        });
        setSkills((p.skills || '').split('; ').filter((s) => SKILL_OPTIONS.includes(s)));
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

  const set = (key: keyof EnrollmentFields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const toggleSkill = (skill: string) => {
    setSkillsError('');
    setSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : prev.length < SKILLS_TO_PICK
          ? [...prev, skill]
          : prev
    );
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!fields.studentName.trim()) next.studentName = 'Please enter the student’s name.';
    if (!fields.parentName.trim()) next.parentName = 'Please enter the parent or guardian’s name.';
    const phone = fields.parentPhone.trim();
    if (!phone) {
      next.parentPhone = 'Please enter a phone number with country code.';
    } else if (!/^\+\d[\d\s().-]{6,}$/.test(phone)) {
      next.parentPhone = 'Please include the country code, e.g. +971 50 123 4567.';
    }
    const email = fields.parentEmail.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.parentEmail = 'Please check the email address.';
    }
    setErrors(next);
    let ok = Object.keys(next).length === 0;
    if (skills.length !== SKILLS_TO_PICK) {
      setSkillsError(`Please pick ${SKILLS_TO_PICK}. You have ${skills.length} so far.`);
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
      const res = await submitEnrollment(token, {
        ...fields,
        skills: skills.join('; '),
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
        <p className="mt-4 text-navy-600">Loading your enrollment&hellip;</p>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="mb-4 font-display text-3xl font-semibold tracking-tight text-navy-900 md:text-4xl">
          We couldn&rsquo;t find this enrollment
        </h1>
        <p className="mb-2 text-navy-600">
          The link may be incomplete. Try opening it again from your email or message.
        </p>
        <p className="text-navy-600">
          Need help? Write to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            {CONTACT_EMAIL}
          </a>{' '}
          and we&rsquo;ll sort it out.
        </p>
      </div>
    );
  }

  if (status === 'done') {
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
          Enrollment confirmed
        </h1>
        <p className="mb-2 text-navy-600">
          Thank you. We have everything we need
          {fields.studentName ? (
            <>
              {' '}for <span className="font-semibold text-navy-900">{fields.studentName}</span>
            </>
          ) : null}
          .
        </p>
        <p className="text-navy-600">
          Your coach and class link will follow by email or WhatsApp before the first session. If
          anything changes, just reopen this link to update your details.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-navy-500">
          Enrollment
        </p>
        <h1 className="mb-3 font-display text-4xl font-semibold tracking-tight text-navy-900 md:text-5xl">
          Complete your <span className="text-signal-500">enrollment</span>
        </h1>
        <p className="mx-auto max-w-lg text-navy-600">
          One minute of details so we can place{' '}
          {prefill?.studentName ? (
            <span className="font-semibold text-navy-900">{prefill.studentName}</span>
          ) : (
            'your child'
          )}{' '}
          in the right class.
        </p>
      </div>

      {prefill?.courseName ? (
        <div className="mb-8 rounded-sm border border-navy-200 bg-white p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-navy-500">
            Your course
          </p>
          <p className="font-display text-xl font-semibold text-navy-900 md:text-2xl">
            {prefill.courseName}
          </p>
          {(prefill.timing || prefill.location) && (
            <p className="mt-1.5 text-navy-600">
              {[prefill.timing, prefill.location].filter(Boolean).join(' · ')}
            </p>
          )}
          {typeof prefill.paid === 'boolean' && (
            <p
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium mt-3 ${
                prefill.paid
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-amber-200 bg-amber-50 text-amber-800'
              }`}
            >
              {prefill.paid
                ? 'Payment received'
                : 'Payment pending — the place is held once the invoice is paid'}
            </p>
          )}
          <p className="mt-3 text-sm text-navy-500">
            Set by our team when you signed up. If this looks wrong, reply to your enrollment email
            or write to{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
      ) : null}

      {wasSubmitted && (
        <div className="mb-8 rounded-sm border border-navy-100 bg-navy-50 px-5 py-4 text-sm text-navy-600">
          We already received this form. Feel free to update anything below and submit again.
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="rounded-sm border border-navy-200 bg-white p-6 md:p-8">
        <fieldset disabled={status === 'submitting'} className="space-y-8">
          <div>
            <h2 className="mb-1 font-display text-xl font-semibold text-navy-900">Student</h2>
            <p className="mb-5 text-sm text-navy-500">Who will be attending class.</p>
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
                  Age or birth year
                </label>
                <input
                  id="age"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 12 or 2014"
                  value={fields.age}
                  onChange={set('age')}
                  className={inputClass}
                />
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
                <label htmlFor="experience" className={labelClass}>
                  Past experience
                </label>
                <textarea
                  id="experience"
                  rows={3}
                  placeholder="Tournaments, clubs, or classes so far. None yet is fine too."
                  value={fields.experience}
                  onChange={set('experience')}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-navy-100 pt-8">
            <h2 className="mb-1 font-display text-xl font-semibold text-navy-900">
              What matters most to you
            </h2>
            <p className="mb-5 text-sm text-navy-500">
              Choose the five skills you most want{' '}
              {fields.studentName.trim() ? fields.studentName.trim().split(' ')[0] : 'your child'} to
              get out of these classes. Your coach sees this before the first session.
            </p>
            <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Skills">
              {SKILL_OPTIONS.map((skill) => {
                const checked = skills.includes(skill);
                const atLimit = !checked && skills.length >= SKILLS_TO_PICK;
                return (
                  <label
                    key={skill}
                    className={`flex items-start gap-3 rounded-sm border px-4 py-3 transition-colors ${
                      checked
                        ? 'border-signal-500/50 bg-signal-500/5'
                        : atLimit
                          ? 'border-navy-200 opacity-50'
                          : 'cursor-pointer border-navy-200 hover:border-signal-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={atLimit}
                      onChange={() => toggleSkill(skill)}
                      className="mt-0.5 h-4 w-4 flex-none accent-signal-500"
                    />
                    <span className="text-sm leading-snug text-navy-900">{skill}</span>
                  </label>
                );
              })}
            </div>
            <p aria-live="polite" className={`mt-3 text-sm ${skillsError ? 'text-signal-600' : 'text-navy-500'}`}>
              {skillsError || `${skills.length} of ${SKILLS_TO_PICK} picked`}
            </p>
          </div>

          <div className="border-t border-navy-100 pt-8">
            <h2 className="mb-1 font-display text-xl font-semibold text-navy-900">
              Parent or guardian
            </h2>
            <p className="mb-5 text-sm text-navy-500">
              How we reach you with schedules and class links.
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
                  placeholder="+971 50 123 4567"
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
                  Anything we should know?
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Goals, schedule limits, anything else useful."
                  value={fields.notes}
                  onChange={set('notes')}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <p className={labelClass}>
                  Where did you find out about us? <span aria-hidden>*</span>
                </p>
                <div className="grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Where did you find out about us?">
                  {HEARD_OPTIONS.map((opt) => {
                    const checked = heardChoice === opt;
                    return (
                      <label
                        key={opt}
                        className={`flex items-start gap-3 border rounded-sm px-4 py-3 transition-colors ${
                          checked ? 'border-signal-500/50 bg-signal-500/5' : 'cursor-pointer border-navy-200 hover:border-signal-400'
                        }`}
                      >
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
            {status === 'submitting' ? 'Sending…' : 'Confirm enrollment'}
          </button>
        </fieldset>
      </form>

      <p className="mt-6 text-center text-sm text-navy-500">
        Your details go only to the {SITE_NAME} teaching team and are never shared.
      </p>
    </>
  );
}

export default function EnrollPage() {
  return (
    <section className="min-h-[70vh] bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={null}>
          <EnrollForm />
        </Suspense>
      </div>
    </section>
  );
}
