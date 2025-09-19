import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media2.giphy.com',
      }
    ],
  },
};

export default nextConfig;
