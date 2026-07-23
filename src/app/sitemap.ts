import { MetadataRoute } from 'next';
import { execSync } from 'node:child_process';
import { programs } from '@/data/programs';
import { resources } from '@/data/resources';
import { blogPosts } from '@/data/blog';
import { motionTopics, motionYears } from '@/lib/motion-bank';
import { SITE_URL } from '@/lib/site';

const baseUrl = SITE_URL;

// Source files whose git history stands in for the "content changed" date below.
const PROGRAMS_DATA = 'src/data/programs.ts';
const RESOURCES_DATA = 'src/data/resources.ts';
const MOTION_BANK_DATA = 'src/data/motion-bank.json';

// Stable fallback for when git history is unavailable at build time (e.g. a
// shallow CI checkout). It MUST be a fixed constant, never `new Date()` — the
// whole point of this file is to stop lastmod churning site-wide every deploy.
const FALLBACK_DATE = new Date('2026-07-23T00:00:00.000Z');

// Last git commit that touched a path -> a genuine "content modified" date
// instead of the build clock. Cached so we shell out at most once per file.
const gitDateCache = new Map<string, number>();
function gitDate(path: string): number {
  const cached = gitDateCache.get(path);
  if (cached !== undefined) return cached;
  let ts = FALLBACK_DATE.getTime();
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${path}"`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (iso) ts = new Date(iso).getTime();
  } catch {
    // git missing / non-repo build -> stable fallback (does not churn).
  }
  gitDateCache.set(path, ts);
  return ts;
}

// Newest git date across the given source paths (e.g. a data file + its template).
function lastModified(...paths: string[]): Date {
  const newest = paths.reduce((max, p) => Math.max(max, gitDate(p)), 0);
  return new Date(newest || FALLBACK_DATE.getTime());
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Static routes paired with the source file that authors their content, so
  // lastmod moves only when that page changes — not on every build.
  const staticRoutes: {
    path: string;
    file: string;
    changeFrequency: 'weekly' | 'monthly' | 'yearly';
    priority: number;
  }[] = [
    { path: '', file: 'src/app/page.tsx', changeFrequency: 'weekly', priority: 1 },
    { path: '/what-is-world-schools-debate', file: 'src/app/(learn)/what-is-world-schools-debate/page.tsx', changeFrequency: 'monthly', priority: 0.95 },
    { path: '/usa-debate-team', file: 'src/app/(learn)/usa-debate-team/page.tsx', changeFrequency: 'monthly', priority: 0.95 },
    { path: '/world-schools-vs-public-forum', file: 'src/app/(learn)/world-schools-vs-public-forum/page.tsx', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/world-schools-debate-judging', file: 'src/app/(learn)/world-schools-debate-judging/page.tsx', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/resources', file: 'src/app/resources/page.tsx', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/motions', file: 'src/app/motions/page.tsx', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/motions/wsdc', file: 'src/app/motions/wsdc/page.tsx', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/blog', file: 'src/app/blog/page.tsx', changeFrequency: 'weekly', priority: 0.85 },
    { path: '/programs', file: 'src/app/programs/page.tsx', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/consultation', file: 'src/app/consultation/page.tsx', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/coaches', file: 'src/app/coaches/page.tsx', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/faq', file: 'src/app/faq/page.tsx', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', file: 'src/app/contact/page.tsx', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/about', file: 'src/app/about/page.tsx', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/privacy', file: 'src/app/privacy/page.tsx', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terms', file: 'src/app/terms/page.tsx', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/refund', file: 'src/app/refund/page.tsx', changeFrequency: 'yearly', priority: 0.3 },
  ];

  const staticPages = staticRoutes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: lastModified(r.file),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Program pages are generated from programs.ts through a shared template.
  const programPages = programs.map((program) => ({
    url: `${baseUrl}/programs/${program.slug}`,
    lastModified: lastModified(PROGRAMS_DATA, 'src/app/programs/[slug]/page.tsx'),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // Each resource page is individually authored at its own route.
  const resourcePages = resources.map((resource) => ({
    url: `${baseUrl}/resources/${resource.slug}`,
    lastModified: lastModified(RESOURCES_DATA, `src/app/resources/${resource.slug}/page.tsx`),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Motion topic/year pages change only when the motion bank (or their template) does.
  const motionTopicPages = motionTopics.map((t) => ({
    url: `${baseUrl}/motions/${t.slug}`,
    lastModified: lastModified(MOTION_BANK_DATA, 'src/app/motions/[topic]/page.tsx'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const motionYearPages = motionYears.map((y) => ({
    url: `${baseUrl}/motions/year/${y}`,
    lastModified: lastModified(MOTION_BANK_DATA, 'src/app/motions/year/[year]/page.tsx'),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Blog posts already carry an authored publish date — the truest lastmod we have.
  const blogPages = blogPosts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...programPages, ...resourcePages, ...motionTopicPages, ...motionYearPages, ...blogPages];
}
