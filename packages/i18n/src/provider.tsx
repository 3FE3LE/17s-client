'use client';

import { I18nextProvider } from 'react-i18next';
import { useMemo, type ReactNode } from 'react';

import { createI18n, type CreateI18nOptions } from './create-i18n';
import type { Locale } from './locales';

export interface I18nProviderProps {
  locale: Locale;
  resources?: CreateI18nOptions['resources'];
  children: ReactNode;
}

/** One i18next instance per locale; shared `common` and `errors` catalogs always included. */
export function I18nProvider({ locale, resources, children }: I18nProviderProps) {
  const i18n = useMemo(
    () => createI18n({ locale, resources: resources ?? {} }),
    [locale, resources],
  );
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
