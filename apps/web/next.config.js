/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@simplifypdf/ui', '@simplifypdf/types', '@simplifypdf/auth'],
  serverExternalPackages: ['argon2', '@prisma/client'],
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
