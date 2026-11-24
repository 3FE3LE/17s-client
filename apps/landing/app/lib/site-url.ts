import { SUPPORTED_LOCALES, type Locale } from '@17suit/i18n';
import { localePath } from './locale-path';

/** Production origin of the landing (apps-registry.json: landing = 17suit.com). */
const FALLBACK_SITE_URL = 'https://17suit.com';

export function getSiteUrl(): string {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return (value || FALLBACK_SITE_URL).replace(/\/+$/, '');
}

/** Absolute URL of a marketing page in a locale. */
export function absoluteUrl(locale: Locale, path: string): string {
  return `${getSiteUrl()}${localePath(locale, path)}`;
}

/** `alternates` metadata: canonical for this locale plus hreflang for every locale. */
export function pageAlternates(locale: Locale, path: string) {
  return {
    canonical: absoluteUrl(locale, path),
    languages: {
      ...Object.fromEntries(SUPPORTED_LOCALES.map((lng) => [lng, absoluteUrl(lng, path)])),
      'x-default': absoluteUrl('en', path),
    },
  };
}
