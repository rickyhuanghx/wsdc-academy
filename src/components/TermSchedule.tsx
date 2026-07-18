'use client';

// Term-wide class schedule for the /programs index: every Junior/Senior slot across
// the group programs, in one timezone-aware view. Reuses the shared ET-anchor
// conversion (src/lib/schedule.ts) and timezone selector (./TimezoneSelect), so it
// stays in sync with the per-program ScheduleTimezones section.

import Link from 'next/link';
import type { Program } from '@/data/programs';
import { formatSlot, slotStartUtc, type ScheduleSlot } from '@/lib/schedule';
import { TimezoneSelect, useViewerTimezone } from './TimezoneSelect';

type ProgramSchedule = { shortName: string; slug: string; tracks: NonNullable<Program['tracks']> };

interface Row {
  programName: string;
  programSlug: string;
  band: string;
  optionId: string;
  slot: ScheduleSlot;
}

export function TermSchedule({ programs }: { programs: ProgramSchedule[] }) {
  const { zone, setZone, options } = useViewerTimezone();

  const rows: Row[] = [];
  for (const p of programs) {
    for (const track of p.tracks) {
      for (const slot of track.options) {
        rows.push({ programName: p.shortName, programSlug: p.slug, band: track.band, optionId: slot.id, slot });
      }
    }
  }
  rows.sort((a, b) => slotStartUtc(a.slot) - slotStartUtc(b.slot));

  // Group consecutive rows by their weekday in the selected zone.
  const groups: { day: string; items: (Row & { time: string; abbr: string })[] }[] = [];
  for (const row of rows) {
    const f = formatSlot(row.slot, zone);
    let group = groups[groups.length - 1];
    if (!group || group.day !== f.day) {
      group = { day: f.day, items: [] };
      groups.push(group);
    }
    group.items.push({ ...row, time: f.time, abbr: f.abbr });
  }

  return (
    <div className="rounded-2xl border border-navy-100 bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy-900">Full class schedule</h2>
          <p className="mt-2 max-w-xl text-sm text-navy-600">
            Every group class in Term 1, in your timezone. Each program runs Junior and Senior groups
            with two time-slot options; a coach confirms the slot when you enroll.
          </p>
        </div>
        <TimezoneSelect zone={zone} options={options} onChange={setZone} id="term-schedule-tz" />
      </div>

      <div className="mt-6 space-y-6">
        {groups.map((group) => (
          <div key={group.day} className="border-t border-navy-100 pt-5">
            <h3 className="font-display text-lg font-semibold text-navy-900">{group.day}</h3>
            <ul className="mt-3 divide-y divide-navy-50">
              {group.items.map((item) => (
                <li
                  key={`${item.programSlug}-${item.band}-${item.optionId}`}
                  className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <span className="font-mono text-sm text-navy-900">
                    {item.time} <span className="text-navy-400">{item.abbr}</span>
                  </span>
                  <span className="text-sm text-navy-600 sm:text-right">
                    <Link
                      href={`/programs/${item.programSlug}`}
                      className="font-semibold text-navy-900 underline decoration-navy-200 underline-offset-2 hover:decoration-signal-500"
                    >
                      {item.programName}
                    </Link>
                    <span className="text-navy-400"> · </span>
                    {item.band} · Option {item.optionId.toUpperCase()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
