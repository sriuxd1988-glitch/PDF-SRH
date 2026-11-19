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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://js.stripe.com;",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              "font-src 'self' https://fonts.gstatic.com data:;",
              "img-src 'self' data: https: blob:;",
              "connect-src 'self' https://api.simplifypdf.com http://localhost:4000 https://api.stripe.com https://api.razorpay.com https://lumberjack-cx.razorpay.com https://*.amazonaws.com;",
              "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://js.stripe.com;",
              "object-src 'none';",
              "base-uri 'self';",
              "form-action 'self' https://api.razorpay.com;",
              "frame-ancestors 'self';",
              "upgrade-insecure-requests;",
            ].join(' '),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://checkout.razorpay.com" "https://js.stripe.com")',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
