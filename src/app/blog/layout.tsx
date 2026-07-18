import type { ReactNode } from 'react';
import { SectionShell } from '@/components/SectionShell';
import { blogPosts, type BlogPost } from '@/data/blog';

// Left-rail navigator for the blog: an "All posts" link plus every essay grouped by category.
// Labels use the title up to the first colon (the descriptive tail is dropped to keep the rail
// scannable). Driven off src/data/blog.ts, so new posts appear automatically.
const categoryOrder: BlogPost['category'][] = [
  'Why it matters',
  'Speaker roles',
  'Technique',
  'The US circuit',
  'International',
];

const groups = [
  { items: [{ href: '/blog', label: 'All posts' }] },
  ...categoryOrder
    .map((category) => ({
      label: category,
      items: blogPosts
        .filter((p) => p.category === category)
        .map((p) => ({ href: `/blog/${p.slug}`, label: p.title.split(':')[0].trim() })),
    }))
    .filter((g) => g.items.length > 0),
];

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <SectionShell title="Blog" groups={groups}>
      {children}
    </SectionShell>
  );
}
