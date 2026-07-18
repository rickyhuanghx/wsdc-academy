'use client';

// Schedule block for the fixed-cohort summer bootcamp. Unlike the term programs
// (which offer either/or time slots), the bootcamp's meetings are ALL required —
// it meets on each listed day. Reuses the shared ET-anchor conversion and
// timezone selector so times localize the same way as the rest of the site.

import type { Program } from '@/data/programs';
import { formatSlot } from '@/lib/schedule';
import { TimezoneSelect, useViewerTimezone } from './TimezoneSelect';

type Bootcamp = NonNullable<Program['bootcamp']>;

export function BootcampSchedule({ bootcamp }: { bootcamp: Bootcamp }) {
  const { zone, setZone, options } = useViewerTimezone();

  return (
    <>
      <div className="mt-5">
        <TimezoneSelect zone={zone} options={options} onChange={setZone} id="bootcamp-tz" />
      </div>

      <div className="mt-5 rounded-xl border border-navy-100 bg-white p-6">
        <p className="text-sm font-semibold text-navy-900">
          {bootcamp.sessionCount} sessions · {bootcamp.totalHours} hours total
        </p>
        <p className="mt-1 text-sm text-navy-600">{bootcamp.dateRange}</p>

        <ul className="mt-4 space-y-4 border-t border-navy-100 pt-4">
          {bootcamp.meetings.map((meeting) => {
            const f = formatSlot(meeting, zone);
            return (
              <li key={meeting.dayOfWeek}>
                <p className="font-display text-lg font-semibold text-navy-900">{f.day}</p>
                <p className="font-mono text-sm text-navy-700">
                  {f.time} <span className="text-navy-400">{f.abbr}</span>
                </p>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-xs text-navy-500">
          The bootcamp meets on both days each week. Times are the same every session.
        </p>
      </div>
    </>
  );
}
