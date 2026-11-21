import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import {
  ArrowUpRightIcon,
  SiteHeader,
  StatusBadge,
  productButtonClass,
  secondaryButtonClass,
} from '../components/landing-ui';
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

function ProductCta({ product, appUrl }: { product: Product; appUrl: string | null }) {
  if (appUrl) {
    return (
      <div className="mt-[var(--spacing-xl)] flex flex-wrap items-center gap-[var(--spacing-sm)]">
        <a href={appUrl} className={productButtonClass}>
          Probar {product.shortName}
          <ArrowUpRightIcon />
        </a>
        <Link href="/" className={secondaryButtonClass}>
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-[var(--spacing-xl)] grid gap-[var(--spacing-sm)]">
      <p className="m-0 max-w-[48ch] text-md leading-[1.5] text-muted">
        {product.name} todavía no está disponible. Si creas tu cuenta 17Suit hoy, la misma te
        servirá cuando abra.
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

  return (
    <main data-product={product.accentKey} className="min-h-screen bg-suit-canvas text-text">
      <div className="mx-auto max-w-[1120px] px-[var(--spacing-md)] pb-[var(--spacing-x3l)] pt-[var(--spacing-md)] md:px-[var(--spacing-lg)] md:pb-[var(--spacing-x4l)] md:pt-[var(--spacing-lg)]">
        <SiteHeader
          signInHref={authHref('/sign-in', appUrl)}
          signUpHref={authHref('/sign-up', appUrl)}
        />

        <section
          aria-labelledby="product-title"
          className="relative isolate grid grid-cols-1 items-end gap-[var(--spacing-xl)] lg:grid-cols-[minmax(0,1fr)_auto]"
        >
          <div className="min-w-0">
            <StatusBadge status={product.status} />
            <h1
              id="product-title"
              className="m-0 mt-[var(--spacing-md)] text-balance font-arvo text-[clamp(36px,5.6vw,64px)] font-bold leading-[1.05] tracking-[-0.025em] text-text"
            >
              {product.name}
            </h1>
            <p className="m-0 mt-[var(--spacing-md)] max-w-[30ch] text-balance font-amaranth text-[clamp(22px,2.6vw,30px)] leading-[1.25] text-product">
              {product.headline}
            </p>
            <p className="m-0 mt-[var(--spacing-md)] max-w-[60ch] text-[clamp(16px,1.4vw,18px)] leading-[1.55] text-muted">
              {product.summary}
            </p>
            <ProductCta product={product} appUrl={appUrl} />
          </div>

          <span
            aria-hidden="true"
            className="order-first select-none font-arvo text-[clamp(120px,22vw,280px)] font-bold leading-[0.78] tracking-[-0.04em] text-product lg:order-none lg:pr-[var(--spacing-md)]"
          >
            {product.numeral}
          </span>
        </section>

        <section aria-labelledby="steps-title" className="mt-[var(--spacing-x4l)]">
          <h2
            id="steps-title"
            className="m-0 font-amaranth text-[clamp(30px,4vw,42px)] font-bold leading-[1.15] text-text"
          >
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
        </section>

        <section
          aria-labelledby="highlights-title"
          className="mt-[var(--spacing-x3l)] grid grid-cols-1 items-start gap-[var(--spacing-lg)] border-t border-line pt-[var(--spacing-xl)] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
        >
          <h2
            id="highlights-title"
            className="m-0 font-amaranth text-[clamp(26px,3vw,34px)] font-bold leading-[1.2] text-text"
          >
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
