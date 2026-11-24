import type { Locale } from '@17suit/i18n';
import { WebAuthProvider } from '@17suit/core/auth/next';
import { ThemeScript } from '@17suit/ui';
import { AppProviders } from '@17suit/ui/app-providers';
import type { ReactNode } from 'react';
import { fontVariables } from '../lib/fonts';
import '../globals.css';
import { LandingI18nProvider } from './i18n-provider';
import { SiteFooter } from './site-footer';

/*
 * Document shell shared by the two root layouts: `(marketing)/[locale]` (locale
 * from the URL, static) and `(account)` (locale from the cookie, dynamic).
 */
export function RootShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html
      lang={locale}
      className={fontVariables}
      // ThemeScript sets the `dark` class before hydration.
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <WebAuthProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInForceRedirectUrl="/"
          signUpForceRedirectUrl="/apps"
        >
          <AppProviders>
            <LandingI18nProvider locale={locale}>
              {children}
              <SiteFooter locale={locale} />
            </LandingI18nProvider>
          </AppProviders>
        </WebAuthProvider>
      </body>
    </html>
  );
}
