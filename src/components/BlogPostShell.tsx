import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd';
import { ArticleByline } from '@/components/ArticleByline';
import type { BlogPost } from '@/data/blog';

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogPostShellProps {
  post: BlogPost;
  lede: ReactNode;
  children: ReactNode;
  faqs?: FAQItem[];
  ctaHeading?: string;
  ctaBody?: string;
  /** Deep-link target for the CTA's program button. Point each post at its most relevant program page. */
  ctaHref?: string;
  ctaLabel?: string;
}

/** Shared article chrome: schema, breadcrumbs, header, FAQ block, CTA band.
    Body sections come in as children and follow the guide-page idioms. */
export function BlogPostShell({
  post,
  lede,
  children,
  faqs,
  ctaHeading = 'Now train it in a judged round.',
  ctaBody = 'Every technique on this page is a drill in our weekly training cycle: judged rounds, oral adjudication, written feedback.',
  ctaHref = '/programs',
  ctaLabel = 'See our programs',
}: BlogPostShellProps) {
  return (
    <>
      <ArticleJsonLd
        title={post.metaTitle}
        description={post.description}
        url={`/blog/${post.slug}`}
        datePublished={post.date}
      />
      {faqs && faqs.length > 0 && <FAQJsonLd faqs={faqs} />}
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">
            <Link href="/blog" className="hover:text-signal-600">Blog</Link> · {post.category}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            {post.title}
          </h1>
          <ArticleByline date={post.date} />
          <div className="mt-6 text-lg leading-relaxed text-navy-700">{lede}</div>
        </header>

        {children}

        {faqs && faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-navy-900">Common questions</h2>
            <div className="mt-6 space-y-3">
              {faqs.map((faq) => (
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
        )}

        <div className="mt-16 bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">{ctaHeading}</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">{ctaBody}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/consultation"
              className="inline-block rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition hover:bg-signal-600 active:scale-[0.98]"
            >
              Book a Consultation
            </Link>
            <Link
              href={ctaHref}
              className="inline-block rounded-sm border border-white/30 px-7 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
