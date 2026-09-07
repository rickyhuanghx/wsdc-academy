'use client';

// Tournament date range rendered in the viewer's timezone. SSR-safe the same
// way ScheduleTimezones is: the first render uses the organiser's zone (so the
// static HTML carries real times and hydration matches), then the viewer's
// zone is detected on mount and swapped in. The organiser line stays as the
// authoritative reference underneath.

import { useEffect, useState } from 'react';
import { ZONES, detectZone, friendlyZoneName, zoneAbbrAt } from '@/lib/schedule';
import { TimezoneSelect } from './TimezoneSelect';

function safeDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function fmt(d: Date, zone: string, opts: Intl.DateTimeFormatOptions): string {
  try {
    return new Intl.DateTimeFormat('en-US', { timeZone: zone, ...opts }).format(d);
  } catch {
    return new Intl.DateTimeFormat('en-US', opts).format(d);
  }
}

function sameDay(a: Date, b: Date, zone: string): boolean {
  return (
    fmt(a, zone, { year: 'numeric', month: '2-digit', day: '2-digit' }) ===
    fmt(b, zone, { year: 'numeric', month: '2-digit', day: '2-digit' })
  );
}

const DATE_LONG: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
const DATE_SHORT: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
const TIME: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

/**
 * "Sat, Oct 10, 2026, 9:00 AM – 5:00 PM EDT" for a same-day event, or
 * "Sat, Oct 10, 9:00 AM – Sun, Oct 11, 2026, 4:00 PM EDT" across days.
 */
export function formatRange(startsAt: string, endsAt: string, zone: string): string {
  const s = safeDate(startsAt);
  if (!s) return '';
  const e = safeDate(endsAt) ?? s;
  const abbr = zoneAbbrAt(s, zone);
  if (sameDay(s, e, zone)) {
    const day = fmt(s, zone, DATE_LONG);
    const t1 = fmt(s, zone, TIME);
    const t2 = fmt(e, zone, TIME);
    return t1 === t2 ? `${day}, ${t1} ${abbr}` : `${day}, ${t1} – ${t2} ${abbr}`;
  }
  return `${fmt(s, zone, { weekday: 'short', ...DATE_SHORT })}, ${fmt(s, zone, TIME)} – ${fmt(e, zone, DATE_LONG)}, ${fmt(e, zone, TIME)} ${abbr}`;
}

/** Date-only range for cards: "Oct 10, 2026" or "Oct 10 – 11, 2026". */
export function formatDateRange(startsAt: string, endsAt: string, zone: string): string {
  const s = safeDate(startsAt);
  if (!s) return '';
  const e = safeDate(endsAt) ?? s;
  if (sameDay(s, e, zone)) return fmt(s, zone, { month: 'short', day: 'numeric', year: 'numeric' });
  const sameMonth =
    fmt(s, zone, { year: 'numeric', month: '2-digit' }) === fmt(e, zone, { year: 'numeric', month: '2-digit' });
  if (sameMonth) {
    return `${fmt(s, zone, DATE_SHORT)} – ${fmt(e, zone, { day: 'numeric' })}, ${fmt(e, zone, { year: 'numeric' })}`;
  }
  return `${fmt(s, zone, DATE_SHORT)} – ${fmt(e, zone, { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

// Organiser zone first; viewer's zone after mount. The organiser zone is always
// selectable so the viewer can flip back to "tournament time".
function useTournamentZone(organiserZone: string) {
  const [zone, setZone] = useState(organiserZone);
  const [options, setOptions] = useState(() => withZone(ZONES, organiserZone, `${friendlyZoneName(organiserZone)} (tournament time)`));

  useEffect(() => {
    const detected = detectZone();
    if (!detected || detected === organiserZone) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOptions((prev) => withZone(prev, detected, `${friendlyZoneName(detected)} (your timezone)`));
    setZone(detected);
  }, [organiserZone]);

  return { zone, setZone, options };
}

function withZone(list: { id: string; label: string }[], id: string, label: string) {
  if (!id || list.some((z) => z.id === id)) return list;
  return [{ id, label }, ...list];
}

export function TournamentDates({
  startsAt,
  endsAt,
  registrationClosesAt,
  timezone,
  compact = false,
  selectId = 'tournament-tz',
}: {
  startsAt: string;
  endsAt: string;
  registrationClosesAt: string | null;
  timezone: string;
  /** Card mode: date range only, no selector, no organiser line. */
  compact?: boolean;
  selectId?: string;
}) {
  const { zone, setZone, options } = useTournamentZone(timezone);

  if (compact) {
    return (
      <span className="font-mono text-sm text-navy-700">{formatDateRange(startsAt, endsAt, zone)}</span>
    );
  }

  const closes = safeDate(registrationClosesAt);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">Dates</p>
        <p className="mt-1 font-mono text-sm text-navy-900">{formatRange(startsAt, endsAt, zone)}</p>
        {zone !== timezone && (
          <p className="mt-1 text-xs text-navy-500">
            Organiser time: {formatRange(startsAt, endsAt, timezone)} ({timezone})
          </p>
        )}
      </div>
      {closes && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">Registration closes</p>
          <p className="mt-1 font-mono text-sm text-navy-900">
            {fmt(closes, zone, DATE_LONG)}, {fmt(closes, zone, TIME)} {zoneAbbrAt(closes, zone)}
          </p>
          <Countdown closesAt={registrationClosesAt} />
        </div>
      )}
      <TimezoneSelect zone={zone} options={options} onChange={setZone} id={selectId} />
    </div>
  );
}

/**
 * "Registration closes in 6 days" / "Registration closes today" /
 * "Registration closed". Computed after mount so the server HTML (which has no
 * reliable "now") never disagrees with the client.
 */
export function Countdown({ closesAt, className = '' }: { closesAt: string | null; className?: string }) {
  const [text, setText] = useState('');

  useEffect(() => {
    const d = safeDate(closesAt);
    if (!d) return;
    const update = () => {
      const ms = d.getTime() - Date.now();
      if (ms <= 0) {
        setText('Registration closed');
        return;
      }
      const days = Math.floor(ms / 86_400_000);
      const hours = Math.floor(ms / 3_600_000);
      if (days >= 2) setText(`Registration closes in ${days} days`);
      else if (days === 1) setText('Registration closes tomorrow');
      else if (hours >= 1) setText(`Registration closes in ${hours} ${hours === 1 ? 'hour' : 'hours'}`);
      else setText('Registration closes within the hour');
    };
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [closesAt]);

  if (!text) return null;
  return <p className={`text-xs font-semibold text-signal-600 ${className}`}>{text}</p>;
}

/** Schedule content block: each row in the viewer's zone, with its own selector. */
export function TournamentScheduleRows({
  rows,
  timezone,
  selectId = 'tournament-schedule-tz',
}: {
  rows: { label: string; starts_at: string; ends_at?: string }[];
  timezone: string;
  selectId?: string;
}) {
  const { zone, setZone, options } = useTournamentZone(timezone);
  return (
    <div>
      <TimezoneSelect zone={zone} options={options} onChange={setZone} id={selectId} />
      <ul className="mt-4 divide-y divide-navy-100 rounded-xl border border-navy-100 bg-white">
        {rows.map((row, i) => {
          const s = safeDate(row.starts_at);
          const e = safeDate(row.ends_at) ?? s;
          let when = '';
          if (s && e) {
            when = sameDay(s, e, zone)
              ? `${fmt(s, zone, DATE_LONG)}, ${fmt(s, zone, TIME)}${e.getTime() !== s.getTime() ? ` – ${fmt(e, zone, TIME)}` : ''} ${zoneAbbrAt(s, zone)}`
              : formatRange(row.starts_at, row.ends_at ?? row.starts_at, zone);
          }
          return (
            <li key={`${row.label}-${i}`} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <span className="font-semibold text-navy-900">{row.label}</span>
              <span className="font-mono text-sm text-navy-700">{when}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
