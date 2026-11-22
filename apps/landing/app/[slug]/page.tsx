import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  SiteHeader,
  StatusBadge,
  productButtonClass,
  secondaryButtonClass,
  sectionHeadingClass,
} from '../components/landing-ui';
import { FifteenReviewMock, SevenSlotMock } from '../components/product-mocks';
import {
  getProduct,
  getProductAppUrl,
  legacySlugRedirects,
  products,
  type Product,
} from '../lib/products';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return [
    ...products.map((product) => ({ slug: product.slug })),
    ...Object.keys(legacySlugRedirects).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: 'Producto no encontrado | 17Suit' };
  }

  return {
    title: `${product.name} | 17Suit`,
    description: product.tagline,
  };
}

function authHref(path: '/sign-in' | '/sign-up', target: string | null): string {
  return target ? `${path}?redirect_url=${encodeURIComponent(target)}` : path;
}

const productMocks: Partial<Record<Product['accentKey'], () => React.JSX.Element>> = {
  fifteen: FifteenReviewMock,
  seven: SevenSlotMock,
};

function ProductCta({ product, appUrl }: { product: Product; appUrl: string | null }) {
  if (appUrl) {
    return (
      <div className="mt-[var(--spacing-xl)] grid gap-[var(--spacing-sm)]">
        {product.status === 'beta' ? (
          <p className="m-0 max-w-[52ch] text-sm leading-[1.4] text-muted">
            Beta: ya puedes usarla; algunas pantallas todavía pueden cambiar.
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-[var(--spacing-sm)]">
          <a href={appUrl} className={productButtonClass}>
            Probar {product.shortName}
            <ArrowUpRightIcon />
          </a>
          <Link href="/" className={secondaryButtonClass}>
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[var(--spacing-xl)] grid gap-[var(--spacing-sm)]">
      <p className="m-0 max-w-[48ch] text-md leading-[1.5] text-muted">
        {product.name} todavía no abre. Crea tu cuenta 17Suit; cuando {product.shortName} abra,
        aparecerá en Mis apps y entrarás con la misma cuenta.
      </p>
      <div className="flex flex-wrap items-center gap-[var(--spacing-sm)]">
        <Link href="/sign-up" className={secondaryButtonClass}>
          Crear cuenta 17Suit
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center px-[var(--spacing-sm)] font-bold text-text underline"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

/*
 * Neutral pointer to the privacy policy for products that ask for account access
 * (Fifteen's Gmail step). Make no claims here about scopes, storage or retention:
 * that text belongs to the owner-written /privacidad page.
 */
function DataNotice({ anchor }: { anchor: string }) {
  return (
    <aside
      aria-labelledby="data-notice-title"
      className="mt-[var(--spacing-md)] flex flex-wrap items-center justify-between gap-x-[var(--spacing-lg)] gap-y-[var(--spacing-xs)] rounded-[var(--radius-lg)] border border-line bg-surface px-[var(--spacing-lg)] py-[var(--spacing-sm)]"
    >
      <div className="min-w-0">
        <h3
          id="data-notice-title"
          className="m-0 font-arvo text-md font-bold leading-[1.3] text-text"
        >
          Tus datos
        </h3>
        <p className="m-0 mt-[2px] text-md leading-[1.5] text-muted">
          Antes de conectar tu correo, revisa cómo tratamos tus datos.
        </p>
      </div>
      <Link
        href={`/privacidad#${anchor}`}
        className="inline-flex min-h-11 items-center gap-2 font-bold text-product underline underline-offset-4"
      >
        Leer la política de privacidad
        <ArrowRightIcon />
      </Link>
    </aside>
  );
}

export default async function ProductLandingPage({ params }: PageProps) {
  const { slug } = await params;

  const legacyTarget = legacySlugRedirects[slug];
  if (legacyTarget) {
    permanentRedirect(`/${legacyTarget}`);
  }

  const product = getProduct(slug);
  if (!product) {
    notFound();
  }

  const appUrl = getProductAppUrl(product);
  const isSoon = product.status === 'soon';
  const Mock = productMocks[product.accentKey];

  return (
    <main data-product={product.accentKey} className="min-h-screen bg-suit-canvas text-text">
      <div className="mx-auto max-w-[1120px] px-[var(--spacing-md)] pb-[var(--spacing-x3l)] pt-[var(--spacing-md)] md:px-[var(--spacing-lg)] md:pb-[var(--spacing-x4l)] md:pt-[var(--spacing-lg)]">
        <SiteHeader signInHref={authHref('/sign-in', appUrl)} />

        <section
          aria-labelledby="product-title"
          className={`grid grid-cols-1 gap-x-[var(--spacing-x3l)] gap-y-[var(--spacing-lg)] ${
            Mock
              ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:grid-rows-[auto_1fr]'
              : 'lg:grid-cols-[minmax(0,1fr)_auto]'
          }`}
        >
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <div className="flex items-center gap-[var(--spacing-md)]">
              <span
                aria-hidden="true"
                className={`select-none font-arvo text-[clamp(48px,5vw,64px)] font-bold leading-[0.8] tracking-[-0.04em] text-product ${Mock ? '' : 'lg:hidden'}`}
              >
                {product.numeral}
              </span>
              <StatusBadge status={product.status} />
            </div>
            <h1
              id="product-title"
              className="m-0 mt-[var(--spacing-md)] text-balance font-arvo text-[clamp(36px,5vw,60px)] font-bold leading-[1.05] tracking-[-0.025em] text-text"
            >
              {product.name}
            </h1>
          </div>

          {Mock ? (
            <div className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
              <Mock />
            </div>
          ) : (
            <span
              aria-hidden="true"
              className="hidden select-none self-end font-arvo text-[clamp(120px,16vw,200px)] font-bold leading-[0.78] tracking-[-0.04em] text-product opacity-90 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:block"
            >
              {product.numeral}
            </span>
          )}

          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <p className="m-0 max-w-[30ch] text-balance font-arvo text-[clamp(24px,2.4vw,28px)] font-normal leading-[1.28] text-product">
              {product.headline}
            </p>
            <p className="m-0 mt-[var(--spacing-md)] max-w-[60ch] text-[clamp(16px,1.4vw,18px)] leading-[1.55] text-muted">
              {product.summary}
            </p>
            <ProductCta product={product} appUrl={appUrl} />
          </div>
        </section>

        <section aria-labelledby="steps-title" className="mt-[var(--spacing-x4l)]">
          <h2 id="steps-title" className={sectionHeadingClass}>
            {isSoon ? 'Cómo funcionará' : 'Cómo funciona'}
          </h2>
          <ol className="m-0 mt-[var(--spacing-lg)] grid list-none grid-cols-1 gap-[var(--spacing-md)] p-0 md:grid-cols-3">
            {product.steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-[var(--radius-lg)] border border-line bg-[color-mix(in_oklab,var(--color-product)_7%,var(--color-surface))] p-[var(--spacing-lg)]"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-product font-arvo text-lg font-bold leading-none text-on-product">
                  <span className="sr-only">Paso </span>
                  {index + 1}
                </span>
                <h3 className="m-0 mt-[var(--spacing-md)] font-arvo text-lg font-bold leading-[1.25] text-text">
                  {step.title}
                </h3>
                <p className="m-0 mt-[var(--spacing-sm)] text-md leading-[1.5] text-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
          {product.privacyAnchor ? <DataNotice anchor={product.privacyAnchor} /> : null}
        </section>

        <section
          aria-labelledby="highlights-title"
          className="mt-[var(--spacing-x3l)] grid grid-cols-1 items-start gap-[var(--spacing-lg)] border-t border-line pt-[var(--spacing-xl)] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
        >
          <h2 id="highlights-title" className={sectionHeadingClass}>
            {isSoon ? 'Lo que podrás hacer' : 'Lo que puedes hacer'}
          </h2>
          <ul className="m-0 grid list-none gap-[var(--spacing-md)] p-0">
            {product.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-[var(--spacing-sm)]">
                <span
                  aria-hidden="true"
                  className="mt-[8px] size-2.5 shrink-0 rounded-full bg-product"
                />
                <span className="text-md leading-[1.5] text-text">{highlight}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
