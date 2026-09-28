import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('points-of-information-debate');

const post = getPostBySlug('points-of-information-debate')!;

const faqs = [
  {
    question: 'How many POIs should I accept in a speech?',
    answer:
      'The standard convention is one or two per substantive speech. Zero reads as evasive and costs Strategy marks; three or more hands control of your speech to the other team. Accept them at moments you choose, typically right after landing a strong section and never mid-argument.',
  },
  {
    question: 'How long can a point of information be?',
    answer:
      'Around fifteen seconds: a question or a pointed statement, not a mini-speech. A rambling POI gets waved down by the speaker and annoys the judge. The best POIs are one sentence with a sting in it.',
  },
  {
    question: 'Do reply speeches take POIs?',
    answer:
      'No. POIs belong to the substantive speeches only, and even there the first and last minute are protected. The reply speeches run uninterrupted.',
  },
];

export default function POIPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHref="/programs/foundations"
      ctaLabel="See the Foundation class"
      ctaHeading="POI composure is a trained reflex."
      ctaBody="Our drills put speakers under live POI pressure every week: offering, declining, and answering without losing the thread."
      lede={
        <p>
          For most of a World Schools round, the teams talk past each other in
          eight-minute blocks. Points of information are the exception: brief,
          live contact, in the middle of the other side&apos;s speaking time.
          Handled well, POIs let you plant doubts in their best speeches and
          prove composure in your own. Handled badly, they cost you both.
          Here are the conventions, and the strategy on each side of them.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">The ground rules</h2>
        <ul className="mt-5 space-y-3 text-navy-700">
          {[
            ['When', 'POIs may be offered during substantive speeches, but the first and last minute of each speech are protected, and no offers may be made during them. Reply speeches take no POIs at all.'],
            ['How', 'a member of the opposing team rises (traditionally with a hand out or a short "Point of information"). The speaker accepts or declines; the choice is entirely theirs.'],
            ['How long', 'about fifteen seconds: one question or statement. The speaker may cut a rambling point off.'],
            ['The clock', 'the speaker’s time keeps running through the point and the answer, which is exactly why both the offer and the answer are strategic acts.'],
          ].map(([title, body]) => (
            <li key={title} className="flex gap-3 border-t border-navy-200 pt-3">
              <span className="leading-relaxed"><strong>{title}</strong>: {body}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Offering: hunt as a team</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Offering POIs steadily across every opposing speech signals a bench
          that is alive and engaged. Judges notice a team that goes quiet.
          But the offers should be aimed, not constant. The best moments: just
          as a speaker finishes a claim your team can gut with one sentence,
          or mid-flight in an argument whose premise you can flip. A sharp POI
          does rebuttal work early: it puts your{' '}
          <Link href="/blog/debate-rebuttal-guide" className="font-semibold text-signal-500 hover:text-signal-600">
            response
          </Link>{' '}
          on the judge&apos;s flow while the argument is still being built.
        </p>
        <p className="mt-4 leading-relaxed text-navy-700">
          Coordinate the hunt: decide in prep which of their arguments each
          teammate is watching, so two of you aren&apos;t chasing the same
          point while a third argument sails through untouched. And keep each
          offer short and pre-phrased. A POI you compose while standing is a
          POI that rambles.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Answering: control the moment</h2>
        <ol className="mt-5 space-y-4">
          {[
            ['Accept on your terms.', 'Take your one or two points right after a section lands, never in the middle of a mechanism. Declining with a quick "not now" and finishing your sentence is strength, not rudeness.'],
            ['Answer in one breath.', 'Ten to twenty seconds: respond, then bridge straight back. "…which is exactly why our second argument matters. Returning to it." The answer is part of your speech; do not let it become a dialogue.'],
            ['Use it as a springboard.', 'The best answers convert the attack into evidence for your case. If a POI walks into your next point, take it gladly and say so: "I’m delighted they asked."'],
            ['Never bluff.', 'If a point genuinely lands, concede the sliver and re-weigh: "even if that’s true, it touches our smallest mechanism, and the impact stands." A composed partial concession outscores a flustered denial every time.'],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4 border-t border-navy-200 pt-4">
              <span className="font-display text-2xl font-bold text-signal-500">{i + 1}</span>
              <p className="leading-relaxed text-navy-700"><strong>{title}</strong> {body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-5 leading-relaxed text-navy-700">
          POI handling is scored under Strategy, in the timing of what you
          accept, and under Style, in the composure of the answer. See{' '}
          <Link href="/world-schools-debate-judging" className="font-semibold text-signal-500 hover:text-signal-600">
            how judging works
          </Link>{' '}
          for where those marks live, and the{' '}
          <Link href="/resources/wsdc-format-quick-reference" className="font-semibold text-signal-500 hover:text-signal-600">
            format quick reference
          </Link>{' '}
          for the rules at a glance.
        </p>
      </section>
    </BlogPostShell>
  );
}
