import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreadcrumbJsonLd, CollectionPageJsonLd } from '@/components/JsonLd';
import {
  getTopicMeta,
  motionTopics,
  motionsForTopic,
  Motion,
} from '@/lib/motion-bank';

interface Props {
  params: Promise<{ topic: string }>;
}

// Every topic page is prerendered; unknown slugs 404 instead of rendering on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return motionTopics.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const meta = getTopicMeta(topic);
  if (!meta) return {};
  const count = motionsForTopic(topic).length;

  return {
    title: `${meta.label} Debate Motions: ${count.toLocaleString('en-US')} Real Tournament Motions`,
    description: `${count.toLocaleString('en-US')} real ${meta.label.toLowerCase()} debate motions from tournament records, grouped by year, with info slides and coaching notes on how these debates are won. Free, no signup.`,
    alternates: { canonical: `/motions/${topic}` },
    openGraph: {
      title: `${meta.label} Debate Motions`,
      description: meta.blurb,
      url: `/motions/${topic}`,
      type: 'website',
    },
  };
}

function groupByYear(list: Motion[]): [string, Motion[]][] {
  const map = new Map<string, Motion[]>();
  for (const m of list) {
    const key = m.y ? String(m.y) : 'Undated';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(m);
  }
  return Array.from(map.entries()).sort((a, b) => {
    if (a[0] === 'Undated') return 1;
    if (b[0] === 'Undated') return -1;
    return Number(b[0]) - Number(a[0]);
  });
}

export default async function MotionTopicPage({ params }: Props) {
  const { topic } = await params;
  const meta = getTopicMeta(topic);
  if (!meta) notFound();

  const list = motionsForTopic(topic);
  const groups = groupByYear(list);
  const related = motionTopics.filter((t) => t.slug !== topic).slice(0, 6);

  return (
    <>
      <CollectionPageJsonLd
        name={`${meta.label} Debate Motions`}
        description={meta.blurb}
        url={`/motions/${topic}`}
        count={list.length}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Motion Bank', href: '/motions' },
          { name: meta.label, href: `/motions/${topic}` },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/motions" className="hover:text-signal-600">Motion Bank</Link> · By topic
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            {meta.label} debate motions
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">{meta.intro}</p>
          <p className="mt-4 leading-relaxed text-navy-700">
            {list.length.toLocaleString('en-US')} motions below, newest season
            first, verbatim from tournament records. Info slides are included
            where the tournament released one. For keyword search and shuffle
            drills, use the{' '}
            <Link href="/motions" className="font-semibold text-signal-500 hover:text-signal-600">
              searchable bank
            </Link>
            .
          </p>
        </header>

        <aside className="mt-8 border border-navy-200 bg-white p-6">
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">Coach&apos;s note</p>
          <p className="mt-2 leading-relaxed text-navy-700">{meta.prepTip}</p>
        </aside>

        <nav aria-label="Jump to year" className="mt-8 flex flex-wrap gap-2">
          {groups.map(([year]) => (
            <a
              key={year}
              href={`#y-${year}`}
              className="rounded-sm border border-navy-200 px-3 py-1 text-sm font-semibold text-navy-700 transition-colors hover:border-navy-400 hover:text-signal-500"
            >
              {year}
            </a>
          ))}
        </nav>

        {groups.map(([year, items]) => (
          <section key={year} id={`y-${year}`} className="mt-12 border-t-2 border-navy-900 pt-8">
            <h2 className="text-2xl font-bold text-navy-900">
              {year}{' '}
              <span className="stat text-base font-normal text-navy-400">
                ({items.length.toLocaleString('en-US')} motions)
              </span>
            </h2>
            <ul className="mt-6 space-y-4">
              {items.map((m) => (
                <li key={m.id} className="border-t border-navy-200 pt-4">
                  <p className="font-display italic leading-relaxed text-navy-800">{m.m}</p>
                  <p className="mt-1.5 text-xs text-navy-500">
                    {[m.t, m.r].filter(Boolean).join(' · ')}
                    {m.w ? ' · World Schools Debating Championships' : ''}
                  </p>
                  {m.i && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-signal-500">
                        Info slide
                      </summary>
                      <p className="mt-2 border-l-2 border-navy-200 pl-3 text-sm leading-relaxed text-navy-600">
                        {m.i}
                      </p>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-14 border-t-2 border-navy-900 pt-8">
          <h2 className="text-2xl font-bold text-navy-900">More topic collections</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {related.map((t) => (
              <li key={t.slug} className="border-t border-navy-200 pt-3">
                <Link
                  href={`/motions/${t.slug}`}
                  className="font-medium text-navy-800 underline decoration-navy-300 underline-offset-4 hover:text-signal-500 hover:decoration-signal-500"
                >
                  {t.label} debate motions
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-navy-600">
            Or start from the{' '}
            <Link href="/motions" className="font-semibold text-signal-500 hover:text-signal-600">
              full motion bank
            </Link>{' '}
            and the{' '}
            <Link href="/motions/wsdc" className="font-semibold text-signal-500 hover:text-signal-600">
              Worlds motions archive
            </Link>
            .
          </p>
        </section>

        <div className="mt-14 bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Motions are free. Judged rounds are the product.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            Our students debate motions like these every week in full judged
            rounds, with oral adjudication and written feedback after every one.
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
