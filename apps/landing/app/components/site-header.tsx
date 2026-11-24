'use client';

import { useAuth } from '@clerk/nextjs';
import { isLocale, type Locale } from '@17suit/i18n';
import { useTranslation } from '@17suit/i18n/react';
import Link from 'next/link';
import { compactSecondaryButtonClass } from './landing-ui';
import { LocaleSwitcher } from './locale-switcher';
import { SignOutControl } from './sign-out-control';
import { SiteLogo } from './site-logo';

interface SiteHeaderProps {
  /** Where "Sign in" goes; product pages pass a `redirect_url` back to the product. */
  signInHref?: string;
  /** `marketing` pages carry the locale in the URL; the account area in a cookie. */
  mode?: 'marketing' | 'account';
}

/*
 * Client component on purpose: reading the session here (not with `auth()` on
 * the server) keeps every marketing page static. Until Clerk loads, the header
 * shows the signed-out entry point.
 */
export function SiteHeader({ signInHref = '/sign-in', mode = 'marketing' }: SiteHeaderProps) {
  const { t, i18n } = useTranslation('landing');
  const { isLoaded, isSignedIn } = useAuth();
  const locale: Locale = isLocale(i18n.language) ? i18n.language : 'en';
  const signedIn = isLoaded && isSignedIn;

  return (
    <header className="mb-[var(--spacing-xl)] flex flex-nowrap items-center justify-between gap-[var(--spacing-sm)] md:mb-[var(--spacing-x3l)]">
      <SiteLogo locale={locale} />

      <nav
        aria-label={t('nav.account')}
        className="flex items-center gap-[var(--spacing-xs)] md:gap-[var(--spacing-sm)]"
      >
        <LocaleSwitcher mode={mode} />
        {signedIn ? (
          <>
            <Link href="/apps" className={compactSecondaryButtonClass}>
              {t('nav.myApps')}
            </Link>
            <SignOutControl
              label={t('nav.signOut')}
              className="inline-flex min-h-11 cursor-pointer items-center whitespace-nowrap rounded-full border-0 bg-transparent px-3 text-md font-bold leading-[1.3] text-text underline underline-offset-4"
            />
          </>
        ) : (
          <Link href={signInHref} className={compactSecondaryButtonClass}>
            {t('nav.signIn')}
          </Link>
        )}
      </nav>
    </header>
  );
}
