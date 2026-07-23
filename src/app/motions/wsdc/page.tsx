import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd, CollectionPageJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { wsdcChampionshipMotions, Motion } from '@/lib/motion-bank';

// Host cities are stable historical record (official WSDC archive + championship
// records). 1988-1993 motions are not preserved in any public archive we found.
const HOSTS: Record<string, string> = {
  '2025': 'Panama City, Panama',
  '2024': 'Belgrade, Serbia',
  '2023': 'Hanoi, Vietnam',
  '2022': 'Online (hosted by the Netherlands)',
  '2021': 'Online (hosted by Macau)',
  '2020': 'Online (replacement event during the pandemic)',
  '2019': 'Bangkok, Thailand',
  '2018': 'Zagreb, Croatia',
  '2017': 'Bali, Indonesia',
  '2016': 'Stuttgart, Germany',
  '2015': 'Singapore',
  '2014': 'Bangkok, Thailand',
  '2013': 'Antalya, Turkey',
  '2012': 'Cape Town, South Africa',
  '2011': 'Dundee, Scotland',
  '2010': 'Doha, Qatar',
  '2009': 'Athens, Greece',
  '2008': 'Washington, D.C., United States',
  '2007': 'Seoul, South Korea',
  '2006': 'Cardiff, Wales',
  '2005': 'Calgary, Canada',
  '2004': 'Stuttgart, Germany',
  '2003': 'Lima, Peru',
  '2002': 'Singapore',
  '2001': 'Johannesburg, South Africa',
  '2000': 'Pittsburgh, United States',
  '1999': 'London, England',
  '1998': 'Jerusalem, Israel',
  '1997': 'Bermuda',
  '1996': 'Canberra, Australia',
  '1995': 'Cardiff, Wales',
  '1994': 'New Zealand',
};

const count = wsdcChampionshipMotions.length;

export const metadata: Metadata = {
  title: `WSDC Motions: Every World Schools Debating Championships Motion Since 1994 (${count} Motions)`,
  description: `The complete Worlds motion archive: ${count} WSDC motions from 32 championships (1994 to 2025), every round from prelims to Grand Finals, with prepared and impromptu rounds labeled. Free, no signup.`,
  alternates: { canonical: '/motions/wsdc' },
  openGraph: {
    title: 'Every WSDC Motion Since 1994: The Worlds Motion Archive',
    description: `${count} motions from 32 World Schools Debating Championships, prepared and impromptu rounds labeled.`,
    url: '/motions/wsdc',
    type: 'website',
  },
};

const faqs = [
  {
    question: 'What is the difference between prepared and impromptu WSDC motions?',
    answer:
      'At Worlds, roughly half the rounds use prepared motions released weeks in advance, and the rest are impromptu: teams get the motion one hour before the debate and prepare without coaches or the internet. Both kinds are labeled in this archive, so you can drill each skill separately.',
  },
  {
    question: 'Why do the oldest championships have missing rounds?',
    answer:
      'The official archive is complete for most championships from 1999 onward, but several rounds from the 1994 to 1998 and 2000 championships were never recorded publicly. We list what the record preserves and do not reconstruct missing motions.',
  },
  {
    question: 'How should I study past Worlds motions?',
    answer:
      'Look for patterns, not predictions. Championship motions balance topic areas across the tournament, favor deep comparative questions over news reactions, and phrase burdens precisely. Prepping ten past Grand Final motions teaches you what the top of the format expects from a case.',
  },
];

function groupByYear(list: Motion[]): [string, Motion[]][] {
  const map = new Map<string, Motion[]>();
  for (const m of list) {
    const key = m.y ? String(m.y) : 'Unknown';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  return Array.from(map.entries()).sort((a, b) => Number(b[0]) - Number(a[0]));
}

export default function WsdcMotionsPage() {
  const groups = groupByYear(wsdcChampionshipMotions);

  return (
    <>
      <CollectionPageJsonLd
        name="WSDC Motions: The World Schools Debating Championships Motion Archive"
        description="Every publicly recorded motion from the World Schools Debating Championships since 1994, with prepared and impromptu rounds labeled."
        url="/motions/wsdc"
        count={count}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Motion Bank', href: '/motions' },
          { name: 'Worlds (WSDC) Motions', href: '/motions/wsdc' },
        ]}
      />
      <FAQJsonLd faqs={faqs} />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/motions" className="hover:text-signal-600">Motion Bank</Link> · The Worlds archive
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            Every WSDC motion since 1994
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            The World Schools Debating Championships is the world final of the
            format: one national team per country, eight preliminary rounds
            split between prepared and impromptu motions, then eliminations to
            a Grand Final. This page collects all {count} publicly recorded
            motions from 32 championships, newest first, sourced from the
            official WSDC motion archive and championship records.
          </p>
          <p className="mt-4 leading-relaxed text-navy-700">
            New to the format? Start with{' '}
            <Link href="/what-is-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
              what World Schools debate is
            </Link>
            . Aiming at the national team that competes here? Read{' '}
            <Link href="/usa-debate-team" className="font-semibold text-signal-500 hover:text-signal-600">
              how USA Debate selection works
            </Link>
            .
          </p>
        </header>

        <nav aria-label="Jump to championship" className="mt-8 flex flex-wrap gap-2">
          {groups.map(([year]) => (
            <a
              key={year}
              href={`#wsdc-${year}`}
              className="rounded-sm border border-navy-200 px-3 py-1 text-sm font-semibold text-navy-700 transition-colors hover:border-navy-400 hover:text-signal-500"
            >
              {year}
            </a>
          ))}
        </nav>

        {groups.map(([year, items]) => (
          <section key={year} id={`wsdc-${year}`} className="mt-12 border-t-2 border-navy-900 pt-8">
            <h2 className="text-2xl font-bold text-navy-900">WSDC {year}</h2>
            {HOSTS[year] && <p className="mt-1 text-sm text-navy-500">{HOSTS[year]}</p>}
            <ul className="mt-6 space-y-4">
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
          <h2 className="text-2xl font-bold text-navy-900">Worlds archive FAQ</h2>
          <dl className="mt-6 space-y-6">
            {faqs.map((f) => (
              <div key={f.question} className="border-t border-navy-200 pt-4">
                <dt className="font-display text-lg font-bold text-navy-900">{f.question}</dt>
                <dd className="mt-2 leading-relaxed text-navy-700">{f.answer}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-sm leading-relaxed text-navy-600">
            Championships before 1994 are not represented: no public archive
            preserves those motions. If you competed then and kept records, we
            would genuinely love to{' '}
            <Link href="/contact" className="font-semibold text-signal-500 hover:text-signal-600">
              hear from you
            </Link>
            .
          </p>
        </section>

        <div className="mt-14 bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Train on the motions Worlds actually set.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            Our competition students debate championship motions in full judged
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
