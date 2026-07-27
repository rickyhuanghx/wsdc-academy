import type { Metadata } from 'next';
import Link from 'next/link';
import { faqs } from '@/data/faqs';
import { FAQJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { FurtherReading } from '@/components/FurtherReading';

export const metadata: Metadata = {
  title: 'World Schools Debate Coaching FAQ',
  description:
    'Answers to common questions about World Schools Debate, the USA Debate team, NSDA Nationals, state divisions, and our online coaching programs.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Frequently Asked Questions | WSDC Prep',
    description:
      'Answers on the World Schools Debate format, the USA Debate pathway, and our programs.',
    url: '/faq',
  },
};

const categories: { key: string; label: string }[] = [
  { key: 'format', label: 'The Format' },
  { key: 'pathway', label: 'The American Pathway' },
  { key: 'programs', label: 'Our Programs' },
  { key: 'logistics', label: 'Logistics' },
];

export default function FAQPage() {
  return (
    <>
      <FAQJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'FAQ', href: '/faq' },
        ]}
      />

      <section className="bg-navy-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-navy-100">
            The format, the American pathway, and how our programs work.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {categories.map((category) => {
          const items = faqs.filter((f) => f.category === category.key);
          if (items.length === 0) return null;
          return (
            <div key={category.key} className="mb-12">
              <h2 className="text-xl font-bold text-navy-900">{category.label}</h2>
              <div className="mt-5 space-y-3">
                {items.map((faq) => (
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
            </div>
          );
        })}

        <p className="text-center text-navy-600">
          Still have a question?{' '}
          <Link href="/contact" className="font-semibold text-signal-500 hover:text-signal-600">
            Contact us
          </Link>
          . We reply within one business day.
        </p>

        <FurtherReading
          heading="Longer answers"
          intro="Several of the questions above have a full guide behind them. All of these are free and need no account."
          links={[
            {
              href: '/what-is-world-schools-debate',
              label: 'What is World Schools Debate?',
              note: 'The format from scratch: the 3-on-3 structure, speech order, prepared versus impromptu motions, and how a round runs.',
            },
            {
              href: '/world-schools-debate-judging',
              label: 'How World Schools judging works',
              note: 'The 40/40/20 Style, Content, and Strategy criteria, what judges reward in each, and how to train for all three.',
            },
            {
              href: '/world-schools-vs-public-forum',
              label: 'World Schools vs Public Forum',
              note: 'Every difference between the two formats, for students converting from PF.',
            },
            {
              href: '/blog/world-schools-debate-pathway-us',
              label: 'The World Schools pathway in the US',
              note: 'Where American students actually compete: school teams, state leagues, NSDA Nationals, and the route to the national team.',
            },
            {
              href: '/usa-debate-team',
              label: 'How to make the USA Debate team',
              note: 'Eligibility, the application, and the season-long timeline for national-team selection.',
            },
          ]}
        />
      </section>
    </>
  );
}
