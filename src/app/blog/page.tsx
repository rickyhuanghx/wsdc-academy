import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/JsonLd';
import { blogPosts } from '@/data/blog';

export const metadata: Metadata = {
  title: 'World Schools Debate Blog: Speaker Roles, Technique & the US Circuit',
  description:
    'Coaching essays on World Schools Debate: full guides to all three speaker roles, argument and rebuttal technique, weighing, reply speeches, and the American pathway from first tournament to USA Debate.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'The WSDC Academy Blog',
    description: 'Speaker roles, technique, and the US World Schools circuit. Written by coaches, not content farms.',
    url: '/blog',
    type: 'website',
  },
};

const categories = ['Why it matters', 'Speaker roles', 'Technique', 'The US circuit', 'International'] as const;

const categoryIntro: Record<(typeof categories)[number], string> = {
  'Why it matters':
    'What a season of debate is actually worth: the skills it builds, where its strongest competitors end up, and the honest evidence behind the claims.',
  'Speaker roles':
    'One full essay per chair. Read the role, then print its cheat sheet from the resource library.',
  Technique:
    'The skills that cut across every speech: building arguments, breaking them, weighing, replies, POIs, and the case file that makes prep faster.',
  'The US circuit':
    'Where World Schools lives in America: the tournaments, the leagues, and the road to the national team.',
  International:
    'The championships, the opens American teams can actually enter, and how to take a bench abroad.',
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogIndexPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Blog', href: '/blog' },
        ]}
      />

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-signal-500">Blog</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            Coaching notes, written down
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-navy-700">
            Essays on how World Schools Debate is actually won: the same
            material we teach in class, minus the judged rounds. For templates
            and printables, see the{' '}
            <Link href="/resources" className="font-semibold text-signal-500 hover:text-signal-600">
              resource library
            </Link>
            .
          </p>
        </header>

        {categories.map((category) => (
          <section key={category} className="mt-14">
            <div className="border-b-2 border-navy-900 pb-3">
              <h2 className="text-2xl font-bold text-navy-900">{category}</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-navy-600">{categoryIntro[category]}</p>
            <ul className="mt-6">
              {blogPosts
                .filter((p) => p.category === category)
                .map((post) => (
                  <li key={post.slug} className="border-t border-navy-200 py-6 first:border-t-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
                      {formatDate(post.date)}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-bold text-navy-900">
                      <Link href={`/blog/${post.slug}`} className="hover:text-signal-500">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-2 leading-relaxed text-navy-600">{post.description}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-3 inline-block text-sm font-semibold text-signal-500 underline decoration-signal-200 underline-offset-4 hover:decoration-signal-500"
                    >
                      Read the essay
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}

        <div className="mt-16 bg-navy-900 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Reading is the cheap half.</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-100">
            The expensive half, judged rounds with written feedback, is what
            our programs are for. Start with a free consultation.
          </p>
          <Link
            href="/consultation"
            className="mt-6 inline-block rounded-sm bg-signal-500 px-7 py-3 font-semibold text-white transition-colors hover:bg-signal-600"
          >
            Book a Consultation
          </Link>
        </div>
      </div>
    </>
  );
}
