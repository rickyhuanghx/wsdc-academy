import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { ArticleByline } from '@/components/ArticleByline';

export const metadata: Metadata = {
  title: 'How World Schools Debate Judging Works: 40/40/20 Explained (2026 Guide)',
  description:
    'World Schools Debate judging explained: how the 40% Style, 40% Content, 20% Strategy criteria actually work, what judges reward in each category, speaker scores, and how to train for all three.',
  alternates: { canonical: '/world-schools-debate-judging' },
  openGraph: {
    title: 'How World Schools Debate Judging Works: 40/40/20 Explained',
    description:
      'What Style, Content, and Strategy actually mean to a World Schools judge, and how to win each of them.',
    url: '/world-schools-debate-judging',
    type: 'article',
  },
};

const pageFaqs = [
  {
    question: 'Can you win a World Schools round on content alone?',
    answer:
      'Rarely. Content is only 40% of the score, and the judge assesses arguments as an “average reasonable person,” not a specialist. A team that wins the argument on paper but loses on delivery and structure gives back everything it earned. The best teams treat Style and Strategy as scoring categories to be trained deliberately, not as garnish.',
  },
  {
    question: 'What is Strategy in World Schools Debate?',
    answer:
      'Strategy covers the choices a speaker makes: prioritizing the issues that decide the round, allocating time to what matters, structuring the speech so the judge can follow it, handling points of information at sensible moments, and fulfilling the specific job of the speaker role. A brilliant argument delivered in the wrong place at the wrong time scores poorly on Strategy.',
  },
  {
    question: 'Who judges World Schools rounds in the US?',
    answer:
      'It varies widely: experienced circuit adjudicators at some tournaments, parent and community judges at others. That is why training to the actual criteria matters: a speech built on clear structure, persuasive delivery, and prioritized argument wins with both trained and lay judges, while a speech built for one specific judging culture does not travel.',
  },
];

export default function JudgingGuidePage() {
  return (
    <>
      <ArticleJsonLd
        title="How World Schools Debate Judging Works: 40/40/20 Explained (2026 Guide)"
        description="How the Style / Content / Strategy criteria actually work, what judges reward in each, and how to train for all three."
        url="/world-schools-debate-judging"
        datePublished="2026-07-09"
      />
      <FAQJsonLd faqs={pageFaqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'How Judging Works', href: '/world-schools-debate-judging' },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">Judging</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            How World Schools Debate judging works
          </h1>
          <ArticleByline date="2026-07-09" />
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            Every speech in{' '}
            <Link href="/what-is-world-schools-debate" className="font-semibold text-signal-500 hover:text-signal-600">
              World Schools Debate
            </Link>{' '}
            is scored against three published criteria: <strong>Style (40%)</strong>,{' '}
            <strong>Content (40%)</strong>, and <strong>Strategy (20%)</strong>.
            That one sentence explains more about who wins rounds than anything else
            in the rules. It is also the single biggest adjustment for students and
            parents coming from other American formats. This guide breaks down what
            each category actually means to a judge, and what training for it looks
            like.
          </p>
        </header>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">The 40/40/20 split at a glance</h2>
          <div className="mt-6 overflow-hidden rounded-lg border border-navy-100">
            <table className="w-full text-sm">
              <thead className="bg-navy-900 text-left text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Criterion</th>
                  <th className="px-4 py-3 font-semibold">Weight</th>
                  <th className="px-4 py-3 font-semibold">What the judge is asking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100 bg-white text-navy-700">
                <tr>
                  <td className="px-4 py-3 font-semibold">Style</td>
                  <td className="px-4 py-3">40%</td>
                  <td className="px-4 py-3">Was this speech persuasive to listen to (clear, engaging, controlled)?</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold">Content</td>
                  <td className="px-4 py-3">40%</td>
                  <td className="px-4 py-3">Were the arguments logical, developed, evidenced, and responsive?</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold">Strategy</td>
                  <td className="px-4 py-3">20%</td>
                  <td className="px-4 py-3">Did the speaker make the right choices on issues, time, structure, and role?</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed text-navy-700">
            Substantive speeches are scored out of 100 (40 + 40 + 20); the shorter
            reply speeches are scored out of 50 on the same proportions. Judges
            work inside a deliberately narrow band around a defined average, which
            means small, consistent advantages in each category, not one flashy
            moment, are what separate teams across a round. The primary sources
            are public: the{' '}
            <a
              href="https://www.wsdcdebating.org/services-4"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-signal-500 hover:text-signal-600"
            >
              official WSDC rules and adjudicator guides
            </a>{' '}
            and the NSDA&apos;s{' '}
            <a
              href="https://www.speechanddebate.org/how-to-judge-world-schools-debate/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-signal-500 hover:text-signal-600"
            >
              How to Judge World Schools Debate
            </a>
            .
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">Style: the 40% American formats undertrain</h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            Style is everything about <em>how</em> the speech reaches the audience:
            vocal variety, pace, eye contact, presence, humor where it belongs, and
            the sense that the speaker is talking <em>to</em> the judge rather than
            reading <em>at</em> them. World Schools expects oratory. Notes are
            allowed, but delivery that sounds recited gets marked down, and speed
            is a liability rather than a weapon. A judge who stops enjoying a
            speech has, in scoring terms, already docked it.
          </p>
          <p className="mt-4 leading-relaxed text-navy-700">
            This is the category that most rewards deliberate training. Rhetorical
            framing, controlled pauses, and confident POI handling are all
            learnable skills. Because Style is worth as much as Content, an hour
            spent on delivery drills often buys more points than an hour of extra
            research.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">Content: arguments for a reasonable person</h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            Content covers the substance: whether arguments are logically complete
            (claim, reasoning, impact), whether they are supported by examples and
            evidence, and whether the team actually engages the other side&apos;s
            case rather than talking past it. The judge assesses arguments as an
            informed &ldquo;average reasonable person,&rdquo; so jargon,
            unexplained studies, and dumped statistics earn nothing on their own.
            An argument only scores when its reasoning is made to stand up in the
            room.
          </p>
          <p className="mt-4 leading-relaxed text-navy-700">
            Content is also where <strong>rebuttal</strong> lives. A speech that
            builds its own case but ignores the clash scores like half a speech.
            The second and third speakers earn their Content marks largely on how
            directly and completely they answer the strongest version of the
            opposing case.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">Strategy: the 20% that decides close rounds</h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            Strategy is the judgment category: did the speaker understand the
            issues that actually decide the debate and spend time accordingly? It
            covers issue prioritization, speech structure, timing, role
            fulfillment (a third speaker who introduces brand-new substantive
            material is failing their role), and the tactical layer of{' '}
            <strong>points of information</strong>: offering them at damaging
            moments and taking one or two at moments you control.
          </p>
          <p className="mt-4 leading-relaxed text-navy-700">
            Strategy is only 20% of the score, but it is the least noisy category:
            weak teams give away strategy marks constantly (mis-timed speeches,
            buried win conditions, POIs taken mid-argument), so disciplined teams
            collect a quiet, consistent edge here in every single round.
          </p>
          <figure className="mt-8">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <Image
                src="/images/student-debating.jpg"
                alt="A student delivering a practice speech in class"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 text-xs text-navy-400">
              Style is 40% of the score, so delivery gets trained like any other skill.
            </figcaption>
          </figure>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">How to train for 40/40/20</h2>
          <p className="mt-4 leading-relaxed text-navy-700">
            The criteria are public, which means improvement can be systematic.
            This is the premise our entire{' '}
            <Link href="/programs" className="font-semibold text-signal-500 hover:text-signal-600">
              training system
            </Link>{' '}
            is built on:
          </p>
          <ul className="mt-5 space-y-3 text-navy-700">
            {[
              ['Style', 'delivery drills, rhetoric reps, and speech redos, because the fastest scoring gains for most American students are in the 40% their previous format never scored.'],
              ['Content', 'casebuilding on live tournament motions, rebuttal laddering against the strongest opposing case, and a season-long knowledge base for impromptu rounds.'],
              ['Strategy', 'speaker-role training, POI timing drills, and full judged rounds with oral adjudication, so students hear exactly where the round was won or lost.'],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-3">
                <span className="mt-1 font-bold text-signal-500">→</span>
                <span><strong>{title}:</strong> {body}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 leading-relaxed text-navy-700">
            Every judged round in our programs ends with written feedback scored
            against these three criteria, so students always know which of the
            three numbers to move next. Converting from another format? Start with{' '}
            <Link href="/world-schools-vs-public-forum" className="font-semibold text-signal-500 hover:text-signal-600">
              World Schools vs Public Forum
            </Link>{' '}
            to see how the judging cultures differ.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-navy-900">Common questions</h2>
          <div className="mt-6 space-y-3">
            {pageFaqs.map((faq) => (
              <details key={faq.question} className="group rounded-lg border border-navy-100 bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold text-navy-900">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-signal-500 transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-navy-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-16 rounded-xl bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Train to the criteria.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            Book a consultation and see how we train and give feedback against the
            40/40/20 criteria, with coaches who have judged the format at international level.
          </p>
          <Link
            href="/consultation"
            className="mt-6 inline-block rounded-md bg-signal-500 px-7 py-3 font-semibold text-white transition-colors hover:bg-signal-600"
          >
            Book a Consultation
          </Link>
        </div>
      </article>
    </>
  );
}
