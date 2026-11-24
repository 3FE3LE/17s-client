import { SUPPORTED_LOCALES, isLocale } from '@17suit/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { primaryButtonClass } from '../../../components/landing-ui';
import { ReviewNotice } from '../../../components/legal-page';
import { SiteHeader } from '../../../components/site-header';
import { getT } from '../../../i18n';
import { localePath } from '../../../lib/locale-path';
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
    title: t('meta.contactTitle'),
    description: t('meta.contactDescription'),
    alternates: pageAlternates(locale, '/contact'),
    openGraph: { url: absoluteUrl(locale, '/contact'), locale },
  };
}

/*
 * The address comes only from NEXT_PUBLIC_CONTACT_EMAIL (see .env.local.example).
 * Never hard-code an email here. Unset or malformed = no mailto link.
 */
function getContactEmail(): string | null {
  const value = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return null;
  }
  return value;
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getT(locale);
  const email = getContactEmail();

  return (
    <main className="min-h-screen bg-suit-canvas text-text">
      <div className="mx-auto max-w-[1120px] px-[var(--spacing-md)] pb-[var(--spacing-x3l)] pt-[var(--spacing-md)] md:px-[var(--spacing-lg)] md:pb-[var(--spacing-x4l)] md:pt-[var(--spacing-lg)]">
        <SiteHeader />

        <section
          aria-labelledby="contact-title"
          className="grid max-w-[60ch] gap-[var(--spacing-md)]"
        >
          <h1
            id="contact-title"
            className="m-0 text-balance font-arvo text-[clamp(34px,5vw,56px)] font-bold leading-[1.06] tracking-[-0.025em] text-text"
          >
            {t('contact.title')}
          </h1>
          <p className="m-0 text-[clamp(16px,1.4vw,18px)] leading-[1.5] text-muted">
            {t('contact.intro')}
          </p>

          {email ? (
            <div className="mt-[var(--spacing-sm)] grid gap-[var(--spacing-xs)]">
              <p className="m-0 text-sm leading-[18px] text-muted">{t('contact.emailLabel')}</p>
              <a
                href={`mailto:${email}`}
                className={`${primaryButtonClass} w-fit max-w-full break-all`}
              >
                {email}
              </a>
            </div>
          ) : (
            <ReviewNotice>{t('contact.pending')}</ReviewNotice>
          )}

          <p className="m-0 mt-[var(--spacing-md)] text-md leading-[1.5] text-muted">
            {t('contact.alsoReview')}{' '}
            <Link
              href={localePath(locale, '/privacy')}
              className="font-bold text-text underline underline-offset-4"
            >
              {t('contact.privacyLink')}
            </Link>{' '}
            {t('contact.and')}{' '}
            <Link
              href={localePath(locale, '/terms')}
              className="font-bold text-text underline underline-offset-4"
            >
              {t('contact.termsLink')}
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
