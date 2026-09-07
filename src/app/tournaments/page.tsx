import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/JsonLd';
import { TournamentDates } from '@/components/TournamentDates';
import { WaitlistForm } from '@/components/WaitlistForm';
import { CONSULTATION_CALENDLY_URL, CONTACT_EMAIL, SITE_NAME } from '@/lib/site';
import {
  FORMAT_LABELS,
  STATUS_LABELS,
  cleanPreviewToken,
  formatTournamentPrice,
  getTournaments,
  isListedAsOpen,
  isPast,
  type PublicTournament,
} from '@/lib/tournaments';

// Listing is served from the ClassDesk API with a 5-minute cache. Reading
// searchParams (preview) makes the route dynamic; the fetch itself stays cached.
export const revalidate = 300; // = TOURNAMENT_REVALIDATE_SECONDS (segment config must be a literal)

type Props = { searchParams: Promise<{ preview?: string | string[] }> };

const DESCRIPTION =
  'Debate tournaments for students, run by WSDC Prep and partner organisers: dates, entry fees, eligibility, and online registration for World Schools rounds.';

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const preview = cleanPreviewToken((await searchParams).preview);
  return {
    title: 'Debate Tournaments: Dates & Registration',
    description: DESCRIPTION,
    alternates: { canonical: '/tournaments' },
    openGraph: {
      title: `Debate Tournaments | ${SITE_NAME}`,
      description: DESCRIPTION,
      url: '/tournaments',
    },
    ...(preview ? { robots: { index: false, follow: false } } : {}),
  };
}

function StatusPill({ status }: { status: PublicTournament['status'] }) {
  const tone =
    status === 'open'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : status === 'full'
        ? 'bg-signal-50 text-signal-600 border-signal-200'
        : status === 'upcoming'
          ? 'bg-navy-50 text-navy-700 border-navy-200'
          : 'bg-navy-50 text-navy-500 border-navy-200';
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${tone}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function TournamentCard({ t, preview }: { t: PublicTournament; preview?: string }) {
  const href = preview ? `/tournaments/${t.slug}?preview=${encodeURIComponent(preview)}` : `/tournaments/${t.slug}`;
  const where = t.mode === 'online' ? 'Online' : t.venue || 'In person';
  return (
    <article className="rounded-xl border border-navy-100 bg-white p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-sm bg-navy-900 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-white">
          {FORMAT_LABELS[t.format]}
        </span>
        <StatusPill status={t.status} />
        {t.preview && (
          <span className="rounded-sm border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-amber-800">
            Preview
          </span>
        )}
      </div>
      <h3 className="mt-4 font-display text-2xl font-semibold text-navy-900">
        <Link href={href} className="hover:text-signal-500">
          {t.name}
        </Link>
      </h3>
      {t.organiserName && <p className="mt-1 text-sm text-navy-500">Organised by {t.organiserName}</p>}
      <dl className="mt-4 space-y-1.5 text-sm">
        <div className="flex gap-3">
          <dt className="w-16 shrink-0 text-navy-400">When</dt>
          <dd>
            <TournamentDates
              startsAt={t.startsAt}
              endsAt={t.endsAt}
              registrationClosesAt={t.registrationClosesAt}
              timezone={t.timezone}
              compact
            />
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-16 shrink-0 text-navy-400">Where</dt>
          <dd className="text-navy-700">{where}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-16 shrink-0 text-navy-400">Entry</dt>
          <dd className="text-navy-700">{formatTournamentPrice(t)} per student</dd>
        </div>
      </dl>
      {t.blurb && <p className="mt-4 text-sm leading-relaxed text-navy-600">{t.blurb}</p>}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 pt-4">
        <Link href={href} className="text-sm font-semibold text-navy-900 underline underline-offset-4 hover:text-signal-500">
          {t.status === 'open' ? 'Details and registration' : 'Details'}
        </Link>
        {t.status === 'open' && t.seatsLeft !== null && t.seatsLeft <= 10 && (
          <span className="text-xs font-semibold text-signal-600">
            {t.seatsLeft === 0 ? 'No places left' : `${t.seatsLeft} ${t.seatsLeft === 1 ? 'place' : 'places'} left`}
          </span>
        )}
      </div>
    </article>
  );
}

export default async function TournamentsPage({ searchParams }: Props) {
  const preview = cleanPreviewToken((await searchParams).preview);
  const all = await getTournaments({ preview });
  const open = all
    .filter(isListedAsOpen)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const past = all
    .filter(isPast)
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Tournaments', href: '/tournaments' },
        ]}
      />
      {!preview && (
        <ItemListJsonLd
          name="Debate Tournaments"
          description={DESCRIPTION}
          url="/tournaments"
          items={open.map((t) => ({
            name: t.name,
            href: `/tournaments/${t.slug}`,
            ...(t.blurb ? { description: t.blurb } : {}),
          }))}
        />
      )}

      <section className="bg-navy-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-navy-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="text-navy-500">/</span>
            <span className="text-navy-100">Tournaments</span>
          </nav>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">Debate Tournaments</h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-100">
            Judged rounds against other schools, run by {SITE_NAME} and partner organisers.
            Entry fees, dates, and eligibility are listed on each tournament, and registration
            takes a few minutes. New to the format? Start with{' '}
            <Link
              href="/what-is-world-schools-debate"
              className="font-semibold text-white underline decoration-signal-400 underline-offset-4 hover:decoration-white"
            >
              what World Schools debate is
            </Link>
            , then look at the{' '}
            <Link
              href="/programs"
              className="font-semibold text-white underline decoration-signal-400 underline-offset-4 hover:decoration-white"
            >
              training programs
            </Link>{' '}
            that prepare students for it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {preview && (
          <p className="mb-8 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Preview mode: unpublished tournaments are included. This view is not indexed.
          </p>
        )}

        {open.length > 0 ? (
          <>
            <h2 className="font-display text-3xl font-semibold text-navy-900">Open for registration</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {open.map((t) => (
                <TournamentCard key={t.slug} t={t} preview={preview} />
              ))}
            </div>
          </>
        ) : (
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <h2 className="font-display text-3xl font-semibold text-navy-900">
                No open tournaments right now
              </h2>
              <p className="mt-4 leading-relaxed text-navy-600">
                Registration for the next tournament is not open yet. Leave your details and we
                will email you when it is. In the meantime, a{' '}
                <a
                  href={CONSULTATION_CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-signal-500"
                >
                  free consultation
                </a>{' '}
                is the quickest way to find the right class, and our{' '}
                <Link href="/blog/world-schools-debate-tournaments" className="underline underline-offset-2 hover:text-signal-500">
                  tournament directory
                </Link>{' '}
                lists the season&apos;s events. Questions? Write to{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-2 hover:text-signal-500">
                  {CONTACT_EMAIL}
                </a>{' '}
                or use the{' '}
                <Link href="/contact" className="underline underline-offset-2 hover:text-signal-500">
                  contact page
                </Link>
                .
              </p>
            </div>
            <div className="lg:col-span-3">
              <WaitlistForm generic />
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-navy-900">Past tournaments</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {past.map((t) => (
                <TournamentCard key={t.slug} t={t} preview={preview} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
