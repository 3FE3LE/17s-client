import { LOCALE_COOKIE, type Locale } from '@17suit/i18n';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Saves the visitor's language so the account area and later visits follow it. */
export function persistLocale(locale: Locale): void {
  const secure = window.location.protocol === 'https:' ? '; secure' : '';
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax${secure}`;
}
