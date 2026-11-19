/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@simplifypdf/ui', '@simplifypdf/types'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
