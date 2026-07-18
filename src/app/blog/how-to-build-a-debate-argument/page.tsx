import Link from 'next/link';
import { BlogPostShell } from '@/components/BlogPostShell';
import { getPostBySlug, postMetadata } from '@/data/blog';

export const metadata = postMetadata('how-to-build-a-debate-argument');

const post = getPostBySlug('how-to-build-a-debate-argument')!;

const faqs = [
  {
    question: 'How many mechanisms does an argument need?',
    answer:
      'Two or three. One mechanism makes the argument fragile: break the mechanism and the argument dies. More than three usually means some are underdeveloped. Each mechanism should be able to carry the argument alone if the others fall.',
  },
  {
    question: 'Do I need statistics to win an argument?',
    answer:
      'No. You need reasoning the judge can verify in their own head, illustrated by examples they can picture. World Schools judges assess arguments as informed generalists: a dumped statistic with no reasoning earns nothing, while a clean causal story with a recognizable real-world example scores even without numbers.',
  },
  {
    question: 'What is the difference between an impact and a mechanism?',
    answer:
      'The mechanism is the causal pathway (why the claim is true); the impact is what it costs or gains at the end of that pathway (why anyone should care). "Fee-paying schools concentrate resources" is a mechanism; "a generation of talented students never gets the chance to compete" is an impact. Arguments need both. Truth without stakes is trivia.',
  },
];

export default function BuildArgumentPost() {
  return (
    <BlogPostShell
      post={post}
      faqs={faqs}
      ctaHeading="Casebuilding is a weekly rep in our program."
      ctaBody="Students build arguments on live motions, get them attacked in judged rounds, and get written feedback on exactly these four layers."
      lede={
        <p>
          Most debate arguments are headlines: &ldquo;this policy
          hurts the poor,&rdquo; delivered with confidence and nothing
          underneath. They sound fine for thirty seconds and evaporate at first
          contact with rebuttal. The arguments that survive have the same
          four-layer anatomy: a <strong>tagline</strong>, two or three{' '}
          <strong>mechanisms</strong>, an <strong>impact</strong>, and{' '}
          <strong>weighing</strong>. Here is the structure, then a worked
          example carried all the way through.
        </p>
      }
    >
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">The four layers</h2>
        <ol className="mt-5 space-y-4">
          {[
            ['Tagline.', 'A short, memorable title: what the judge writes at the top of their flow. "Brain drain breaks the ladder" beats "our second argument about education outcomes." If your tagline needs a paragraph of explanation, it is not a tagline.'],
            ['Mechanisms.', 'The causal pathways that make your claim true, each with reasoning (the logic, step by step) and an example or evidence (the pathway visible in the real world). This is the layer most arguments are missing entirely.'],
            ['Impact.', 'What sits at the end of the pathway: who is affected, how severely, at what scale, and how permanently. An argument without an impact is a true statement nobody has a reason to vote on.'],
            ['Weighing.', 'Why your impact outranks theirs: scale, severity, reversibility, or priority of stakeholder. Weighing inside the argument, before the clash starts, frames the clash.'],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4 border-t border-navy-200 pt-4">
              <span className="font-display text-2xl font-bold text-signal-500">{i + 1}</span>
              <p className="leading-relaxed text-navy-700"><strong>{title}</strong> {body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">A worked example</h2>
        <p className="mt-4 leading-relaxed text-navy-700">
          Motion: <em className="font-display">This House would make voting compulsory.</em>{' '}
          Proposition argument, built layer by layer:
        </p>
        <div className="mt-6 space-y-4">
          {[
            ['Tagline', '“Politicians chase the missing voter.”'],
            ['Mechanism 1: reasoning', 'When turnout is voluntary, campaigns rationally target the people most likely to vote and ignore the rest. Make voting universal, and every ignored group becomes a constituency someone must win, so policy attention follows.'],
            ['Mechanism 1: example', 'In countries with compulsory voting, parties campaign on issues that reach low-income and young voters, because those votes are guaranteed to exist.'],
            ['Mechanism 2: reasoning', 'Non-voters are not randomly distributed. They cluster among the disadvantaged. Voluntary systems therefore produce governments systematically tilted toward the already-served.'],
            ['Impact', 'Whole communities stop being an afterthought of policy: the people with the greatest stake in public services finally shape them. This compounds with every budget and every cycle.'],
            ['Weighing', 'The opposition will defend the freedom to abstain. But set a marginal restriction on one civic choice against the permanent structural exclusion of millions from political relevance, and scale and severity both cut our way.'],
          ].map(([label, body]) => (
            <div key={label} className="border-l-2 border-signal-500 pl-4">
              <p className="text-xs font-bold uppercase tracking-wider text-navy-500">{label}</p>
              <p className="mt-1 leading-relaxed text-navy-700">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 leading-relaxed text-navy-700">
          Notice what the structure buys you defensively: to beat this
          argument, rebuttal now has to break <em>both</em> mechanisms, or
          out-weigh the impact, a much taller order than dismissing a
          headline.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-navy-900">Why arguments fail</h2>
        <ul className="mt-5 space-y-3 text-navy-700">
          {[
            ['Assertion without mechanism', 'the claim and the impact with nothing connecting them. Nine out of ten junior arguments die here.'],
            ['Examples doing the reasoning’s job', 'an anecdote is an illustration, not a proof. If your only mechanism is "it happened in Sweden," the response "we are not Sweden" ends the argument.'],
            ['Impacts nobody weighed', 'you proved something bad happens; they proved something bad happens. Without weighing, the judge picks, and you handed them the choice.'],
            ['Tag-dumping', 'four arguments in eight minutes, none past layer one. Fewer, deeper arguments win rounds; see how the first speaker packages two of them.'],
          ].map(([title, body]) => (
            <li key={title} className="flex gap-3 border-t border-navy-200 pt-3">
              <span className="leading-relaxed"><strong>{title}</strong>: {body}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 leading-relaxed text-navy-700">
          This structure is baked into the{' '}
          <Link href="/resources/first-speaker-cheat-sheet" className="font-semibold text-signal-500 hover:text-signal-600">
            speaker cheat sheets
          </Link>
          . Every argument block is tagline → mechanisms → impact → weighing.
          To practice, take a motion from the{' '}
          <Link href="/resources/practice-motions" className="font-semibold text-signal-500 hover:text-signal-600">
            motion bank
          </Link>{' '}
          and build one argument through all four layers in fifteen minutes.
          Then learn how opponents will attack it in the{' '}
          <Link href="/blog/debate-rebuttal-guide" className="font-semibold text-signal-500 hover:text-signal-600">
            rebuttal guide
          </Link>
          .
        </p>
      </section>
    </BlogPostShell>
  );
}
