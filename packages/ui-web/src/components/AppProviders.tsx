'use client';

import { DEFAULT_LOCALE, type Locale } from '@17suit/i18n';
import { I18nProvider } from '@17suit/i18n/react';
import type { PropsWithChildren } from 'react';
import { ToastProvider } from '../feedback/toast';
import { ThemeProvider } from '../theme/theme-context';

export interface AppProvidersProps extends PropsWithChildren {
  /** Resolved on the server with `getProductLocale()` from `@17suit/i18n/next`. */
  locale?: Locale;
  /** Product catalogs merged over the shared `common` and `errors` ones. */
  resources?: Partial<Record<Locale, Record<string, object>>>;
}

/**
 * Web theme: one mechanism, the `dark` class on <html>. Render
 * `<ThemeScript />` inside <head> of the root layout (with
 * `suppressHydrationWarning` on <html>) so the stored preference applies
 * before first paint; ThemeProvider and AppThemeToggle read the same store.
 * Language: pass the server-resolved `locale` so client components can use
 * `useTranslation`.
 */
export function AppProviders({ children, locale = DEFAULT_LOCALE, resources }: AppProvidersProps) {
  return (
    <I18nProvider locale={locale} {...(resources ? { resources } : {})}>
      <ThemeProvider>
        {children}
        <ToastProvider />
      </ThemeProvider>
    </I18nProvider>
  );
}
