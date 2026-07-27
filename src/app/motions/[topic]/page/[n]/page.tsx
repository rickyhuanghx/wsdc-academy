import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MotionTopicView } from '@/components/MotionTopicView';
import { getTopicMeta, motionTopics, topicPageCount } from '@/lib/motion-bank';

interface Props {
  params: Promise<{ topic: string; n: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  // Page 1 lives at /motions/[topic] and is deliberately not duplicated here.
  return motionTopics.flatMap((t) =>
    Array.from({ length: topicPageCount(t.slug) - 1 }, (_, i) => ({
      topic: t.slug,
      n: String(i + 2),
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic, n } = await params;
  const meta = getTopicMeta(topic);
  if (!meta) return {};
  const page = Number(n);
  const total = topicPageCount(topic);
  if (!Number.isInteger(page) || page < 2 || page > total) return {};

  return {
    // No "of N" here: it pushes the longest topic labels past the SERP cut.
    // The page count is in the description and in the on-page pager.
    title: `${meta.label} Debate Motions: Page ${page}`,
    description: `Page ${page} of the ${meta.label.toLowerCase()} debate motion archive: more real tournament motions, grouped by season, with info slides where released.`,
    // Self-canonical, not a canonical back to page 1. Page 2 holds motions that
    // appear nowhere else, so pointing it at page 1 would deindex real content.
    // (Google dropped rel=next/prev as an indexing signal in 2019; the rel
    // attributes on the pager below are for other crawlers that still read them.)
    alternates: { canonical: `/motions/${topic}/page/${page}` },
    openGraph: {
      title: `${meta.label} Debate Motions (page ${page})`,
      description: meta.blurb,
      url: `/motions/${topic}/page/${page}`,
      type: 'website',
    },
  };
}

export default async function MotionTopicPagedPage({ params }: Props) {
  const { topic, n } = await params;
  const meta = getTopicMeta(topic);
  if (!meta) notFound();

  const page = Number(n);
  if (!Number.isInteger(page) || page < 2 || page > topicPageCount(topic)) notFound();

  return <MotionTopicView meta={meta} page={page} />;
}
