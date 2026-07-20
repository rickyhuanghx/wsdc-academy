import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { PrintButton } from '@/components/PrintButton';
import { Sheet, SheetSection, Field, FieldRow, SubBlock } from '@/components/CheatSheet';

export const metadata: Metadata = {
  title: 'First Speaker Cheat Sheet: Printable World Schools Debate Template',
  description:
    'A free printable cheat sheet for the first speaker in World Schools Debate: introduction framing, set-up, definitions, team stance, speaker split, winning metric, and two fully structured arguments.',
  alternates: { canonical: '/resources/first-speaker-cheat-sheet' },
  openGraph: {
    title: 'First Speaker Cheat Sheet (World Schools Debate)',
    description: 'Fill this in during prep and your first speech is already organized. Free and printable.',
    url: '/resources/first-speaker-cheat-sheet',
    type: 'article',
  },
};

function ArgumentBlock({ n }: { n: number }) {
  return (
    <SheetSection label={`Argument ${n}`}>
      <Field label="Tagline (short, memorable title)" />
      {[1, 2, 3].map((m) => (
        <SubBlock key={m} label={`Mechanism ${m}`}>
          <Field label="Reasoning: why is this true?" lines={2} />
          <Field label="Example / evidence" lines={1} />
        </SubBlock>
      ))}
      <SubBlock label="Impact & weighing">
        <Field label="Impact: depth and scale of what follows" lines={2} />
        <Field label="Weighing vs. the other side" lines={2} />
      </SubBlock>
    </SheetSection>
  );
}

export default function FirstSpeakerCheatSheetPage() {
  return (
    <>
      <ArticleJsonLd
        title="First Speaker Cheat Sheet: Printable World Schools Debate Template"
        description="A printable prep-room template covering the first speaker's full job: framing, set-up, two structured arguments, and the caseline."
        url="/resources/first-speaker-cheat-sheet"
        datePublished="2026-07-09"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Resources', href: '/resources' },
          { name: 'First Speaker Cheat Sheet', href: '/resources/first-speaker-cheat-sheet' },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="print-hide">
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/resources" className="hover:text-signal-600">Resources</Link> · Cheat sheet
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            First Speaker cheat sheet
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            The first speaker builds the house everyone else lives in: definitions,
            stance, the split, the metric, and the first two arguments. This
            printable sheet walks through every required element in order. Fill
            it in during the prep hour and your speech structure is done before
            you stand up.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <PrintButton />
            <span className="text-sm text-navy-500">Prints clean. Page chrome is stripped automatically.</span>
          </div>
        </header>

        <div className="mt-10">
          <Sheet title="First Speaker / Leader" subtitle="World Schools Debate · fill in during prep, deliver in order">
            <SheetSection
              label="Introduction"
              hint="one rhetorical device: historical example · emotional appeal · logical link"
            >
              <Field label="Opening frame: how do we make the judge see the debate our way?" lines={2} />
            </SheetSection>

            <SheetSection label="Set-up">
              <Field label="Key definitions (only if genuinely unclear)" lines={2} />
              <Field label="Trade-off / core tension in the debate" lines={2} />
              <Field label="Team stance (We believe that…)" lines={1} />
              <FieldRow>
                <Field label="Speaker 1 will argue…" lines={2} />
                <Field label="Speaker 2 will argue…" lines={2} />
              </FieldRow>
              <Field label="Winning metric: how should the judge decide who wins?" lines={1} />
            </SheetSection>

            <ArgumentBlock n={1} />
            <ArgumentBlock n={2} />

            <SheetSection label="Conclusion">
              <Field label="Summary of what we have proven" lines={2} />
              <Field label="Final framing / caseline (the sentence your whole bench repeats)" lines={1} />
            </SheetSection>
          </Sheet>
        </div>

        <section className="print-hide mt-12">
          <h2 className="text-2xl font-bold text-navy-900">How to use this sheet</h2>
          <ol className="mt-6 space-y-4">
            {[
              ['Set-up before arguments.', 'Judges reward first speeches that make the debate easy to follow. If your definitions, stance, and metric are clear in the first ninety seconds, everything after lands harder.'],
              ['Three mechanisms is a target, not a quota.', 'Two fully reasoned mechanisms with sharp examples beat three thin ones. Never deliver a mechanism you cannot explain in your own words.'],
              ['The caseline is the whole team’s job.', 'Write one sentence that captures your side of the debate. Your second and third speakers should be able to end their speeches with the same line.'],
              ['The metric is your quiet weapon.', 'Telling the judge how to decide the round, then winning on that metric, is the single most strategic thing a first speaker can do.'],
            ].map(([title, body], i) => (
              <li key={title} className="flex gap-4 border-t border-navy-200 pt-4">
                <span className="font-display text-2xl font-bold text-signal-500">{i + 1}</span>
                <p className="leading-relaxed text-navy-700">
                  <strong>{title}</strong> {body}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-8 leading-relaxed text-navy-700">
            New to the format? Start with{' '}
            <Link href="/what-is-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
              what World Schools Debate is
            </Link>{' '}
            and{' '}
            <Link href="/world-schools-debate-judging" className="font-semibold text-signal-500 hover:text-signal-600">
              how the 40/40/20 judging works
            </Link>
            . Then grab the sheets for your teammates:{' '}
            <Link href="/resources/second-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
              second speaker
            </Link>{' '}
            and{' '}
            <Link href="/resources/third-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
              third speaker
            </Link>
            . For the full walk-through of the role, read the{' '}
            <Link href="/blog/first-speaker-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
              first speaker guide
            </Link>
            .
          </p>
        </section>

        <div className="print-hide mt-14 bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">The template is the easy part.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            In our judged practice rounds, first speakers get written feedback on
            exactly these elements: set-up, mechanization, and framing.
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
