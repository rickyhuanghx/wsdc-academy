import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /go/ holds the vanity ad redirects — crawling them pollutes the
        // click count and offers nothing to index.
        disallow: ['/api/', '/admin/', '/checkout/', '/go/', '/enroll'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
