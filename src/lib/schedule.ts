// Pure timezone helpers for class schedules (no React, no date library).
//
// Each class slot is stored anchored to US Eastern wall-clock — `start`/`end` are
// "HH:MM" (24h) ET and `dayOfWeek` is 0=Sun..6=Sat (see src/data/programs.ts). These
// helpers convert that anchor to any IANA timezone with the Intl API, so a single ET
// source of truth drives every viewer's local time (and day-rollover) correctly.

export const ANCHOR_ZONE = 'America/New_York'; // the zone the ET times are written in

export const ZONES: { id: string; label: string }[] = [
  { id: 'America/Los_Angeles', label: 'US Pacific' },
  { id: 'America/Denver', label: 'US Mountain' },
  { id: 'America/Chicago', label: 'US Central' },
  { id: 'America/New_York', label: 'US Eastern' },
  { id: 'Europe/London', label: 'UK / London' },
  { id: 'Asia/Dubai', label: 'Gulf / Dubai' },
  { id: 'Asia/Shanghai', label: 'China' },
];

export interface ScheduleSlot {
  day: string; // human label / no-JS fallback, e.g. "Saturdays"
  dayOfWeek: number; // 0=Sun..6=Sat
  start: string; // "HH:MM" ET
  end: string; // "HH:MM" ET
}

// Offset (ms) of `timeZone` from UTC at the given instant.
function tzOffsetMs(timeZone: string, utcMs: number): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(utcMs));
  const f: Record<string, string> = {};
  for (const p of parts) if (p.type !== 'literal') f[p.type] = p.value;
  let hour = Number(f.hour);
  if (hour === 24) hour = 0; // some engines emit 24 for midnight
  const asIfUtc = Date.UTC(Number(f.year), Number(f.month) - 1, Number(f.day), hour, Number(f.minute), Number(f.second));
  return asIfUtc - utcMs;
}

// A concrete date in the first term week (Fri Sep 4 2026) matching the weekday, so DST
// offsets are evaluated in-season. Fixed base string keeps this deterministic.
function anchorDateFor(dayOfWeek: number): string {
  const base = Date.UTC(2026, 8, 4); // Fri, Sep 4 2026
  const offsetDays = ((dayOfWeek - 5) + 7) % 7; // Friday is weekday 5
  const d = new Date(base + offsetDays * 86_400_000);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

// Convert a wall-clock time in ANCHOR_ZONE on the given date to a UTC instant (ms).
function anchorToUtc(dateISO: string, hour: number, minute: number): number {
  const [y, m, d] = dateISO.split('-').map(Number);
  const guess = Date.UTC(y, m - 1, d, hour, minute);
  return guess - tzOffsetMs(ANCHOR_ZONE, guess);
}

// The slot's start instant (UTC ms) — used to order slots chronologically across a week.
export function slotStartUtc(slot: ScheduleSlot): number {
  const [sh, sm] = slot.start.split(':').map(Number);
  return anchorToUtc(anchorDateFor(slot.dayOfWeek), sh, sm);
}

// Render a slot in the given timezone: local weekday (pluralized), time range, and abbr.
export function formatSlot(slot: ScheduleSlot, zone: string): { day: string; time: string; abbr: string } {
  try {
    const date = anchorDateFor(slot.dayOfWeek);
    const [sh, sm] = slot.start.split(':').map(Number);
    const [eh, em] = slot.end.split(':').map(Number);
    const startUtc = anchorToUtc(date, sh, sm);
    const endUtc = anchorToUtc(date, eh, em);

    const weekday = new Intl.DateTimeFormat('en-US', { timeZone: zone, weekday: 'long' }).format(new Date(startUtc));
    const t = (ms: number) =>
      new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(ms));
    const abbr =
      new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'short' })
        .formatToParts(new Date(startUtc))
        .find((p) => p.type === 'timeZoneName')?.value ?? '';

    return { day: `${weekday}s`, time: `${t(startUtc)} – ${t(endUtc)}`, abbr };
  } catch {
    // ICU/zone failure: fall back to the authored day + raw ET times.
    return { day: slot.day, time: `${slot.start}–${slot.end}`, abbr: 'ET' };
  }
}

export function friendlyZoneName(tz: string): string {
  return tz.split('/').pop()?.replace(/_/g, ' ') ?? tz;
}

// The viewer's IANA timezone, or '' if unavailable.
export function detectZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  } catch {
    return '';
  }
}
