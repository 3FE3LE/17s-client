'use client';

import { createI18n, type Locale } from '@17suit/i18n';
import { I18nextProvider } from '@17suit/i18n/react';
import { useMemo, type ReactNode } from 'react';
import { landingResources } from '../i18n';

/** Client-side i18n for the interactive pieces (header, forms). Server pages use `getT`. */
export function LandingI18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const i18n = useMemo(() => createI18n({ locale, resources: landingResources }), [locale]);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
