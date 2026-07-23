import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreadcrumbJsonLd, CollectionPageJsonLd } from '@/components/JsonLd';
import {
  motionYears,
  motionsForYear,
  motionTopics,
  Motion,
} from '@/lib/motion-bank';

interface Props {
  params: Promise<{ year: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return motionYears.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;
  const y = Number(year);
  if (!motionYears.includes(y)) return {};
  const count = motionsForYear(y).length;

  return {
    title: `Debate Motions ${year}: ${count.toLocaleString('en-US')} Motions from the ${year} Season`,
    description: `Every ${year} debate motion in the bank: ${count.toLocaleString('en-US')} motions from tournament records that season, grouped by tournament, with info slides where released. Free, no signup.`,
    alternates: { canonical: `/motions/year/${year}` },
    openGraph: {
      title: `Debate Motions ${year}`,
      description: `${count.toLocaleString('en-US')} real tournament motions from the ${year} season.`,
      url: `/motions/year/${year}`,
      type: 'website',
    },
  };
}

function groupByTournament(list: Motion[]): [string, Motion[]][] {
  const map = new Map<string, Motion[]>();
  for (const m of list) {
    const key = m.t || 'Tournament not recorded';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
}

export default async function MotionYearPage({ params }: Props) {
  const { year } = await params;
  const y = Number(year);
  if (!motionYears.includes(y)) notFound();

  const list = motionsForYear(y);
  const groups = groupByTournament(list);
  const idx = motionYears.indexOf(y);
  const newer = idx > 0 ? motionYears[idx - 1] : null;
  const older = idx < motionYears.length - 1 ? motionYears[idx + 1] : null;
  const wsdcCount = list.filter((m) => m.w).length;

  return (
    <>
      <CollectionPageJsonLd
        name={`Debate Motions ${year}`}
        description={`Real tournament debate motions from the ${year} season, grouped by tournament.`}
        url={`/motions/year/${year}`}
        count={list.length}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Motion Bank', href: '/motions' },
          { name: year, href: `/motions/year/${year}` },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/motions" className="hover:text-signal-600">Motion Bank</Link> · By year
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            Debate motions from {year}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            {list.length.toLocaleString('en-US')} motions set at{' '}
            {groups.length.toLocaleString('en-US')} tournaments during {year},
            verbatim from public tab records, largest tournaments first.
            {wsdcCount > 0 ? (
              <>
                {' '}It includes {wsdcCount} motions from that year&apos;s{' '}
                <Link href="/motions/wsdc" className="font-semibold text-signal-500 hover:text-signal-600">
                  World Schools Debating Championships
                </Link>
                .
              </>
            ) : null}{' '}
            For keyword search and topic filters, use the{' '}
            <Link href="/motions" className="font-semibold text-signal-500 hover:text-signal-600">
              searchable bank
            </Link>
            .
          </p>
        </header>

        <nav aria-label="Other years" className="mt-8 flex flex-wrap items-center gap-3 text-sm">
          {older && (
            <Link
              href={`/motions/year/${older}`}
              className="rounded-sm border border-navy-200 px-4 py-2 font-semibold text-navy-700 transition-colors hover:border-navy-400 hover:text-signal-500"
            >
              Older: {older} motions
            </Link>
          )}
          {newer && (
            <Link
              href={`/motions/year/${newer}`}
              className="rounded-sm border border-navy-200 px-4 py-2 font-semibold text-navy-700 transition-colors hover:border-navy-400 hover:text-signal-500"
            >
              Newer: {newer} motions
            </Link>
          )}
        </nav>

        {groups.map(([tournament, items]) => (
          <section key={tournament} className="motion-year-section mt-12 border-t-2 border-navy-900 pt-8">
            <h2 className="text-xl font-bold text-navy-900">
              {tournament}{' '}
              <span className="stat text-base font-normal text-navy-400">
                ({items.length} {items.length === 1 ? 'motion' : 'motions'})
              </span>
            </h2>
            <ul className="mt-5 space-y-4">
              {items.map((m) => (
                <li key={m.id} className="border-t border-navy-200 pt-4">
                  <p className="font-display italic leading-relaxed text-navy-800">{m.m}</p>
                  {m.r && <p className="mt-1.5 text-xs text-navy-500">{m.r}</p>}
                  {m.i && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-signal-500">
                        Info slide
                      </summary>
                      <p className="mt-2 border-l-2 border-navy-200 pl-3 text-sm leading-relaxed text-navy-600">
                        {m.i}
                      </p>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-14 border-t-2 border-navy-900 pt-8">
          <h2 className="text-2xl font-bold text-navy-900">Browse by topic instead</h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {motionTopics.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/motions/${t.slug}`}
                  className="inline-block rounded-sm border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-800 transition-colors hover:border-navy-400 hover:text-signal-500"
                >
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-14 bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Motions are free. Judged rounds are the product.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            Our students debate motions like these every week in full judged
            rounds, with oral adjudication and written feedback after every one.
          </p>
          <Link
            href="/consultation"
            className="mt-6 inline-block rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
          >
            Book a Consultation
          </Link>
        </div>
      </article>
    </>
  );
}
