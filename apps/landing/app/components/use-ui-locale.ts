import { DEFAULT_LOCALE, isLocale, type Locale } from '@17suit/i18n';
import { useTranslation } from '@17suit/i18n/react';

/** Active UI locale from the nearest `LandingI18nProvider`. */
export function useUiLocale(): Locale {
  const { i18n } = useTranslation('landing');
  return isLocale(i18n.language) ? i18n.language : DEFAULT_LOCALE;
}
