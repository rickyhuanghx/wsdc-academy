import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MotionTopicView } from '@/components/MotionTopicView';
import { getTopicMeta, motionTopics, motionsForTopic } from '@/lib/motion-bank';

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
    // No count in the title: the longest topic labels pushed it past the SERP
    // cut (65 chars rendered), and the count churned the title every rebuild.
    // The count survives in the description.
    title: `${meta.label} Debate Motions`,
    description: `${count.toLocaleString('en-US')} real ${meta.label.toLowerCase()} debate motions from tournament records, grouped by year, with info slides and coaching notes. Free, no signup.`,
    alternates: { canonical: `/motions/${topic}` },
    openGraph: {
      title: `${meta.label} Debate Motions`,
      description: meta.blurb,
      url: `/motions/${topic}`,
      type: 'website',
    },
  };
}

export default async function MotionTopicPage({ params }: Props) {
  const { topic } = await params;
  const meta = getTopicMeta(topic);
  if (!meta) notFound();

  return <MotionTopicView meta={meta} page={1} />;
}
