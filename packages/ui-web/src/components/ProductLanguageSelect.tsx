'use client';

import { LOCALE_COOKIE, isLocale, type Locale } from '@17suit/i18n';
import { useTranslation } from '@17suit/i18n/react';

import { LanguageSelect } from './LanguageSelect';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export interface ProductLanguageSelectProps {
  className?: string;
  /** Runs after the choice is saved; defaults to a full reload so server components re-render. */
  onChanged?: (locale: Locale) => void;
}

/**
 * Language control for product web apps: saves the choice in the
 * `suit-locale` cookie, which `getProductLocale()` reads on the server.
 */
export function ProductLanguageSelect({ className, onChanged }: ProductLanguageSelectProps) {
  const { i18n, t } = useTranslation('common');
  const current: Locale = isLocale(i18n.language) ? i18n.language : 'en';

  function handleChange(next: Locale) {
    const secure = window.location.protocol === 'https:' ? '; secure' : '';
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax${secure}`;
    if (onChanged) onChanged(next);
    else window.location.reload();
  }

  return (
    <LanguageSelect
      value={current}
      onChange={handleChange}
      label={t('language.label')}
      {...(className ? { className } : {})}
    />
  );
}
