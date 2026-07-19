// /llms.txt — a curated, plain-text map of the site for AI crawlers and LLMs.
// Data-driven off the same registries as sitemap.ts, so new programs, posts,
// resources, and coaches appear here automatically. Convention: llmstxt.org.
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, CONTACT_EMAIL } from '@/lib/site';
import { programs } from '@/data/programs';
import { blogPosts } from '@/data/blog';
import { resources } from '@/data/resources';
import { coaches } from '@/data/coaches';

// Prerendered as a static file at build time (no per-request work).
export const dynamic = 'force-static';

// The four "Learn" guides have no descriptions in the registry, so give them
// concise, evergreen one-liners here.
const GUIDE_LINKS = [
  { href: '/what-is-world-schools-debate', title: 'What is World Schools Debate?', blurb: 'The format, rules, speech order, and judging explained for newcomers.' },
  { href: '/world-schools-debate-judging', title: 'How World Schools judging works', blurb: 'The 40/40/20 Style / Content / Strategy criteria and how to train for each.' },
  { href: '/world-schools-vs-public-forum', title: 'World Schools vs Public Forum', blurb: 'Every difference between the two formats, for students converting over.' },
  { href: '/usa-debate-team', title: 'How to make the USA Debate team', blurb: 'Eligibility, the application, and the season-long timeline for national-team selection.' },
];

function item(title: string, url: string, blurb: string): string {
  return `- [${title}](${url}): ${blurb}`;
}

export function GET() {
  const u = (path: string) => `${SITE_URL}${path}`;

  const sections = [
    `# ${SITE_NAME}`,

    `> ${SITE_DESCRIPTION}`,

    `${SITE_NAME} is a year-round online training program for World Schools Debate (WSDC format) serving students ages 9 to 18 across the United States. Every program runs on a structured curriculum mapped to the 40/40/20 judging criteria, judged practice rounds, and written feedback after every session, from coaches who have competed and adjudicated at the top of the format.`,

    '## Guides\n' + GUIDE_LINKS.map((g) => item(g.title, u(g.href), g.blurb)).join('\n'),

    '## Programs\n' + programs.map((p) => item(p.name, u(`/programs/${p.slug}`), p.tagline)).join('\n'),

    '## Blog\n' + blogPosts.map((p) => item(p.title, u(`/blog/${p.slug}`), p.description)).join('\n'),

    '## Resources\n' + resources.map((r) => item(r.title, u(`/resources/${r.slug}`), r.description)).join('\n'),

    '## Coaches\n' + coaches.map((c) => `- ${c.name}, ${c.role} — ${c.highlight}`).join('\n'),

    '## Contact\n' +
      item('Book a free consultation', u('/consultation'), 'A free initial call that ends with a placement recommendation.') +
      '\n' +
      `- Email: ${CONTACT_EMAIL}`,
  ];

  return new Response(sections.join('\n\n') + '\n', {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}
