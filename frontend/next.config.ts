import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '194.163.162.240',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'laptopduniya.in',
        pathname: '/media/**',
      },
      // Add your DO droplet IP or production domain here later
    ],
  },
  output: "standalone",
};

export default nextConfig;
