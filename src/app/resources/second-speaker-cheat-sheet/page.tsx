import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { PrintButton } from '@/components/PrintButton';
import { Sheet, SheetSection, Field, SubBlock } from '@/components/CheatSheet';

export const metadata: Metadata = {
  title: 'Second Speaker Cheat Sheet: Printable World Schools Debate Template',
  description:
    'A free printable cheat sheet for the second speaker (deputy) in World Schools Debate: rebuttal in "they say / however" form, rebuilding your first speaker\'s case, and the new extension argument.',
  alternates: { canonical: '/resources/second-speaker-cheat-sheet' },
  openGraph: {
    title: 'Second Speaker Cheat Sheet (World Schools Debate)',
    description: 'Rebut, rebuild, extend: the deputy speech on one printable sheet.',
    url: '/resources/second-speaker-cheat-sheet',
    type: 'article',
  },
};

function ResponseBlock({ label, conclusion }: { label: string; conclusion: string }) {
  return (
    <SheetSection label={label}>
      {[1, 2, 3].map((t) => (
        <SubBlock key={t} label={`Exchange ${t}`}>
          <Field label="They say…" lines={1} />
          <Field label="However…" lines={2} />
        </SubBlock>
      ))}
      <Field label={conclusion} lines={2} />
    </SheetSection>
  );
}

export default function SecondSpeakerCheatSheetPage() {
  return (
    <>
      <ArticleJsonLd
        title="Second Speaker Cheat Sheet: Printable World Schools Debate Template"
        description="A printable template for the deputy speech: rebuttal, rebuilding, and the extension argument."
        url="/resources/second-speaker-cheat-sheet"
        datePublished="2026-07-09"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Resources', href: '/resources' },
          { name: 'Second Speaker Cheat Sheet', href: '/resources/second-speaker-cheat-sheet' },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="print-hide">
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/resources" className="hover:text-signal-600">Resources</Link> · Cheat sheet
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            Second Speaker cheat sheet
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            The deputy speech is where debates are usually won or lost: you have
            to tear down the other side&apos;s case, repair your own, and still
            deliver a brand-new argument. This sheet structures all three jobs:
            rebuttal and rebuilding in &ldquo;they say / however&rdquo; form,
            then a fully mechanized extension.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <PrintButton />
            <span className="text-sm text-navy-500">Prints clean. Page chrome is stripped automatically.</span>
          </div>
        </header>

        <div className="mt-10">
          <Sheet title="Second Speaker / Deputy" subtitle="World Schools Debate · rebut → rebuild → extend">
            <SheetSection
              label="Introduction"
              hint="one rhetorical device: historical example · emotional appeal · logical link"
            >
              <Field label="Opening frame: re-anchor the judge to your side of the debate" lines={2} />
            </SheetSection>

            <ResponseBlock
              label="Rebuttal: their Argument 1"
              conclusion="Their argument fails because… (summary of responses)"
            />
            <ResponseBlock
              label="Rebuttal: their Argument 2"
              conclusion="Their argument fails because… (summary of responses)"
            />
            <ResponseBlock
              label="Rebuilding: our Argument 1"
              conclusion="Our argument still stands because… (summary of rebuilding)"
            />
            <ResponseBlock
              label="Rebuilding: our Argument 2"
              conclusion="Our argument still stands because… (summary of rebuilding)"
            />

            <SheetSection label="New argument / extension">
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

            <SheetSection label="Conclusion">
              <Field label="Summary of the speech" lines={2} />
              <Field label="Final framing / caseline" lines={1} />
            </SheetSection>
          </Sheet>
        </div>

        <section className="print-hide mt-12">
          <h2 className="text-2xl font-bold text-navy-900">How to use this sheet</h2>
          <ol className="mt-6 space-y-4">
            {[
              ['Rebut the best version of their argument.', 'Judges notice when you answer a weaker version of what was actually said. Steel-man it, then break it. That is what earns Content marks.'],
              ['Rebuild before you extend.', 'A new argument on top of a collapsed case impresses nobody. Spend real time showing why your first speaker’s material survives their rebuttal.'],
              ['Every exchange gets a conclusion.', 'The "this shows their argument fails because…" line converts a list of responses into a judgment the judge can write down. Do not skip it.'],
              ['Budget ruthlessly.', 'A common split is roughly three minutes of rebuttal and rebuilding, four minutes of extension, one minute of framing. Adjust live based on how much damage the other side actually did.'],
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
            Get the matching sheets for the rest of your bench:{' '}
            <Link href="/resources/first-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
              first speaker
            </Link>{' '}
            and{' '}
            <Link href="/resources/third-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
              third speaker
            </Link>, and see{' '}
            <Link href="/world-schools-debate-judging" className="font-semibold text-signal-500 hover:text-signal-600">
              how judges score rebuttal
            </Link>{' '}
            under the 40/40/20 criteria. For the full walk-through of the role, read the{' '}
            <Link href="/blog/second-speaker-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
              second speaker guide
            </Link>
            .
          </p>
        </section>

        <div className="print-hide mt-14 bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Rebuttal is a rep sport.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            Our classes drill &ldquo;they say / however&rdquo; laddering against
            live opposition every week, with written feedback on every round.
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
