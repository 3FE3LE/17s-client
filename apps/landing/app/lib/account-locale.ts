import { LOCALE_COOKIE, parseAcceptLanguage, resolveLocale, type Locale } from '@17suit/i18n';
import { cookies, headers } from 'next/headers';

/** Locale of the dynamic account area: saved cookie > Accept-Language > en. */
export async function getAccountLocale(): Promise<Locale> {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  return resolveLocale({
    profile: 'product',
    saved: cookieStore.get(LOCALE_COOKIE)?.value ?? null,
    detected: parseAcceptLanguage(headerStore.get('accept-language')),
  });
}
