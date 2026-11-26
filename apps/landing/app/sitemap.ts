import { SUPPORTED_LOCALES } from '@17suit/i18n';
import type { MetadataRoute } from 'next';
import { products } from './lib/products';
import { absoluteUrl } from './lib/site-url';

/*
 * Indexable marketing URLs only. Legal pages are placeholders (noindex) and the
 * account area is noindex, so neither is listed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', ...products.map((product) => `/${product.slug}`), '/contact'];

  return paths.flatMap((path) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: absoluteUrl(locale, path),
      alternates: {
        languages: Object.fromEntries(
          SUPPORTED_LOCALES.map((alt) => [alt, absoluteUrl(alt, path)]),
        ),
      },
    })),
  );
}
