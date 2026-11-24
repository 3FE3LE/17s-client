import { isLocale, type Locale } from '@17suit/i18n';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HeroActions, SignedOutCta } from '../../components/home-actions';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  StatusBadge,
  productButtonClass,
  sectionHeadingClass,
} from '../../components/landing-ui';
import { FifteenReviewMock, SevenSlotMock } from '../../components/product-mocks';
import { SiteHeader } from '../../components/site-header';
import { getT, tList, type LandingT } from '../../i18n';
import { localePath } from '../../lib/locale-path';
import { getProductAppUrl, hasApp, productCount, products, type Product } from '../../lib/products';
import { pageAlternates } from '../../lib/site-url';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { alternates: pageAlternates(locale, '/') };
}

const availableCount = products.filter(hasApp).length;
const upcomingCount = productCount - availableCount;

/*
 * Hero visual: the two open products, shown as their own sample screens.
 * On mobile only the Fifteen screen shows, after the CTAs and at a smaller size.
 */
function HeroProducts({ t }: { t: LandingT }) {
  return (
    <div className="relative mx-auto grid w-full max-w-[400px] gap-[var(--spacing-md)] lg:mx-0 lg:max-w-none">
      <div data-product="fifteen">
        <FifteenReviewMock t={t} compact caption={t('mocks.heroFifteen')} />
      </div>
      <div data-product="seven" className="hidden lg:ml-[var(--spacing-xl)] lg:block">
        <SevenSlotMock t={t} compact caption={t('mocks.heroSeven')} />
      </div>
    </div>
  );
}

function ProductCard({ product, locale, t }: { product: Product; locale: Locale; t: LandingT }) {
  const appUrl = getProductAppUrl(product);
  const featured = hasApp(product);

  return (
    <article
      data-product={product.accentKey}
      className={`group relative isolate flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-line bg-[color-mix(in_oklab,var(--landing-product)_13%,var(--color-surface))] p-[var(--spacing-lg)] transition-[transform,box-shadow,border-color] duration-300 ease-out focus-within:border-product hover:-translate-y-1 hover:border-product hover:shadow-[0_18px_40px_color-mix(in_oklab,var(--landing-product)_18%,transparent)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        featured ? 'md:col-span-3 md:min-h-[340px]' : 'md:col-span-2'
      }`}
    >
      <div className="flex items-start justify-between gap-[var(--spacing-md)]">
        <div className="min-w-0">
          <StatusBadge status={product.status} label={t(`status.${product.status}`)} />
          <h3
            className={`m-0 mt-[var(--spacing-md)] max-w-[14ch] text-balance font-arvo font-bold leading-[1.12] text-text ${
              featured ? 'text-[clamp(26px,3vw,34px)]' : 'text-lg'
            }`}
          >
            {product.name}
          </h3>
        </div>
        <span
          aria-hidden="true"
          className={`shrink-0 select-none font-arvo font-bold leading-[0.8] tracking-[-0.04em] text-product transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.04] motion-reduce:transition-none ${
            featured ? 'text-[clamp(88px,11vw,152px)]' : 'text-[clamp(64px,7vw,96px)]'
          }`}
        >
          {product.numeral}
        </span>
      </div>
      <p className="m-0 mt-[var(--spacing-sm)] max-w-[40ch] text-md leading-[1.5] text-muted">
        {t(`products.${product.accentKey}.tagline`)}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-x-[var(--spacing-md)] gap-y-[var(--spacing-sm)] pt-[var(--spacing-lg)]">
        {appUrl ? (
          <a href={appUrl} className={`${productButtonClass} relative z-10`}>
            {t('home.tryInApp')}
            <span className="sr-only"> {product.shortName}</span>
            <ArrowUpRightIcon />
          </a>
        ) : null}
        <Link
          href={localePath(locale, `/${product.slug}`)}
          className="inline-flex min-h-11 items-center gap-2 rounded-md font-bold text-product no-underline after:absolute after:inset-0 after:content-[''] hover:underline"
        >
          {t('home.seeDetails')}
          <span className="sr-only"> {product.name}</span>
          <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getT(locale);
  const benefits = tList(t, 'home.benefits');

  return (
    <main className="min-h-screen bg-suit-canvas text-text">
      <div className="mx-auto max-w-[1120px] px-[var(--spacing-md)] pb-[var(--spacing-x3l)] pt-[var(--spacing-md)] md:px-[var(--spacing-lg)] md:pb-[var(--spacing-x4l)] md:pt-[var(--spacing-lg)]">
        <SiteHeader />

        <section
          aria-labelledby="hero-title"
          className="grid grid-cols-1 items-center gap-[var(--spacing-xl)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-[var(--spacing-x3l)]"
        >
          <div className="pt-[var(--spacing-sm)] lg:pt-[var(--spacing-lg)]">
            <h1
              id="hero-title"
              className="m-0 max-w-[18ch] text-balance font-arvo text-[clamp(36px,4.8vw,60px)] font-bold leading-[1.04] tracking-[-0.025em] text-text"
            >
              {t('home.heroTitle')}
            </h1>
            <p className="m-0 mt-[var(--spacing-lg)] max-w-[54ch] text-[clamp(17px,1.6vw,20px)] leading-[1.5] text-muted">
              {t('home.heroBody')}
            </p>
            <HeroActions />
          </div>

          <HeroProducts t={t} />
        </section>

        <section
          id="products"
          aria-labelledby="products-title"
          className="mt-[var(--spacing-x4l)] scroll-mt-[var(--spacing-lg)]"
        >
          <div className="flex flex-wrap items-end justify-between gap-[var(--spacing-sm)]">
            <h2 id="products-title" className={sectionHeadingClass}>
              {t('home.productsTitle')}
            </h2>
            <p className="m-0 max-w-[52ch] text-md leading-[1.5] text-muted">
              {t('home.productsIntro', { available: availableCount, upcoming: upcomingCount })}
            </p>
          </div>

          <div className="mt-[var(--spacing-lg)] grid grid-cols-1 gap-[var(--spacing-md)] md:grid-cols-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} locale={locale} t={t} />
            ))}
          </div>
        </section>

        <section
          aria-labelledby="benefits-title"
          className="mt-[var(--spacing-xl)] flex flex-wrap items-baseline gap-x-[var(--spacing-lg)] gap-y-[var(--spacing-xs)] border-t border-line pt-[var(--spacing-md)]"
        >
          <h2
            id="benefits-title"
            className="m-0 font-arvo text-md font-bold leading-[1.4] text-text"
          >
            {t('home.benefitsTitle')}
          </h2>
          <ul className="m-0 flex list-none flex-wrap gap-x-[var(--spacing-lg)] gap-y-[var(--spacing-xs)] p-0 text-md leading-[1.5] text-muted">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-baseline gap-[var(--spacing-xs)]">
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-brand-secondary"
                />
                {benefit}
              </li>
            ))}
          </ul>
        </section>

        <SignedOutCta />
      </div>
    </main>
  );
}
