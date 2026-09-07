import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreadcrumbJsonLd, EventJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { TournamentDates, TournamentScheduleRows } from '@/components/TournamentDates';
import { TournamentEnrollButton } from '@/components/TournamentEnrollButton';
import { SITE_NAME } from '@/lib/site';
import {
  FORMAT_LABELS,
  STATUS_LABELS,
  cleanPreviewToken,
  eligibilityParts,
  formatTournamentPrice,
  getTournament,
  priceUsd,
  tournamentDescription,
  type ContentBlock,
} from '@/lib/tournaments';

// Detail pages are rendered on demand from the ClassDesk API and cached for
// five minutes. There is no generateStaticParams: slugs live in the API.
export const revalidate = 300; // = TOURNAMENT_REVALIDATE_SECONDS (segment config must be a literal)
export const dynamicParams = true;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const preview = cleanPreviewToken((await searchParams).preview);
  const t = await getTournament(slug, { preview });
  if (!t) return {};
  const description = tournamentDescription(t);
  return {
    title: t.name.length > 46 ? t.name : `${t.name}: Debate Tournament`,
    description,
    alternates: { canonical: `/tournaments/${t.slug}` },
    openGraph: {
      title: `${t.name} | ${SITE_NAME}`,
      description,
      url: `/tournaments/${t.slug}`,
      ...(t.heroImageUrl ? { images: [{ url: t.heroImageUrl, alt: t.name }] } : {}),
    },
    ...(preview || t.preview ? { robots: { index: false, follow: false } } : {}),
  };
}

function Blocks({ blocks, timezone }: { blocks: ContentBlock[]; timezone: string }) {
  return (
    <div className="space-y-8">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'heading':
            return (
              <h2 key={i} className="font-display text-2xl font-semibold text-navy-900">
                {b.text}
              </h2>
            );
          case 'paragraph':
            return (
              <p key={i} className="leading-relaxed text-navy-700">
                {b.text}
              </p>
            );
          case 'list':
            return (
              <div key={i}>
                {b.title && <h3 className="font-semibold text-navy-900">{b.title}</h3>}
                <ul className="mt-3 list-disc space-y-2 pl-5 text-navy-700">
                  {b.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          case 'faq':
            return (
              <details key={i} className="group rounded-xl border border-navy-100 bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold text-navy-900">{b.q}</summary>
                <p className="mt-3 leading-relaxed text-navy-700">{b.a}</p>
              </details>
            );
          case 'schedule':
            return (
              <div key={i}>
                <TournamentScheduleRows rows={b.rows} timezone={timezone} selectId={`schedule-tz-${i}`} />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export default async function TournamentPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const preview = cleanPreviewToken((await searchParams).preview);
  const t = await getTournament(slug, { preview });
  if (!t) notFound();

  const url = `/tournaments/${t.slug}`;
  const faqs = t.content
    .filter((b): b is Extract<ContentBlock, { type: 'faq' }> => b.type === 'faq')
    .map((b) => ({ question: b.q, answer: b.a }));
  const eligibility = eligibilityParts(t);
  const where = t.mode === 'online' ? 'Online' : t.venue || 'In person';
  const listHref = preview ? `/tournaments?preview=${encodeURIComponent(preview)}` : '/tournaments';

  return (
    <>
      <EventJsonLd tournament={t} url={url} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Tournaments', href: '/tournaments' },
          { name: t.name, href: url },
        ]}
      />
      {faqs.length > 0 && <FAQJsonLd faqs={faqs} />}

      <section className="relative bg-navy-950 py-16 text-white sm:py-20">
        {t.heroImageUrl && (
          <>
            {/* Remote organiser images are not in next.config's image allowlist; a plain img is fine here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/85 to-navy-950/60" />
          </>
        )}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-navy-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="text-navy-500">/</span>
            <Link href={listHref} className="hover:text-white">Tournaments</Link>
            <span className="text-navy-500">/</span>
            <span className="text-navy-100">{t.name}</span>
          </nav>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-navy-300">
            {FORMAT_LABELS[t.format]} · {where} · {STATUS_LABELS[t.status]}
            {t.preview ? ' · Preview' : ''}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            {t.name}
          </h1>
          {t.organiserName && (
            <p className="mt-4 text-navy-200">
              Organised by{' '}
              {t.organiserUrl ? (
                <a
                  href={t.organiserUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white underline decoration-navy-300 underline-offset-4 hover:decoration-white"
                >
                  {t.organiserName}
                </a>
              ) : (
                <span className="font-semibold text-white">{t.organiserName}</span>
              )}
            </p>
          )}
          {t.blurb && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-100">{t.blurb}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {t.content.length > 0 ? (
              <Blocks blocks={t.content} timezone={t.timezone} />
            ) : (
              <p className="leading-relaxed text-navy-700">
                Full details for this tournament will be posted here. For anything not covered,
                use the{' '}
                <Link href="/contact" className="underline underline-offset-2 hover:text-signal-500">
                  contact page
                </Link>
                .
              </p>
            )}

            <div className="mt-12 border-t border-navy-100 pt-8">
              <h2 className="font-display text-2xl font-semibold text-navy-900">Preparing for the tournament</h2>
              <p className="mt-3 leading-relaxed text-navy-700">
                Students entering their first judged rounds usually get the most out of a short run of
                coached practice first. The{' '}
                <Link href="/programs/foundations" className="underline underline-offset-2 hover:text-signal-500">
                  Foundation class
                </Link>{' '}
                covers the format from scratch, the{' '}
                <Link href="/programs/competition-team" className="underline underline-offset-2 hover:text-signal-500">
                  Competition Team
                </Link>{' '}
                trains year-round, and the{' '}
                <Link href="/motions" className="underline underline-offset-2 hover:text-signal-500">
                  motion bank
                </Link>{' '}
                has thousands of real motions to practise on. How rounds are scored is explained in{' '}
                <Link href="/world-schools-debate-judging" className="underline underline-offset-2 hover:text-signal-500">
                  how World Schools judging works
                </Link>
                .
              </p>
            </div>
          </div>

          <aside>
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-navy-100 bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">Entry fee</p>
                <p className="mt-1 font-display text-3xl font-semibold text-navy-900">
                  {formatTournamentPrice(t)}
                  <span className="ml-2 text-base font-normal text-navy-500">per student</span>
                </p>

                <div className="mt-6 border-t border-navy-100 pt-5">
                  <TournamentDates
                    startsAt={t.startsAt}
                    endsAt={t.endsAt}
                    registrationClosesAt={t.registrationClosesAt}
                    timezone={t.timezone}
                  />
                </div>

                <dl className="mt-5 space-y-3 border-t border-navy-100 pt-5 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-navy-400">Where</dt>
                    <dd className="mt-1 text-navy-900">{where}</dd>
                  </div>
                  {eligibility.length > 0 && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-navy-400">Eligibility</dt>
                      <dd className="mt-1 text-navy-900">{eligibility.join(' · ')}</dd>
                    </div>
                  )}
                  {t.seatsLeft !== null && (t.status === 'open' || t.status === 'full') && (
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-navy-400">Places</dt>
                      <dd className="mt-1 text-navy-900">
                        {t.seatsLeft === 0
                          ? 'Full'
                          : `${t.seatsLeft} left${t.capacity ? ` of ${t.capacity}` : ''}`}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-6 border-t border-navy-100 pt-5">
                  <TournamentEnrollButton
                    slug={t.slug}
                    name={t.name}
                    status={t.status}
                    amountUsd={priceUsd(t)}
                    priceLabel={formatTournamentPrice(t)}
                    opensLabel={
                      t.registrationOpensAt
                        ? new Intl.DateTimeFormat('en-GB', { timeZone: t.timezone, day: 'numeric', month: 'short' }).format(new Date(t.registrationOpensAt))
                        : undefined
                    }
                  />
                </div>
              </div>
              <p className="text-xs leading-relaxed text-navy-500">
                Checkout collects each student&apos;s name, date of birth, grade, and school, plus a
                parent contact. Confirmation and joining details come by email after payment.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
