import type { MetadataRoute } from 'next';
import { getSiteUrl } from './lib/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/sign-in', '/sign-up', '/forgot-password', '/sso-callback', '/continue', '/apps'],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
