'use client';

// Calendar-style tournament listing: search, format and mode filters, a
// timezone selector, and cards grouped by month (the layout the owner
// prefers from atlanticivy.com), in the WSDC Prep register: navy header
// blocks instead of stock photos, scarlet only on the register action.

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { TimezoneSelect, useViewerTimezone } from './TimezoneSelect';
import { formatDateRange } from './TournamentDates';
import { zoneAbbrAt } from '@/lib/schedule';
import {
  FORMAT_LABELS,
  STATUS_LABELS,
  eligibilityParts,
  formatTournamentPrice,
  priceUsd,
  type PublicTournament,
  type TournamentFormat,
} from '@/lib/tournaments';

type ModeFilter = 'all' | 'online' | 'in_person';

function monthKey(iso: string, zone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: zone, year: 'numeric', month: '2-digit' }).formatToParts(new Date(iso));
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
    return `${get('year')}-${get('month')}`; // sortable YYYY-MM
  } catch {
    return iso.slice(0, 7);
  }
}

function monthLabel(iso: string, zone: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', { timeZone: zone, year: 'numeric', month: 'long' }).format(new Date(iso));
  } catch {
    return iso.slice(0, 7);
  }
}

function durationDays(startsAt: string, endsAt: string): number {
  const ms = Date.parse(endsAt) - Date.parse(startsAt);
  return Math.max(1, Math.ceil(ms / 86_400_000));
}

function statusTone(status: PublicTournament['status']): string {
  switch (status) {
    case 'open':
      return 'bg-emerald-500 text-white';
    case 'full':
      return 'bg-amber-400 text-navy-950';
    case 'upcoming':
    case 'interest':
      return 'bg-violet-500 text-white';
    case 'invite_only':
      return 'bg-white/15 text-white';
    case 'completed':
      return 'bg-navy-200 text-navy-700';
    default:
      return 'bg-navy-500 text-white';
  }
}

export function TournamentCalendar({ tournaments, preview }: { tournaments: PublicTournament[]; preview?: string }) {
  const { zone, setZone, options } = useViewerTimezone();
  const [query, setQuery] = useState('');
  const [format, setFormat] = useState<'all' | TournamentFormat>('all');
  const [mode, setMode] = useState<ModeFilter>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tournaments
      .filter((t) => (format === 'all' ? true : t.format === format))
      .filter((t) => (mode === 'all' ? true : t.mode === mode))
      .filter((t) => {
        if (!q) return true;
        const hay = [t.name, t.organiserName, t.venue, t.blurb, FORMAT_LABELS[t.format]].filter(Boolean).join(' ').toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }, [tournaments, query, format, mode]);

  const groups = useMemo(() => {
    const map = new Map<string, { label: string; items: PublicTournament[] }>();
    for (const t of filtered) {
      const k = monthKey(t.startsAt, zone);
      if (!map.has(k)) map.set(k, { label: monthLabel(t.startsAt, zone), items: [] });
      map.get(k)!.items.push(t);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  }, [filtered, zone]);

  const formatsPresent = useMemo(() => [...new Set(tournaments.map((t) => t.format))], [tournaments]);
  const modeBtn = (value: ModeFilter, label: string) => (
    <button
      type="button"
      onClick={() => setMode(value)}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${mode === value ? 'bg-navy-900 text-white' : 'text-navy-700 hover:bg-navy-50'}`}
      aria-pressed={mode === value}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="rounded-xl border border-navy-100 bg-white p-4 shadow-sm">
        <label htmlFor="tournament-search" className="sr-only">
          Search tournaments
        </label>
        <input
          id="tournament-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tournaments by name, format, organiser or venue"
          className="w-full rounded-md border border-navy-200 px-4 py-2.5 text-sm text-navy-900 placeholder:text-navy-400 focus:border-navy-400 focus:outline-none focus:ring-1 focus:ring-navy-400"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'all' | TournamentFormat)}
            className="rounded-md border border-navy-200 bg-white px-3 py-1.5 text-sm font-medium text-navy-900 focus:border-navy-400 focus:outline-none"
            aria-label="Format"
          >
            <option value="all">All formats</option>
            {formatsPresent.map((f) => (
              <option key={f} value={f}>
                {FORMAT_LABELS[f]}
              </option>
            ))}
          </select>
          <div className="flex items-center rounded-md border border-navy-200 p-0.5">
            {modeBtn('all', 'All')}
            {modeBtn('online', 'Online')}
            {modeBtn('in_person', 'In person')}
          </div>
          <div className="sm:ml-auto">
            <TimezoneSelect zone={zone} options={options} onChange={setZone} id="tournament-calendar-tz" />
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-navy-500">
        Showing {filtered.length} {filtered.length === 1 ? 'tournament' : 'tournaments'}
        {filtered.length !== tournaments.length ? ` of ${tournaments.length}` : ''}
      </p>

      {groups.length === 0 && (
        <p className="mt-6 rounded-xl border border-navy-100 bg-white p-8 text-center text-navy-600">
          Nothing matches those filters.{' '}
          <button
            type="button"
            className="font-semibold text-navy-900 underline underline-offset-4 hover:text-signal-500"
            onClick={() => {
              setQuery('');
              setFormat('all');
              setMode('all');
            }}
          >
            Clear filters
          </button>
        </p>
      )}

      {groups.map((g) => (
        <section key={g.label} className="mt-10">
          <div className="flex items-center gap-3 border-b border-navy-100 pb-3">
            <h2 className="font-display text-2xl font-semibold text-navy-900">{g.label}</h2>
            <span className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-semibold text-navy-700">
              {g.items.length} {g.items.length === 1 ? 'tournament' : 'tournaments'}
            </span>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {g.items.map((t) => (
              <CalendarCard key={t.slug} t={t} zone={zone} preview={preview} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CalendarCard({ t, zone, preview }: { t: PublicTournament; zone: string; preview?: string }) {
  const href = preview ? `/tournaments/${t.slug}?preview=${encodeURIComponent(preview)}` : `/tournaments/${t.slug}`;
  const days = durationDays(t.startsAt, t.endsAt);
  const eligibility = eligibilityParts(t).filter((p) => !p.startsWith('Teams of'));
  const organiserDiffers = zone !== t.timezone;
  const start = new Date(t.startsAt);

  const cta =
    t.status === 'open' ? (
      <Link href={href} className="rounded-md bg-signal-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]">
        Register
      </Link>
    ) : t.status === 'full' ? (
      <Link href={href} className="rounded-md bg-amber-400 px-4 py-2 text-center text-sm font-semibold text-navy-950 transition hover:bg-amber-300">
        Join the waitlist
      </Link>
    ) : t.status === 'interest' || t.status === 'upcoming' ? (
      <Link href={href} className="rounded-md bg-navy-900 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-navy-800">
        Register interest
      </Link>
    ) : (
      <span className="rounded-md border border-navy-200 px-4 py-2 text-center text-sm font-semibold text-navy-400">
        {STATUS_LABELS[t.status]}
      </span>
    );

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-navy-100 bg-white">
      <Link href={href} className="group block bg-navy-950 p-5 text-white">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusTone(t.status)}`}>{STATUS_LABELS[t.status]}</span>
          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white">{t.mode === 'online' ? 'Online' : 'In person'}</span>
          {t.preview && <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-navy-950">Preview</span>}
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold leading-snug group-hover:underline group-hover:decoration-signal-400 group-hover:underline-offset-4">
          {t.name}
        </h3>
        <p className="mt-1 text-sm text-navy-200">{FORMAT_LABELS[t.format]}</p>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="sr-only">Dates</dt>
            <dd className="font-mono text-navy-900">
              {formatDateRange(t.startsAt, t.endsAt, zone)} <span className="text-navy-500">({zoneAbbrAt(start, zone)})</span>
            </dd>
            {organiserDiffers && (
              <dd className="mt-0.5 text-xs text-navy-500">
                Organiser time: {formatDateRange(t.startsAt, t.endsAt, t.timezone)} ({zoneAbbrAt(start, t.timezone)})
              </dd>
            )}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-navy-700">
            <span>
              {days} {days === 1 ? 'day' : 'days'}
            </span>
            {eligibility.length > 0 && <span>{eligibility.join(' · ')}</span>}
            {t.mode !== 'online' && t.venue && <span>{t.venue}</span>}
          </div>
          <div className="font-semibold text-navy-900">{formatTournamentPrice(t)}{priceUsd(t) > 0 ? ' per student' : ''}</div>
        </dl>
        {t.blurb && <p className="mt-3 text-sm leading-relaxed text-navy-600">{t.blurb}</p>}
        {t.status === 'open' && t.seatsLeft !== null && t.seatsLeft <= 10 && (
          <p className="mt-2 text-xs font-semibold text-signal-600">
            {t.seatsLeft === 0 ? 'No places left' : `${t.seatsLeft} ${t.seatsLeft === 1 ? 'place' : 'places'} left`}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2 pt-5">
          <Link href={href} className="rounded-md border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700 transition-colors hover:border-navy-400">
            Details
          </Link>
          {cta}
        </div>
      </div>
    </article>
  );
}
