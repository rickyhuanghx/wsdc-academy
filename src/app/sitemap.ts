import { MetadataRoute } from 'next';
import { programs } from '@/data/programs';
import { resources } from '@/data/resources';
import { blogPosts } from '@/data/blog';
import { motionTopics, motionYears } from '@/lib/motion-bank';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/what-is-world-schools-debate`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.95 },
    { url: `${baseUrl}/usa-debate-team`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.95 },
    { url: `${baseUrl}/world-schools-vs-public-forum`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/world-schools-debate-judging`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/resources`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/motions`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/motions/wsdc`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.85 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${baseUrl}/programs`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/consultation`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/coaches`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/refund`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.3 },
  ];

  const programPages = programs.map((program) => ({
    url: `${baseUrl}/programs/${program.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const resourcePages = resources.map((resource) => ({
    url: `${baseUrl}/resources/${resource.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const motionTopicPages = motionTopics.map((t) => ({
    url: `${baseUrl}/motions/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const motionYearPages = motionYears.map((y) => ({
    url: `${baseUrl}/motions/year/${y}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const blogPages = blogPosts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...programPages, ...resourcePages, ...motionTopicPages, ...motionYearPages, ...blogPages];
}
