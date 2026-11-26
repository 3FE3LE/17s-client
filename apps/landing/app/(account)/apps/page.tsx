import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowUpRightIcon,
  StatusBadge,
  primaryButtonClass,
  productButtonClass,
  sectionHeadingClass,
} from '../../components/landing-ui';
import { SiteHeader } from '../../components/site-header';
import { getT } from '../../i18n';
import { getAccountLocale } from '../../lib/account-locale';
import { localePath } from '../../lib/locale-path';
import { getProductAppUrl, hasApp, products } from '../../lib/products';

export async function generateMetadata(): Promise<Metadata> {
  const t = getT(await getAccountLocale());
  return { title: t('meta.appsTitle'), description: t('meta.appsDescription') };
}

/*
 * "Mis apps": post-sign-up destination and the signed-in header link.
 * Lists products with a web app; upcoming ones appear here when they open,
 * because this list is derived from `hasApp` in app/lib/products.ts.
 */
export default async function AppsPage() {
  const { userId } = await auth();
  const locale = await getAccountLocale();
  const t = getT(locale);
  const liveProducts = products.filter(hasApp);
  const upcoming = products.filter((product) => !hasApp(product));

  return (
    <main className="min-h-screen bg-suit-canvas text-text">
      <div className="mx-auto max-w-[1120px] px-[var(--spacing-md)] pb-[var(--spacing-x3l)] pt-[var(--spacing-md)] md:px-[var(--spacing-lg)] md:pb-[var(--spacing-x4l)] md:pt-[var(--spacing-lg)]">
        <SiteHeader mode="account" />

        <section aria-labelledby="apps-title">
          <h1
            id="apps-title"
            className="m-0 font-arvo text-[clamp(34px,4.6vw,56px)] font-bold leading-[1.06] tracking-[-0.025em] text-text"
          >
            {t('account.apps.title')}
          </h1>
          <p className="m-0 mt-[var(--spacing-md)] max-w-[54ch] text-[clamp(16px,1.4vw,18px)] leading-[1.5] text-muted">
            {userId ? t('account.apps.introSignedIn') : t('account.apps.introSignedOut')}
          </p>

          <ul className="m-0 mt-[var(--spacing-xl)] grid list-none grid-cols-1 gap-[var(--spacing-md)] p-0 md:grid-cols-2">
            {liveProducts.map((product) => {
              const appUrl = getProductAppUrl(product);
              return (
                <li
                  key={product.slug}
                  data-product={product.accentKey}
                  className="flex flex-col gap-[var(--spacing-md)] rounded-[var(--radius-xl)] border border-line bg-[color-mix(in_oklab,var(--landing-product)_13%,var(--color-surface))] p-[var(--spacing-lg)]"
                >
                  <div className="flex items-start justify-between gap-[var(--spacing-md)]">
                    <div className="min-w-0">
                      <StatusBadge status={product.status} label={t(`status.${product.status}`)} />
                      <h2 className="m-0 mt-[var(--spacing-sm)] font-arvo text-[clamp(22px,2.4vw,28px)] font-bold leading-[1.15] text-text">
                        {product.name}
                      </h2>
                    </div>
                    <span
                      aria-hidden="true"
                      className="shrink-0 select-none font-arvo text-[64px] font-bold leading-[0.8] tracking-[-0.04em] text-product"
                    >
                      {product.numeral}
                    </span>
                  </div>
                  <p className="m-0 max-w-[44ch] text-md leading-[1.5] text-muted">
                    {t(`products.${product.accentKey}.tagline`)}
                  </p>
                  {appUrl ? (
                    <a href={appUrl} className={`${productButtonClass} mt-auto w-fit`}>
                      {t('account.apps.open', { name: product.shortName })}
                      <ArrowUpRightIcon />
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {upcoming.length > 0 ? (
          <section
            aria-labelledby="upcoming-title"
            className="mt-[var(--spacing-x3l)] border-t border-line pt-[var(--spacing-lg)]"
          >
            <h2 id="upcoming-title" className={sectionHeadingClass}>
              {t('account.apps.upcomingTitle')}
            </h2>
            <p className="m-0 mt-[var(--spacing-sm)] max-w-[60ch] text-md leading-[1.5] text-muted">
              {t('account.apps.upcomingBody')}
            </p>
            <ul className="m-0 mt-[var(--spacing-md)] flex list-none flex-wrap gap-x-[var(--spacing-lg)] p-0">
              {upcoming.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={localePath(locale, `/${product.slug}`)}
                    className="inline-flex min-h-11 items-center font-bold text-text underline underline-offset-4"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {userId ? null : (
          <div className="mt-[var(--spacing-x3l)]">
            <Link href="/sign-in?redirect_url=%2Fapps" className={primaryButtonClass}>
              {t('account.apps.signIn')}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
