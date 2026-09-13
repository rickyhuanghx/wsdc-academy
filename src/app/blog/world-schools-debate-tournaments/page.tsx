import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';
import { CIRCUIT_GENERATED, circuitStats, postedTournaments } from '@/lib/ws-circuit';

export const metadata = postMetadata('world-schools-debate-tournaments');

const post = getPostBySlug('world-schools-debate-tournaments')!;

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-signal-500 hover:text-signal-600"
    >
      {children}
    </a>
  );
}

const GENERATED_LABEL = new Date(`${CIRCUIT_GENERATED}T12:00:00Z`).toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const springboard = postedTournaments.filter((t) => t.tags.includes('nsda-springboard-scrimmage'));

const highlights: { window: string; events: { name: string; where: string; note: string; href?: string }[] }[] = [
  {
    window: 'September',
    events: [
      { name: 'Greenhill Fall Classic', where: 'Greenhill School, Addison, TX · Sep 16–21, 2026', note: 'Quarters bid (Gold division), the highest bid tier, right out of the gate. A Green division for developing teams.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=40192' },
      { name: 'NSDA Season Opener', where: 'Online (NSDA Campus) · Sep 11–13, 2026', note: 'The circuit’s curtain-raiser, fully online; semis bid, plus a Junior division.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=40313' },
      { name: 'Grapevine Classic', where: 'Grapevine HS, TX · Sep 11–13, 2026', note: 'Texas season opener; finals bid.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=39477' },
      { name: 'Stephen Stewart Memorial', where: 'Milpitas HS, CA · Sep 25–27, 2026', note: 'West-coast opener; finals bid.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=39935' },
    ],
  },
  {
    window: 'October',
    events: [
      { name: 'Yale Invitational', where: 'Yale University, New Haven, CT · Oct 2–4, 2026', note: 'The Northeast’s marquee fall WS division; semis bid.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=38436' },
      { name: 'Jack Howe Memorial', where: 'CSU Long Beach, CA · Oct 3–5, 2026', note: 'Open World Schools division; finals bid.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=40450' },
      { name: 'Westminster', where: 'The Westminster Schools, Atlanta, GA · Oct 9–11, 2026', note: 'Georgia’s circuit anchor; finals bid. Coppell Classic (TX, Oct 15–17) runs a semis-bid division and a round robin the same week.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=40714' },
      { name: 'Heart of Texas', where: 'St. Mark’s School, Dallas, TX · Oct 16–18, 2026', note: 'Major national-circuit stop; finals bid.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=40242' },
      { name: 'Florida Blue Key', where: 'University of Florida, Gainesville · Oct 29–Nov 1, 2026', note: 'School entries capped in WS, no hired judging; finals bid.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=38785' },
    ],
  },
  {
    window: 'November',
    events: [
      { name: 'Ed Long Invitational', where: 'The Hockaday School, Dallas, TX · Nov 6–7, 2026', note: 'Semis bid.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=39900' },
      { name: 'Peach State Classic', where: 'Online · Nov 13–15, 2026', note: 'Full WS division with published motions.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=40761' },
      { name: 'John Lewis SVUDL Invitational', where: 'Online (NSDA Campus) · Nov 20–22, 2026', note: 'Hosted by the Silicon Valley Urban Debate League; finals bid.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=39924' },
    ],
  },
  {
    window: 'December',
    events: [
      { name: 'Longhorn Classic', where: 'UT Austin, TX · Dec 4–6, 2026', note: 'One of the deeper WS fields. Quarters bid.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=38583' },
      { name: 'Isidore Newman Invitational', where: 'New Orleans, LA · Dec 11–13, 2026', note: 'Finals bid. Dripping Springs Tiger Tussle (TX, Dec 11–12) runs novice and varsity WS the same weekend; finals bid.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=40760' },
      { name: 'John Edie Holiday Debates', where: 'The Blake School, Minneapolis, MN · Dec 18–21, 2026', note: 'Late-December tradition; semis bid.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=40798' },
    ],
  },
  {
    window: 'January',
    events: [
      { name: 'Cavalier Invitational', where: 'Durham Academy, NC · Jan 15–18, 2027', note: 'Finals bid.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=39720' },
      { name: 'Barkley Forum for High Schools', where: 'Emory University, Atlanta, GA · Jan 22–24, 2027', note: 'Emory’s national tournament now runs a World Schools division.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=39754' },
      { name: 'Sunvitational', where: 'NSU University School, Davie, FL · expected mid-January', note: 'Florida’s big winter WS division, middle-school divisions too (its WS division carries no TOC bid). 2027 page not yet posted.' },
      { name: 'Mount Vernon Invitational', where: 'Mount Vernon HS, WA · Jan 15–16, 2027 (hybrid)', note: 'The Northwest’s WS stop; semis bid. Southlake Carroll Dragon Faire (TX, online) the same weekend; semis bid. Neither page is on Tabroom yet.' },
    ],
  },
  {
    window: 'February',
    events: [
      { name: 'Harvard National Tournament', where: 'Cambridge, MA (varsity in person, open online) · Feb 11–15, 2027', note: 'Presidents’ Day weekend; quarters bids in both divisions.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=40853' },
      { name: 'Stanford Invitational', where: 'Online (NSDA Campus) · Feb 6–8, 2027', note: 'TOC division (quarters bid) plus a novice division.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=40749' },
      { name: 'Cal Invitational', where: 'UC Berkeley, CA (WS division online) · Feb 13–15, 2027', note: 'Finals bid.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=39887' },
      { name: 'Liberty Bell Classic', where: 'University of Pennsylvania, Philadelphia · Feb 5–7, 2027', note: 'Penn’s in-person invitational with a WS division.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=40599' },
    ],
  },
  {
    window: 'March',
    events: [
      { name: 'Penn World Schools Invitational', where: 'Online (University of Pennsylvania) · expected late March', note: 'Dedicated all-WS online tournament (2026: Mar 28–29, 60-team cap, ESL/EFL categories). 2027 page not yet posted.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=39557' },
      { name: 'TOC Digital Series 3', where: 'Online (University of Kentucky) · Mar 5–7, 2027', note: 'The last of Kentucky’s three online semis-bid weekends (Series 1: Dec 4–6; Series 2: Feb 19–21).' },
    ],
  },
  {
    window: 'April',
    events: [
      { name: 'Tournament of Champions (WS division)', where: 'University of Kentucky, Lexington · Apr 17–19, 2027', note: 'The circuit’s championship, entered via season bids (55th edition).', href: 'https://ci.uky.edu/debate/toc/bids/bid-tournaments' },
      { name: 'Harvard College WS Invitational', where: 'Harvard University, Cambridge, MA · expected April', note: 'Dedicated all-WS tournament run by Harvard’s college debaters. 2027 page not yet posted.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=35272' },
      { name: 'Bluebonnet WS International', where: 'Grand Oaks HS, Spring, TX · Apr 22–24, 2027', note: '10th edition: championship and novice divisions, plus a clinic and a training track; international delegations attend.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=40857' },
      { name: 'NSDA Last Chance Qualifier', where: 'Des Moines, IA (online rounds) · Apr 29–May 1, 2027', note: 'The final route into NSDA Nationals for teams that missed districts.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=41099' },
    ],
  },
  {
    window: 'May – June',
    events: [
      { name: 'WISDAA State Debate Festival', where: 'Madison, WI · expected early May', note: 'Wisconsin’s state festival runs exactly two debate events: Congress and World Schools, in person and online.', href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=38164' },
      { name: 'NSDA Nationals (USA World Schools Debate Invitational)', where: 'Phoenix, AZ · Jun 13–18, 2027', note: 'Qualify through your NSDA district; up to two teams of 3–5 per district.', href: 'https://www.speechanddebate.org/uswsdi-manual/' },
    ],
  },
];

const internationals: { name: string; when: string; entry: string; note: string; href?: string }[] = [
  { name: 'ESDC (Eurasian Schools Debating Championship)', when: 'January · Robert College, Istanbul', entry: 'Open: school teams', note: 'Student-organized WSDC-format open; 17th edition set for January 2027.', href: 'https://esdc.info/' },
  { name: 'Oldham Cup', when: 'April · Anglo-Chinese Junior College, Singapore', entry: 'Open: school teams', note: 'Singapore’s flagship schools WS event; recent editions drew ~50 teams from across Asia and beyond.', href: 'https://www.acjc.moe.edu.sg/international-oldham-cup-2024/' },
  { name: 'Prague Debate Spring', when: 'July · Prague, Czech Republic', entry: 'Open: school teams', note: 'Czech Debate Association’s WS-format summer tournament with a worldwide field.', href: 'https://pds.debatovani.cz/' },
  { name: 'Heart of Europe', when: 'July · Olomouc, Czech Republic', entry: 'Open: school teams', note: 'Running since 2001; teams from 40+ countries; full WSDC-style schematic. Confirm the current edition by email.', href: 'https://en.wikipedia.org/wiki/Heart_of_Europe_Debating_Tournament' },
  { name: 'Doxbridge WSDC', when: 'July · Online', entry: 'Open: school teams', note: 'The established online international: 2025 ran six rounds at £90/team with national and open breaks.' },
  { name: 'EurOpen', when: 'November · Stuttgart, Germany', entry: 'Open: school teams and national squads', note: 'Founded 1996 by the Debating Society Germany; confirm the current edition before planning travel.', href: 'https://schoolsdebate.de/' },
  { name: 'Winter Holidays Open (WHO)', when: 'December · Zagreb, Croatia', entry: 'Open: school/club teams', note: 'Around 100 school teams from dozens of countries, including the US; open break plus a novice break. One of the most accessible internationals for American teams.', href: 'https://who.hdd.hr/' },
  { name: 'EuroSDC', when: 'Feb–Mar · rotating European host', entry: 'National teams only', note: 'Europe’s continental championship under WSDC rules (2027: Parma); not enterable by US school teams.', href: 'https://idebate.net/what-we-do/EuroSDC' },
  { name: 'Asia WSDC', when: 'Summer · Bangkok, Thailand', entry: 'Primarily national teams', note: 'The Asian championship in WS format.' },
];

const faqs = [
  {
    question: 'Can my school team enter the World Schools Debating Championships?',
    answer:
      'No. WSDC entry is one team per nation, so American students compete there only as members of USA Debate, the NSDA-selected national team. What school teams CAN do: enter the open internationals (Winter Holidays Open, ESDC Istanbul, Oldham Cup, Bluebonnet International), which run the same format against genuinely international fields.',
  },
  {
    question: 'What is a TOC bid in World Schools?',
    answer:
      'The Tournament of Champions at the University of Kentucky runs a World Schools division entered by earning bids, which means reaching a specified elimination round at designated events across the season. The official 2026–27 list names 36 qualifying tournaments in three tiers: five quarters-bid events (Greenhill Gold, Longhorn, Stanford, and Harvard’s two divisions), fifteen semis-bid events, and sixteen finals-bid events. Several are online, and a handful are hosted abroad.',
  },
  {
    question: 'How current is this list?',
    answer: `The full directory page was built on ${GENERATED_LABEL} by reading every tournament page on Tabroom's North American calendars for the 2026–27 season (about 3,700 tournaments) and keeping the ones with a posted World Schools event, then cross-checking against the official TOC bid list. Hosts keep posting pages through the autumn, so the "expected" list will keep converting into confirmed dates; we re-run the scan monthly. Always confirm on the tournament's Tabroom page or invite before committing travel.`,
  },
  {
    question: 'Which tournaments are online?',
    answer: `${circuitStats.online} of the ${circuitStats.posted} posted World Schools events run online or in a hybrid form, including the NSDA Season Opener, the Stanford Invitational, Harvard National's open division, Peach State Classic, John Lewis SVUDL, and the free NSDA Springboard scrimmages. They are all marked Online in the full directory page.`,
  },
];

export default function TournamentsPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHref="/programs/competition-team"
      ctaLabel="Train with the Competition Team"
      ctaHeading="A season plan beats a tournament list."
      ctaBody="Our competition team builds each student’s calendar (which divisions, which bids, which internationals) and trains toward it all year."
      lede={
        <p>
          &ldquo;Where can I actually debate World Schools?&rdquo; is the most
          common question we get from families new to the format, and the
          answer has changed dramatically. The US now has a real circuit: a
          bid system, dedicated WS tournaments, state championships, and a
          national invitational, plus a set of international opens that
          American school teams can enter directly. Here is the whole map,
          with links: the highlights first, then{' '}
          <a href="#directory" className="font-semibold text-signal-500 hover:text-signal-600">
            every posted World Schools division for 2026–27
          </a>{' '}
          ({circuitStats.posted} events across {circuitStats.states} states plus the online circuit, read
          straight from Tabroom on {GENERATED_LABEL}).
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">The US season, month by month</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The spine of the domestic circuit is the{' '}
          <Ext href="https://ci.uky.edu/debate/toc/bids/bid-tournaments">
            Tournament of Champions World Schools bid list
          </Ext>
          : 36 tournaments in the 2026–27 season, tiered by bid level
          (reaching quarters, semis, or finals at a designated event earns
          the TOC qualification). The highlights:
        </p>
        <div className="mt-6 space-y-8">
          {highlights.map((month) => (
            <div key={month.window}>
              <h3 className="font-display text-lg font-bold text-signal-500">{month.window}</h3>
              <ul className="mt-3">
                {month.events.map((e) => (
                  <li key={e.name} className="border-t border-navy-200 py-3">
                    <p className="font-semibold text-navy-900">
                      {e.href ? <Ext href={e.href}>{e.name}</Ext> : e.name}
                      <span className="ml-2 font-normal text-navy-500">· {e.where}</span>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-navy-600">{e.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-l-2 border-signal-500 bg-white p-5">
          <h3 className="font-display text-lg font-bold text-navy-900">No travel budget? The online circuit is real.</h3>
          <p className="mt-2 text-sm leading-relaxed text-navy-700">
            A striking share of the bid list is reachable from your bedroom:
            the NSDA Season Opener (September), Kentucky&apos;s three TOC
            Digital Series weekends (December to March), Harvard&apos;s three
            online International Series qualifiers, Harvard National&apos;s
            online division (a quarters bid), the Stanford Invitational, and
            Penn&apos;s all-WS invitational all run online. The NSDA also runs
            free{' '}
            <Ext href="https://www.speechanddebate.org/springboard-series/">
              Springboard Series
            </Ext>{' '}
            WS scrimmages on NSDA Campus, open even to non-members:{' '}
            {springboard.length} are already scheduled this autumn (see below).
            That is the lowest-stakes first tournament there is.
          </p>
        </div>
        <p className="mt-6 text-sm leading-relaxed text-navy-600">
          The bid list also reaches a handful of tournaments hosted in Asia. Texas fields more bid tournaments than any
          other state. Check the{' '}
          <Ext href="https://ci.uky.edu/debate/toc/bids/bid-tournaments">
            official list
          </Ext>{' '}
          for each event&apos;s bid level.
        </p>
      </section>

      <section id="directory" className="mt-14 scroll-mt-24">
        <h2 className="text-2xl font-bold text-navy-900">The full 2026–27 directory</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The highlights above are the events most families plan a season around. The complete list is
          a page of its own:{' '}
          <Link href="/world-schools-debate-tournaments" className="font-semibold text-signal-500 hover:text-signal-600">
            every North American tournament with a posted World Schools division
          </Link>
          , {circuitStats.posted} events across {circuitStats.states} states plus the online circuit, month by
          month, with TOC bid tiers, Tabroom links, the {circuitStats.expected} hosts expected to post from last
          season, and a subscribable calendar feed. It was built by reading every tournament page on
          Tabroom on {GENERATED_LABEL} and is re-scanned monthly.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <Link
            href="/world-schools-debate-tournaments"
            className="inline-block rounded-sm bg-navy-900 px-4 py-2 font-semibold text-white transition hover:bg-navy-800"
          >
            Open the directory
          </Link>
          <a
            href="/world-schools-tournaments.ics"
            className="inline-block rounded-sm border border-navy-900 px-4 py-2 font-semibold text-navy-900 transition hover:bg-navy-50"
          >
            Subscribe to the calendar (.ics)
          </a>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">State championships</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Six states now run World Schools at or near the state level:{' '}
          <Ext href="https://texasforensicassociation.com/world-schools/">Texas</Ext>
          , where WS is an official TFA event with impromptu-motion
          requirements built into state qualification, plus{' '}
          <strong>Team Texas</strong>, a TFA all-star WS squad with weekly
          practices;{' '}
          <Ext href="https://www.inspeechanddebate.org/tournaments/state-debate">Indiana</Ext>
          , whose ISSDA State Debate runs a WS bracket each winter; Florida,
          whose FFL has offered WS at its Open State Championship;
          Washington, which has staged WS as a trial event at the WIAA state
          championships and whose district qualifiers now run it;{' '}
          <Ext href="https://www.wisdaa.org/docs/debate/debate-categories-rules/debate-categories/">Wisconsin</Ext>
          , whose WISDAA festival runs only two debate events, Congress and
          World Schools; and Arkansas, whose{' '}
          <Ext href="https://actaa.org/World-Schools-Debate-(WS)">ACTAA</Ext>{' '}
          lists WS among its official events. Idaho is the quiet success
          story in the directory above: more than a dozen Idaho invitationals
          now run novice and varsity WS divisions, and the Idaho State Debate
          Tournament ran one in 2026. Georgia is the interesting
          case: no WS at GFCA State, but a healthy invitational scene
          (Westminster, Peach State Classic, Barkley Forum). If your state runs nothing, the
          NSDA district route, the online events above, and the invitational
          circuit are all open regardless.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">The internationals</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The summit of the format is the{' '}
          <Ext href="https://www.wsdcdebating.org/">
            World Schools Debating Championships
          </Ext>
          : one team per nation, well over sixty countries, eight preliminary
          rounds (four prepared, four impromptu) before elims. Recent editions:
          Hanoi 2023 (won by the USA), Belgrade 2024 (Scotland), Panama City
          2025 (India), and Nairobi 2026 (Canada), the championship&apos;s
          first visit to East Africa; the full record is on our{' '}
          <Link href="/wsdc-champions" className="font-semibold text-signal-500 hover:text-signal-600">
            WSDC champions page
          </Link>
          . For American students, the only route in is{' '}
          <Link href="/usa-debate-team" className="font-semibold text-signal-500 hover:text-signal-600">
            the USA Debate national team
          </Link>
          .
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          WSDC is not the only international table, though. These events run
          the same format, and several are open to any school team willing to
          travel (or log on):
        </p>
        <div className="mt-6 overflow-x-auto rounded-lg border border-navy-100">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-navy-900 text-left text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Tournament</th>
                <th className="px-4 py-3 font-semibold">When & where</th>
                <th className="px-4 py-3 font-semibold">Who can enter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 bg-white text-navy-700">
              {internationals.map((t) => (
                <tr key={t.name}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-navy-900">
                      {t.href ? <Ext href={t.href}>{t.name}</Ext> : t.name}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-navy-500">{t.note}</p>
                  </td>
                  <td className="px-4 py-3">{t.when}</td>
                  <td className="px-4 py-3">{t.entry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 leading-relaxed text-navy-700">
          This table is the summary. The full guide, including a watchlist of
          events to verify, travel-window advice, and the famous international
          tournaments that are <em>not</em> World Schools format, is in{' '}
          <Link href="/blog/international-world-schools-tournaments" className="font-semibold text-signal-500 hover:text-signal-600">
            taking a bench abroad: the international World Schools calendar
          </Link>
          .
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Building a season from the map</h2>
        <ol className="mt-5 space-y-4">
          {[
            ['Anchor on one fall and one winter invitational', 'within travel range, ideally TOC bid events, so results compound into qualification.'],
            ['Add your state championship or district tournament', 'the NSDA district route to Nationals needs only that you competed at districts; your district may enter up to two WS teams.'],
            ['Pick one stretch goal', 'a TOC bid, the Harvard College WS Invitational, Bluebonnet, or, for the adventurous, an international open like Zagreb’s Winter Holidays Open in December.'],
            ['Let every motion feed the file', 'a season on this circuit produces exactly the case-file material that makes the next tournament’s prep hour faster.'],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4 border-t border-navy-200 pt-4">
              <span className="font-display text-2xl font-bold text-signal-500">{i + 1}</span>
              <p className="leading-relaxed text-navy-700"><strong>{title}</strong> {body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 leading-relaxed text-navy-700">
          For where each rung leads, read{' '}
          <Link href="/blog/world-schools-debate-pathway-us" className="font-semibold text-signal-500 hover:text-signal-600">
            the US World Schools pathway
          </Link>
          , and drill between tournaments with the{' '}
          <Link href="/resources/practice-motions" className="font-semibold text-signal-500 hover:text-signal-600">
            practice motion bank
          </Link>
          .
        </p>
      </section>
    </BlogPostShell>
  );
}
