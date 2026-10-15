import Link from 'next/link';
import { FORMAT_LABELS, getTournaments, isListedAsOpen, STATUS_LABELS } from '@/lib/tournaments';

// In-body links from the tournament guides to the live /tournaments/[slug]
// pages, which otherwise get a single link from the hub (2026-10-15 audit).
// Data comes from the ClassDesk API; on any failure the section renders nothing.
export async function EnterableTournaments({ heading }: { heading: string }) {
  const listed = (await getTournaments())
    .filter((t) => !t.preview && isListedAsOpen(t))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  if (listed.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="text-2xl font-bold text-navy-900">{heading}</h2>
      <p className="mt-4 max-w-3xl leading-relaxed text-navy-700">
        Events we register students for this season, with the format of each. Every page has the dates in your time zone, the
        entry fee and what is included.
      </p>
      <ul className="mt-6 divide-y divide-navy-100 border-y border-navy-100">
        {listed.map((t) => (
          <li key={t.slug} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3">
            <Link href={`/tournaments/${t.slug}`} className="font-semibold text-signal-500 hover:text-signal-600">
              {t.name}
            </Link>
            <span className="text-sm text-navy-600">
              {new Date(t.startsAt).toLocaleDateString('en-US', {
                timeZone: t.timezone || 'UTC',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
              {' · '}
              {FORMAT_LABELS[t.format]}
              {' · '}
              {t.mode === 'online' ? 'Online' : t.venue || 'In person'}
              {' · '}
              {STATUS_LABELS[t.status]}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-navy-700">
        The full list, including past events, is on{' '}
        <Link href="/tournaments" className="font-semibold text-signal-500 hover:text-signal-600">
          tournaments you can enter with WSDC Prep
        </Link>
        .
      </p>
    </section>
  );
}
