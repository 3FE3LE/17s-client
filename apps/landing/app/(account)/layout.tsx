import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { RootShell } from '../components/root-shell';
import { getT } from '../i18n';
import { baseMetadata } from '../lib/site-metadata';
import { getAccountLocale } from '../lib/account-locale';

export async function generateMetadata(): Promise<Metadata> {
  const t = getT(await getAccountLocale());
  return {
    ...baseMetadata(),
    title: t('meta.homeTitle'),
    description: t('meta.homeDescription'),
    // Sign-in, sign-up and account pages are not for search results.
    robots: { index: false, follow: false },
  };
}

/*
 * Root layout of the account area (sign-in, sign-up, password reset, SSO, apps).
 * Dynamic and `noindex`: the locale comes from the saved cookie, then the
 * browser's Accept-Language, then `en`.
 */
export default async function AccountLayout({ children }: { children: ReactNode }) {
  const locale = await getAccountLocale();
  return <RootShell locale={locale}>{children}</RootShell>;
}
