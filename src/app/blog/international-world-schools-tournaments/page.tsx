import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('international-world-schools-tournaments');

const post = getPostBySlug('international-world-schools-tournaments')!;

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

const opens: { when: string; name: string; where: string; note: string; href?: string }[] = [
  {
    when: 'January',
    name: 'ESDC (Eurasian Schools Debating Championship)',
    where: 'Robert College, Istanbul',
    note: 'A WSDC-format open run entirely by high-school students; the 17th edition is set for January 2027. One of the friendliest first internationals for a US team.',
    href: 'https://esdc.info/',
  },
  {
    when: 'April',
    name: 'International Oldham Cup',
    where: 'Anglo-Chinese Junior College, Singapore',
    note: 'Singapore’s flagship schools event, typically ~50 teams from across Asia and beyond; the 2026 edition ran in April. Watch ACJC’s site for 2027.',
    href: 'https://www.acjc.moe.edu.sg/international-oldham-cup-2024/',
  },
  {
    when: 'April',
    name: 'Bluebonnet World Schools International',
    where: 'Spring, Texas, USA',
    note: 'The NSDA’s own international: all-impromptu, championship and novice divisions, with visiting international delegations. The one “international” no US team needs a passport for.',
    href: 'https://www.tabroom.com/index/tourn/index.mhtml?tourn_id=36305',
  },
  {
    when: 'Late June',
    name: 'World Schools Debate Academy',
    where: 'Kranjska Gora, Slovenia',
    note: 'Half summer camp, half tournament: a residential WS academy (run by Slovenia’s Za in proti) that ends in a multi-day competition, grouped by experience level. Ideal for developing benches.',
    href: 'https://idebate.net/what-we-do/event-list',
  },
  {
    when: 'July',
    name: 'Prague Debate Spring',
    where: 'Prague, Czech Republic',
    note: 'WS-format summer tournament from the Czech Debate Association that draws teams and adjudicators worldwide; the 2026 edition ran July 9–12.',
    href: 'https://pds.debatovani.cz/',
  },
  {
    when: 'July',
    name: 'Heart of Europe',
    where: 'Olomouc, Czech Republic',
    note: 'Running since 2001 with teams from 40+ countries; a full WSDC-style schematic of eight prelims, four prepared and four impromptu. Confirm the current edition by email; the website has been unreliable.',
    href: 'https://en.wikipedia.org/wiki/Heart_of_Europe_Debating_Tournament',
  },
  {
    when: 'July',
    name: 'Doxbridge WSDC',
    where: 'Online (UK-run)',
    note: 'The established online international: the 2025 edition ran six rounds (four impromptu, two prepared) over a July weekend at £90 per team, with national and open breaks. The cheapest international field a US team can enter.',
  },
  {
    when: 'November',
    name: 'EurOpen',
    where: 'Stuttgart, Germany',
    note: 'Founded 1996; explicitly invites both school teams and national delegations, first half of November. The 2025 edition ran; the website was under maintenance when we checked, so email the organizers before planning.',
    href: 'https://schoolsdebate.de/index.php/about-us/our-competitions',
  },
  {
    when: 'December',
    name: 'Winter Holidays Open',
    where: 'Zagreb, Croatia',
    note: 'Around 100 school teams from dozens of countries (billed as Europe’s biggest in-person schools tournament), with an open break and a novice break. Registration typically closes in late October.',
    href: 'https://who.hdd.hr/',
  },
];

const watchlist: { name: string; note: string; href?: string }[] = [
  {
    name: 'Malaysia International WSDC (MIWSDC)',
    note: 'Fifth edition announced with registration live; dates and eligibility were not yet published when we checked.',
    href: 'https://wsdcmalaysia.org/',
  },
  {
    name: 'East African WSDC, Tanzania WSDC & UAE Junior WSDC',
    note: 'African Debate Academy events in Nairobi (May, 90+ teams), Dar es Salaam (August), and Dubai (November). WS format per the organizer, but single-source listings; verify directly.',
    href: 'https://africandebate.com/events/',
  },
  {
    name: 'QatarDebate International Schools Championship',
    note: 'Seven editions, English and Arabic tracks in Doha, but we could not confirm it runs 3-speaker World Schools format. Ask before entering.',
    href: 'https://qatardebate.org/international-events/isdcs/',
  },
  {
    name: 'Asia WSDC (Bangkok)',
    note: 'The Asian championship in WS format (7th edition mid-2025); primarily for national and top regional teams, and the next edition was unconfirmed when we checked.',
  },
];

const faqs = [
  {
    question: 'Can a US school team really debate internationally without making USA Debate?',
    answer:
      'Yes. That is the whole point of the opens. WSDC and EuroSDC are national-team-only, but ESDC Istanbul, the Winter Holidays Open, Prague Debate Spring, Heart of Europe, Oldham Cup, EurOpen, and Doxbridge all accept school or club teams directly. American teams already attend some of these: Zagreb’s recent fields have included US benches.',
  },
  {
    question: 'How do we check an event is actually World Schools format?',
    answer:
      'Look for the fingerprints in the invite: teams of three speakers (rosters of 3–5), eight-minute substantive speeches, four-minute reply speeches, POIs, and a mix of prepared and impromptu motions. If the invite says two-person teams, fifteen-minute prep for every round, or "British Parliamentary," it is a different sport; several famous international schools tournaments are BP, not WS.',
  },
  {
    question: 'Is an online international worth entering?',
    answer:
      'For a first international field, absolutely. Doxbridge runs a genuine multi-continent field for roughly the cost of one tank of gas, US-friendly evening hours aside, and Penn’s online WS invitational and Harvard’s online division offer international-flavored fields on US time. The judging you meet (different accents, different argument cultures, ordinary-intelligent-voter standards applied strictly) is most of what travel buys, at none of the cost.',
  },
  {
    question: 'When in the season should a US team go abroad?',
    answer:
      'The natural windows are December (Zagreb falls after the fall US circuit and before January exams), January (Istanbul, before the spring push), and July (Prague, Heart of Europe, Doxbridge; after NSDA Nationals, when the US season is over and a traveling tournament doubles as pre-season training).',
  },
];

export default function InternationalTournamentsPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHeading="Want your bench ready for an international field?"
      ctaBody="Our coaches have competed and adjudicated at the international level, and our judged rounds train to the standard those tournaments use."
      lede={
        <p>
          World Schools is the only high-school format with a genuinely global
          circuit, and most American families have no idea how much of it is
          open to them. This guide splits the international calendar into its
          two very different halves: the <strong>championships</strong>, where
          entry belongs to national teams, and the <strong>opens</strong>,
          where any school or club bench with three debaters and a plan can
          register. Every event below was verified against its most recent
          edition in July 2026. Statuses change, so treat months as
          &ldquo;typically held&rdquo; and confirm with organizers before
          booking anything.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">The championships: national teams only</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          The summit is the{' '}
          <Ext href="https://www.wsdcdebating.org/">
            World Schools Debating Championships
          </Ext>
          : one team per nation, eight preliminary rounds (four prepared, four
          impromptu), held each July–August in a rotating host country. Recent
          editions were Hanoi 2023 (won by the USA), Belgrade 2024 (Scotland),
          Panama City 2025 (India def. Australia 9–0), and Nairobi in July
          2026, the championship&apos;s first visit to East Africa, with
          Sofia, Bulgaria
          expected for 2027. American students get there exactly one way:{' '}
          <Link href="/usa-debate-team" className="font-semibold text-signal-500 hover:text-signal-600">
            the USA Debate national team
          </Link>
          .
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          Europe mirrors the model with{' '}
          <Ext href="https://idebate.net/what-we-do/EuroSDC">EuroSDC</Ext>, the
          continental championship under WSDC rules (2026 in Skopje; 2027 in
          Parma), and Asia with the <strong>Asia WSDC</strong> in Bangkok.
          Both run national-delegation entry: interesting to follow, not
          enterable from a US school.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">The opens: where a US school team can actually enter</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          These run the same three-speaker, reply-speech, POI format and
          take direct entries from school and club teams. In calendar order:
        </p>
        <div className="mt-6 space-y-0">
          {opens.map((event) => (
            <div key={event.name} className="border-t border-navy-200 py-5">
              <p className="text-xs font-bold uppercase tracking-wider text-signal-500">{event.when}</p>
              <h3 className="mt-1 font-display text-lg font-bold text-navy-900">
                {event.href ? <Ext href={event.href}>{event.name}</Ext> : event.name}
                <span className="ml-2 font-sans text-sm font-normal text-navy-500">· {event.where}</span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{event.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">The watchlist: verify before you book</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Promising events whose current details we could not fully pin down.
          Worth an email, not yet worth a flight booking:
        </p>
        <ul className="mt-5 space-y-3 text-navy-700">
          {watchlist.map((item) => (
            <li key={item.name} className="flex gap-3 border-t border-navy-200 pt-3">
              <span className="leading-relaxed">
                <strong>{item.href ? <Ext href={item.href}>{item.name}</Ext> : item.name}</strong>
                {'. '}
                {item.note}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Famous and international, but not World Schools</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          A warning that saves families real money: several of the world&apos;s
          best-known school debating competitions run <em>different formats</em>.
          The Cambridge Union&apos;s schools competitions and ICYD are
          two-person British Parliamentary-style events; Canada&apos;s Hart
          House and McGill high-school tournaments run BP and Canadian
          Parliamentary; Hanoi&apos;s Asian Schools Debating Championship uses
          Asian Parliamentary. All excellent; none of them World Schools. If
          your season goal is WS development (or a{' '}
          <Link href="/blog/world-schools-debate-tournaments" className="font-semibold text-signal-500 hover:text-signal-600">
            TOC bid back home
          </Link>
          ), check the format line in the invite before anything else.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Making it work from the US</h2>
        <ol className="mt-5 space-y-4">
          {[
            ['Start online.', 'Doxbridge in July, plus the US-hosted online WS events (Penn’s invitational, Harvard’s online division, the NSDA Season Opener), give your bench an international-standard field with zero travel risk.'],
            ['Pick one travel window.', 'December (Zagreb), January (Istanbul), or July (Prague / Heart of Europe); each sits in a natural gap in the US season. One well-chosen trip beats three rushed ones.'],
            ['Email the organizers early.', 'The opens are run by debate societies and schools, not conference companies. Registration caps are real (Zagreb closes in October), responses are personal, and hybrid or composite teams are often negotiable.'],
            ['Train to the judging you’ll meet.', 'International pools apply the ordinary-intelligent-voter standard strictly: style-heavy, jargon-averse. A season of judged rounds against that standard is the actual preparation.'],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4 border-t border-navy-200 pt-4">
              <span className="font-display text-2xl font-bold text-signal-500">{i + 1}</span>
              <p className="leading-relaxed text-navy-700"><strong>{title}</strong> {body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 leading-relaxed text-navy-700">
          For the domestic half of the calendar (the bid circuit, state
          championships, and NSDA Nationals), see{' '}
          <Link href="/blog/world-schools-debate-tournaments" className="font-semibold text-signal-500 hover:text-signal-600">
            the full tournament map
          </Link>
          .
        </p>
      </section>
    </BlogPostShell>
  );
}
