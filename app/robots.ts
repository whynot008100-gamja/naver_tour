import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/bookmarks/'],
    },
    sitemap: 'https://naver-tour.vercel.app/sitemap.xml',
  };
}
