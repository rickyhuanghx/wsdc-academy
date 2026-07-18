'use client';

// The per-program Junior/Senior class schedule with a timezone selector. Slots are
// anchored to US Eastern in src/data/programs.ts; conversion + detection live in
// src/lib/schedule.ts and ./TimezoneSelect (shared with the term-wide TermSchedule).

import type { Program } from '@/data/programs';
import { formatSlot } from '@/lib/schedule';
import { TimezoneSelect, useViewerTimezone } from './TimezoneSelect';

type Track = NonNullable<Program['tracks']>[number];

export function ScheduleTimezones({ tracks }: { tracks: Track[] }) {
  const { zone, setZone, options } = useViewerTimezone();

  return (
    <>
      <div className="mt-5">
        <TimezoneSelect zone={zone} options={options} onChange={setZone} />
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {tracks.map((track) => (
          <div key={track.band} className="rounded-xl border border-navy-100 bg-white p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-xl font-semibold text-navy-900">{track.label}</h3>
              <span className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                Ages {track.ageRange.min}–{track.ageRange.max}
              </span>
            </div>
            <p className="mt-2 text-sm text-navy-600">{track.cadence}</p>
            <ul className="mt-4 space-y-4 border-t border-navy-100 pt-4">
              {track.options.map((slot) => {
                const f = formatSlot(slot, zone);
                return (
                  <li key={slot.id}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                      Option {slot.id.toUpperCase()}
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold text-navy-900">{f.day}</p>
                    <p className="font-mono text-sm text-navy-700">
                      {f.time} <span className="text-navy-400">{f.abbr}</span>
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
