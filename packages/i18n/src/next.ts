import { cookies, headers } from 'next/headers';

import { LOCALE_COOKIE, parseAcceptLanguage, type Locale } from './locales';
import { resolveLocale } from './resolve-locale';

/**
 * Locale of a product web app (dynamic rendering): saved cookie >
 * Accept-Language > default. Never call it from marketing routes: reading
 * cookies/headers makes the page dynamic.
 */
export async function getProductLocale(): Promise<Locale> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  return resolveLocale({
    profile: 'product',
    saved: cookieStore.get(LOCALE_COOKIE)?.value ?? null,
    detected: parseAcceptLanguage(headerStore.get('accept-language')),
  });
}
