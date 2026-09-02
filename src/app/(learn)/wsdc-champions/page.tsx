import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { ArticleByline } from '@/components/ArticleByline';
import { WSDC_REVIEWER } from '@/data/author';

export const metadata: Metadata = {
  title: 'WSDC Champions by Year: Full Results 1988–2026',
  description:
    'Every World Schools Debating Championships result: champion, runner-up, host city, and final score for all 38 championships, plus titles by country.',
  alternates: { canonical: '/wsdc-champions' },
  openGraph: {
    title: 'WSDC Champions by Year: Full Results 1988–2026',
    description:
      'Every World Schools Debating Championships result since 1988: champions, runners-up, hosts, and final scores, cross-checked against the official record.',
    url: '/wsdc-champions',
    type: 'article',
  },
};

interface ChampionshipRow {
  year: string;
  host: string;
  champion: string;
  runnerUp: string;
  score: string;
  note?: string;
}

/**
 * Champions and runners-up are double-sourced: Wikipedia's champions table
 * cross-checked against the official WSDC results page (wsdcdebating.org),
 * which agree for every year. Final scores are included only where confirmed
 * by contemporaneous reporting; unverified scores are left blank rather than
 * guessed. Host venues before 2010 rest primarily on Wikipedia.
 */
const championships: ChampionshipRow[] = [
  { year: '2026', host: 'Nairobi, Kenya', champion: 'Canada', runnerUp: 'India', score: '', note: 'First WSDC in East Africa; best new team South Sudan' },
  { year: '2025', host: 'Panama City, Panama', champion: 'India', runnerUp: 'Australia', score: '9–0' },
  { year: '2024', host: 'Belgrade, Serbia', champion: 'Scotland', runnerUp: 'Bulgaria', score: '7–2', note: 'Bulgaria’s first final' },
  { year: '2023', host: 'Hanoi, Vietnam', champion: 'United States', runnerUp: 'Canada', score: '7–4', note: 'First all-North-American final' },
  { year: '2022', host: 'Online (Netherlands)', champion: 'Hong Kong', runnerUp: 'China', score: '9–0', note: 'Hong Kong’s first title; last online edition' },
  { year: '2021', host: 'Online (Macau)', champion: 'Canada', runnerUp: 'Hong Kong', score: '' },
  { year: '2020', host: 'Online (Mexico)', champion: 'Canada', runnerUp: 'Sri Lanka', score: '8–1', note: 'Replacement event; not counted as official by WSDC' },
  { year: '2019', host: 'Bangkok, Thailand', champion: 'India', runnerUp: 'Canada', score: '9–0', note: 'India went undefeated' },
  { year: '2018', host: 'Zagreb, Croatia', champion: 'China', runnerUp: 'India', score: '', note: 'China’s first title, on a narrow split decision' },
  { year: '2017', host: 'Bali, Indonesia', champion: 'Singapore', runnerUp: 'England', score: '8–1' },
  { year: '2016', host: 'Stuttgart, Germany', champion: 'England', runnerUp: 'Canada', score: '', note: 'England’s most recent title' },
  { year: '2015', host: 'Singapore', champion: 'Singapore', runnerUp: 'Canada', score: '', note: 'A rare home-nation win' },
  { year: '2014', host: 'Bangkok, Thailand', champion: 'England', runnerUp: 'South Africa', score: '' },
  { year: '2013', host: 'Antalya, Turkey', champion: 'Australia', runnerUp: 'Eswatini', score: '9–0', note: 'Australia’s most recent title; Eswatini’s second WSDC' },
  { year: '2012', host: 'Cape Town, South Africa', champion: 'Scotland', runnerUp: 'Wales', score: '', note: 'Wales’ only final' },
  { year: '2011', host: 'Dundee, Scotland', champion: 'Singapore', runnerUp: 'Australia', score: '', note: 'Singapore’s first title' },
  { year: '2010', host: 'Doha, Qatar', champion: 'Canada', runnerUp: 'England', score: '' },
  { year: '2009', host: 'Athens, Greece', champion: 'New Zealand', runnerUp: 'England', score: '', note: 'New Zealand’s most recent title' },
  { year: '2008', host: 'Washington, DC, USA', champion: 'England', runnerUp: 'New Zealand', score: '' },
  { year: '2007', host: 'Seoul, South Korea', champion: 'Scotland', runnerUp: 'Singapore', score: '' },
  { year: '2006', host: 'Cardiff, Wales', champion: 'Australia', runnerUp: 'Ireland', score: '' },
  { year: '2005', host: 'Calgary, Canada', champion: 'Australia', runnerUp: 'England', score: '' },
  { year: '2004', host: 'Stuttgart, Germany', champion: 'Australia', runnerUp: 'South Africa', score: '' },
  { year: '2003', host: 'Lima, Peru', champion: 'Australia', runnerUp: 'Singapore', score: '' },
  { year: '2002', host: 'Singapore', champion: 'Ireland', runnerUp: 'Australia', score: '', note: 'Ireland’s only title' },
  { year: '2001', host: 'Johannesburg, South Africa', champion: 'Australia', runnerUp: 'Scotland', score: '' },
  { year: '2000', host: 'Pittsburgh, USA', champion: 'Australia', runnerUp: 'England', score: '' },
  { year: '1999', host: 'London, England', champion: 'Scotland', runnerUp: 'England', score: '' },
  { year: '1998', host: 'Jerusalem, Israel', champion: 'Australia', runnerUp: 'Scotland', score: '' },
  { year: '1997', host: 'Bermuda', champion: 'Australia', runnerUp: 'England', score: '', note: 'The first of Australia’s nine titles' },
  { year: '1996', host: 'Canberra, Australia', champion: 'England', runnerUp: 'Pakistan', score: '' },
  { year: '1995', host: 'Cardiff, Wales', champion: 'New Zealand', runnerUp: 'Scotland', score: '' },
  { year: '1994', host: 'New Zealand', champion: 'United States', runnerUp: 'Pakistan', score: '', note: 'The USA’s only title until 2023' },
  { year: '1993', host: 'Medicine Hat, Canada', champion: 'England', runnerUp: 'Scotland', score: '' },
  { year: '1992', host: 'London, England', champion: 'New Zealand', runnerUp: 'Scotland', score: '' },
  { year: '1991', host: 'Edinburgh, Scotland', champion: 'New Zealand', runnerUp: 'Australia', score: '', note: 'The “WSDC” name was adopted this year' },
  { year: '1990', host: 'Winnipeg, Canada', champion: 'Scotland', runnerUp: 'Australia', score: '', note: 'Scotland won on debut; no championship was held in 1989' },
  { year: '1988', host: 'Australia', champion: 'Canada', runnerUp: 'Australia', score: '', note: 'The inaugural championship, with six nations' },
];

const titleCounts: Array<[string, number, string]> = [
  ['Australia', 9, '1997–2013'],
  ['Canada', 5, '1988–2026'],
  ['England', 5, '1993–2016'],
  ['Scotland', 5, '1990–2024'],
  ['New Zealand', 4, '1991–2009'],
  ['Singapore', 3, '2011–2017'],
  ['India', 2, '2019, 2025'],
  ['United States', 2, '1994, 2023'],
  ['China', 1, '2018'],
  ['Hong Kong', 1, '2022'],
  ['Ireland', 1, '2002'],
];

const pageFaqs = [
  {
    question: 'Who won WSDC 2026?',
    answer:
      'Canada won the 2026 World Schools Debating Championships in Nairobi, Kenya, defeating defending champions India in the grand final on July 24, 2026. It was the first championship held in East Africa, with more than seventy national teams competing; the United States’ Aayush Appan was top speaker and South Sudan was named best new team.',
  },
  {
    question: 'Which country has won the most WSDC titles?',
    answer:
      'Australia, with nine championships, all won between 1997 and 2013. Canada, England, and Scotland have five each, though Canada’s count includes the 2020 online replacement event, which the WSDC governing body does not record as an official championship. New Zealand has four, and Singapore three.',
  },
  {
    question: 'Has the United States ever won the World Schools Debating Championships?',
    answer:
      'Twice. The USA won the 1994 championship in New Zealand, defeating Pakistan in the final, and then waited twenty-nine years for its second title, beating Canada 7–4 in Hanoi in 2023. American students reach the championship through the USA Debate national team, selected by the National Speech & Debate Association.',
  },
  {
    question: 'When and where is the next WSDC?',
    answer:
      'The 2027 World Schools Debating Championships has been awarded to Sofia, Bulgaria, a fitting host after Bulgaria reached its first grand final in Belgrade in 2024. The championship runs each July–August with one team per nation and eight preliminary rounds, four on prepared motions and four impromptu.',
  },
];

function InLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-semibold text-signal-500 underline underline-offset-4 hover:text-signal-600"
    >
      {children}
    </Link>
  );
}

export default function WsdcChampionsPage() {
  return (
    <>
      <ArticleJsonLd
        reviewedBy={WSDC_REVIEWER}
        title="WSDC Champions by Year: Full Results 1988–2026"
        description="Every World Schools Debating Championships result: champion, runner-up, host, and final score for all 38 championships, cross-checked against the official record."
        url="/wsdc-champions"
        datePublished="2026-09-01"
      />
      <FAQJsonLd faqs={pageFaqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'WSDC Champions', href: '/wsdc-champions' },
        ]}
      />

      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">The championship</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            WSDC champions: every result since 1988
          </h1>
          <ArticleByline date="2026-09-01" reviewer={WSDC_REVIEWER} />
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            The World Schools Debating Championships (WSDC) is the world
            championship of high-school debate: one team per nation, eight
            preliminary rounds, and a grand final judged by a nine-member
            panel. Thirty-eight championships have been held since the
            inaugural 1988 event in Australia, and eleven nations have won
            at least one. Canada is the reigning champion, having defeated
            India in the 2026 final in Nairobi, Kenya. Australia leads the
            all-time count with nine titles, all between 1997 and 2013;
            Canada, England, and Scotland have five each; the United States
            has won twice, in 1994 and 2023. This page lists every
            champion, runner-up, host, and confirmed final score,
            cross-checked between the official WSDC results record and
            independent reporting.
          </p>
        </header>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">
            Which countries have won the most titles?
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-navy-900 text-sm uppercase tracking-wide text-navy-900">
                  <th className="py-2 pr-4 font-semibold">Nation</th>
                  <th className="py-2 pr-4 font-semibold">Titles</th>
                  <th className="py-2 font-semibold">Title span</th>
                </tr>
              </thead>
              <tbody>
                {titleCounts.map(([nation, count, span]) => (
                  <tr key={nation} className="border-b border-navy-200 text-navy-700">
                    <td className="py-2 pr-4 font-semibold text-navy-900">{nation}</td>
                    <td className="py-2 pr-4 font-mono text-sm">{count}</td>
                    <td className="py-2 text-sm">{span}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-navy-600">
            Canada&apos;s five includes the 2020 online event, held as a
            replacement after the Mexico City championship was cancelled;
            the WSDC governing body&apos;s own results page records 2020 as
            &ldquo;no official championship held,&rdquo; while the 2021 and
            2022 online editions count as official.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">
            Full results, 1988–2026
          </h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            Final scores are ballots on the grand-final panel and are shown
            only where confirmed by contemporaneous reporting; blank cells
            mean the split could not be verified, not that the final was
            unscored.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-navy-900 text-sm uppercase tracking-wide text-navy-900">
                  <th className="py-2 pr-4 font-semibold">Year</th>
                  <th className="py-2 pr-4 font-semibold">Host</th>
                  <th className="py-2 pr-4 font-semibold">Champion</th>
                  <th className="py-2 pr-4 font-semibold">Runner-up</th>
                  <th className="py-2 font-semibold">Final</th>
                </tr>
              </thead>
              <tbody>
                {championships.map((row) => (
                  <tr key={row.year} className="border-b border-navy-200 align-top text-navy-700">
                    <td className="py-2 pr-4 font-mono text-sm">{row.year}</td>
                    <td className="py-2 pr-4 text-sm">{row.host}</td>
                    <td className="py-2 pr-4 font-semibold text-navy-900">{row.champion}</td>
                    <td className="py-2 pr-4 text-sm">{row.runnerUp}</td>
                    <td className="py-2 text-sm">
                      {row.score || '—'}
                      {row.note ? (
                        <span className="block text-xs text-navy-500">{row.note}</span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">
            What does the record show?
          </h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            Three eras are visible in the table. The championship&apos;s
            first two decades belonged to the Commonwealth&apos;s founding
            debate cultures: every title through 2010 went to Australia,
            New Zealand, England, Scotland, Canada, Ireland, or the United
            States, with Australia&apos;s 1997–2006 run (eight titles in
            ten years) the most dominant stretch the event has seen. From
            2011, Asian programs arrived: Singapore won three
            championships in seven years, and China, India, and Hong Kong
            all took first titles between 2018 and 2022, a period in which
            Australia has not won at all. The 2020s have been the most
            open era in WSDC history: six different champions in the last
            seven championships, including the United States&apos; return
            to the title in Hanoi in 2023, twenty-nine years after its
            first.
          </p>
          <p className="mt-4 leading-relaxed text-navy-700">
            The runner-up column tells its own story about the
            format&apos;s reach: Pakistan (twice in the 1990s), Eswatini
            at only its second championship, Sri Lanka in the online
            year, and Bulgaria in 2024 have all reached grand finals
            without yet winning, and 2026&apos;s best-new-team award went
            to South Sudan. For what championship-level debating does for
            the debaters themselves, our{' '}
            <InLink href="/blog/does-debate-help-college-admissions">
              university admissions study
            </InLink>{' '}
            tracked where top WSDC speakers end up.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">
            How the championship works
          </h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            Each nation sends one team of three to five debaters, who
            debate eight preliminary rounds, four on motions released
            weeks in advance and four impromptu, prepared in an hour.
            The format is the source of the{' '}
            <InLink href="/what-is-world-schools-debate">World Schools
            debate</InLink> style used in schools worldwide and judged on
            the{' '}
            <InLink href="/world-schools-debate-judging">40/40/20
            criteria</InLink>. The motions debated at every championship
            from 1994 through 2025 are in our{' '}
            <InLink href="/motions/wsdc">Worlds motion archive</InLink>.
            American students reach the
            championship through{' '}
            <InLink href="/usa-debate-team">the USA Debate national
            team</InLink>; the wider international calendar around the
            championship is mapped in our{' '}
            <InLink href="/blog/international-world-schools-tournaments">
              guide to international tournaments
            </InLink>.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">
            Sources and method
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-navy-600">
            Champions and runners-up are cross-checked between the
            official WSDC results record (wsdcdebating.org) and
            Wikipedia&apos;s championship table, which agree for every
            year, with news reporting (BBC, The Scotsman, national debate
            federations) confirming recent finals. Host venues before 2010
            rest primarily on Wikipedia&apos;s record. Where sources
            disagree (the 2018 final margin) or a fact could not be
            confirmed (several final scores, the 1994 host city), the
            detail is omitted rather than guessed. Corrections:{' '}
            <InLink href="/contact">contact us</InLink>.
          </p>
        </section>

        <section className="mt-16 border-t border-navy-200 pt-10">
          <h2 className="text-2xl font-bold text-navy-900">Common questions</h2>
          <div className="mt-6 space-y-3">
            {pageFaqs.map((faq) => (
              <details key={faq.question} className="group rounded-lg border border-navy-100 bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold text-navy-900">
                  <span className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-navy-900">{faq.question}</h3>
                    <span className="text-signal-500 transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-navy-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
