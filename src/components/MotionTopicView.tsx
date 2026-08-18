import Link from 'next/link';
import { BreadcrumbJsonLd, CollectionPageJsonLd } from '@/components/JsonLd';
import {
  groupByYear,
  motionTopics,
  motionsForTopic,
  paginateYearGroups,
  type MotionTopic,
} from '@/lib/motion-bank';

/**
 * The full topic page, shared by /motions/[topic] (page 1) and
 * /motions/[topic]/page/[n] (pages 2+) so the two routes cannot drift apart.
 * Server-rendered on purpose: the crawlable motion text is the whole SEO edge
 * over the SPA motion sites, so this must never become a client component.
 */
export function MotionTopicView({ meta, page }: { meta: MotionTopic; page: number }) {
  const list = motionsForTopic(meta.slug);
  const pages = paginateYearGroups(groupByYear(list));
  const groups = pages[page - 1] ?? [];
  const totalPages = pages.length;
  const related = motionTopics.filter((t) => t.slug !== meta.slug).slice(0, 6);

  const base = `/motions/${meta.slug}`;
  const hrefFor = (n: number) => (n === 1 ? base : `${base}/page/${n}`);
  const onPage = groups.reduce((n, [, items]) => n + items.length, 0);
  const firstYear = groups[0]?.[0];
  const lastYear = groups[groups.length - 1]?.[0];

  return (
    <>
      {/* Page 1 stands for the collection; later pages are just more of it. */}
      {page === 1 && (
        <CollectionPageJsonLd
          name={`${meta.label} Debate Motions`}
          description={meta.blurb}
          url={base}
          count={list.length}
        />
      )}
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Motion Bank', href: '/motions' },
          { name: meta.label, href: base },
          ...(page > 1 ? [{ name: `Page ${page}`, href: hrefFor(page) }] : []),
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/motions" className="hover:text-signal-600">Motion Bank</Link> · By topic
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            {meta.label} debate motions
            {page > 1 ? <span className="text-navy-400"> (page {page})</span> : null}
          </h1>
          {page === 1 ? (
            <>
              <p className="mt-6 text-lg leading-relaxed text-navy-700">{meta.intro}</p>
              <p className="mt-4 leading-relaxed text-navy-700">
                {list.length.toLocaleString('en-US')} motions, newest season
                first, verbatim from tournament records. Info slides are included
                where the tournament released one. For keyword search and shuffle
                drills, use the{' '}
                <Link href="/motions" className="font-semibold text-signal-500 hover:text-signal-600">
                  searchable bank
                </Link>
                .
              </p>
            </>
          ) : (
            <p className="mt-6 text-lg leading-relaxed text-navy-700">
              Page {page} of {totalPages}:{' '}
              {onPage.toLocaleString('en-US')} more {meta.label.toLowerCase()} motions,
              {firstYear === lastYear ? ` from ${firstYear}` : ` covering ${lastYear} to ${firstYear}`}
              . Start at the{' '}
              <Link href={base} className="font-semibold text-signal-500 hover:text-signal-600">
                newest {meta.label.toLowerCase()} motions
              </Link>
              , or search the whole bank from the{' '}
              <Link href="/motions" className="font-semibold text-signal-500 hover:text-signal-600">
                motion explorer
              </Link>
              .
            </p>
          )}
        </header>

        {page === 1 && (
          <aside className="mt-8 border border-navy-200 bg-white p-6">
            <p className="text-sm font-bold uppercase tracking-wider text-signal-500">Coach&apos;s note</p>
            <p className="mt-2 leading-relaxed text-navy-700">{meta.prepTip}</p>
          </aside>
        )}

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
          <section key={year} id={`y-${year}`} className="motion-year-section mt-12 border-t-2 border-navy-900 pt-8">
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

        {totalPages > 1 && (
          <nav
            aria-label={`${meta.label} motion pages`}
            className="mt-14 border-t-2 border-navy-900 pt-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              {page > 1 ? (
                <Link
                  href={hrefFor(page - 1)}
                  rel="prev"
                  className="rounded-sm border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700 transition-colors hover:border-navy-400 hover:text-signal-500"
                >
                  Newer motions
                </Link>
              ) : (
                <span />
              )}
              {page < totalPages ? (
                <Link
                  href={hrefFor(page + 1)}
                  rel="next"
                  className="rounded-sm border border-navy-200 px-4 py-2 text-sm font-semibold text-navy-700 transition-colors hover:border-navy-400 hover:text-signal-500"
                >
                  Older motions
                </Link>
              ) : (
                <span />
              )}
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <li key={n}>
                  {n === page ? (
                    <span
                      aria-current="page"
                      className="inline-block rounded-sm border border-navy-900 bg-navy-900 px-3 py-1 text-sm font-semibold text-white"
                    >
                      {n}
                    </span>
                  ) : (
                    <Link
                      href={hrefFor(n)}
                      className="inline-block rounded-sm border border-navy-200 px-3 py-1 text-sm font-semibold text-navy-700 transition-colors hover:border-navy-400 hover:text-signal-500"
                    >
                      {n}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}

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
            . New to the format? Read{' '}
            <Link
              href="/what-is-world-schools-debate"
              className="font-semibold text-signal-500 hover:text-signal-600"
            >
              What is World Schools Debate?
            </Link>{' '}
            first: it explains how motions like these get debated in a round.
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
