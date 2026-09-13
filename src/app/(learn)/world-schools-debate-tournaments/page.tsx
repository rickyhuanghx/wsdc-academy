import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { ArticleByline } from '@/components/ArticleByline';
import { FurtherReading } from '@/components/FurtherReading';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import {
  CIRCUIT_GENERATED,
  circuitStats,
  formatRange,
  postedTournaments,
  tierLabel,
  tocBids,
  type TocTier,
} from '@/lib/ws-circuit';
import { Badge, Ext, PostedByMonth, SideLists, ExpectedTable, abroadBids, competitive } from '@/components/WsCircuitDirectory';

const PATH = '/world-schools-debate-tournaments';

const GENERATED_LABEL = new Date(`${CIRCUIT_GENERATED}T12:00:00Z`).toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export const metadata: Metadata = {
  title: 'World Schools Debate Tournaments: North America',
  description: `Every North American World Schools Debate tournament in 2026–27: ${circuitStats.posted} US events with dates, TOC bid tiers, NSDA qualifiers and Tabroom links, read from Tabroom itself.`,
  keywords: [
    'world schools debate tournaments',
    'north american debate tournaments',
    'world schools debate USA',
    'TOC world schools bids',
    'NSDA world schools debate',
    'world schools debate tournaments 2026-27',
  ],
  alternates: { canonical: PATH },
  openGraph: {
    title: `North American World Schools Debate Tournaments 2026–27 | ${SITE_NAME}`,
    description: `${circuitStats.posted} US tournaments with a World Schools division, month by month: TOC bid tiers, NSDA events, online divisions and Tabroom links. Updated from a full Tabroom scan.`,
    url: PATH,
    type: 'article',
  },
};

const pageFaqs = [
  {
    question: 'How was this list built?',
    answer: `Every tournament on Tabroom's calendars for all US states, Canadian provinces and the online time zones (about 3,700 pages for the 2025–26 and 2026–27 seasons) was opened and its event list checked for a World Schools division. Bid tiers come from the University of Kentucky's official 2026–27 TOC list. The last scan ran on ${GENERATED_LABEL}; we re-run it monthly during the season.`,
  },
  {
    question: 'Why is a tournament I know about missing?',
    answer:
      'Three reasons cover almost every case: the host has not created its 2026–27 Tabroom page yet (see the "expected" list, which projects last season’s hosts forward), the page exists but its event list is still empty, or the tournament runs off Tabroom (some Canadian and international events use Tabbycat or Calicotab). Email us the link and we will add it.',
  },
  {
    question: 'What is a TOC bid in World Schools?',
    answer:
      'The Tournament of Champions at the University of Kentucky runs a World Schools division entered by earning bids: reaching a specified elimination round at a designated tournament. The 2026–27 list has 36 bid tournaments in three tiers (quarters, semis, finals). A fully qualified team needs two bids earned together, and approved bid tournaments must field at least eight teams in round one.',
  },
  {
    question: 'Which World Schools tournaments are online?',
    answer: `${circuitStats.online} of the ${circuitStats.posted} posted events run online or as hybrids: the NSDA Season Opener, the Stanford Invitational, Harvard National's open division, Peach State Classic, John Lewis SVUDL, the Texas online swings on NSDA Campus, and the free NSDA Springboard scrimmages among them. Look for the Online label in the tables.`,
  },
  {
    question: 'Is World Schools Debate an NSDA event?',
    answer:
      'Yes. The NSDA runs World Schools Debate at its national tournament as the USA World Schools Debate Invitational, entered through NSDA districts, and it selects the USA Debate national team that represents the United States at the World Schools Debating Championships. World Schools is also a Tournament of Champions division, and an official event in several state associations, Texas first among them.',
  },
  {
    question: 'Are there World Schools tournaments in Canada?',
    answer:
      'Not on Tabroom this season: the sweep of every Canadian province found no posted World Schools division. Canadian schools compete in the format through the Canadian Student Debating Federation’s national championships and by travelling to Harvard, Yale and Penn. Team Canada won the 2026 World Schools Debating Championships.',
  },
];

const tiers: { tier: TocTier; label: string }[] = [
  { tier: 'quarters', label: 'Quarters bid' },
  { tier: 'semis', label: 'Semis bid' },
  { tier: 'finals', label: 'Finals bid' },
];

const abroadNames = new Set(abroadBids.map((b) => b.name));

const nsdaEvents = postedTournaments
  .filter((t) => /national speech and debate season opener|nsda springboard scrimmage 1$|last chance qualifier/i.test(t.name))
  .sort((a, b) => a.startDate.localeCompare(b.startDate));

function stateCount() {
  const counts = new Map<string, number>();
  for (const t of competitive) {
    const k = t.stateLabel;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
}

/** ItemList of Event nodes: one per posted tournament, all-day date ranges,
    Tabroom as the event URL, no offers (we do not sell entry). */
function DirectoryJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}${PATH}`,
    name: 'World Schools Debate Tournaments in North America, 2026–27',
    description: metadata.description,
    url: `${SITE_URL}${PATH}`,
    dateModified: CIRCUIT_GENERATED,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: postedTournaments.length,
      itemListElement: postedTournaments.map((t, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Event',
          name: t.name,
          startDate: t.startDate,
          endDate: t.endDate,
          url: t.url,
          eventAttendanceMode:
            t.mode === 'online'
              ? 'https://schema.org/OnlineEventAttendanceMode'
              : t.mode === 'hybrid'
                ? 'https://schema.org/MixedEventAttendanceMode'
                : 'https://schema.org/OfflineEventAttendanceMode',
          location:
            t.stateLabel === 'Online'
              ? { '@type': 'VirtualLocation', url: t.url }
              : { '@type': 'Place', name: [t.city, t.state].filter(Boolean).join(', '), address: { '@type': 'PostalAddress', addressLocality: t.city, addressRegion: t.state, addressCountry: 'US' } },
          description: `World Schools Debate division(s): ${t.ws_events.join('; ')}${t.toc_tier ? `. TOC ${tierLabel(t.toc_tier)}.` : '.'}`,
        },
      })),
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function WorldSchoolsTournamentsPage() {
  const states = stateCount();
  return (
    <>
      <DirectoryJsonLd />
      <FAQJsonLd faqs={pageFaqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'World Schools Tournaments', href: PATH },
        ]}
      />

      <article className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">Directory · United States and Canada · 2026–27 season</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            North American World Schools Debate Tournaments, 2026–27
          </h1>
          <ArticleByline date="2026-09-08" updated={CIRCUIT_GENERATED} />
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            Every debate tournament in the United States and Canada with a World Schools division this season:{' '}
            {circuitStats.posted} events across {circuitStats.states} states plus the online circuit, with dates, divisions,
            Tournament of Champions (TOC) bid tiers, the NSDA qualifiers, and a link to each Tabroom registration page.
            Built by reading every North American tournament page on Tabroom, not from memory, and re-scanned monthly.
            Last scan: {GENERATED_LABEL}.
          </p>
        </header>

        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            [circuitStats.posted, 'World Schools events posted'],
            [circuitStats.bidEvents, 'TOC bid events on Tabroom'],
            [circuitStats.online, 'online or hybrid'],
            [circuitStats.expected, 'more expected from last season’s hosts'],
          ].map(([n, label]) => (
            <div key={String(label)} className="border border-navy-100 bg-white p-3">
              <dt className="font-display text-3xl font-bold text-signal-500">{n}</dt>
              <dd className="mt-1 text-xs leading-snug text-navy-600">{label}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <a href="/world-schools-tournaments.ics" className="inline-block rounded-sm bg-navy-900 px-4 py-2 font-semibold text-white transition hover:bg-navy-800">
            Subscribe to the calendar (.ics)
          </a>
          <span className="text-navy-500">Works with Google Calendar, Apple Calendar and Outlook; updates when we re-scan.</span>
        </div>

        <nav className="mt-8 flex flex-wrap gap-2 text-sm" aria-label="On this page">
          {[
            ['#bids', 'TOC bid tournaments'],
            ['#nsda', 'NSDA events'],
            ['#directory', 'Every posted division'],
            ['#free', 'Free scrimmages and middle school'],
            ['#expected', 'Expected, not yet posted'],
            ['#states', 'By state'],
            ['#faq', 'Questions'],
          ].map(([href, label]) => (
            <a key={href} href={href} className="rounded-full border border-navy-200 px-3 py-1 text-navy-700 hover:border-navy-900">
              {label}
            </a>
          ))}
        </nav>

        <section id="bids" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold text-navy-900">TOC World Schools bid tournaments in North America, 2026–27</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-navy-700">
            The spine of the circuit is the{' '}
            <Ext href="https://ci.uky.edu/debate/toc/bids/bid-tournaments">Tournament of Champions World Schools bid list</Ext>: reaching
            quarters, semis or finals at a designated tournament earns a bid, and two bids earned together qualify a team for the TOC at the
            University of Kentucky (Apr 17–19, 2027). The full list has 36 tournaments: five quarters-bid events, fifteen semis,
            sixteen finals. The {abroadBids.length} hosted in Asia and the Gulf are left off this North American table. Rows link to
            the Tabroom page where one exists.
          </p>
          <div className="mt-5 overflow-x-auto rounded-lg border border-navy-100">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-navy-900 text-left text-white">
                <tr>
                  <th className="px-3 py-2 font-semibold">Tier</th>
                  <th className="px-3 py-2 font-semibold">Dates</th>
                  <th className="px-3 py-2 font-semibold">Tournament</th>
                  <th className="px-3 py-2 font-semibold">Host · location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 bg-white text-navy-700">
                {tiers.flatMap(({ tier, label }) =>
                  tocBids
                    .filter((b) => b.tier === tier && !abroadNames.has(b.name))
                    .map((b) => {
                      const posted = postedTournaments.find((t) => t.toc_name === b.name);
                      return (
                        <tr key={`${tier}-${b.name}`}>
                          <td className="whitespace-nowrap px-3 py-2 align-top">
                            <Badge tone={tier === 'quarters' ? 'signal' : 'navy'}>{label}</Badge>
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 align-top">
                            {posted ? <time dateTime={posted.startDate}>{formatRange(posted.startDate, posted.endDate)}</time> : b.dates.replace(/\.\s?/g, ' ').replace(/,\s?2026$/, ', 2027') || 'TBA'}
                          </td>
                          <td className="px-3 py-2 align-top">{posted ? <Ext href={posted.url}>{b.name}</Ext> : b.name}</td>
                          <td className="px-3 py-2 align-top text-navy-600">{[b.host, b.location].filter(Boolean).join(' · ')}</td>
                        </tr>
                      );
                    }),
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-navy-600">
            The official page lists Southlake Carroll as January 2026; that is a typo for 2027.
          </p>
        </section>

        <section id="nsda" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold text-navy-900">NSDA World Schools events: Nationals, Season Opener, Springboard, Last Chance</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-navy-700">
            The National Speech &amp; Debate Association runs World Schools Debate at its national tournament (the USA World Schools
            Debate Invitational: teams of three to five entered through NSDA districts, up to two teams per district), opens the season
            with the online Season Opener, hosts free Springboard scrimmages on NSDA Campus all autumn, and offers a Last Chance
            Qualifier in the spring. The NSDA-run World Schools events on Tabroom this season:
          </p>
          <ul className="mt-4 max-w-3xl space-y-2 text-sm">
            {nsdaEvents.map((t) => (
              <li key={t.tourn_id} className="flex flex-wrap gap-x-3 gap-y-1 border-t border-navy-100 pt-2">
                <time dateTime={t.startDate} className="whitespace-nowrap text-navy-500">{formatRange(t.startDate, t.endDate)}</time>
                <Ext href={t.url}>{t.name}</Ext>
                <span className="text-navy-600">{t.ws_events.join(' · ')}</span>
                {t.toc_tier && <Badge tone="signal">{tierLabel(t.toc_tier)}</Badge>}
              </li>
            ))}
            <li className="flex flex-wrap gap-x-3 gap-y-1 border-t border-navy-100 pt-2">
              <span className="whitespace-nowrap text-navy-500">Jun 13–18, 2027</span>
              <Ext href="https://www.speechanddebate.org/uswsdi-manual/">NSDA National Tournament (USA World Schools Debate Invitational)</Ext>
              <span className="text-navy-600">Phoenix, AZ · qualify through your NSDA district</span>
            </li>
          </ul>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-navy-600">
            The national team is a different route: see{' '}
            <Link href="/usa-debate-team" className="font-semibold text-signal-500 hover:text-signal-600">how to make the USA Debate team</Link>.
            All nine Springboard scrimmage dates are listed further down.
          </p>
        </section>

        <section id="directory" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold text-navy-900">Every posted World Schools division, month by month</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-navy-700">
            {competitive.length} open tournaments with a World Schools event on their Tabroom page, sorted by start date. Practice rounds,
            closed district events and camp tournaments are left out; the free NSDA Springboard scrimmages, the weeknight online series and
            middle-school-only meets are listed separately below. Texas alone runs {states.find((s) => s[0] === 'TX')?.[1] ?? 0} of them.
          </p>
          <PostedByMonth />
        </section>

        <section id="free" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold text-navy-900">Free scrimmages, the weeknight series and middle school</h2>
          <SideLists />
        </section>

        <section id="expected" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold text-navy-900">Expected, not yet posted</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-navy-700">
            These hosts ran a World Schools division in 2025–26 and had not created a 2026–27 Tabroom page when we scanned. Dates are last
            season&apos;s plus a year: the likely weekend, not a confirmation. The TOC-listed ones are all but certain to return.
          </p>
          <ExpectedTable />
        </section>

        <section id="states" className="mt-14 scroll-mt-24">
          <h2 className="text-2xl font-bold text-navy-900">Where World Schools is played</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-navy-700">
            Posted open tournaments by state this season. Texas is the format&apos;s home (World Schools is an official TFA event with a
            state championship and an all-star Team Texas); Idaho has quietly built a full novice-and-varsity circuit; California, Arizona,
            Georgia, Florida and the online calendar make up most of the rest.
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3 md:grid-cols-4">
            {states.map(([state, n]) => (
              <li key={state} className="flex justify-between border-b border-navy-100 py-1">
                <span className="text-navy-800">{state}</span>
                <span className="font-display font-bold text-signal-500">{n}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-navy-600">
            Six states run World Schools at or near the state level: <Ext href="https://texasforensicassociation.com/world-schools/">Texas</Ext>,{' '}
            <Ext href="https://www.inspeechanddebate.org/tournaments/state-debate">Indiana</Ext>, Florida, Washington,{' '}
            <Ext href="https://www.wisdaa.org/docs/debate/debate-categories-rules/debate-categories/">Wisconsin</Ext> and{' '}
            <Ext href="https://actaa.org/World-Schools-Debate-(WS)">Arkansas</Ext>. If your state runs nothing, the NSDA district route to
            Nationals, the online events above and the invitational circuit are all open regardless. The national picture, the internationals
            American teams can enter, and how to build a season from this list are in{' '}
            <Link href="/blog/world-schools-debate-tournaments" className="font-semibold text-signal-500 hover:text-signal-600">
              the World Schools tournament map
            </Link>
            .
          </p>
        </section>

        <section id="faq" className="mt-14 scroll-mt-24 max-w-3xl">
          <h2 className="text-2xl font-bold text-navy-900">Questions</h2>
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
          <p className="mt-6 text-xs leading-relaxed text-navy-500">
            Method: every tournament on Tabroom&apos;s calendars for all US states, Canadian provinces and the online time zones was opened
            and its event list checked for a World Schools event. Canada and Mexico had no posted World Schools divisions. Corrections to{' '}
            <a href="mailto:info@wsdcacademy.com" className="font-semibold text-signal-500 hover:text-signal-600">info@wsdcacademy.com</a>.
          </p>
        </section>

        <FurtherReading
          heading="Prepare for the season"
          links={[
            { href: '/blog/world-schools-debate-tournaments', label: 'The World Schools tournament map', note: 'The highlights month by month, state championships, and the internationals American school teams can enter.' },
            { href: '/motions/wsdc', label: 'The WSDC motion archive', note: 'Every World Schools Debating Championships motion since 1994, prepared and impromptu, free to search.' },
            { href: '/resources', label: 'Printable cheat sheets and the prep-hour planner', note: 'Speaker-role sheets and the one-hour impromptu prep system, ready to print for a tournament.' },
            { href: '/programs/competition-team', label: 'Competition Team', note: 'A coached season: which tournaments, which bids, and judged practice rounds every week.' },
          ]}
        />
      </article>
    </>
  );
}
