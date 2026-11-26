'use client';

import { isLocale, SUPPORTED_LOCALES, type Locale } from '@17suit/i18n';
import { useTranslation } from '@17suit/i18n/react';
import { LanguageSelect } from '@17suit/ui';
import { usePathname, useRouter } from 'next/navigation';
import { persistLocale } from '../lib/locale-cookie';
import { localePath, stripLocale } from '../lib/locale-path';

interface LocaleSwitcherProps {
  /**
   * `marketing`: the language lives in the URL, so switching navigates to the
   * same page in the other locale. `account`: the language lives in the cookie,
   * so switching saves it and refreshes the page.
   */
  mode: 'marketing' | 'account';
}

export function LocaleSwitcher({ mode }: LocaleSwitcherProps) {
  const { i18n, t } = useTranslation('common');
  const router = useRouter();
  const pathname = usePathname();
  const current: Locale = isLocale(i18n.language) ? i18n.language : 'en';

  function handleChange(next: Locale) {
    persistLocale(next);
    if (mode === 'marketing') {
      router.push(localePath(next, stripLocale(pathname, SUPPORTED_LOCALES)));
    } else {
      router.refresh();
    }
  }

  return <LanguageSelect value={current} onChange={handleChange} label={t('language.label')} />;
}
