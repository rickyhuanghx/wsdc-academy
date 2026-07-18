import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The free trial class is retired; consultations replace it.
      { source: '/trial', destination: '/consultation', permanent: true },
    ];
  },
};

export default nextConfig;
