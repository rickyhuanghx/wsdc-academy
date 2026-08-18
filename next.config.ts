import type { NextConfig } from "next";

// Security headers must live HERE, not netlify.toml: the Netlify Next runtime
// serves app routes through its own handler and silently ignores [[headers]]
// blocks for them (verified across the sibling sites — see repo memory).
// CSP ships REPORT-ONLY first: GTM/GA4, Stripe, and Calendly all inject
// scripts/frames, so enforce only after the console shows no violations.
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  // 'unsafe-inline' is required: Next inlines bootstrap scripts and we emit
  // JSON-LD via dangerouslySetInnerHTML without nonces.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://assets.calendly.com",
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://api.stripe.com https://m.stripe.network https://calendly.com https://script.google.com https://script.googleusercontent.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com https://m.stripe.network https://calendly.com https://www.googletagmanager.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const SECURITY_HEADERS = [
  // 2 years; no `preload` until the owner decides to submit to the HSTS list.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // `payment` deliberately left unset so Stripe's wallet iframes keep working.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy-Report-Only', value: CSP_REPORT_ONLY },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: SECURITY_HEADERS,
      },
    ];
  },
  async redirects() {
    return [
      // The free trial class is retired; consultations replace it.
      { source: '/trial', destination: '/consultation', permanent: true },
      // Vanity link for Tabroom placements; UTM tags let GA4 attribute the
      // session (and any conversion events in it) to Tabroom. Temporary
      // redirect on purpose so the destination/params can change later.
      {
        source: '/tabroom',
        destination: '/?utm_source=tabroom&utm_medium=referral&utm_campaign=tabroom',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      // Data-driven essay served as a self-contained static page at a clean blog URL.
      {
        source: '/blog/does-debate-help-college-admissions',
        destination: '/blog-posts/does-debate-help-college-admissions.html',
      },
    ];
  },
};

export default nextConfig;
