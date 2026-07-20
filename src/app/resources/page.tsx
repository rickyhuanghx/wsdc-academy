import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { resources, resourceCategories } from '@/data/resources';

export const metadata: Metadata = {
  title: 'World Schools Debate Resources: Cheat Sheets, Templates & References',
  description:
    'Free World Schools Debate resources: printable speaker cheat sheets, a 1-hour prep planner, a practice motion bank, format quick references, and a full glossary, built by coaches who train the format year-round.',
  alternates: { canonical: '/resources' },
  openGraph: {
    title: 'World Schools Debate Resource Library',
    description:
      'Printable speaker cheat sheets, prep templates, practice motions, and quick references for World Schools Debate.',
    url: '/resources',
    type: 'website',
  },
};

const categoryIntro: Record<string, string> = {
  'Cheat sheets':
    'Print these and bring them into the prep room. Each sheet is the exact structure we drill in class. Fill it in during the hour and your speech is already organized.',
  'Quick references':
    'The rules, criteria, and vocabulary of the format, condensed. Useful for new debaters, parents, and anyone judging their first tournament.',
  'Practice & prep':
    'Materials for running real practice: a minute-by-minute plan for the prep hour and a motion bank deep enough for a full season of scrimmages.',
};

export default function ResourcesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Resources', href: '/resources' },
        ]}
      />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">Resource Library</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            World Schools Debate resources
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            Everything on this page is free, and everything is the real thing:
            the same templates, references, and drills we use inside our{' '}
            <Link href="/programs" className="font-semibold text-signal-500 hover:text-signal-600">
              training programs
            </Link>
            . Print the cheat sheets, run the motions at practice, and keep the
            references open on tournament day.
          </p>
        </header>

        {resourceCategories.map((category) => (
          <section key={category} className="mt-16">
            <div className="flex items-baseline gap-4 border-b-2 border-navy-900 pb-3">
              <h2 className="text-2xl font-bold text-navy-900">{category}</h2>
            </div>
            <p className="mt-4 max-w-3xl leading-relaxed text-navy-600">{categoryIntro[category]}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resources
                .filter((r) => r.category === category)
                .map((resource) => (
                  <Link
                    key={resource.slug}
                    href={`/resources/${resource.slug}`}
                    className="group flex flex-col border border-navy-200 bg-white p-6 transition-colors hover:border-navy-400"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-lg font-bold text-navy-900">{resource.shortTitle}</h3>
                      {resource.printable && (
                        <span className="rounded-sm border border-navy-200 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-navy-500">
                          Printable
                        </span>
                      )}
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">{resource.description}</p>
                    <span className="mt-4 text-sm font-semibold text-signal-500 underline decoration-signal-200 underline-offset-4 group-hover:decoration-signal-500">
                      Open {resource.printable ? 'and print' : 'the reference'}
                    </span>
                  </Link>
                ))}
            </div>
          </section>
        ))}

        <section className="mt-16">
          <div className="flex items-baseline gap-4 border-b-2 border-navy-900 pb-3">
            <h2 className="text-2xl font-bold text-navy-900">Deep-dive guides</h2>
          </div>
          <p className="mt-4 max-w-3xl leading-relaxed text-navy-600">
            The resources above tell you <em>what</em> to write down. These guides
            explain <em>why</em>: the format, the judging model, and how World
            Schools differs from the formats most American debaters start in.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              ['/what-is-world-schools-debate', 'What is World Schools Debate? The complete introduction'],
              ['/world-schools-debate-judging', 'How judging works: Style, Content, Strategy (40/40/20)'],
              ['/world-schools-vs-public-forum', 'World Schools vs Public Forum: what actually changes'],
              ['/usa-debate-team', 'How to make the USA Debate Team'],
              ['/blog', 'The blog: speaker-role deep dives, technique essays, and the US circuit'],
            ].map(([href, label]) => (
              <li key={href} className="border-t border-navy-200 pt-3">
                <Link
                  href={href}
                  className="font-medium text-navy-800 underline decoration-navy-300 underline-offset-4 hover:text-signal-500 hover:decoration-signal-500"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="print-hide mt-20 bg-navy-900 p-10 text-center text-white">
          <h2 className="text-2xl font-bold">Templates teach structure. Coaches teach judgment.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            Every one of these resources comes alive in a judged round with written
            feedback. Try a class and see the system working.
          </p>
          <Link
            href="/consultation"
            className="mt-6 inline-block rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
          >
            Book a Consultation
          </Link>
        </div>
      </div>
    </>
  );
}
