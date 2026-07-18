import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The free trial class is retired; consultations replace it.
      { source: '/trial', destination: '/consultation', permanent: true },
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
