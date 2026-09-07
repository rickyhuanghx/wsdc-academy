import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd, ItemListJsonLd } from '@/components/JsonLd';
import { TournamentCalendar } from '@/components/TournamentCalendar';
import { WaitlistForm } from '@/components/WaitlistForm';
import { CONSULTATION_CALENDLY_URL, CONTACT_EMAIL, SITE_NAME } from '@/lib/site';
import { cleanPreviewToken, getTournaments, isListedAsOpen } from '@/lib/tournaments';

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

export default async function TournamentsPage({ searchParams }: Props) {
  const preview = cleanPreviewToken((await searchParams).preview);
  const all = await getTournaments({ preview });
  const open = all.filter(isListedAsOpen).sort((a, b) => a.startsAt.localeCompare(b.startsAt));

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

        {all.length > 0 ? (
          <TournamentCalendar tournaments={all} preview={preview} />
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
      </section>
    </>
  );
}
