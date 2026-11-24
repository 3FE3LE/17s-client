'use client';

import { useAuth } from '@clerk/nextjs';
import { isLocale } from '@17suit/i18n';
import { useTranslation } from '@17suit/i18n/react';
import Link from 'next/link';
import { localePath } from '../lib/locale-path';
import {
  primaryButtonClass,
  secondaryButtonClass,
  sectionHeadingClass,
  textLinkClass,
} from './landing-ui';

/*
 * The only session-dependent parts of the home page. They are client components
 * so the page itself stays static; until Clerk loads they show the signed-out
 * calls to action.
 */

function useSignedIn(): boolean {
  const { isLoaded, isSignedIn } = useAuth();
  return isLoaded && Boolean(isSignedIn);
}

export function HeroActions() {
  const { t, i18n } = useTranslation('landing');
  const signedIn = useSignedIn();
  const locale = isLocale(i18n.language) ? i18n.language : 'en';

  return (
    <div className="mt-[var(--spacing-xl)] flex flex-wrap items-center gap-[var(--spacing-sm)]">
      {signedIn ? (
        <Link href="/apps" className={primaryButtonClass}>
          {t('home.openMyApps')}
        </Link>
      ) : (
        <Link href="/sign-up" className={primaryButtonClass}>
          {t('home.createAccount')}
        </Link>
      )}
      <Link href={`${localePath(locale, '/')}#products`} className={secondaryButtonClass}>
        {t('home.seeProducts')}
      </Link>
    </div>
  );
}

export function SignedOutCta() {
  const { t } = useTranslation('landing');
  const signedIn = useSignedIn();

  if (signedIn) return null;

  return (
    <section
      aria-labelledby="cta-title"
      className="mt-[var(--spacing-x3l)] flex flex-col items-start justify-between gap-[var(--spacing-md)] rounded-[var(--radius-xl)] border border-line bg-surface p-[var(--spacing-lg)] shadow-panel md:flex-row md:items-center md:p-[var(--spacing-xl)]"
    >
      <div>
        <h2 id="cta-title" className={sectionHeadingClass}>
          {t('home.ctaTitle')}
        </h2>
        <p className="m-0 mt-[var(--spacing-xs)] text-md leading-[1.5] text-muted">
          {t('home.ctaBody')}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-[var(--spacing-sm)]">
        <Link href="/sign-up" className={primaryButtonClass}>
          {t('home.createAccount')}
        </Link>
        <Link href="/sign-in" className={textLinkClass}>
          {t('home.haveAccount')}
        </Link>
      </div>
    </section>
  );
}
