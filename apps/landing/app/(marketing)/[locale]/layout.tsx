import { SUPPORTED_LOCALES, isLocale } from '@17suit/i18n';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { RootShell } from '../../components/root-shell';
import { getT } from '../../i18n';
import { baseMetadata } from '../../lib/site-metadata';
import { absoluteUrl, pageAlternates } from '../../lib/site-url';

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ locale: string }> {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<LayoutProps, 'params'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getT(locale);

  return {
    ...baseMetadata(),
    title: t('meta.homeTitle'),
    description: t('meta.homeDescription'),
    alternates: pageAlternates(locale, '/'),
    openGraph: {
      type: 'website',
      siteName: t('meta.siteName'),
      locale,
      url: absoluteUrl(locale, '/'),
      title: t('meta.homeTitle'),
      description: t('meta.homeDescription'),
    },
  };
}

/*
 * Root layout of every marketing page. The locale comes from the URL segment
 * only: never read `cookies()` or `headers()` here, or these pages stop being
 * static (and crawlers would see one language per visitor).
 */
export default async function MarketingLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <RootShell locale={locale}>{children}</RootShell>;
}
