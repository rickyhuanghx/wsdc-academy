'use client';

// Shared timezone state + selector for the schedule views. SSR-safe: the initial
// zone is US Eastern (so server-rendered HTML carries real ET times for SEO/no-JS),
// then we detect the viewer's zone on mount — a post-hydration state change.

import { useEffect, useState } from 'react';
import { ANCHOR_ZONE, ZONES, detectZone, friendlyZoneName } from '@/lib/schedule';

export function useViewerTimezone() {
  const [zone, setZone] = useState(ANCHOR_ZONE);
  const [options, setOptions] = useState(ZONES);

  useEffect(() => {
    const detected = detectZone();
    if (!detected) return;
    if (!ZONES.some((z) => z.id === detected)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOptions([{ id: detected, label: `Your timezone (${friendlyZoneName(detected)})` }, ...ZONES]);
    }
    setZone(detected);
  }, []);

  return { zone, setZone, options };
}

export function TimezoneSelect({
  zone,
  options,
  onChange,
  id = 'schedule-tz',
}: {
  zone: string;
  options: { id: string; label: string }[];
  onChange: (zone: string) => void;
  id?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor={id} className="text-sm font-medium text-navy-600">
        Show times in
      </label>
      <select
        id={id}
        value={zone}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-navy-200 bg-white px-3 py-1.5 text-sm font-medium text-navy-900 shadow-sm focus:border-navy-400 focus:outline-none"
      >
        {options.map((z) => (
          <option key={z.id} value={z.id}>
            {z.label}
          </option>
        ))}
      </select>
    </div>
  );
}
