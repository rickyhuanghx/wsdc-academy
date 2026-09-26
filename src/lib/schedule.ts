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
  { id: 'Europe/Berlin', label: 'Central Europe (Berlin, Paris, Zurich)' },
  { id: 'Europe/Athens', label: 'Eastern Europe (Athens, Helsinki)' },
  { id: 'Asia/Dubai', label: 'Gulf / Dubai' },
  { id: 'Asia/Shanghai', label: 'China' },
];

export interface ScheduleSlot {
  day: string; // human label / no-JS fallback, e.g. "Saturdays"
  dayOfWeek: number; // 0=Sun..6=Sat
  start: string; // "HH:MM" ET
  end: string; // "HH:MM" ET
  /**
   * Optional ISO date (must fall on `dayOfWeek`) to evaluate the conversion on.
   * Weekly term classes omit it and convert on their next occurrence. Fixed-date
   * intensives (the December Winter Academy) set it, so the conversion uses the
   * offsets in force on the class dates (EST, not today's EDT).
   */
  date?: string;
}

// Intl's en-US short zone name renders many non-US zones as "GMT+8", which reads
// like a placeholder next to "EDT". Formatting with the zone's home English locale
// yields the familiar abbreviation (BST, SGT, AEST) and stays DST-correct.
const ABBR_LOCALE: Record<string, string> = {
  'Europe/London': 'en-GB',
  'Europe/Dublin': 'en-IE',
  // en-GB renders the Central and Eastern European zones as CET/CEST and EET/EEST.
  'Europe/Berlin': 'en-GB',
  'Europe/Paris': 'en-GB',
  'Europe/Zurich': 'en-GB',
  'Europe/Madrid': 'en-GB',
  'Europe/Rome': 'en-GB',
  'Europe/Amsterdam': 'en-GB',
  'Europe/Vienna': 'en-GB',
  'Europe/Athens': 'en-GB',
  'Europe/Helsinki': 'en-GB',
  'Asia/Dubai': 'en-AE',
  'Asia/Singapore': 'en-SG',
  'Asia/Hong_Kong': 'en-HK',
  'Asia/Kolkata': 'en-IN',
  'Asia/Calcutta': 'en-IN',
  'Asia/Tokyo': 'ja-JP',
  'Pacific/Auckland': 'en-NZ',
};

function abbrLocale(zone: string): string {
  return ABBR_LOCALE[zone] ?? (zone.startsWith('Australia/') ? 'en-AU' : 'en-US');
}

/** Zone abbreviation for `zone` at `instant`, e.g. "EDT", "BST", "SGT". */
export function zoneAbbrAt(instant: Date, zone: string): string {
  try {
    return (
      new Intl.DateTimeFormat(abbrLocale(zone), { timeZone: zone, timeZoneName: 'short' })
        .formatToParts(instant)
        .find((p) => p.type === 'timeZoneName')?.value ?? ''
    );
  } catch {
    return '';
  }
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

// The date a slot's conversion is evaluated on. Fixed-date slots carry their own
// `date`. Weekly term slots use the NEXT occurrence of their weekday (today
// included), so the offsets are the ones in force for the class the viewer would
// actually attend. This used to be pinned to Sep 4 2026, which left every
// non-US viewer an hour out once US clocks changed on Nov 1 (and would again in
// March). Static HTML renders in ET, where only the EDT/EST abbreviation can
// differ between build time and view time.
function anchorDateFor(slot: Pick<ScheduleSlot, 'dayOfWeek' | 'date'>): string {
  if (slot.date) return slot.date;
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const offsetDays = ((slot.dayOfWeek - new Date(today).getUTCDay()) + 7) % 7;
  const d = new Date(today + offsetDays * 86_400_000);
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
  return anchorToUtc(anchorDateFor(slot), sh, sm);
}

// Render a slot in the given timezone: local weekday (pluralized), time range, and abbr.
export function formatSlot(slot: ScheduleSlot, zone: string): { day: string; time: string; abbr: string } {
  try {
    const date = anchorDateFor(slot);
    const [sh, sm] = slot.start.split(':').map(Number);
    const [eh, em] = slot.end.split(':').map(Number);
    const startUtc = anchorToUtc(date, sh, sm);
    const endUtc = anchorToUtc(date, eh, em);

    const weekday = new Intl.DateTimeFormat('en-US', { timeZone: zone, weekday: 'long' }).format(new Date(startUtc));
    const t = (ms: number) =>
      new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(ms));
    const abbr = zoneAbbrAt(new Date(startUtc), zone);

    return { day: `${weekday}s`, time: `${t(startUtc)} – ${t(endUtc)}`, abbr };
  } catch {
    // ICU/zone failure: fall back to the authored day + raw ET times.
    return { day: slot.day, time: `${slot.start}–${slot.end}`, abbr: 'ET' };
  }
}

// One-line label for a set of weekly meetings rendered in `zone`, e.g.
// "Saturdays 1:00 PM – 3:00 PM EDT" or, when a slot meets twice a week at the
// same hour, "Mondays & Thursdays 1:00 PM – 3:00 PM EDT". Used for the
// enrollment / checkout time pickers so the buyer chooses in their own clock.
export function formatSlotGroup(slots: ScheduleSlot[], zone: string): string {
  if (slots.length === 0) return '';
  const parts = slots.map((s) => formatSlot(s, zone));
  const sameTime = parts.every((p) => p.time === parts[0].time && p.abbr === parts[0].abbr);
  if (!sameTime) return parts.map((p) => `${p.day} ${p.time} ${p.abbr}`).join(' & ');
  const days = parts.map((p) => p.day);
  const dayList =
    days.length === 1 ? days[0] : `${days.slice(0, -1).join(', ')} & ${days[days.length - 1]}`;
  return `${dayList} ${parts[0].time} ${parts[0].abbr}`.trim();
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
