import { DEFAULT_LOCALE, type Locale } from '@17suit/i18n';

/**
 * Public path of a marketing page: `en` is unprefixed (`/contact`), the others
 * carry their code (`/es/contact`). `proxy.ts` rewrites unprefixed paths to `/en`.
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path;
  return locale === DEFAULT_LOCALE ? clean || '/' : `/${locale}${clean}`;
}

/** Strips a leading locale segment: `/es/contact` becomes `/contact`. */
export function stripLocale(pathname: string, locales: readonly string[]): string {
  const [, first = '', ...rest] = pathname.split('/');
  return locales.includes(first) ? `/${rest.join('/')}`.replace(/\/$/, '') || '/' : pathname;
}
