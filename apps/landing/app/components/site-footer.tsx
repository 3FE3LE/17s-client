import type { Locale } from '@17suit/i18n';
import Image from 'next/image';
import Link from 'next/link';
import { getT } from '../i18n';
import { localePath } from '../lib/locale-path';
import { products } from '../lib/products';

const legalLinks = [
  { path: '/privacy', labelKey: 'nav.privacy' },
  { path: '/terms', labelKey: 'nav.terms' },
  { path: '/contact', labelKey: 'nav.contact' },
] as const;

const linkClass =
  'inline-flex min-h-11 items-center text-muted no-underline hover:text-text hover:underline';

/*
 * Landing-owned footer. Replaces the shared AppProductFooter here because the
 * landing needs token-based colors (dark mode), 44px tap targets and the
 * product list from `app/lib/products.ts`. Account actions live in the header only.
 */
export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getT(locale);

  return (
    <footer className="border-t border-line bg-surface text-text">
      <div className="mx-auto grid max-w-[1120px] gap-[var(--spacing-lg)] px-[var(--spacing-md)] py-[var(--spacing-xl)] md:px-[var(--spacing-lg)]">
        <div className="flex flex-wrap items-center justify-between gap-[var(--spacing-md)]">
          <div>
            <Image
              src="/logo-17suit@4x.svg"
              alt={t('nav.logoAltFooter')}
              width={196}
              height={62}
              className="h-[32px] w-auto dark:brightness-0 dark:invert"
            />
            <p className="m-0 mt-[var(--spacing-xs)] text-sm leading-[1.5] text-muted">
              {t('footer.tagline')}
            </p>
          </div>
        </div>

        <nav aria-label={t('nav.products')}>
          <ul className="m-0 flex list-none flex-wrap gap-x-[var(--spacing-md)] p-0">
            <li>
              <Link href={localePath(locale, '/')} className={`${linkClass} text-md`}>
                {t('nav.home')}
              </Link>
            </li>
            {products.map((product) => (
              <li key={product.slug}>
                <Link
                  href={localePath(locale, `/${product.slug}`)}
                  className={`${linkClass} text-md`}
                >
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-x-[var(--spacing-md)] gap-y-[var(--spacing-xs)] border-t border-line pt-[var(--spacing-md)]">
          <p className="m-0 text-sm leading-[1.5] text-muted">{t('footer.rights')}</p>
          <nav aria-label={t('nav.legal')}>
            <ul className="m-0 flex list-none flex-wrap gap-x-[var(--spacing-md)] p-0">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link href={localePath(locale, link.path)} className={`${linkClass} text-sm`}>
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
