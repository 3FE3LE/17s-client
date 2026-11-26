import { SUPPORTED_LOCALES, isLocale } from '@17suit/i18n';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalPage, type LegalSection } from '../../../components/legal-page';
import { getT } from '../../../i18n';
import { absoluteUrl, pageAlternates } from '../../../lib/site-url';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ locale: string }> {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getT(locale);
  return {
    title: t('meta.termsTitle'),
    description: t('meta.termsDescription'),
    // Placeholder outline: keep out of search results until the final text is published.
    robots: { index: false, follow: true },
    alternates: pageAlternates(locale, '/terms'),
    openGraph: { url: absoluteUrl(locale, '/terms'), locale },
  };
}

// TODO(legal): every section below is a placeholder; the owner writes the text.
// Section ids are stable anchors.
const sectionIds = [
  'acceptance',
  'service',
  'account',
  'acceptable-use',
  'third-party',
  'intellectual-property',
  'liability',
  'suspension',
  'changes',
  'contact',
] as const;

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getT(locale);
  const sections: readonly LegalSection[] = sectionIds.map((id) => ({
    id,
    title: t(`legal.terms.sections.${id}`),
    body: t(`legal.terms.body.${id}`),
    linksToContact: id === 'contact',
  }));

  return (
    <LegalPage
      locale={locale}
      title={t('legal.terms.title')}
      description={t('legal.terms.description')}
      sections={sections}
    />
  );
}
