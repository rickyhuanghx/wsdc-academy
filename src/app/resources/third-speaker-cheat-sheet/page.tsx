import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { PrintButton } from '@/components/PrintButton';
import { Sheet, SheetSection, Field, SubBlock } from '@/components/CheatSheet';

export const metadata: Metadata = {
  title: 'Third Speaker (Whip) Cheat Sheet: Printable World Schools Debate Template',
  description:
    'A free printable cheat sheet for the third speaker in World Schools Debate: choosing 2–3 clashes, answering the opposition\'s strongest material, and internal vs. external weighing, with no new arguments.',
  alternates: { canonical: '/resources/third-speaker-cheat-sheet' },
  openGraph: {
    title: 'Third Speaker Cheat Sheet (World Schools Debate)',
    description: 'The whip speech as a clash sheet: their best material, why it falls, and why your case wins the round.',
    url: '/resources/third-speaker-cheat-sheet',
    type: 'article',
  },
};

function ClashBlock({ n }: { n: number }) {
  return (
    <SheetSection label={`Clash ${n}`} hint="name the clash as a question the judge must answer">
      <Field label="The clash (e.g. “Does the policy actually reduce harm?”)" lines={1} />
      <SubBlock label="Their side">
        <Field label="Their strongest remaining material: what do they say?" lines={2} />
        <Field label="Why it does not stand" lines={2} />
      </SubBlock>
      <SubBlock label="Our side">
        <Field label="Internal weighing: why is our case still standing while theirs is not?" lines={2} />
        <Field label="External weighing: why does our worst case beat their best case?" lines={2} />
      </SubBlock>
    </SheetSection>
  );
}

export default function ThirdSpeakerCheatSheetPage() {
  return (
    <>
      <ArticleJsonLd
        title="Third Speaker (Whip) Cheat Sheet: Printable World Schools Debate Template"
        description="A printable clash sheet for the whip speech: 2–3 clashes, responses, and internal vs. external weighing."
        url="/resources/third-speaker-cheat-sheet"
        datePublished="2026-07-09"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Resources', href: '/resources' },
          { name: 'Third Speaker Cheat Sheet', href: '/resources/third-speaker-cheat-sheet' },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="print-hide">
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/resources" className="hover:text-signal-600">Resources</Link> · Cheat sheet
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            Third Speaker cheat sheet
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            The whip does not build new material. Your job is to reorganize
            a messy debate into two or three clashes, show the judge why your
            side wins each one, and weigh the round shut. One rule above all:{' '}
            <strong>no new arguments</strong>. New examples and new responses are
            fine; new substantive material is a role violation judges punish.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <PrintButton />
            <span className="text-sm text-navy-500">Prints clean. Page chrome is stripped automatically.</span>
          </div>
        </header>

        <div className="mt-10">
          <Sheet title="Third Speaker / Whip" subtitle="World Schools Debate · clarify the clashes, win each one, weigh the round">
            <SheetSection
              label="Introduction"
              hint="one rhetorical device: historical example · emotional appeal · logical link"
            >
              <Field label="Opening frame: what has this debate really been about?" lines={2} />
            </SheetSection>

            <ClashBlock n={1} />
            <ClashBlock n={2} />
            <ClashBlock n={3} />

            <SheetSection label="Metrics">
              <Field label="Why should the judge decide the round on our metric?" lines={2} />
            </SheetSection>

            <SheetSection label="Conclusion">
              <Field label="Summary of the round as we have won it" lines={2} />
              <Field label="Final framing / caseline" lines={1} />
            </SheetSection>
          </Sheet>
        </div>

        <section className="print-hide mt-12">
          <h2 className="text-2xl font-bold text-navy-900">How to use this sheet</h2>
          <ol className="mt-6 space-y-4">
            {[
              ['Pick clashes, not arguments.', 'Do not walk through the debate speech by speech. Group everything said into 2–3 questions that decide the round, and spend your time only on those.'],
              ['Track material all round.', 'The whip speech is written during the debate, not before it. Keep this sheet in front of you from the first proposition speech and fill the "they say" boxes live.'],
              ['Weigh twice.', 'Internal weighing proves your case survived and theirs did not. External weighing proves that even in their best world, your impacts matter more. Judges reward whips who do both, explicitly.'],
              ['Concede strategically.', 'You will not win every clash. Position the ones you win as decisive and the ones you lose as marginal. That framing is what the Strategy score rewards.'],
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
            Complete the set:{' '}
            <Link href="/resources/first-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
              first speaker
            </Link>{' '}
            and{' '}
            <Link href="/resources/second-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
              second speaker
            </Link>
            . Weighing decides close rounds. See how it is scored in{' '}
            <Link href="/world-schools-debate-judging" className="font-semibold text-signal-500 hover:text-signal-600">
              our judging guide
            </Link>
            , and read the full{' '}
            <Link href="/blog/third-speaker-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
              third speaker guide
            </Link>
            .
          </p>
        </section>

        <div className="print-hide mt-14 bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Whip speeches are judgment under pressure.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            The only way to learn clash selection is live rounds with honest
            adjudication. That is exactly what our program runs every week.
          </p>
          <Link
            href="/consultation"
            className="mt-6 inline-block rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition-colors hover:bg-signal-600"
          >
            Book a Consultation
          </Link>
        </div>
      </article>
    </>
  );
}
