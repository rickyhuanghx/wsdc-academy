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

      <section className="relative overflow-hidden bg-navy-950 py-16 text-white sm:py-20">
        {/* eslint-disable-next-line @next/next/no-img-element -- full-bleed background, sized by CSS */}
        <img src="/images/tournaments/listing-hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[center_30%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/85 to-navy-900/60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href={CONSULTATION_CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-signal-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
            >
              Talk to a coach about your child
            </a>
            <span className="text-sm text-navy-200">A 20-minute call to pick the right tournament and level.</span>
          </div>
          <div className="mt-8 max-w-3xl rounded-sm border border-white/15 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-200">What&apos;s included if you sign up through us</p>
            <ol className="mt-3 grid gap-3 sm:grid-cols-3">
              {['4 hours of coaching by experts', 'Sorted registration and judge requirement', 'Feedback about the tournament after the rounds'].map((item, i) => (
                <li key={item} className="flex gap-3 text-sm text-white">
                  <span className="font-display text-2xl font-semibold leading-none text-signal-400">{i + 1}</span>
                  <span className="pt-1">{item}</span>
                </li>
              ))}
            </ol>
          </div>
          <ul className="mt-10 grid max-w-3xl grid-cols-3 gap-3">
            {[
              ['/images/tournaments/finals-day.jpg', 'A WSDC Prep team on finals day'],
              ['/images/tournaments/online-debating.jpg', 'A student debating online'],
              ['/images/tournaments/awards.jpg', 'Students with tournament awards'],
            ].map(([src, alt]) => (
              <li key={src} className="overflow-hidden rounded-sm border border-white/15">
                {/* eslint-disable-next-line @next/next/no-img-element -- static site photos */}
                <img src={src} alt={alt} className="aspect-[4/3] h-full w-full object-cover" loading="lazy" />
              </li>
            ))}
          </ul>
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
