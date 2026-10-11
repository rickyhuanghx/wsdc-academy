import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { ArticleByline } from '@/components/ArticleByline';
import { socialMeta } from '@/lib/pageMeta';
import { SITE_NAME } from '@/lib/site';
import {
  formats,
  ageBands,
  roleCards,
  glossary,
  modelSpeeches,
  adjudication,
  MODEL_MOTION,
} from './content';

// Flagship beginner's guide for "how to debate" / "debate for beginners"
// queries (720 + 90/mo US, KD 2, 2026-08-31 research). Replaces the thin
// router post at /blog/how-to-debate (301 in next.config.ts). Written by the
// program director with the coaching team from the lecture library and the
// owner's WSDC Guide; the model debate uses a real bank motion (id 11773).

const PUBLISHED = '2026-10-11';

export const metadata: Metadata = {
  title: 'How to Debate: A Complete Beginner’s Guide',
  description:
    'How to debate, for beginners: what a round looks like, speaker roles, building arguments, rebuttal, how judges decide, a full model debate and a 4-week plan.',
  alternates: { canonical: '/how-to-debate' },
  ...socialMeta({
    title: 'How to Debate: A Complete Beginner’s Guide',
    description:
      'What a debate is, the formats, speaker roles, arguments, rebuttal, judging, a fully annotated model debate and a four-week practice plan.',
    url: '/how-to-debate',
    type: 'article',
  }),
};

const tocItems = [
  ['what', 'What a debate is'],
  ['formats', 'Formats'],
  ['round', 'A round'],
  ['roles', 'Speaker roles'],
  ['motion', 'Reading the motion'],
  ['argument', 'Arguments'],
  ['rebuttal', 'Rebuttal'],
  ['weighing', 'Weighing'],
  ['pois', 'POIs'],
  ['flowing', 'Flowing'],
  ['delivery', 'Delivery'],
  ['judging', 'Judging'],
  ['model', 'Model debate'],
  ['mistakes', 'Mistakes'],
  ['plan', '4-week plan'],
  ['glossary', 'Glossary'],
  ['faq', 'FAQ'],
];

const glance = [
  ['1 motion', 'A statement to argue for or against. You do not choose your side.'],
  ['2 teams', 'Proposition and Opposition, three speakers each in World Schools.'],
  ['3 skills', 'Build an argument, take one apart, show the judge which matters more.'],
  ['4 weeks', 'Enough to have your first real debate, with the plan at the end of this page.'],
];

const mistakes: { mistake: string; sounds: string; fix: string; drill: string }[] = [
  {
    mistake: 'Labels instead of arguments',
    sounds: '"Our first point is economic reasons."',
    fix: 'Write every claim as a full sentence that could be true or false, then say "because".',
    drill: 'The because test: say "This House would ban homework because..." and finish the sentence aloud. If it sounds silly, it is not an argument yet.',
  },
  {
    mistake: 'The parallel debate',
    sounds: 'Both teams read out prepared points and never touch what the other side said.',
    fix: 'From the second speech onward, respond before you build. Name the point you are answering.',
    drill: 'Pause a recorded first speech after each argument, write a one-line response, then compare it with what the real second speaker said.',
  },
  {
    mistake: 'Answering everything',
    sounds: 'Ten quick denials, none of them explained.',
    fix: 'Pick the two points that would decide the round if left standing. Answer those fully.',
    drill: 'Shrinking rebuttal: answer one argument in 30 seconds, then 20, then 10. The last version is the link that mattered.',
  },
  {
    mistake: 'Catastrophising impacts',
    sounds: '"This will destroy the economy and end childhood."',
    fix: 'End on a concrete, believable consequence for a specific person, compared with the world as it is now.',
    drill: 'Zoom the lens: take "students will be stressed" and rewrite it three times, each time closer to one child’s evening.',
  },
  {
    mistake: 'Reading a script',
    sounds: 'Head down, monotone, lost when the page runs out.',
    fix: 'Speak from an outline on cards: a title, three or four cues per argument, large writing.',
    drill: 'Build one argument in ten minutes on a single index card, then deliver it in two minutes without reading.',
  },
  {
    mistake: 'Running out of time, or far under',
    sounds: 'A rushed third argument, or a two-minute speech that stops at fifty-five seconds.',
    fix: 'Write a time stamp beside each section of your notes and move on when you pass it. Have your last sentence ready.',
    drill: 'Give the same four-minute speech three times with a visible clock. Aim to land the final sentence within ten seconds of time.',
  },
  {
    mistake: 'New arguments in the last speech',
    sounds: 'The third speaker introduces a point nobody has heard before.',
    fix: 'Third speeches answer and compare. New responses and examples are fine; new arguments are not credited.',
    drill: 'Practise the template: "We said this. They said this. We are still right because..."',
  },
  {
    mistake: 'Arguing that the policy could never happen',
    sounds: '"Parliament would never pass this, so we should not ban it."',
    fix: 'Assume the policy happens (debaters call this fiat) and argue that it is a bad idea, not an impossible one.',
    drill: 'For any "This House would" motion, list three things that go wrong once the policy is in place. Never "it will not pass".',
  },
  {
    mistake: 'Freezing on a point of information',
    sounds: 'A long pause, then "I will come back to that" and never does.',
    fix: 'Say yes or no, give one reason, return to your speech. Fifteen seconds.',
    drill: 'POI firing line: speak for 90 seconds while a partner offers a question every 20 seconds. Answer each in one sentence.',
  },
  {
    mistake: 'Speaking too fast',
    sounds: 'Stumbles, restarts, a judge who has stopped writing.',
    fix: 'Pauses are spoken punctuation. A pause after a strong point gives the judge time to write it down.',
    drill: 'Record a two-minute speech on your phone and watch it back once a week. Count the fillers; next week, replace each with a pause.',
  },
];

const weeks: { week: string; goal: string; days: string[]; watch: string }[] = [
  {
    week: 'Week 1',
    goal: 'Understand the round',
    days: [
      'Read the speech-order table on this page until you can recite it. Then read our three speaker-role essays (first, second, third speaker).',
      'Watch one full World Schools round. Keep the speech table beside you and tick off each job as the speaker does it.',
      'Start flowing: draw four columns on a landscape page and take notes on a recorded speech, key claims and taglines only.',
      'Daily, 10 minutes: pick a motion from our beginner topic lists and build one argument on an index card (claim, why it is true, example, so what).',
      'Deliver that one argument out loud to your phone camera in two minutes. Watch it once. Pick one thing to fix tomorrow.',
    ],
    watch: 'A recent WSDC final on the championship’s official channel. Watch the first speakers twice: once for content, once for how they signpost.',
  },
  {
    week: 'Week 2',
    goal: 'Build and rebut',
    days: [
      'Each day, build one argument, then spend one minute refuting your own argument. Which link did you attack? That is where your argument was weak.',
      'Rewrite one rebuttal three times: a weak version (deny), an acceptable version (they say / but / because), a strong version (not true, even if, so what).',
      'Flip, neutralise, mitigate: take one opposing argument and write all three responses. Deliver them in that order with a why-it-matters at the end.',
      'Weigh: take two impacts from any motion and compare them on number, depth, likelihood and duration in sixty seconds.',
      'Watch a recorded first speech, pause after each argument, write your response, then listen to the real second speaker.',
    ],
    watch: 'Any second speech from a championship round. Count how many of the other side’s points the speaker answers and how many they ignore. Good speakers ignore a lot on purpose.',
  },
  {
    week: 'Week 3',
    goal: 'Full speeches, under time',
    days: [
      'Give a complete four-minute first speech from cards: hook, stance, split, two arguments, caseline. Record it.',
      'Give a four-minute second speech against a recorded first speech: two rebuttals, one rebuild, one new argument.',
      'POI firing line with a partner or parent: 90 seconds of speech, a question every 20 seconds, one-sentence answers.',
      'Flow a full recorded round, then give a three-minute third speech from your flow: two clashes, a verdict on each, a weighing line.',
      'Watch your Week 1 recording beside your Week 3 recording. Write down the two biggest differences.',
    ],
    watch: 'A third speech and both reply speeches from the same round. Notice how the third speaker reorganises the debate into questions, and how the reply tells a story.',
  },
  {
    week: 'Week 4',
    goal: 'A real round',
    days: [
      'Set up a mini-debate: one against one or two against two, three- or four-minute speeches, a friend, sibling or parent as judge with our printable ballot.',
      'Debate it. Take at least one point of information. Finish on time.',
      'Get the decision and the reasons out loud, result first. If the judge says "I just found you more persuasive", ask them which argument did it.',
      'Write one lesson in a debate journal, win or lose. One, not ten.',
      'Find structure: a school club, a local league, or a coached class with judged rounds. Solo work gets you to the first debate; other people get you past it.',
    ],
    watch: 'Nothing new. Re-watch your own round if you recorded it, and watch the judge’s reasons more closely than the speeches.',
  },
];

const pageFaqs = [
  {
    question: 'How do I start debating with no experience?',
    answer:
      'Pick one motion, take fifteen minutes to prepare one side, and argue it out loud for three minutes to a phone camera. That single rep teaches more than an afternoon of videos. Then follow the four-week plan on this page: learn the shape of a round, build one argument a day, learn to rebut, then have a real mini-debate with someone judging. After that, join something: a school club, a local league or a coached class, because the fastest improvement comes from debating real opponents and hearing a judge explain the result.',
  },
  {
    question: 'What is the difference between a debate and an argument?',
    answer:
      'A debate has a set motion, assigned sides, timed speeches in a fixed order, and a judge who decides on what was said rather than on their own views. An argument has none of those. The other difference is that in a debate you must respond to the other side: Debating SA puts it simply, debating is public speaking plus rebuttal.',
  },
  {
    question: 'How long does it take to get good at debate?',
    answer:
      'Most students can give a structured speech on an assigned side within two or three sessions. Rebutting the best version of the other side, weighing the round and working as a team take a season or more. The honest marker is the judge’s feedback: when the reasons you lose change from "no response to their case" to "close on the second clash", you are getting good.',
  },
  {
    question: 'Which debate format is best for beginners?',
    answer:
      'The one your school or local circuit runs, because you need opponents. If you have a free choice, World Schools is the easiest to learn: three speakers with clearly defined jobs, no evidence cards, no speed, and judging criteria that are published. British Parliamentary is the standard at universities. In the United States, Public Forum is the most common school format and the easiest to find a partner for.',
  },
  {
    question: 'What age can children start debating?',
    answer:
      'Structured debate with speaker roles works from about age nine or ten, with speeches of two to four minutes and motions about school, animals, screens and sport. Junior World Schools divisions start at under-12. Younger children can play the games (argue a silly motion for one minute, then switch sides) long before they can hold a format.',
  },
  {
    question: 'Do I have to argue for things I disagree with?',
    answer:
      'Yes, roughly half the time, and it is the most useful part. You are not stating your beliefs; you are showing the judge the best case for a position, like an actor playing a character or a lawyer taking a brief. Students who can build the strongest version of a view they dislike understand their own views far better afterwards.',
  },
  {
    question: 'How many arguments should I have in a speech?',
    answer:
      'One or two, fully built. A four-minute junior speech holds one argument done properly. An eight-minute World Schools speech holds two. Three is almost always too many: each one ends up as a label with no mechanism, and the judge credits none of them.',
  },
  {
    question: 'Can I use notes in a debate?',
    answer:
      'Yes, in every format on this page. Use an outline on index cards with large writing, not a full script on an A4 sheet: once you stand up the page is twice as far from your eyes, so you end up talking to the table. Judges in World Schools and the ESU Mace mark down speeches that are read, so write cues, not sentences.',
  },
  {
    question: 'How do you win a debate?',
    answer:
      'By making the judge believe your arguments more than the other side’s, then telling them why yours matter more. In practice that means two or three well-explained arguments rather than many, rebuttal aimed at the strongest version of the opposing case, and a closing comparison the judge can repeat back: "even in their best case, our worst case is better because..." Volume, speed and confidence on their own do not move a trained judge.',
  },
  {
    question: 'How do I handle nerves before a debate?',
    answer:
      'Prepare more than you think you need, then trust the preparation. Breathe out slowly before you stand. Set your notes down, look at the judge, start your timer and only then speak. If you freeze, pause, go back to the last confident sentence and restart; judges barely notice a two-second pause. Treat a hard point of information as one exam question, answer it, and return to your structure. Nerves fade with repetitions, which is why the practice plan has you speaking every day.',
  },
  {
    question: 'Is debate good for shy students?',
    answer:
      'Usually, yes, because the structure removes the hardest part of speaking: deciding what to say. A shy student with an assigned side, a speaker role and a card of cues knows exactly what their job is for four minutes. Good coaches start them small (one argument, one minute, from the back of the room) and move forward from there. Many of the best third speakers started as the quietest person in the club.',
  },
  {
    question: 'How do I practise debate alone?',
    answer:
      'Build one argument a day on an index card and deliver it to your phone. Refute your own argument in one minute. Rebut recorded speeches: pause after each argument, respond, then compare with the real speaker. Flow full rounds. Rewrite one weak rebuttal into a strong one. The four-week plan above sequences these. Solo work builds the skills; you still need real rounds to learn to use them under pressure.',
  },
  {
    question: 'What should I watch to learn debate?',
    answer:
      'Full rounds with the judge’s decision, not highlight clips. World Schools finals and the World Universities championship finals are the best filmed. Watch with a job: track one speaker role, count rebuttals, or flow the round and then give your own third speech before hearing the real one. Skip videos about "destroying" people in arguments; they teach the opposite of what judges reward.',
  },
];

function L({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-signal-500 hover:text-signal-600">
      {children}
    </Link>
  );
}

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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-signal-500">{children}</p>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-navy-900">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-10 font-display text-xl font-semibold text-navy-900">{children}</h3>;
}

function P({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`mt-5 leading-relaxed text-navy-700 ${className}`}>{children}</p>;
}

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 border-l-4 border-signal-500 bg-white px-6 py-5">
      <h3 className="font-display text-lg font-semibold text-navy-900">{title}</h3>
      <div className="mt-2 leading-relaxed text-navy-700">{children}</div>
    </div>
  );
}

function Section({
  id,
  cream = false,
  wide = false,
  children,
}: {
  id: string;
  cream?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-32 ${cream ? 'border-y border-navy-100 bg-cream' : 'bg-white'}`}
    >
      <div className={`mx-auto ${wide ? 'max-w-5xl' : 'max-w-3xl'} px-4 py-16 sm:px-6 lg:px-8`}>
        {children}
      </div>
    </section>
  );
}

export default function HowToDebatePage() {
  const team = `${SITE_NAME} coaching team`;
  return (
    <>
      <ArticleJsonLd
        title="How to Debate: A Complete Beginner’s Guide"
        description="A beginner’s guide to debating: what a debate is, the formats, speaker roles, how to build and rebut arguments, how judges decide, an annotated model debate and a four-week practice plan."
        url="/how-to-debate"
        datePublished={PUBLISHED}
        image="/images/student-speech-competition.jpg"
        contributor={team}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'How to debate', href: '/how-to-debate' },
        ]}
      />
      <FAQJsonLd faqs={pageFaqs} />

      {/* Hero */}
      <section className="relative bg-navy-950 text-white">
        <Image
          src="/images/student-speech-competition.jpg"
          alt="A student delivering a speech to a full classroom at a competition"
          fill
          sizes="100vw"
          className="object-cover object-[center_40%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/85 to-navy-950/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 text-xs font-semibold uppercase tracking-[0.15em] text-navy-300"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2 text-signal-500">/</span>
            <span className="text-navy-200">Learn</span>
          </nav>
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-signal-400">
              The beginner&rsquo;s guide
            </p>
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              How to debate: a complete beginner&rsquo;s guide
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-navy-100">
              Everything a new debater needs in one place: what a debate is,
              how a round runs, what each speaker does, how to build an
              argument and take one apart, how judges decide, a full model
              debate with the judge&rsquo;s reasons, and a four-week plan to
              your first real round. Written by coaches who teach this every
              week, for students from about age nine upward and the parents
              and teachers helping them.
            </p>
            <ArticleByline date={PUBLISHED} variant="onDark" withTeam={team} />
          </div>
        </div>
      </section>

      {/* At a glance */}
      <section className="border-b border-navy-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-px overflow-hidden rounded-sm border border-navy-100 bg-navy-100 sm:grid-cols-2 lg:grid-cols-4">
            {glance.map(([stat, label]) => (
              <div key={stat} className="bg-white p-6">
                <p className="stat font-display text-3xl font-semibold text-navy-900">{stat}</p>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOC */}
      <nav
        aria-label="In this guide"
        className="sticky top-16 z-40 border-b border-navy-100 bg-white/90 backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          <span className="hidden shrink-0 py-1.5 pr-1 text-xs font-semibold uppercase tracking-[0.15em] text-navy-400 sm:block">
            In this guide
          </span>
          {tocItems.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="shrink-0 rounded-sm border border-navy-200 px-3 py-1.5 text-xs font-semibold text-navy-700 transition-colors hover:border-navy-400 hover:text-navy-900"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* 1. What a debate is */}
      <Section id="what">
        <Eyebrow>Start here</Eyebrow>
        <H2>What is a debate?</H2>
        <P className="text-lg">
          A debate is a structured contest of reasoning. Two sides are given a
          statement, called the motion, and assigned to argue for or against
          it. They speak in turn for a fixed time, respond to what the other
          side has said, and a judge decides which side was more persuasive,
          based only on what was said in the room.
        </P>
        <P>
          Three things separate it from an ordinary argument. First, you do not
          choose your side, so the question is never &ldquo;what do you
          believe?&rdquo; but &ldquo;what is the best case for this
          position?&rdquo; Second, you must answer the other side: a speech
          that ignores what the opponents said loses even if every sentence in
          it is true. Third, there is a judge, and the judge is not persuaded
          by volume, confidence or clever words. They are persuaded by reasons
          they can follow and repeat back.
        </P>
        <P>
          That last point is why debate is learnable. Underneath every polished
          speaker is the same small set of moves: state a claim, explain why it
          is true, show why it matters, take apart what the other side claimed,
          and tell the judge how to compare what is left. This guide teaches
          those moves in the order they build on one another, using{' '}
          <L href="/what-is-world-schools-debate">World Schools debate</L>, the
          international three-a-side school format, as the worked example.
          Almost everything transfers to the other formats, and the table
          below shows where they differ.
        </P>

        <H3>Who this guide is for</H3>
        <P>
          Beginners of any age, and the adults helping them. What a good
          beginner looks like changes with age, so here is the honest version.
        </P>
        <div className="mt-6 overflow-hidden rounded-sm border border-navy-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-900 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Age</th>
                <th className="px-4 py-3 font-semibold">What to expect</th>
                <th className="px-4 py-3 font-semibold">What &ldquo;good&rdquo; looks like</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 bg-white text-navy-700">
              {ageBands.map((b) => (
                <tr key={b.band}>
                  <td className="px-4 py-3 align-top">
                    <span className="font-semibold text-navy-900">{b.band}</span>
                    <span className="mt-1 block text-xs text-navy-500">{b.ages}</span>
                  </td>
                  <td className="px-4 py-3 align-top leading-relaxed">{b.expect}</td>
                  <td className="px-4 py-3 align-top leading-relaxed">{b.good}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 2. Formats */}
      <Section id="formats" cream wide>
        <div className="mx-auto max-w-3xl">
          <Eyebrow>The map</Eyebrow>
          <H2>Which debate format will you meet first?</H2>
          <P>
            Every format is the same game with different settings: how many
            speakers, how long they speak, how much preparation time, whether
            you can interrupt, and how the judge scores. The one you will meet
            first depends on where you live. In the United States, school
            debate usually means Public Forum, Lincoln-Douglas or Policy, with
            World Schools growing fast through the NSDA. In the UK, schools
            debate in the ESU Mace and in British Parliamentary at the
            university-run schools competitions. Australia, New Zealand and
            much of Asia use a three-a-side format with no interruptions.
            Internationally, World Schools is the common language.
          </P>
        </div>
        <div className="mt-8 overflow-x-auto rounded-sm border border-navy-200 bg-white">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-navy-900 text-white">
              <tr>
                <th className="px-3 py-3 font-semibold">Format</th>
                <th className="px-3 py-3 font-semibold">Teams</th>
                <th className="px-3 py-3 font-semibold">Speeches</th>
                <th className="px-3 py-3 font-semibold">Preparation</th>
                <th className="px-3 py-3 font-semibold">Interruptions</th>
                <th className="px-3 py-3 font-semibold">Closing speech</th>
                <th className="px-3 py-3 font-semibold">Judged on</th>
                <th className="px-3 py-3 font-semibold">Where</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 text-navy-700">
              {formats.map((f) => (
                <tr key={f.name} className="align-top">
                  <td className="px-3 py-3 font-semibold text-navy-900">{f.name}</td>
                  <td className="px-3 py-3">{f.teams}</td>
                  <td className="px-3 py-3">{f.speeches}</td>
                  <td className="px-3 py-3">{f.prep}</td>
                  <td className="px-3 py-3">{f.pois}</td>
                  <td className="px-3 py-3">{f.closing}</td>
                  <td className="px-3 py-3">{f.judged}</td>
                  <td className="px-3 py-3">{f.where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mx-auto mt-6 max-w-3xl">
          <p className="text-sm leading-relaxed text-navy-600">
            Times are the standard adult or senior settings; junior divisions
            shorten them. We coach World Schools, and we think it is the best
            first format because every speaker has a defined job, there are no
            evidence cards or speed, and the judging criteria are published.
            If you are deciding between World Schools and the big American
            format, our comparison of{' '}
            <L href="/world-schools-vs-public-forum">World Schools and Public Forum</L>{' '}
            goes through every difference.
          </p>
        </div>
      </Section>

      {/* 3. A round */}
      <Section id="round">
        <Eyebrow>The shape</Eyebrow>
        <H2>How does a debate round work?</H2>
        <P>
          Here is a World Schools round from the moment the motion is read.
          Two teams, Proposition and Opposition. Six substantive speeches,
          alternating sides, then two short reply speeches in which the
          opposition goes first so that proposition closes the debate. The
          other formats rearrange the pieces; the pieces are the same.
        </P>
        <div className="mt-8 overflow-hidden rounded-sm border border-navy-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-900 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Speech</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Job in one line</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 bg-white text-navy-700">
              {[
                ['1', 'First Proposition', '8 min', 'Frame the debate, define, set the stance and the split, deliver the first arguments'],
                ['2', 'First Opposition', '8 min', 'State the opposition’s position, answer the proposition case, deliver the first opposition arguments'],
                ['3', 'Second Proposition', '8 min', 'Rebut, rebuild, add one new argument'],
                ['4', 'Second Opposition', '8 min', 'Rebut, rebuild, add one new argument'],
                ['5', 'Third Proposition', '8 min', 'Reorganise the round into two or three clashes and win them; no new arguments'],
                ['6', 'Third Opposition', '8 min', 'The same, for the opposition'],
                ['7', 'Opposition Reply', '4 min', 'A biased summary of why the opposition already won; first or second speaker'],
                ['8', 'Proposition Reply', '4 min', 'The same, and the last word in the debate'],
              ].map(([n, s, t, j]) => (
                <tr key={n}>
                  <td className="px-4 py-3 font-semibold text-navy-900">{n}</td>
                  <td className="px-4 py-3 font-semibold text-navy-900">{s}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{t}</td>
                  <td className="px-4 py-3 leading-relaxed">{j}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-navy-600">
          Junior divisions typically run 4- or 5-minute speeches and 2-minute
          replies. The third speaker never gives the reply; otherwise one person
          would speak twice in a row.
        </p>
        <P>
          Before the first speech, for a prepared motion, the teams arrive
          with a researched case. For an impromptu motion they
          get one hour, in a room with their own printed notes, no internet, no
          phones and no coach. How to spend that hour is covered below.
        </P>
        <P>
          During the speeches, between the first and last minute of each
          substantive one, the other side may stand and offer
          a point of information: a question or short statement, about fifteen
          seconds, which the speaker can accept or wave down. Reply speeches
          are protected; nobody may interrupt them.
        </P>
        <P>
          After the last speech the judge, or a panel of three, decides the result and then explains it to both teams out
          loud, usually in five to ten minutes: result first, then the two or
          three questions the round turned on, what each side established, and
          what the losing team needed. In World Schools each speech also gets
          a score out of 100 against three criteria (Style 40, Content 40,
          Strategy 20), with a 70 as the honest average. The section on{' '}
          <a href="#judging" className="font-semibold text-signal-500 hover:text-signal-600">
            how judges decide
          </a>{' '}
          explains what those numbers reward.
        </P>
      </Section>

      {/* 4. Roles */}
      <Section id="roles" cream wide>
        <div className="mx-auto max-w-3xl">
          <Eyebrow>The jobs</Eyebrow>
          <H2>What does each speaker do?</H2>
          <P>
            Roles exist so that the debate builds. Without them, both teams
            would read out everything they had in the first speech and nothing
            could be saved, answered or compared. Learn the first speaker role
            first, even if you expect to speak second or third: it is where
            you learn what a debate is.
          </P>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {roleCards.map((r) => (
            <div key={r.role} className="rounded-sm border border-navy-200 bg-white p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-signal-500">
                {r.minutes}
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold text-navy-900">{r.role}</h3>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-navy-700">
                {r.jobs.map((j) => (
                  <li key={j} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-500" />
                    <span>{j}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-navy-100 pt-3 text-sm leading-relaxed text-navy-600">
                <span className="font-semibold text-navy-900">Avoid:</span> {r.avoid}
              </p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-3xl">
          <P>
            Each role has a full essay on this site: the{' '}
            <L href="/blog/first-speaker-world-schools-debate">first speaker</L>, the{' '}
            <L href="/blog/second-speaker-world-schools-debate">second speaker</L>, the{' '}
            <L href="/blog/third-speaker-world-schools-debate">third speaker</L> and the{' '}
            <L href="/blog/reply-speech-world-schools-debate">reply speech</L>. For
            rounds, our{' '}
            <L href="/resources/first-speaker-cheat-sheet">printable speaker cheat sheets</L>{' '}
            turn each role into a fill-in checklist you can take to the table.
          </P>
        </div>
      </Section>

      {/* 5. Reading the motion and prep */}
      <Section id="motion">
        <Eyebrow>Before you speak</Eyebrow>
        <H2>How do you read a motion and prepare a case?</H2>
        <P>
          Most debates are won or lost before the first speech, in how the
          team reads the motion and spends its preparation time. Four habits
          matter.
        </P>

        <H3>Know what kind of motion it is</H3>
        <P>
          <strong>Policy motions</strong> (&ldquo;This House would ban
          homework&rdquo;) ask the proposition to describe a change and show
          it works. Proposition should prove there is a problem, say how the
          policy works, show the policy fixes the problem, and name any extra
          benefits. Opposition can deny the problem, defend the world as it is,
          offer a better alternative, or show the policy does more harm than
          good. <strong>Value motions</strong> (&ldquo;This House believes
          that homework does more harm than good&rdquo;) have no policy to
          defend; they turn on which side&rsquo;s standard the judge accepts,
          so say early what the debate should be measured by.{' '}
          <strong>Actor motions</strong> (&ldquo;This House, as a parent,
          would refuse to help with homework&rdquo;) are decided by what that
          actor wants and can do. <strong>Regret motions</strong> ask whether
          the world would be better had something never happened. Our{' '}
          <L href="/resources/motion-types">motion types reference</L> has
          examples of each with the burdens spelled out.
        </P>

        <H3>Assume the policy happens</H3>
        <P>
          On a &ldquo;would&rdquo; motion both sides assume the policy is
          put in place. Debaters call this fiat. The question is
          never &ldquo;could this pass?&rdquo; but &ldquo;should it?&rdquo;.
          One coach we like puts it this way: if the motion is to
          move every dog in the country abroad, the answer is &ldquo;don&rsquo;t
          take my dog&rdquo;, not &ldquo;that&rsquo;s impossible&rdquo;. Fiat
          lets you assume the policy happens; it does not let you assume it is
          done well.
        </P>

        <H3>Define only what is disputed</H3>
        <P>
          Beginners spend three minutes defining words everyone understands.
          Define a term only when the debate changes depending on what it
          means, and pick the meaning an ordinary intelligent person would
          expect from the motion. If the motion is about banning homework,
          nobody needs &ldquo;school&rdquo; defined; they do need to know
          whether reading for pleasure counts.
        </P>

        <H3>Spend the hour in this order</H3>
        <P>
          The World Schools impromptu hour, as the strongest teams run it. The
          numbers scale down: for a fifteen-minute British Parliamentary prep,
          think three minutes alone, seven together, five writing.
        </P>
        <div className="mt-6 overflow-hidden rounded-sm border border-navy-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy-900 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Minutes</th>
                <th className="px-4 py-3 font-semibold">What happens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 bg-white text-navy-700">
              {[
                ['0–10', 'Silence. Each speaker works alone: what does every word mean, why was this motion set, what is the single biggest difference between the two worlds, what must each side prove, what are the two or three likely clashes. Write one-line arguments, not themes. Teams that talk from minute one get steered by the loudest voice.'],
                ['10–30', 'Team discussion, led by one pre-agreed person. Compare readings of the motion. Choose two or three arguments and the model or stance. Agree the caseline: one sentence every speaker will repeat. Assign the split.'],
                ['30–45', 'Write by role. The first speaker writes the whole speech. The second writes their new argument and lists the attacks they expect to answer. The third lists the opposition’s likely case and the responses to each line.'],
                ['45–55', 'Pre-empt. The second and third speakers brief the first on the obvious objections and the first-layer answers, so the first speech is not blindsided by a point of information. Plan which POIs the team wants to ask.'],
                ['55–60', 'Read the case back aloud. Everyone should be able to state the caseline, the arguments and their taglines, why each matters, and the team’s position on the two or three questions the other side will raise.'],
              ].map(([t, w]) => (
                <tr key={t}>
                  <td className="px-4 py-3 font-semibold text-navy-900 whitespace-nowrap">{t}</td>
                  <td className="px-4 py-3 leading-relaxed">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P>
          Our{' '}
          <L href="/resources/prep-hour-planner">printable prep-hour planner</L>{' '}
          lays this out as a single sheet. Practice motions at every level are
          in our <L href="/debate-topics">debate topics lists</L>, and the full{' '}
          <L href="/motions">motion bank</L> has more than twelve thousand
          real tournament motions when you want volume.
        </P>
      </Section>

      {/* 6. Arguments */}
      <Section id="argument" cream>
        <Eyebrow>Skill one</Eyebrow>
        <H2>How do you build a debate argument?</H2>
        <P>
          An argument is not an opinion said confidently. It has four parts,
          and judges are trained to check for each one.
        </P>
        <ol className="mt-6 space-y-4">
          {[
            ['Claim', 'A complete sentence that could be true or false. "Homework teaches less than people assume." Not "education", not "the economic argument".'],
            ['Mechanism', 'Why the claim is true, step by step: who does what, and what follows. "A child who did not understand fractions in class does not understand them better alone at nine at night with nobody to correct them."'],
            ['Impact', 'Why it matters: who is affected, how badly, how many. End on a concrete person, not an abstraction.'],
            ['Comparison', 'Why this impact beats what the other side will offer. One sentence now saves the third speaker a minute later.'],
          ].map(([name, text], i) => (
            <li key={name} className="flex gap-4 rounded-sm border border-navy-200 bg-white p-5">
              <span className="font-display text-3xl font-semibold text-signal-500">{i + 1}</span>
              <div>
                <p className="font-semibold text-navy-900">{name}</p>
                <p className="mt-1 text-sm leading-relaxed text-navy-700">{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <P>
          Coaches teach the same skeleton under different names: assertion,
          reasoning, evidence, impact; or idea, analysis, example, so-what. The
          two tests behind all of them are the ones a judge applies: is this
          true, and is this important? Keep asking &ldquo;why is that
          true?&rdquo; of your own argument until the answer is something
          nobody would dispute, because the other side will attack your
          weakest link, and so will the judge in their head.
        </P>

        <H3>A weak argument and a strong one, same motion</H3>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-sm border border-navy-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy-400">Weak</p>
            <p className="mt-3 text-sm leading-relaxed text-navy-700">
              &ldquo;Our first argument is stress. Homework is really stressful
              for students. Studies show that students are more stressed than
              ever. Stress is bad for mental health. Therefore we should ban
              homework.&rdquo;
            </p>
            <p className="mt-4 border-t border-navy-100 pt-3 text-xs leading-relaxed text-navy-500">
              A label, an assertion, an unnamed study, a generic harm. No
              mechanism connecting homework to the stress, no reason the stress
              outweighs any benefit, nothing the judge can picture.
            </p>
          </div>
          <div className="rounded-sm border border-navy-200 bg-navy-900 p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-signal-300">Strong</p>
            <p className="mt-3 text-sm leading-relaxed text-navy-100">
              &ldquo;Our first argument: homework eats the lesson it was meant
              to support. A twelve-year-old who gets home at four, eats, and
              starts an hour of maths at seven is doing the hardest thinking of
              the day when they are most tired and nobody is there to catch
              the mistake. They finish late, sleep less, and arrive at
              tomorrow&rsquo;s lesson worse at learning than if they had done
              nothing. So the cost goes beyond a bad evening: it is a worse
              school day, every day, for the children who most need the school
              day to work. Whatever practice the opposition claims homework
              gives, it has to outweigh a child who is less able to learn in
              the one place a teacher is present.&rdquo;
            </p>
            <p className="mt-4 border-t border-white/15 pt-3 text-xs leading-relaxed text-navy-200">
              A claim that could be false, a mechanism the judge can follow
              with a real child in it, an impact compared with the alternative,
              and a line that tells the judge what the other side must beat.
            </p>
          </div>
        </div>

        <H3>Talk about people, not policies</H3>
        <P>
          The fastest way to make a mechanism believable is to describe how a
          specific person behaves: what the tired twelve-year-old does, what
          the teacher does when half the class has not done the work, what the
          parent who works evenings does. Coaches call this characterisation.
          Do not jump from &ldquo;people will be unhappy&rdquo; to
          &ldquo;riots&rdquo;; narrate the steps. And split groups: not every
          student is harmed by homework, but a large group plainly is, and a
          large group is enough.
        </P>

        <H3>How much evidence do you need?</H3>
        <P>
          It depends on the format, and most online guides get this wrong. In
          World Schools and British Parliamentary, judges cannot check your
          statistics and are told not to use their own expertise, so a precise
          number you half-remember is worth less than a mechanism they can
          follow and one well-chosen example. Give trends and ranges
          (&ldquo;roughly a fifth&rdquo;), never invented decimals, and never
          make anything up: a judge who catches one fabricated figure stops
          believing the rest. In American Public Forum, Lincoln-Douglas and
          Policy, the opposite rules apply: judges expect quoted evidence with
          sources, and an argument without a card is an assertion. Learn which
          world you are in before your first tournament. The full method, with
          a second worked example, is in{' '}
          <L href="/blog/how-to-build-a-debate-argument">how to build a debate argument</L>.
        </P>
      </Section>

      {/* 7. Rebuttal */}
      <Section id="rebuttal">
        <Eyebrow>Skill two</Eyebrow>
        <H2>How do you rebut in a debate?</H2>
        <P>
          Rebuttal is where beginners separate from everyone else, because
          most people have never been taught to answer an argument rather than
          just disagree with it. A rebuttal has three possible moves, and a
          good one uses two of them.
        </P>
        <ol className="mt-6 space-y-4">
          {[
            ['Not true', 'Show the claim or its mechanism fails. "Homework does not teach responsibility to the child who never starts it; there is nobody there to teach them how."'],
            ['Even if', 'Concede it for the sake of argument and show you still win. "Even if homework builds some responsibility, so do chores, sport and getting to school on time, none of which costs a child sleep."'],
            ['So what', 'Tell the judge what the response does to the round. "So the benefit is unproven and available elsewhere, which means it cannot outweigh the sleep cost we showed you."'],
          ].map(([name, text], i) => (
            <li key={name} className="flex gap-4 rounded-sm border border-navy-200 bg-white p-5">
              <span className="font-display text-3xl font-semibold text-signal-500">{i + 1}</span>
              <div>
                <p className="font-semibold text-navy-900">{name}</p>
                <p className="mt-1 text-sm leading-relaxed text-navy-700">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <H3>The same rebuttal, three ways</H3>
        <P>
          The argument to answer: &ldquo;Homework teaches responsibility,
          because students learn to manage a task with a deadline on their
          own.&rdquo;
        </P>
        <div className="mt-6 space-y-4">
          {[
            ['Weak', 'That’s not true. Homework is just stressful and students hate it, so it doesn’t teach anything.', 'A denial with no reason, followed by a different argument. The judge has no reason to prefer it to what they just heard.'],
            ['Acceptable', 'They say homework teaches responsibility. But most students do it the night before or on the bus, so what it teaches is cramming, not planning.', 'Names the point, gives a reason. It attacks the mechanism (the planning never happens). It stops short of saying what this does to the round.'],
            ['Strong', 'They say homework teaches responsibility. Two answers. First, it is not true for the students they most need it to be true for: the child who never starts has nobody there to teach them to start, so homework records irresponsibility rather than building it. Second, even if it did, so do chores, sport, a part-time job and getting to school on time, none of which costs a child their sleep. So the benefit is both unproven and available elsewhere, and it cannot outweigh the sleep cost we showed you.', 'Not true, even if, so what. Each step is explained, and the last sentence tells the judge how the round now looks.'],
          ].map(([grade, text, why]) => (
            <div key={grade} className="rounded-sm border border-navy-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-signal-500">{grade}</p>
              <p className="mt-3 leading-relaxed text-navy-800">&ldquo;{text}&rdquo;</p>
              <p className="mt-3 border-t border-navy-100 pt-3 text-sm leading-relaxed text-navy-600">{why}</p>
            </div>
          ))}
        </div>

        <H3>Four rules coaches repeat</H3>
        <P>
          Answer the strongest version of what they said. Say &ldquo;even
          in their best case&rdquo; and mean it. The judge has notes of what was
          said; a response to a caricature loses credibility and
          leaves the real argument standing.
        </P>
        <P>
          Aim high. Arguments cascade from context to mechanism to impact,
          so knock out the mechanism and everything below it falls; quibbling with an example or a date changes nothing. If the
          fact they state is true, say so and attack the link: &ldquo;if the
          sky is blue, accept it.&rdquo;
        </P>
        <P>
          Answer what matters rather than everything. Two decisive
          responses beat ten denials. Find the point that would decide the
          round if left standing and spend your time there. A one-line aside
          made at seven minutes forty can be ignored.
        </P>
        <P>
          When you can, climb the ladder. A response can mitigate (their point is smaller than they said), neutralise (it
          does not happen), or flip (it helps your side: a smoking
          ban is also freedom from cancer). Deliver the strongest you honestly
          have first. Do not force a flip; a flip with no mechanism is just a
          slogan. The four-step response structure and where to aim it are in
          our <L href="/blog/debate-rebuttal-guide">rebuttal guide</L>.
        </P>
      </Section>

      {/* 8. Weighing */}
      <Section id="weighing" cream>
        <Eyebrow>Skill three</Eyebrow>
        <H2>How do you weigh arguments?</H2>
        <P>
          At the end of a close round both teams have arguments standing. The
          side that wins is usually the one that told the judge how to compare
          them. Coaches say it plainly: it is unreliable to expect the judge
          to do the direct comparison for you. You do not have to prove their
          case is worth nothing and yours is worth everything; you have to
          prove yours is better.
        </P>
        <P>
          Four questions do most of the work for beginners. <strong>How many</strong>{' '}
          people are affected? <strong>How much</strong> does it change each
          life? <strong>How long</strong> does it last, and can it be undone?{' '}
          <strong>How likely</strong>{' '}is it to happen at all? A small group
          suffering something acute can outweigh a large group mildly
          inconvenienced, and an impact with a one-in-twenty chance is usually
          not worth the judge&rsquo;s time. Pick the two comparisons that
          favour you and say them out loud in every speech, including the early
          ones.
        </P>
        <Callout title="The sentence every third speaker needs">
          &ldquo;Even if you believe everything they said, our worst case beats
          their best case, because...&rdquo; It concedes nothing real, it tells
          the judge how to decide if they are torn, and it forces you to name
          the comparison. The full method, including how a first speaker sets
          the metric the round is decided on, is in our essay on{' '}
          <L href="/blog/weighing-in-debate">weighing in debate</L>.
        </Callout>
      </Section>

      {/* 9. POIs */}
      <Section id="pois">
        <Eyebrow>Live interruptions</Eyebrow>
        <H2>How do points of information work?</H2>
        <P>
          In World Schools, British Parliamentary and the Mace, the other side
          may stand during your speech and say &ldquo;point of
          information&rdquo; or &ldquo;on that point&rdquo;. You decide: take
          it (&ldquo;yes, go ahead&rdquo;) or wave it down (&ldquo;no thank
          you&rdquo;). They have about fifteen seconds; your clock keeps
          running; the first and last minute are protected and reply speeches
          cannot be interrupted at all.
        </P>
        <P>
          Take one or two. Take none and the judge marks you down for
          ducking; take four and you have given your speech away.
          Take them at transitions, between arguments, never in the middle of a
          mechanism. If nobody has offered one by minute six, invite one, so
          the judge sees you were willing.
        </P>
        <P>
          Answer in about fifteen seconds: yes or no, one reason, back to
          your speech. If the question contains a premise that already
          fits your case, agree with it and claim it: &ldquo;Yes, we want
          diversity in politics, and we are the side that delivers it.&rdquo;
          Never say &ldquo;I will come back to that&rdquo; unless you will.
        </P>
        <P>
          When you offer one, ask a question rather than making a statement:
          one short challenge, aimed at their strongest argument and at what they are
          saying right now. After a refusal, wait twenty to thirty seconds
          before anyone on your team stands again; constant standing is
          penalised as barracking. How to hunt as a team and how to plan the
          concessions you want is in our essay on{' '}
          <L href="/blog/points-of-information-debate">points of information</L>.
        </P>
      </Section>

      {/* 10. Flowing */}
      <Section id="flowing" cream wide>
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Notes that win rounds</Eyebrow>
          <H2>How do you take notes during a debate?</H2>
          <P>
            Debaters call it flowing: one landscape sheet per side&rsquo;s
            case, folded into columns, one column per speech, so the debate
            reads left to right and a blank cell is a visible concession you
            can point to. Write the other side&rsquo;s taglines, not their
            sentences, and write more about what you are going to say than
            about what they said. Here is the first clash of the model debate
            below, flowed the way a third speaker would keep it.
          </P>
        </div>
        <div className="mt-8 overflow-x-auto rounded-sm border border-navy-200 bg-white">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-navy-900 text-white">
              <tr>
                <th className="px-3 py-3 font-semibold">Prop 1</th>
                <th className="px-3 py-3 font-semibold">Opp 1</th>
                <th className="px-3 py-3 font-semibold">Prop 2</th>
                <th className="px-3 py-3 font-semibold">Opp 2</th>
                <th className="px-3 py-3 font-semibold">For my 3rd</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 font-mono text-xs text-navy-700">
              <tr className="align-top">
                <td className="px-3 py-3">A1 hw teaches little. No teacher @ 9pm → mistakes repeated. Meta-analyses: ~0 primary, small secondary.</td>
                <td className="px-3 py-3">NT: research = clear benefit secondary, maths/lang. Ban covers to 16 → uses 7yo data on 15yo. A1: practice = retrieval w/o teacher → permanent.</td>
                <td className="px-3 py-3">Agree practice matters. EI: best when short + corrected fast = 10-min quiz in class, not 1hr alone. Their mech survives, conclusion doesn&apos;t.</td>
                <td className="px-3 py-3">Class time FIXED. 50 min / 30 kids. Quiz = 1 topic. Behind kid needs more reps → only tutor. Equal time ≠ equal outcome.</td>
                <td className="px-3 py-3 bg-cream">CLASH 1: where + how much practice. They never answered FIXED TIME. [Prop 3 must hit this] Weigh: supervised&gt;unsupervised vs more&gt;less.</td>
              </tr>
              <tr className="align-top">
                <td className="px-3 py-3">A2 cost real: tired → worse next day; family fights; sport/music lost.</td>
                <td className="px-3 py-3">Quantity not existence. 30 min reading ≠ ruined childhood. Limit, not ban. [limits exist already]</td>
                <td className="px-3 py-3">Limits tried 20 yrs, never worked; teacher incentive = set more. Only a ban changes behaviour.</td>
                <td className="px-3 py-3">Why is ban enforced better than limit? Honest teacher loses 20 useful min, dishonest one carries on.</td>
                <td className="px-3 py-3 bg-cream">Enforcement Q unanswered by us ✗. Concede or answer: a ban is checkable by parents; a limit is not.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mx-auto mt-6 max-w-3xl">
          <p className="text-sm leading-relaxed text-navy-600">
            Shorthand teams use: NT (not true), EI (even if), SW
            (so what), arrows for cause, a circle around anything the other
            side dropped. Learn it in steps: flow a friend reading a menu, then
            one recorded speech, then a whole round on video, then live. Keep
            the sheets in speaking order and move each to the back as you
            finish it, so the paper left in your hand tells you the conclusion
            is still to come.
          </p>
        </div>
      </Section>

      {/* 11. Delivery */}
      <Section id="delivery">
        <Eyebrow>Style</Eyebrow>
        <H2>How do you speak well in a debate?</H2>
        <P>
          Style is forty percent of a World Schools score, and in every format
          a judge can only credit what they heard and understood. The
          beginner&rsquo;s version of style has five parts, and none of them
          is &ldquo;be a natural&rdquo;.
        </P>
        <H3>Signpost rigidly first</H3>
        <P>
          &ldquo;Two things to set
          up, then two arguments. First...&rdquo; &ldquo;Moving to my second
          argument, which is...&rdquo; &ldquo;Responding to their point about
          sleep...&rdquo; It sounds mechanical for a month. It is what lets a
          judge, who cannot re-read you like a book, write your speech down.
          Conversational flow comes later and only works on top of it.
        </P>
        <H3>Clarity is the whole job</H3>
        <P>
          Pace, volume, pauses, pronunciation. Rushing causes stumbles and restarts, so by going
          fast you go slower. Pauses are the spoken form of commas and full
          stops, and a pause after a strong line gives the judge time to write
          it. Drop filler words by replacing each one with silence. Ban
          &ldquo;obviously&rdquo;: if it were obvious you would not need to
          spend time on it.
        </P>
        <H3>Cards, not sheets</H3>
        <P>
          A page written sitting down is
          twice as far from your eyes once you stand, so you talk to the
          table. Index cards, few words, large writing, numbered. Speak from an
          outline, never a script. Set the cards down, look at the judge, start
          your timer, then speak. Nothing in your hands.
        </P>
        <H3>Manage the clock</H3>
        <P>
          Write a time beside each section
          of your notes (set-up to 1:00, first argument to 3:30) and move on
          when you pass it. Have your last sentence ready so that when time is
          called you say it, look up and sit. Going well over is penalised;
          finishing a four-minute speech at two minutes is also a fault.
        </P>
        <H3>Nerves are normal, and they shrink with reps</H3>
        <P>
          Breathe out slowly before you stand. If you freeze, pause, go back to your
          last confident sentence and restart; the judge barely notices. Treat
          a hard point of information as one exam question, answer it, and
          return to your structure. Students who speak every day for four
          weeks stop noticing the nerves by week three, which is the point of
          the practice plan below. For the shape of a speech from first word to
          last, see{' '}
          <L href="/blog/how-to-write-a-debate-speech">how to write a debate speech</L>{' '}
          and <L href="/blog/how-to-start-a-debate-speech">how to start one</L>.
        </P>
      </Section>

      {/* 12. Judging */}
      <Section id="judging" cream>
        <Eyebrow>The target</Eyebrow>
        <H2>How do judges decide who won?</H2>
        <P>
          Beginners imagine judging is a vibe. It is a procedure, and knowing
          it changes how you speak. Every trained judge in every format does
          roughly the same five things.
        </P>
        <H3>The judge is an ordinary intelligent voter</H3>
        <P>
          Someone who reads the news and knows the broad facts, with no specialist
          knowledge and no willingness to use what they personally know. They
          decide on what was said in the round, not on what should have been
          said, and not on their own opinion of the motion.
        </P>
        <H3>The judge fills no gaps</H3>
        <P>
          A title is not credited for what
          it might have contained. If you said &ldquo;homework causes
          stress&rdquo; and never explained how, the judge writes down an
          assertion and gives it almost no weight, however true it is. Show
          your work as if it were a maths proof.
        </P>
        <H3>Proven beats asserted, and rebuttal weakens rather than erases</H3>
        <P>
          In a close round the judge strips out every unproven
          claim on both sides and decides on what is left, even if it is
          small. A good rebuttal shrinks an argument; it rarely deletes it, so
          rebuilding what survived still matters. And an unanswered argument
          is not automatically strong: the judge can discount nonsense nobody
          bothered to answer.
        </P>
        <H3>Clashes first, then weighing</H3>
        <P>
          The judge splits the round into two or three questions, follows each exchange
          (argument, response, rebuild, what remains), decides who won each
          question, and then compares the wins: first using the weighing the
          teams gave, then by whether a clear win beats a marginal one. If you
          did not weigh, they weigh for you, by their own lights.
        </P>
        <H3>Judges decline to credit; they do not punish</H3>
        <P>
          A new argument in the third speech is ignored, not penalised. Going over
          time loses the material said after the bell. A contradiction between
          teammates usually means the first version stands and both are
          weakened.
        </P>

        <H3>What the scores mean</H3>
        <P>
          In World Schools each substantive speech is scored 60 to 80 against
          three published criteria: Style (how it was argued, 40), Content
          (what was argued, 40) and Strategy (why it was argued: structure,
          timing, issue choice, handling of POIs, 20). A 70 is a good
          speech, not a failure; a 75 is a speech the judge will still be talking
          about next week. Replies score 30 to 40. The ESU Mace scores each speaker
          out of 40 across four skill sets (organisation and prioritisation,
          listening and response, expression and delivery, reasoning and
          evidence), with written behaviours under each. British Parliamentary
          ranks the four teams instead of scoring criteria. In every case the
          judge then explains the decision out loud, result first.
        </P>
        <P>
          We wrote a full guide to the World Schools criteria and how to
          train for each: <L href="/world-schools-debate-judging">how World Schools judging works</L>.
          If you want to see the decision from the judge&rsquo;s chair, our{' '}
          <L href="/resources/judging-ballot">printable judging ballot</L>{' '}is
          the sheet our coaches use in practice rounds, and judging a
          friend&rsquo;s round is one of the fastest ways to improve your own.
        </P>
      </Section>

      {/* 13. Model debate */}
      <Section id="model" wide>
        <div className="mx-auto max-w-3xl">
          <Eyebrow>Put it together</Eyebrow>
          <H2>A complete model debate, annotated</H2>
          <P>
            No online guide we could find shows a beginner a whole debate with
            the judge&rsquo;s reasons, so here is one. The motion is real; it
            was set at the Korean national championships in 2022. The speeches
            are written to a junior length (a little under three minutes
            spoken) so the whole round fits on one page. Every move a senior
            round would make is here; a senior round would simply make each
            one at greater length. Read the speech, then the notes beside it.
          </P>
          <div className="mt-8 rounded-sm border-l-4 border-signal-500 bg-cream px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-signal-500">The motion</p>
            <p className="mt-2 font-display text-2xl font-semibold text-navy-900">{MODEL_MOTION}</p>
            <p className="mt-2 text-sm text-navy-600">
              Policy motion. Info slide given: homework is a set of tasks assigned by
              teachers to be completed outside the classroom and school hours.
            </p>
          </div>
        </div>

        <div className="mt-12 space-y-12">
          {modelSpeeches.map((s, i) => (
            <article key={s.id} id={`model-${s.id}`} className="scroll-mt-32">
              <div className="mx-auto max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-signal-500">
                  Speech {i + 1} · {s.side}
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-navy-900">
                  {s.speaker}: {s.title}
                </h3>
              </div>
              <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <div className="space-y-4 rounded-sm border border-navy-200 bg-white p-6 leading-relaxed text-navy-800">
                  {s.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
                <aside className="space-y-3">
                  {s.notes.map((n) => (
                    <div key={n.tag} className="rounded-sm border-l-4 border-signal-500 bg-cream px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-signal-500">{n.tag}</p>
                      <p className="mt-1 text-sm leading-relaxed text-navy-700">{n.text}</p>
                    </div>
                  ))}
                </aside>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl rounded-sm border border-navy-200 bg-navy-900 p-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-signal-300">
            The judge&rsquo;s oral adjudication
          </p>
          <p className="mt-3 font-display text-xl font-semibold">{adjudication.result}</p>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-navy-100">
            {adjudication.reasons.map((r, i) => (
              <p key={i}>{r}</p>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-3xl">
          <P>
            Notice what decided it. Not delivery, not the number of points,
            not who sounded more confident: one unanswered mechanism (class
            time is fixed) in the clash both teams agreed mattered most. That
            is what a judge means by &ldquo;the round turned on&rdquo;
            something, and learning to spot it mid-round is the whole job of
            the third speaker. For hundreds more motions at this level, see
            the beginner lists in our <L href="/debate-topics">debate topics</L>{' '}
            and the <L href="/motions/wsdc">archive of every World Championships motion</L>.
          </P>
        </div>
      </Section>

      {/* 14. Mistakes */}
      <Section id="mistakes" cream wide>
        <div className="mx-auto max-w-3xl">
          <Eyebrow>What goes wrong</Eyebrow>
          <H2>The mistakes every beginner makes, and the drill that fixes each</H2>
          <P>
            Coaches see the same ten faults in every first-year class. Each has
            a fix you can apply in your next speech and a drill that makes the
            fix permanent.
          </P>
        </div>
        <div className="mt-8 overflow-x-auto rounded-sm border border-navy-200 bg-white">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="bg-navy-900 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Mistake</th>
                <th className="px-4 py-3 font-semibold">What it sounds like</th>
                <th className="px-4 py-3 font-semibold">The fix</th>
                <th className="px-4 py-3 font-semibold">The drill</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 text-navy-700">
              {mistakes.map((m) => (
                <tr key={m.mistake} className="align-top">
                  <td className="px-4 py-3 font-semibold text-navy-900">{m.mistake}</td>
                  <td className="px-4 py-3 leading-relaxed text-navy-600">{m.sounds}</td>
                  <td className="px-4 py-3 leading-relaxed">{m.fix}</td>
                  <td className="px-4 py-3 leading-relaxed">{m.drill}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mx-auto mt-6 max-w-3xl">
          <p className="text-sm leading-relaxed text-navy-600">
            Fix one or two habits at a time. A full drill menu with a weekly
            routine is in our <L href="/blog/debate-practice">debate practice guide</L>,
            and when the early gains flatten out,{' '}
            <L href="/blog/how-to-get-better-at-debate">how to get better at debate</L>{' '}
            is about breaking the plateau.
          </p>
        </div>
      </Section>

      {/* 15. Four-week plan */}
      <Section id="plan">
        <Eyebrow>Do this</Eyebrow>
        <H2>A four-week plan to your first debate</H2>
        <P>
          Twenty to thirty minutes a day, five days a week, no club required.
          A parent or friend with no debate background can run every step: they
          hold the timer, offer the points of information, and judge with the
          printable ballot. If you already have a club or class, run this
          alongside it; the rounds you get there are the thing the plan is
          building towards.
        </P>
        <div className="mt-8 space-y-6">
          {weeks.map((w) => (
            <div key={w.week} className="rounded-sm border border-navy-200 bg-white p-6">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p className="font-display text-2xl font-semibold text-signal-500">{w.week}</p>
                <h3 className="font-display text-xl font-semibold text-navy-900">{w.goal}</h3>
              </div>
              <ol className="mt-4 space-y-2 text-sm leading-relaxed text-navy-700">
                {w.days.map((d, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-5 shrink-0 font-semibold text-navy-400">{i + 1}</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-navy-100 pt-3 text-sm leading-relaxed text-navy-600">
                <span className="font-semibold text-navy-900">Watch this week:</span> {w.watch}
              </p>
            </div>
          ))}
        </div>
        <Callout title="For parents running this at home">
          You do not need to know debate to judge it. Time the speech on your
          phone. Offer a point of information once per speech by standing up
          and asking one honest question. Afterwards, answer three questions
          out loud, in this order: was it clear to you as a non-expert, was
          the main argument both true and important, and what did they not
          say that you were waiting for. Give the result first, then the
          reasons, then one thing to keep doing. Students only hear the
          criticism after they have heard the praise.
        </Callout>
        <P>
          When the four weeks are done, the thing that moves students fastest
          is a judged round every week with written feedback. That is what a
          coached program is, and our{' '}
          <L href="/online-debate-classes">online debate classes for kids and teens</L>{' '}
          run exactly this loop in small groups, with the{' '}
          <L href="/programs/foundations">Foundation class</L> built for
          students starting from this page.
        </P>
      </Section>

      {/* 16. Glossary */}
      <Section id="glossary" cream wide>
        <div className="mx-auto max-w-3xl">
          <Eyebrow>The words</Eyebrow>
          <H2>Debate terms every beginner meets</H2>
          <P>
            Forty-two terms you will hear in your first month, each in one
            sentence. Every entry has its own link, so a coach or teammate can
            send you straight to one.
          </P>
        </div>
        <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {glossary.map((g) => {
            const id = `term-${g.term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
            return (
              <div key={g.term} id={id} className="scroll-mt-32 border-t border-navy-200 pt-3">
                <dt className="font-semibold text-navy-900">
                  <a href={`#${id}`} className="hover:text-signal-500">
                    {g.term}
                  </a>
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-navy-700">{g.def}</dd>
              </div>
            );
          })}
        </dl>
        <div className="mx-auto mt-8 max-w-3xl">
          <p className="text-sm leading-relaxed text-navy-600">
            The longer <L href="/resources/glossary">World Schools glossary</L>{' '}
            in our resource library covers the competitive vocabulary too.
          </p>
        </div>
      </Section>

      {/* 17. FAQ */}
      <Section id="faq">
        <Eyebrow>Common questions</Eyebrow>
        <H2>Frequently asked questions about learning to debate</H2>
        <div className="mt-8 divide-y divide-navy-200 border-y border-navy-200">
          {pageFaqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="cursor-pointer list-none font-semibold text-navy-900">
                <span className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-navy-900">{faq.question}</h3>
                  <span className="text-signal-500 transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-navy-700">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* 18. Further resources */}
      <Section id="resources" cream>
        <Eyebrow>Keep going</Eyebrow>
        <H2>Where to go next</H2>
        <H3>Printables from this site</H3>
        <P>
          The{' '}
          <L href="/resources/first-speaker-cheat-sheet">speaker cheat sheets</L>{' '}
          (one per role), the{' '}
          <L href="/resources/prep-hour-planner">prep-hour planner</L>, the{' '}
          <L href="/resources/judging-ballot">judging ballot</L> and the{' '}
          <L href="/resources/wsdc-format-quick-reference">format quick reference</L>{' '}
          are all free and designed to be printed and taken to the table. The
          whole library is at <L href="/resources">our resources page</L>.
        </P>
        <H3>Guides worth reading after this one</H3>
        <P>
          The Oxford
          Union&rsquo;s{' '}
          <Ext href="https://www.oxfordschools.net/_files/ugd/3c910b_6779fcae86294ad2b795b1820d809755.pdf">
            Debating at Oxford Schools
          </Ext>{' '}
          (January 2025) is the clearest short explanation of argument quality
          and of how judges think, written for British Parliamentary. The{' '}
          <Ext href="https://www.esu.org/wp-content/uploads/2025/10/Mace-Handbook-2025.pdf">
            ESU Schools&rsquo; Mace handbook
          </Ext>{' '}
          publishes a full mark scheme with the behaviours judges look for
          under each criterion. The Monash Association of Debaters&rsquo;{' '}
          <Ext href="https://monashdebaters.com/s/Training-Guide-V4.pdf">training guide</Ext>{' '}
          is university-level and long, but its appendix on preparing an
          unseen topic is the best written procedure we know. The official{' '}
          <Ext href="https://www.wsdcdebating.org/">World Schools Debating Championships site</Ext>{' '}
          carries the rules and the results back to 1988; our{' '}
          <L href="/wsdc-champions">list of champions by year</L> is drawn from it.
        </P>
        <H3>What to watch</H3>
        <P>
          Full rounds with the decision, not clips. Recent World Schools finals and the World Universities
          championship finals are the best filmed. Watch with a job each time:
          follow one speaker role, count the rebuttals, or flow the round and
          give your own third speech before you hear the real one. Skip
          anything titled &ldquo;how to destroy anyone in an argument&rdquo;;
          it teaches the opposite of what a judge rewards.
        </P>
        <H3>Who wrote this</H3>
        <P>
          This guide was written by{' '}
          <L href="/coaches">Peregrine Beckett</L>, our program director, with
          the {SITE_NAME} coaching team, from the way we teach the first weeks
          of our{' '}
          <L href="/programs/foundations">Foundation class</L> and from a
          library of several hundred recorded coaching lectures from World
          Schools, British Parliamentary and Australian programs. Where coaches
          disagree (how many points of information to take, whether to rebut
          before or after your own arguments in a first opposition speech), we
          have given the beginner-safe answer and said so. If something here
          is unclear, <L href="/contact">tell us</L> and we will fix it.
        </P>
      </Section>

      {/* CTA */}
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold">Learn it in a judged round, not a lecture.</h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-navy-100">
            Our beginner Foundation class teaches exactly this stack, in order,
            with a real practice debate, oral adjudication and written feedback
            every week. Small groups for ages 9 to 16, taught live online.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/consultation"
              className="inline-block rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
            >
              Book a consultation
            </Link>
            <Link
              href="/programs/foundations"
              className="inline-block rounded-sm border border-white/30 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              About the Foundation class
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
