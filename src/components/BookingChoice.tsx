'use client';

// Dual-path "initial consultation" widget: request a callback (form → /api/callback
// → shared Google Sheet + admin email) or book a Zoom meeting (the existing
// Calendly embed, unchanged). UX/copy ported from the approved dual-path demo.

import { useEffect, useState } from 'react';
import { CalendlyEmbed } from '@/components/CalendlyEmbed';
import { CONSULTATION_CALENDLY_URL, CONTACT_EMAIL, SITE_NAME } from '@/lib/site';
import { trackEvent, getAdClickId } from '@/lib/analytics';

// Brand-styled embed URL: scarlet primary color, cookie banner hidden.
const EMBED_URL = `${CONSULTATION_CALENDLY_URL}?hide_gdpr_banner=1&primary_color=c8102e`;

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const DAY_SETS: Record<string, string[]> = {
  all: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  weekend: ['Sat', 'Sun'],
};

const QUICK_SETS = [
  { id: 'all', label: 'Any day' },
  { id: 'weekdays', label: 'Weekdays' },
  { id: 'weekend', label: 'Weekends' },
] as const;

const WINDOWS = [
  { id: 'Morning', range: '9:00 AM – 12:00 PM' },
  { id: 'Afternoon', range: '12:00 PM – 5:00 PM' },
  { id: 'Evening', range: '5:00 PM – 8:00 PM' },
] as const;

const WINDOW_SHORT: Record<string, string> = {
  Morning: '9 AM–12 PM',
  Afternoon: '12–5 PM',
  Evening: '5–8 PM',
};

const FALLBACK_ZONES = [
  'Asia/Dubai',
  'Asia/Riyadh',
  'Asia/Qatar',
  'Asia/Hong_Kong',
  'Asia/Singapore',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Europe/London',
  'Europe/Paris',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'Australia/Sydney',
];

function sameSet(a: string[], b: string[]): boolean {
  return a.length === b.length && b.every((v) => a.includes(v));
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

function daySummary(sel: string[]): string {
  if (sameSet(sel, DAY_SETS.all)) return 'Any day';
  if (sameSet(sel, DAY_SETS.weekdays)) return 'Weekdays (Mon–Fri)';
  if (sameSet(sel, DAY_SETS.weekend)) return 'Weekends (Sat–Sun)';
  return ALL_DAYS.filter((d) => sel.includes(d)).join(', ');
}

function windowSummary(sel: string[]): string {
  if (sel.length === WINDOWS.length) return 'Any time (9 AM – 8 PM)';
  return WINDOWS.filter((w) => sel.includes(w.id))
    .map((w) => `${w.id} (${WINDOW_SHORT[w.id]})`)
    .join(', ');
}

/* ---------- Inline SVG line icons (no emojis, ported from the demo) ---------- */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} className={className} aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" />
    </svg>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} className={className} aria-hidden="true">
      <rect x="2" y="6" width="13" height="12" rx="2" />
      <path d="m15 10 5.2-3.1a.8.8 0 0 1 1.3.7v8.8a.8.8 0 0 1-1.3.7L15 14" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.2} {...stroke} className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={2.2} {...stroke} className={className} aria-hidden="true">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function SunriseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} className={className} aria-hidden="true">
      <path d="M12 3v3M5.6 6.6l2.1 2.1M3 13h3M18 13h3M16.3 8.7l2.1-2.1M7 17a5 5 0 0 1 10 0" />
      <path d="M3 21h18" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth={1.8} {...stroke} className={className} aria-hidden="true">
      <path d="M21 13.5A8.5 8.5 0 1 1 10.5 3a7 7 0 0 0 10.5 10.5z" />
    </svg>
  );
}

const WINDOW_ICONS: Record<string, ({ className }: { className?: string }) => React.ReactElement> = {
  Morning: SunriseIcon,
  Afternoon: SunIcon,
  Evening: MoonIcon,
};

/* ---------- Shared class strings ---------- */

const inputClass =
  'w-full rounded-sm border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 placeholder:text-navy-400 transition focus:border-signal-500 focus:outline-none focus:ring-2 focus:ring-signal-500/15';
const inputInvalid = 'border-signal-600';
const labelClass = 'block text-sm font-semibold text-navy-900';
const errorClass = 'text-xs font-medium text-signal-600';
const buttonClass =
  'inline-flex items-center gap-2 rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98] disabled:opacity-60 motion-reduce:transition-none';

function SectionRule({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-signal-500 sm:col-span-2 first:pt-0">
      {children}
      <span className="h-px flex-1 bg-navy-100" aria-hidden="true" />
    </div>
  );
}

function BackLink({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-500 transition hover:text-navy-900 motion-reduce:transition-none"
    >
      <ArrowLeftIcon className="h-3.5 w-3.5" />
      Back
    </button>
  );
}

/* ---------- Component ---------- */

type Step = 'choose' | 'callback' | 'zoom' | 'done';

export function BookingChoice() {
  const [step, setStep] = useState<Step>('choose');
  // The Calendly script only initializes embeds present when it loads, so once the
  // Zoom panel has mounted we keep it mounted and toggle visibility instead.
  const [zoomMounted, setZoomMounted] = useState(false);

  // Form fields
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [school, setSchool] = useState('');
  const [experience, setExperience] = useState('');
  const [notes, setNotes] = useState('');
  const [website, setWebsite] = useState(''); // honeypot
  const [days, setDays] = useState<string[]>(DAY_SETS.all.slice());
  const [windows, setWindows] = useState<string[]>([]);

  // Timezone (populated on mount to avoid a server/client mismatch)
  const [zones, setZones] = useState<string[]>([]);
  const [tz, setTz] = useState('');
  const [showTzPicker, setShowTzPicker] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [recap, setRecap] = useState<[string, string][]>([]);

  useEffect(() => {
    let detected = 'America/New_York';
    try {
      detected = Intl.DateTimeFormat().resolvedOptions().timeZone || detected;
    } catch {
      // keep fallback
    }
    let list: string[];
    try {
      list = [...Intl.supportedValuesOf('timeZone')];
    } catch {
      list = [...FALLBACK_ZONES];
    }
    if (!list.includes(detected)) list.unshift(detected);
    // Post-hydration detection is deliberate (same pattern as useViewerTimezone):
    // the server can't know the visitor's zone, so first paint upgrades on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setZones(list);
    setTz(detected);
  }, []);

  const tzOffset = tz ? offsetLabel(tz) : '';
  const tzLabel = tz ? `${tz.replace(/_/g, ' ')}${tzOffset ? ` (${tzOffset})` : ''}` : '';

  function clearError(key: string) {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function applyDaySet(setId: string) {
    setDays(DAY_SETS[setId].slice());
    clearError('days');
  }

  function toggleWindow(id: string) {
    setWindows((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]));
    clearError('windows');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const errs: Record<string, string> = {};
    if (!parentName.trim()) errs.parentName = 'Please add your name.';
    if (phone.replace(/\D/g, '').length < 6) {
      errs.phone = 'Please add a phone number we can reach you on, including the country code.';
    }
    if (!childName.trim()) errs.childName = 'Please add their name.';
    if (!childAge) errs.childAge = 'Please select an age.';
    if (!school.trim()) errs.school = 'Please tell us the school or area.';
    if (days.length === 0) errs.days = 'Please pick at least one day.';
    if (windows.length === 0) errs.windows = 'Please pick at least one window.';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('submitting');
    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          website,
          parentName: parentName.trim(),
          phone: phone.trim(),
          childName: childName.trim(),
          childAge,
          school: school.trim(),
          experience: experience.trim(),
          notes: notes.trim(),
          days: ALL_DAYS.filter((d) => days.includes(d)),
          windows: WINDOWS.filter((w) => windows.includes(w.id)).map((w) => w.id),
          timezone: tz,
          pageUrl: window.location.href,
          gclid: getAdClickId(),
        }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      trackEvent('callback_requested', { brand: SITE_NAME });
      setRecap([
        ['Callback for', `${parentName.trim()} · ${phone.trim()}`],
        ['Child', `${childName.trim()}, age ${childAge}`],
        ['School / area', school.trim()],
        ['Days', daySummary(days)],
        ['Time windows', windowSummary(windows)],
        ['Timezone', tzLabel || tz],
      ]);
      setStatus('idle');
      setStep('done');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div>
      {/* STEP 1: choose a path */}
      {step === 'choose' && (
        <div className="booking-step">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-signal-500">
            Free initial consultation
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900">
            Book your initial consultation
          </h2>
          <p className="mt-3 leading-relaxed text-navy-700">
            A free 30-minute conversation with a member of the admissions team about your
            child&apos;s goals and next steps. Choose whichever suits you.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setStep('callback')}
              className="group flex flex-col gap-2.5 rounded-sm border border-navy-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-signal-500 hover:shadow-[0_18px_40px_-22px_rgba(200,16,46,0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-signal-50 text-signal-500">
                <PhoneIcon className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-semibold text-navy-900">
                Request a callback
              </span>
              <span className="text-sm leading-relaxed text-navy-600">
                Leave your number and a good time to reach you. A member of the admissions team
                will call you back to go over course curriculum, pricing, timing, and any
                questions you have.
              </span>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-1.5 text-sm font-semibold text-signal-500">
                Get a callback
                <ArrowRightIcon className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setZoomMounted(true);
                setStep('zoom');
              }}
              className="group flex flex-col gap-2.5 rounded-sm border border-navy-200 bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-signal-500 hover:shadow-[0_18px_40px_-22px_rgba(200,16,46,0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-signal-50 text-signal-500">
                <VideoIcon className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-semibold text-navy-900">
                Book a Zoom meeting
              </span>
              <span className="text-sm leading-relaxed text-navy-600">
                Prefer to meet over Zoom? Pick an exact slot on the calendar and we&apos;ll send
                the meeting link straight to your inbox — we&apos;ll cover the same ground, face
                to face.
              </span>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-1.5 text-sm font-semibold text-signal-500">
                See available times
                <ArrowRightIcon className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2a: callback form */}
      {step === 'callback' && (
        <div className="booking-step">
          <BackLink onBack={() => setStep('choose')} />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-signal-500">
            Request a callback
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900">
            Tell us who to call
          </h2>
          <p className="mt-3 leading-relaxed text-navy-700">
            Takes about two minutes. A member of the admissions team will call you within your
            chosen window.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-7">
            {/* Honeypot — humans never see this field */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
              aria-hidden="true"
            />

            <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
              <SectionRule>Contact details</SectionRule>

              <div className="space-y-1.5">
                <label htmlFor="cb-parent" className={labelClass}>
                  Your name
                </label>
                <input
                  id="cb-parent"
                  type="text"
                  autoComplete="name"
                  placeholder="Parent or guardian"
                  value={parentName}
                  onChange={(e) => {
                    setParentName(e.target.value);
                    clearError('parentName');
                  }}
                  aria-invalid={Boolean(errors.parentName)}
                  className={`${inputClass} ${errors.parentName ? inputInvalid : ''}`}
                />
                {errors.parentName && <p className={errorClass}>{errors.parentName}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="cb-phone" className={labelClass}>
                  Phone number <span className="font-medium text-navy-500">(with country code)</span>
                </label>
                <input
                  id="cb-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+1 555 123 4567"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearError('phone');
                  }}
                  aria-invalid={Boolean(errors.phone)}
                  className={`${inputClass} ${errors.phone ? inputInvalid : ''}`}
                />
                {errors.phone && <p className={errorClass}>{errors.phone}</p>}
              </div>

              <SectionRule>About your child</SectionRule>

              <div className="space-y-1.5">
                <label htmlFor="cb-child" className={labelClass}>
                  Child&apos;s name
                </label>
                <input
                  id="cb-child"
                  type="text"
                  placeholder="First name is fine"
                  value={childName}
                  onChange={(e) => {
                    setChildName(e.target.value);
                    clearError('childName');
                  }}
                  aria-invalid={Boolean(errors.childName)}
                  className={`${inputClass} ${errors.childName ? inputInvalid : ''}`}
                />
                {errors.childName && <p className={errorClass}>{errors.childName}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="cb-age" className={labelClass}>
                  Child&apos;s age
                </label>
                <select
                  id="cb-age"
                  value={childAge}
                  onChange={(e) => {
                    setChildAge(e.target.value);
                    clearError('childAge');
                  }}
                  aria-invalid={Boolean(errors.childAge)}
                  className={`${inputClass} tabular-nums ${errors.childAge ? inputInvalid : ''}`}
                >
                  <option value="" disabled>
                    Select age
                  </option>
                  {Array.from({ length: 12 }, (_, i) => String(i + 7)).map((age) => (
                    <option key={age} value={age}>
                      {age}
                    </option>
                  ))}
                </select>
                {errors.childAge && <p className={errorClass}>{errors.childAge}</p>}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="cb-school" className={labelClass}>
                  Current school &amp; area
                </label>
                <input
                  id="cb-school"
                  type="text"
                  placeholder="e.g. Dubai College, Dubai"
                  value={school}
                  onChange={(e) => {
                    setSchool(e.target.value);
                    clearError('school');
                  }}
                  aria-invalid={Boolean(errors.school)}
                  className={`${inputClass} ${errors.school ? inputInvalid : ''}`}
                />
                {errors.school && <p className={errorClass}>{errors.school}</p>}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="cb-exp" className={labelClass}>
                  Relevant experience <span className="font-medium text-navy-500">(optional)</span>
                </label>
                <input
                  id="cb-exp"
                  type="text"
                  placeholder="e.g. formats debated, tournaments entered, school team"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="cb-notes" className={labelClass}>
                  Anything we should know before the call?{' '}
                  <span className="font-medium text-navy-500">(optional)</span>
                </label>
                <textarea
                  id="cb-notes"
                  rows={3}
                  placeholder="Goals, questions, preferred language, anything else"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`${inputClass} min-h-[74px] resize-y`}
                />
              </div>

              <SectionRule>When to call</SectionRule>

              <div className="space-y-2 sm:col-span-2">
                <span id="cb-days-label" className={labelClass}>
                  Which days suit you?
                </span>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="cb-days-label">
                  {QUICK_SETS.map((qs) => {
                    const checked = sameSet(days, DAY_SETS[qs.id]);
                    return (
                      <button
                        key={qs.id}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        onClick={() => applyDaySet(qs.id)}
                        className={`cursor-pointer rounded-sm border px-4 py-2 text-sm font-semibold transition motion-reduce:transition-none ${
                          checked
                            ? 'border-signal-500 bg-signal-50 text-navy-900 ring-1 ring-inset ring-signal-500'
                            : 'border-navy-200 bg-white text-navy-500 hover:border-signal-500'
                        }`}
                      >
                        {qs.label}
                      </button>
                    );
                  })}
                </div>
                {errors.days && <p className={errorClass}>{errors.days}</p>}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <span id="cb-windows-label" className={labelClass}>
                  What time of day?{' '}
                  <span className="font-medium text-navy-500">(select all that work)</span>
                </span>
                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-labelledby="cb-windows-label"
                >
                  {WINDOWS.map((win) => {
                    const checked = windows.includes(win.id);
                    const Icon = WINDOW_ICONS[win.id];
                    return (
                      <button
                        key={win.id}
                        type="button"
                        onClick={() => toggleWindow(win.id)}
                        aria-pressed={checked}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-sm border px-4 py-2 text-sm font-semibold transition motion-reduce:transition-none ${
                          checked
                            ? 'border-signal-500 bg-signal-50 text-navy-900 ring-1 ring-inset ring-signal-500'
                            : 'border-navy-200 bg-white text-navy-500 hover:border-signal-500'
                        }`}
                      >
                        <Icon className="h-4 w-4 text-signal-500" />
                        {win.id}
                        <span className="font-mono text-xs font-medium tabular-nums text-navy-500">
                          {WINDOW_SHORT[win.id]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.windows && <p className={errorClass}>{errors.windows}</p>}
              </div>

              <div className="sm:col-span-2">
                {!showTzPicker ? (
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-relaxed text-navy-500">
                    <ClockIcon className="h-3.5 w-3.5 flex-none" />
                    <span>
                      Times are in your timezone —{' '}
                      <strong className="font-semibold text-navy-900">
                        {tz.replace(/_/g, ' ')}
                      </strong>
                      {tzOffset ? ` (${tzOffset})` : ''}.
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowTzPicker(true)}
                      className="font-semibold text-signal-500 underline underline-offset-2 transition hover:text-signal-600 motion-reduce:transition-none"
                    >
                      Change
                    </button>
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    <label htmlFor="cb-tz" className={labelClass}>
                      Your timezone
                    </label>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <select
                        id="cb-tz"
                        value={tz}
                        onChange={(e) => setTz(e.target.value)}
                        className={`${inputClass} w-auto min-w-0 flex-1 basis-[220px]`}
                      >
                        {zones.length === 0 ? (
                          <option value="">Detecting…</option>
                        ) : (
                          zones.map((z) => (
                            <option key={z} value={z}>
                              {z.replace(/_/g, ' ')}
                            </option>
                          ))
                        )}
                      </select>
                      <span className="flex-none font-mono text-sm font-medium tabular-nums text-navy-500">
                        {tzOffset}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {status === 'error' && (
              <p role="alert" className="mt-5 text-sm font-medium text-signal-600">
                Something went wrong sending your request. Please try again, or email us at{' '}
                {CONTACT_EMAIL}.
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button type="submit" disabled={status === 'submitting'} className={buttonClass}>
                {status === 'submitting' ? 'Sending…' : 'Request my callback'}
                <ArrowRightIcon className="h-4 w-4" />
              </button>
              <span className="max-w-[34ch] text-xs leading-relaxed text-navy-500">
                No spam, no obligation. We only call about your enquiry.
              </span>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2b: Zoom / Calendly — stays mounted once visited so the embed survives Back */}
      {zoomMounted && (
        <div className={step === 'zoom' ? 'booking-step' : 'hidden'}>
          <BackLink onBack={() => setStep('choose')} />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-signal-500">
            Book a Zoom meeting
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900">
            Pick a time that suits you
          </h2>
          <p className="mt-3 leading-relaxed text-navy-700">
            A 30-minute initial consultation over Zoom with a member of the admissions team.
            You&apos;ll get the meeting link by email as soon as you book.
          </p>
          <div className="mt-5 overflow-hidden rounded-sm border border-navy-100 bg-white">
            <CalendlyEmbed url={EMBED_URL} />
          </div>
        </div>
      )}

      {/* STEP 3: confirmation */}
      {step === 'done' && (
        <div className="booking-step">
          <div
            className="booking-pop flex h-13 w-13 items-center justify-center rounded-full bg-signal-50 text-signal-500"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" strokeWidth={2.2} {...stroke} className="h-6.5 w-6.5">
              <path className="booking-draw" d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-signal-500">
            Request received
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900">
            We&apos;ll call you soon
          </h2>
          <p className="mt-3 leading-relaxed text-navy-700">
            A member of the admissions team will call you within your chosen window.
          </p>

          <dl className="mt-6 rounded-sm border border-navy-200 bg-white px-5">
            {recap.map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between gap-6 border-b border-navy-100 py-3 text-sm last:border-b-0"
              >
                <dt className="flex-none text-navy-500">{label}</dt>
                <dd className="text-right font-semibold text-navy-900 [overflow-wrap:anywhere]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
