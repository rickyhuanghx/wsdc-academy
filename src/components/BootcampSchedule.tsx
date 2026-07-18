'use client';

// Schedule block for the fixed-cohort summer bootcamp. The buyer picks ONE of
// two time options; each option meets twice a week for three weeks (6 sessions).
// Reuses the shared ET-anchor conversion and timezone selector so times localize
// the same way as the rest of the site.

import type { Program } from '@/data/programs';
import { formatSlot } from '@/lib/schedule';
import { TimezoneSelect, useViewerTimezone } from './TimezoneSelect';

type Bootcamp = NonNullable<Program['bootcamp']>;

export function BootcampSchedule({ bootcamp }: { bootcamp: Bootcamp }) {
  const { zone, setZone, options } = useViewerTimezone();

  return (
    <>
      <div className="mt-5 rounded-xl border border-navy-100 bg-white p-6">
        <p className="text-sm font-semibold text-navy-900">Summer cohorts</p>
        <ul className="mt-3 divide-y divide-navy-100">
          {bootcamp.cohorts.map((cohort) => (
            <li key={cohort.label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
              <span
                className={
                  cohort.status === 'closed' ? 'text-navy-400' : 'font-semibold text-navy-900'
                }
              >
                {cohort.label}
              </span>
              {cohort.status === 'closed' ? (
                <span className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                  Enrollment closed
                </span>
              ) : (
                <span className="rounded-full bg-signal-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-signal-600">
                  Enrolling now
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <TimezoneSelect zone={zone} options={options} onChange={setZone} id="bootcamp-tz" />
      </div>

      <div className="mt-5 rounded-xl border border-navy-100 bg-white p-6">
        <p className="text-sm font-semibold text-navy-900">
          {bootcamp.sessionCount} sessions · {bootcamp.totalHours} hours total
        </p>
        <p className="mt-1 text-sm text-navy-600">
          {bootcamp.dateRange} · pick one option, meets twice a week
        </p>

        <div className="mt-4 grid gap-4 border-t border-navy-100 pt-4 sm:grid-cols-2">
          {bootcamp.options.map((option) => (
            <div key={option.id} className="rounded-lg border border-navy-100 bg-cream p-4">
              <p className="text-sm font-semibold text-navy-900">{option.label}</p>
              <ul className="mt-3 space-y-3">
                {option.meetings.map((meeting) => {
                  const f = formatSlot(meeting, zone);
                  return (
                    <li key={meeting.dayOfWeek}>
                      <p className="font-display font-semibold text-navy-900">{f.day}</p>
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

        <p className="mt-4 text-xs text-navy-500">
          You choose your option at checkout. Both cover the same six sessions.
        </p>
      </div>
    </>
  );
}
