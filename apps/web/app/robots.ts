import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/tools/*', '/blog/*', '/pricing', '/security'],
        disallow: ['/api/*', '/admin/*', '/app/*', '/login'],
      },
    ],
    sitemap: 'https://simplifypdf.com/sitemap.xml',
  };
}
