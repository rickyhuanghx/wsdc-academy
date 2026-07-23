import { Program } from '@/data/programs';
import { Coach } from '@/data/coaches';
import { ARTICLE_AUTHOR } from '@/data/author';
import { SITE_NAME, SITE_URL, CONTACT_EMAIL, CONTACT_PHONE, SITE_SLOGAN, SITE_DESCRIPTION } from '@/lib/site';

const baseUrl = SITE_URL;

// NOTE: never add aggregateRating to any schema here unless it comes from a
// verifiable third-party source (e.g. Google Business Profile). Self-declared
// ratings violate Google's structured-data policy. (Lesson learned on wscprep.com.)

// Organization Schema
export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${baseUrl}/#organization`,
    name: SITE_NAME,
    alternateName: ['WSDC Prep Debate Training', 'World Schools Debate Academy'],
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description: SITE_DESCRIPTION,
    foundingDate: '2026',
    slogan: SITE_SLOGAN,
    knowsAbout: [
      'World Schools Debate',
      'World Schools Debating Championships',
      'USA Debate national team',
      'NSDA World Schools Debate Invitational',
      'Impromptu debate preparation',
      'Debate coaching',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: CONTACT_EMAIL,
      telephone: CONTACT_PHONE,
      areaServed: 'US',
      availableLanguage: ['English'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'World Schools Debate Programs',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'World Schools Summer Bootcamp',
          description: 'A 12-hour August intensive introducing beginners to the World Schools format',
          url: `${baseUrl}/programs/summer-bootcamp`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'Advanced World Schools Summer Bootcamp',
          description: 'A 12-hour August intensive for students who already compete in World Schools',
          url: `${baseUrl}/programs/advanced-summer-bootcamp`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'World Schools Foundation',
          description: 'Beginner introduction to the World Schools format',
          url: `${baseUrl}/programs/foundations`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'Competition Team',
          description: 'Year-round World Schools squad training',
          url: `${baseUrl}/programs/competition-team`,
        },
        {
          '@type': 'OfferCatalog',
          name: 'National Team Sprint',
          description: 'Invitation-only advanced squad for national-circuit and Nationals competitors',
          url: `${baseUrl}/programs/national-team-sprint`,
        },
        {
          '@type': 'OfferCatalog',
          name: '1-on-1 Coaching',
          description: 'Private World Schools Debate coaching',
          url: `${baseUrl}/programs/private-coaching`,
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// WebSite Schema
export function WebSiteJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: SITE_NAME,
    alternateName: 'World Schools Debate Academy',
    url: baseUrl,
    description: 'A real training system for World Schools Debate',
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Service Schema for coaching services
export function ServiceJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/#service`,
    name: 'World Schools Debate Coaching',
    alternateName: 'WSDC Training',
    description:
      'Expert online coaching for the World Schools Debate format: beginner foundations, year-round competition training, NSDA Nationals preparation, and private 1-on-1 coaching.',
    provider: {
      '@id': `${baseUrl}/#organization`,
    },
    serviceType: 'Educational Coaching',
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      audienceType: 'Students ages 11-18',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Course Schema for program detail pages

// "2 hours" → "PT2H", "60 minutes" → "PT60M" (per-session ISO 8601 duration).
function isoSessionDuration(sessionLength?: string): string | undefined {
  if (!sessionLength) return undefined;
  const hours = sessionLength.match(/(\d+)\s*hour/);
  if (hours) return `PT${hours[1]}H`;
  const minutes = sessionLength.match(/(\d+)\s*min/);
  if (minutes) return `PT${minutes[1]}M`;
  return undefined;
}

export function CourseJsonLd({ program, coaches = [] }: { program: Program; coaches?: Coach[] }) {
  const sessionDuration = isoSessionDuration(program.sessionLength);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${baseUrl}/programs/${program.slug}`,
    name: program.name,
    url: `${baseUrl}/programs/${program.slug}`,
    image: `${baseUrl}${program.image}`,
    description: program.longDescription,
    provider: {
      '@id': `${baseUrl}/#organization`,
    },
    educationalLevel: program.level,
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      audienceType: `Students ages ${program.ageRange.min}-${program.ageRange.max}`,
    },
    teaches: program.outcomes,
    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        courseMode: 'online',
        ...(program.termDates
          ? { startDate: program.termDates.start, endDate: program.termDates.end }
          : {}),
        ...(program.instruction
          ? { courseWorkload: `PT${program.instruction.totalHours}H` }
          : {}),
        courseSchedule: {
          '@type': 'Schedule',
          repeatFrequency: 'Weekly',
          ...(program.instruction ? { repeatCount: program.instruction.sessions } : {}),
          ...(sessionDuration ? { duration: sessionDuration } : {}),
        },
        ...(coaches.length > 0
          ? {
              instructor: coaches.map((coach) => ({
                '@type': 'Person',
                name: coach.name,
                jobTitle: coach.role,
                image: `${baseUrl}${coach.image}`,
                description: coach.credentials.join('; '),
              })),
            }
          : {}),
        // Invitation-only programs are not purchasable, so they carry no public Offer.
        // Only the real charged price goes in — never the struck compareAt / early-bird framing.
        ...(program.invitationOnly
          ? {}
          : {
              offers: {
                '@type': 'Offer',
                category: 'Paid',
                price: String(program.pricing.amount),
                priceCurrency: program.pricing.currency,
                availability: 'https://schema.org/InStock',
              },
            }),
      },
    ],
    syllabusSections: program.curriculum.map((section) => ({
      '@type': 'Syllabus',
      name: section.title,
      description: section.detail,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Schema
interface FAQItem {
  question: string;
  answer: string;
}

export function FAQJsonLd({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  href: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Article Schema for guide pages
export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image = '/images/og-home.jpg',
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  /** Representative image for Article rich results. Relative path resolved
      against SITE_URL; defaults to the site OG image (1200×630). Pass a
      per-page hero where one exists. */
  image?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${baseUrl}${url}#article`,
    headline: title,
    description: description,
    url: `${baseUrl}${url}`,
    image: `${baseUrl}${image}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: ARTICLE_AUTHOR.name,
      url: `${baseUrl}${ARTICLE_AUTHOR.url}`,
      image: `${baseUrl}${ARTICLE_AUTHOR.image}`,
      jobTitle: ARTICLE_AUTHOR.role,
      description: ARTICLE_AUTHOR.credentials.join('; '),
      worksFor: {
        '@id': `${baseUrl}/#organization`,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${url}`,
    },
    about: {
      '@type': 'Thing',
      name: 'World Schools Debate',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Dataset schema for the motion bank landing page
export function DatasetJsonLd({
  name,
  description,
  url,
  size,
}: {
  name: string;
  description: string;
  url: string;
  size: number;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${baseUrl}${url}#dataset`,
    name,
    description,
    url: `${baseUrl}${url}`,
    creator: { '@id': `${baseUrl}/#organization` },
    isAccessibleForFree: true,
    variableMeasured: 'Debate motions with tournament, round, year, topic, and info slide',
    size: `${size} motions`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// CollectionPage schema for motion topic / year archive pages
export function CollectionPageJsonLd({
  name,
  description,
  url,
  count,
}: {
  name: string;
  description: string;
  url: string;
  count: number;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${baseUrl}${url}`,
    name,
    description,
    url: `${baseUrl}${url}`,
    isPartOf: { '@id': `${baseUrl}/#website` },
    about: { '@type': 'Thing', name: 'Debate motions' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: count,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Person schema list for the coaches page
export function CoachListJsonLd({ coaches }: { coaches: Coach[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'WSDC Prep Coaching Team',
    numberOfItems: coaches.length,
    itemListElement: coaches.map((coach, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: coach.name,
        jobTitle: coach.role,
        image: `${baseUrl}${coach.image}`,
        worksFor: {
          '@id': `${baseUrl}/#organization`,
        },
        description: coach.credentials.join('; '),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
