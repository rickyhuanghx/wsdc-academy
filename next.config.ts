import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
