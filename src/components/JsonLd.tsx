import { Program } from '@/data/programs';
import { Coach } from '@/data/coaches';
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
    alternateName: ['WSDC Academy Debate Training', 'World Schools Debate Academy'],
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
        },
        {
          '@type': 'OfferCatalog',
          name: 'World Schools Foundation',
          description: 'Beginner introduction to the World Schools format',
        },
        {
          '@type': 'OfferCatalog',
          name: 'Competition Team',
          description: 'Year-round World Schools squad training',
        },
        {
          '@type': 'OfferCatalog',
          name: 'National Team Sprint',
          description: 'Invitation-only advanced squad for national-circuit and Nationals competitors',
        },
        {
          '@type': 'OfferCatalog',
          name: '1-on-1 Coaching',
          description: 'Private World Schools Debate coaching',
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
export function CourseJsonLd({ program }: { program: Program }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${baseUrl}/programs/${program.slug}`,
    name: program.name,
    description: program.longDescription,
    provider: {
      '@type': 'EducationalOrganization',
      name: SITE_NAME,
      url: baseUrl,
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
        courseSchedule: {
          '@type': 'Schedule',
          repeatFrequency: 'Weekly',
        },
        // Invitation-only programs are not purchasable, so they carry no public Offer.
        ...(program.invitationOnly
          ? {}
          : {
              offers: {
                '@type': 'Offer',
                price: program.pricing.amount,
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
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${baseUrl}${url}#article`,
    headline: title,
    description: description,
    url: `${baseUrl}${url}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: baseUrl,
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

// Person schema list for the coaches page
export function CoachListJsonLd({ coaches }: { coaches: Coach[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'WSDC Academy Coaching Team',
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
