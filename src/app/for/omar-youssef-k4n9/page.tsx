import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getProgramBySlug } from '@/data/programs';
import { getCoachBySlug } from '@/data/coaches';
import { ScheduleTimezones } from '@/components/ScheduleTimezones';
import { CONSULTATION_CALENDLY_URL, CONTACT_EMAIL, CONTACT_PHONE, SITE_NAME, WHATSAPP_URL } from '@/lib/site';

// Private proposal page for one family. Shared by direct link only: the /for
// layout sets noindex/nofollow, next.config adds an X-Robots-Tag header, and
// this route is deliberately absent from sitemap.ts, llms.txt, and every menu.

export const metadata: Metadata = {
  title: 'A 10-week public speaking plan for Omar',
  description: 'Private coaching proposal prepared for the Youssef family.',
  openGraph: { title: `A 10-week public speaking plan for Omar | ${SITE_NAME}` },
};

const STUDENT = { name: 'Omar Youssef', first: 'Omar', age: 9 };
const PARENT = 'Shatha';
const PREPARED_ON = 'September 8, 2026';

// Stripe invoice FQHOPHOF-0001 (HK account), finalized 2026-09-08: $1,250 list,
// 20% early-bird coupon, $1,000 due September 15, 2026.
const INVOICE = {
  number: 'FQHOPHOF-0001',
  listPrice: 1250,
  discountPercent: 20,
  discount: 250,
  total: 1000,
  hours: 10,
  dueLabel: 'September 15, 2026',
  hostedUrl:
    'https://invoice.stripe.com/i/acct_1TMjTUL1Pf2G27AU/live_YWNjdF8xVE1qVFVMMVBmMkcyN0FVLF9WRGxmdzZvM09hOXhCM0JUWUd2MnhNNW40ZWVQc2k4LDE3OTM5NTkwNg0200duhW58lN?s=ap',
  pdfUrl:
    'https://pay.stripe.com/invoice/acct_1TMjTUL1Pf2G27AU/live_YWNjdF8xVE1qVFVMMVBmMkcyN0FVLF9WRGxmdzZvM09hOXhCM0JUWUd2MnhNNW40ZWVQc2k4LDE3OTM5NTkwNg0200duhW58lN/pdf?s=ap',
};

const PARTS = [
  { id: 'coach', n: '01', label: 'Your coach' },
  { id: 'curriculum', n: '02', label: 'The 10-week curriculum' },
  { id: 'payment', n: '03', label: 'Payment' },
  { id: 'next', n: '04', label: 'What comes next' },
];

// What the family told us on the callback form (September 1, 2026).
const GOALS = ['Public speaking', 'Confidence', 'Listening skills', 'Communication', 'Answering questions from an audience'];

// 60-minute session shape, the same every week so Omar knows what is coming.
const SESSION_SHAPE = [
  { time: '0:00', title: 'Warm-up game', detail: 'Ten minutes of voice or body games (tongue twisters, one-word stories, statue-to-speaker) so he is already talking before the real work starts.' },
  { time: '0:10', title: 'Skill of the week', detail: 'One idea, taught directly with a demonstration by Netra, then named so Omar can use the word himself.' },
  { time: '0:25', title: 'Practice with coaching', detail: 'Omar speaks, gets one correction, and goes again. He spends most of the hour on his feet rather than listening to Netra talk.' },
  { time: '0:50', title: 'Feedback and home task', detail: 'One thing he did well, one thing to work on, and a five-minute daily task for the week.' },
];

interface Week {
  n: number;
  title: string;
  focus: string;
  inSession: string;
  homeTask: string;
}

const WEEKS: Week[] = [
  {
    n: 1,
    title: 'Hello, audience',
    focus: 'Getting comfortable, and learning who a speech is for',
    inSession:
      'A one-minute ice-breaker speech (three things about me), then the speaker-listener-message-feedback loop explained in nine-year-old terms. Netra makes clear from the first minute that mistakes are part of practising.',
    homeTask: 'Tell a family member one thing about the day in exactly three sentences.',
  },
  {
    n: 2,
    title: 'The voice toolbox',
    focus: 'Volume, speed, pitch, and tone',
    inSession:
      'Belly breathing, then a short poem read four ways (loud, slow, happy, serious). Omar hears how the same words change meaning with the delivery, and learns to fill a big room by projecting rather than shouting.',
    homeTask: 'Read the same poem to someone at home in two different voices.',
  },
  {
    n: 3,
    title: 'Body talks',
    focus: 'Posture, still feet, eye contact, hands that help',
    inSession:
      'Mirror games and a statue-to-speaker drill. Omar picks three eye-contact anchors in the room and practises moving between them while telling a short story.',
    homeTask: 'One minute of show-and-tell in front of a mirror, every day.',
  },
  {
    n: 4,
    title: 'Show and tell, with a shape',
    focus: 'Opening, body, closing',
    inSession:
      'A favourite-object speech built on a three-part signpost. Omar learns a simple hook to open with and a one-line ending that tells the audience he is finished.',
    homeTask: 'Plan a second object speech on an index card.',
  },
  {
    n: 5,
    title: 'Tell a story',
    focus: 'Beginning, middle, end, and character voices',
    inSession:
      'A two-minute retelling of a favourite story or a true one from school, with a hook, a problem, and a payoff. Character voices bring the voice toolbox back into play.',
    homeTask: 'Record the story on a phone and watch it back once, looking for the three anchors.',
  },
  {
    n: 6,
    title: 'Think on your feet',
    focus: 'Impromptu answers with a structure',
    inSession:
      'Table-topics style: fun surprise questions answered in thirty seconds, growing to a minute, using the PREP pattern (Point, Reason, Example, Point). This is the first skill that carries straight over into debate.',
    homeTask: 'Family asks two surprise questions at dinner; Omar answers with a point and a reason.',
  },
  {
    n: 7,
    title: 'Teach us something',
    focus: 'A how-to speech with a prop',
    inSession:
      'Omar teaches Netra to do something he is good at (a game, a recipe, a trick) in clear steps with one prop or drawing. Transitions (first, next, finally) get drilled here.',
    homeTask: 'Choose a topic he cares about for the persuasion speech in week 9.',
  },
  {
    n: 8,
    title: 'Listen, then answer',
    focus: 'Active listening and handling questions from an audience',
    inSession:
      'This is the week you asked about. Omar learns to repeat a question back, answer it with a reason, and stay calm when the question is a hard one. He also asks questions of a speech Netra gives and practises giving a kind, specific compliment.',
    homeTask: 'Watch a three-minute speech by another child and write down one thing it did well.',
  },
  {
    n: 9,
    title: 'Persuade me',
    focus: 'A short persuasive speech, plus questions afterwards',
    inSession:
      'A "why everyone should..." speech with two reasons and an example, then a friendly disagreement from Netra that Omar has to answer politely. Everything from weeks 1 to 8 gets used at once.',
    homeTask: 'Rehearse the showcase speech twice, once for a mirror and once for a person.',
  },
  {
    n: 10,
    title: 'Showcase',
    focus: 'A prepared speech, recorded for the family',
    inSession:
      'A two- to three-minute prepared speech with questions at the end, recorded so you can keep it. Netra then writes a progress report against the five skills below and a recommendation for the next step.',
    homeTask: 'None. Watch the recording together and celebrate.',
  },
];

const RUBRIC = [
  { skill: 'Voice', detail: 'Clear, loud enough for the room, and varied', later: 'Style' },
  { skill: 'Body', detail: 'Eye contact, posture, purposeful hands', later: 'Style' },
  { skill: 'Structure', detail: 'An opening, a middle in order, and a real ending', later: 'Strategy' },
  { skill: 'Ideas', detail: 'Reasons, examples, and stories that support the point', later: 'Content' },
  { skill: 'Audience', detail: 'Listens to questions and answers them with a reason', later: 'Strategy' },
];

const INCLUDED = [
  'Ten private 60-minute sessions with Netra over ten weeks, on Zoom',
  'Weekend slots (Riyadh time), fixed with Netra before the first session',
  'A short written note after every session: what went well, what to work on, the home task',
  'The five-skill progress rubric, scored weekly and shared with you',
  'A recorded showcase speech in week 10 and a written progress report',
  'Access to the printable resource library on wsdcacademy.com',
];

function usd(n: number) {
  return `$${n.toLocaleString('en-US')}`;
}

export default function OmarProposalPage() {
  const netra = getCoachBySlug('netra-easwaran');
  const foundation = getProgramBySlug('foundations');
  const juniorTrack = foundation?.tracks?.filter((t) => t.band === 'Junior') ?? [];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-300">
            Private proposal · Prepared {PREPARED_ON}
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            A 10-week public speaking plan for {STUDENT.first}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-navy-100">
            Dear {PARENT}, thank you for the call last week. This page sets out what we
            propose for {STUDENT.name}: who will coach him, what the ten weeks cover, what it
            costs, and what he could move on to afterwards.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-navy-700 pt-8 sm:grid-cols-4">
            {[
              ['Student', `${STUDENT.name}, age ${STUDENT.age}`],
              ['Format', '10 × 60 min, private, online'],
              ['Timing', 'Weekends, Riyadh time'],
              ['Coach', 'Netra Easwaran, Yale'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-navy-400">{k}</dt>
                <dd className="mt-1 text-sm font-medium text-white">{v}</dd>
              </div>
            ))}
          </dl>

          <nav aria-label="Parts of this proposal" className="mt-10">
            <ol className="grid gap-2 sm:grid-cols-4">
              {PARTS.map((p) => (
                <li key={p.id}>
                  <a
                    href={`#${p.id}`}
                    className="block rounded-sm border border-navy-700 px-4 py-3 text-sm transition hover:border-navy-400 hover:bg-navy-800"
                  >
                    <span className="font-mono text-xs text-signal-300">{p.n}</span>
                    <span className="ml-3 font-semibold">{p.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* ── What you told us ─────────────────────────────────── */}
      <section className="border-b border-navy-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400">
            What you told us you want for {STUDENT.first}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <li
                key={g}
                className="rounded-sm border border-navy-200 bg-cream px-3 py-1.5 text-sm font-medium text-navy-800"
              >
                {g}
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-navy-600">
            Each week below works on at least one of these. Answering questions from an
            audience gets a week of its own (week 8), and after that every speech he gives ends
            with questions.
          </p>
        </div>
      </section>

      {/* ── Part 1: Coach ────────────────────────────────────── */}
      <section id="coach" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="font-mono text-sm text-signal-500">01</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
            Your coach: Netra Easwaran
          </h2>

          <div className="mt-10 grid gap-10 md:grid-cols-[280px_1fr]">
            <div>
              {netra && (
                <div className="relative aspect-square overflow-hidden rounded-sm border border-navy-100">
                  <Image
                    src={netra.image}
                    alt={`${netra.name}, ${netra.role} at ${SITE_NAME}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="mt-5 flex items-center gap-3 border-t border-navy-100 pt-5">
                <Image
                  src="/images/logos/yale.webp"
                  alt="Yale University logo"
                  width={152}
                  height={160}
                  className="h-12 w-auto object-contain mix-blend-multiply"
                />
                <div>
                  <p className="text-sm font-semibold text-navy-900">Yale University</p>
                  <p className="text-xs text-navy-500">Yale Debate Association</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-lg leading-relaxed text-navy-800">
                Netra is a student at Yale University, where she debates with the Yale Debate
                Association and helps run the Tournament of Champions. She has a strong record on
                the APDA circuit, the American university parliamentary league, and has reached
                late elimination rounds at multiple tournaments, including the Harvard Invitational.
              </p>
              <p className="mt-4 leading-relaxed text-navy-700">
                Outside her own competing, Netra directs World Scholar&apos;s Cup programs, where
                many of the students are {STUDENT.first}&apos;s age, and she served as
                Director-General of Yale Model United Nations. She is also President of the Yale
                International Relations Association. At {SITE_NAME} she teaches the Junior
                World Schools Foundation class, which is the class we recommend for {STUDENT.first}
                {' '}after this plan (part 4).
              </p>

              <ul className="mt-8 space-y-3 border-t-2 border-navy-900 pt-6">
                {[
                  'Yale University student, Yale Debate Association',
                  'Helps run the Tournament of Champions at Yale',
                  'Strong record on the APDA circuit; late elimination rounds at the Harvard Invitational',
                  'Directs World Scholar\'s Cup programs for younger students',
                  'Director-General, Yale Model United Nations',
                  'President, Yale International Relations Association',
                ].map((c) => (
                  <li key={c} className="flex gap-3 text-sm text-navy-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-signal-500" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-sm border border-navy-100 bg-cream p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
                  Why Netra for a nine-year-old
                </p>
                <p className="mt-2 text-sm leading-relaxed text-navy-700">
                  Most debate coaches are used to teenagers. Netra&apos;s World Scholar&apos;s Cup
                  work means she spends much of her coaching time with children of {STUDENT.first}&apos;s
                  age, and her own competing at Yale means she knows which habits matter later.
                  Expect games and some silliness in the first ten minutes of each session, and
                  very specific corrections after that.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Part 2: Curriculum ───────────────────────────────── */}
      <section id="curriculum" className="scroll-mt-20 border-y border-navy-100 bg-cream">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="font-mono text-sm text-signal-500">02</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
            The 10-week curriculum
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-navy-700">
            One skill a week, and every session ends with {STUDENT.first} on his feet giving a
            short speech. The early weeks are about comfort, voice, and body. The middle weeks add
            structure and thinking on his feet. The last weeks deal with an audience and end with
            a recorded showcase.
          </p>

          {/* Session shape */}
          <div className="mt-10 rounded-sm border border-navy-100 bg-white p-6">
            <h3 className="font-display text-xl font-semibold text-navy-900">
              What one 60-minute session looks like
            </h3>
            <ol className="mt-5 divide-y divide-navy-100">
              {SESSION_SHAPE.map((s) => (
                <li key={s.time} className="grid gap-2 py-4 sm:grid-cols-[64px_180px_1fr]">
                  <span className="font-mono text-sm text-signal-500">{s.time}</span>
                  <span className="font-semibold text-navy-900">{s.title}</span>
                  <span className="text-sm leading-relaxed text-navy-600">{s.detail}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Weeks */}
          <ol className="mt-10 space-y-4">
            {WEEKS.map((w) => (
              <li key={w.n} className="rounded-sm border border-navy-100 bg-white p-6">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-3xl font-semibold text-signal-500">
                    {String(w.n).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-navy-900">{w.title}</h3>
                    <p className="mt-0.5 text-sm text-navy-500">{w.focus}</p>
                  </div>
                </div>
                <dl className="mt-4 grid gap-4 border-t border-navy-100 pt-4 md:grid-cols-[1fr_1fr]">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-navy-400">In the session</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-navy-700">{w.inSession}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-navy-400">Home task (5 minutes a day)</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-navy-700">{w.homeTask}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>

          {/* Rubric */}
          <div className="mt-10 rounded-sm border border-navy-100 bg-white p-6">
            <h3 className="font-display text-xl font-semibold text-navy-900">
              How progress is measured
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-600">
              Netra scores five skills from 1 to 4 every week and shares the sheet with you, so
              you can see the line move. The right-hand column shows which World Schools judging
              category each skill grows into later.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-navy-900 text-xs uppercase tracking-wide text-navy-500">
                    <th className="py-2 pr-4 font-semibold">Skill</th>
                    <th className="py-2 pr-4 font-semibold">What a 4 looks like</th>
                    <th className="py-2 font-semibold">Becomes, in debate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {RUBRIC.map((r) => (
                    <tr key={r.skill}>
                      <td className="py-3 pr-4 font-semibold text-navy-900">{r.skill}</td>
                      <td className="py-3 pr-4 text-navy-700">{r.detail}</td>
                      <td className="py-3 font-mono text-xs text-signal-500">{r.later}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-navy-500">
            Sequence adapted for one student aged {STUDENT.age} from the National Speech &amp; Debate
            Association&apos;s &quot;Start Here&quot; public speaking course (terminology, voice,
            nonverbal, organised speech, demonstration, persuasion), the Institute for Cultural
            Communicators&apos; Beginning Public Speaking course for ages 6 to 10 (introductions,
            storytelling, limited-preparation speaking, visual aids), and the Toastmasters Youth
            Leadership Program format (ice-breaker speech, table topics, peer evaluation).
          </p>
        </div>
      </section>

      {/* ── Part 3: Payment ──────────────────────────────────── */}
      <section id="payment" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="font-mono text-sm text-signal-500">03</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
            Payment
          </h2>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div>
              <ul className="space-y-3">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex gap-3 text-navy-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal-500" aria-hidden />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-navy-100 pt-6 text-sm leading-relaxed text-navy-600">
                <p>
                  Hours are valid for one year from the date of purchase. If a session has to
                  move, tell Netra 24 hours ahead and we reschedule it rather than count it as used. Refund terms
                  are the standard {SITE_NAME} terms at{' '}
                  <Link href="/refund" className="underline decoration-navy-300 underline-offset-4 hover:text-signal-500">
                    wsdcacademy.com/refund
                  </Link>
                  .
                </p>
                <p className="mt-3">
                  The invoice is issued by Atlantic Ivy Education Limited, the company behind{' '}
                  {SITE_NAME}, and is payable by card through Stripe. Once it is paid, Netra
                  will email you to fix the weekly slot.
                </p>
              </div>
            </div>

            <aside className="rounded-sm border-2 border-navy-900 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-400">
                Invoice {INVOICE.number}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold text-navy-900">
                1-on-1 Public Speaking, {INVOICE.hours} hours
              </h3>
              <dl className="mt-5 divide-y divide-navy-100 text-sm">
                <div className="flex items-baseline justify-between py-2.5">
                  <dt className="text-navy-600">
                    List price ({INVOICE.hours} × {usd(INVOICE.listPrice / INVOICE.hours)})
                  </dt>
                  <dd className="font-mono text-navy-500 line-through">{usd(INVOICE.listPrice)}</dd>
                </div>
                <div className="flex items-baseline justify-between py-2.5">
                  <dt className="text-navy-600">
                    Early-bird discount ({INVOICE.discountPercent}% off)
                  </dt>
                  <dd className="font-mono text-signal-500">&minus;{usd(INVOICE.discount)}</dd>
                </div>
                <div className="flex items-baseline justify-between py-3">
                  <dt className="font-semibold text-navy-900">Total due</dt>
                  <dd className="font-display text-3xl font-semibold text-navy-900">
                    {usd(INVOICE.total)}
                    <span className="ml-1 text-sm font-normal text-navy-500">USD</span>
                  </dd>
                </div>
              </dl>
              <p className="text-xs text-navy-500">
                {usd(INVOICE.total / INVOICE.hours)} an hour. Early-bird price valid through{' '}
                {INVOICE.dueLabel}.
              </p>
              <a
                href={INVOICE.hostedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block rounded-md bg-signal-500 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
              >
                Pay the invoice
              </a>
              <a
                href={INVOICE.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center text-sm text-navy-700 underline decoration-navy-300 underline-offset-4 hover:text-signal-500"
              >
                Download the invoice as a PDF
              </a>
              <p className="mt-4 text-center text-xs text-navy-400">
                Secure payment by Stripe. Card, Apple Pay, or Google Pay.
              </p>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Part 4: What's next ──────────────────────────────── */}
      <section id="next" className="scroll-mt-20 border-t border-navy-100 bg-cream">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="font-mono text-sm text-signal-500">04</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
            What comes next
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-navy-700">
            The ten weeks are a term of their own. If {STUDENT.first} finishes them scoring 3 or
            better on Voice, Structure, and Audience, Netra will recommend moving him into the
            Junior World Schools Foundation class for the following term. In World Schools judging, style is 40% of the
            score, and that is what these ten weeks build. Foundation adds content and strategy,
            the other 60%.
          </p>

          {/* Pathway */}
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                step: 'Now',
                title: '10-week public speaking plan',
                detail: `Private, 1-on-1 with Netra. Voice, body, structure, impromptu, audience Q&A. Ends with a recorded showcase.`,
                current: true,
              },
              {
                step: 'Next term',
                title: 'Junior World Schools Foundation',
                detail: `Small group, ages ${foundation?.tracks?.[0]?.ageRange.min ?? 9} to ${foundation?.tracks?.[0]?.ageRange.max ?? 12}. Speaker roles, building an argument, points of information, monthly judged practice debates. Netra teaches it.`,
                current: false,
              },
              {
                step: 'Later',
                title: 'Competition Team',
                detail: 'From age 11. Tournament preparation and judged rounds with written feedback, for students who want to compete.',
                current: false,
              },
            ].map((s) => (
              <li
                key={s.title}
                className={`rounded-sm border p-6 ${
                  s.current ? 'border-2 border-navy-900 bg-white' : 'border-navy-100 bg-white'
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-signal-500">{s.step}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-navy-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{s.detail}</p>
              </li>
            ))}
          </ol>

          {foundation && (
            <div className="mt-10 rounded-sm border border-navy-100 bg-white p-6">
              <div className="grid gap-8 md:grid-cols-[1fr_300px]">
                <div>
                  <h3 className="font-display text-xl font-semibold text-navy-900">
                    Junior World Schools Foundation, at a glance
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy-700">{foundation.longDescription}</p>
                  <ul className="mt-5 space-y-2">
                    {foundation.outcomes.map((o) => (
                      <li key={o} className="flex gap-3 text-sm text-navy-700">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-signal-500" aria-hidden />
                        {o}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm text-navy-600">
                    Full details:{' '}
                    <Link
                      href={`/programs/${foundation.slug}`}
                      className="font-semibold text-navy-900 underline decoration-navy-300 underline-offset-4 hover:text-signal-500"
                    >
                      {foundation.name}
                    </Link>
                    . Term dates and pricing for the next term are confirmed closer to the time.
                    Families continuing from 1-on-1 coaching hear first.
                  </p>
                </div>
                <dl className="divide-y divide-navy-100 text-sm">
                  {[
                    ['Format', foundation.format],
                    ['Class size', foundation.classSize ?? ''],
                    ['Schedule', foundation.schedule],
                    ['Per term', `${foundation.instruction?.totalHours ?? ''} hrs · ${foundation.instruction?.sessions ?? ''} classes`],
                    ['Current price', `${usd(foundation.pricing.amount)} per term`],
                  ]
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} className="py-2.5">
                        <dt className="text-xs font-semibold uppercase tracking-wide text-navy-400">{k}</dt>
                        <dd className="mt-0.5 text-navy-800">{v}</dd>
                      </div>
                    ))}
                </dl>
              </div>

              {juniorTrack.length > 0 && (
                <div className="mt-8 border-t border-navy-100 pt-6">
                  <p className="text-sm text-navy-600">
                    Current Junior class times, shown in your own time zone (Riyadh is detected
                    automatically; you can change it):
                  </p>
                  <div className="mt-3">
                    <ScheduleTimezones tracks={juniorTrack} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Closing ──────────────────────────────────────────── */}
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Questions before you decide?
          </h2>
          <p className="mt-3 max-w-2xl text-navy-100">
            Reply on WhatsApp or email, or book another call. If you would like {STUDENT.first} to
            meet Netra before paying, we can arrange a 20-minute hello call at no charge.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-signal-500 px-7 py-3.5 text-center font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
            >
              WhatsApp {CONTACT_PHONE}
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="px-2 py-3.5 text-center font-semibold text-white underline decoration-navy-300 underline-offset-4 transition-colors hover:decoration-white"
            >
              {CONTACT_EMAIL}
            </a>
            <a
              href={CONSULTATION_CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-3.5 text-center font-semibold text-white underline decoration-navy-300 underline-offset-4 transition-colors hover:decoration-white"
            >
              Book a call
            </a>
          </div>
          <p className="mt-10 text-xs text-navy-400">
            This page was prepared for the Youssef family and is not listed anywhere on the site.
            Please do not share the link publicly.
          </p>
        </div>
      </section>
    </>
  );
}
