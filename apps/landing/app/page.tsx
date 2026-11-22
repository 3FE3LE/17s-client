import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  SiteHeader,
  StatusBadge,
  primaryButtonClass,
  productButtonClass,
  secondaryButtonClass,
  sectionHeadingClass,
} from './components/landing-ui';
import { getProductAppUrl, hasApp, productCount, products, type Product } from './lib/products';

const availableCount = products.filter(hasApp).length;
const upcomingCount = productCount - availableCount;

const benefits = [
  'Entras una vez y abres cualquier app de 17Suit',
  'Vuelves a la app desde la que llegaste',
  'Recuperas tu contraseña con un código en tu correo',
];

/*
 * Hero mark: the product numerals as one composition. Decorative only; the
 * product grid below is the single list of products on this page.
 */
function NumeralMark() {
  return (
    <div
      aria-hidden="true"
      className="grid select-none grid-cols-[repeat(5,auto)] items-end justify-start gap-x-[clamp(10px,2vw,28px)] lg:justify-end"
    >
      {products.map((product, index) => (
        <span
          key={product.slug}
          data-product={product.accentKey}
          className={`font-arvo font-bold leading-[0.8] tracking-[-0.04em] text-product tabular-nums ${
            index < 2 ? 'text-[clamp(64px,10vw,148px)]' : 'text-[clamp(40px,5.5vw,80px)] opacity-80'
          }`}
        >
          {product.numeral}
        </span>
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const appUrl = getProductAppUrl(product);
  const featured = hasApp(product);

  return (
    <article
      data-product={product.accentKey}
      className={`group relative isolate flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-line bg-[color-mix(in_oklab,var(--color-product)_7%,var(--color-surface))] p-[var(--spacing-lg)] transition-[transform,box-shadow,border-color] duration-300 ease-out focus-within:border-product hover:-translate-y-1 hover:border-product hover:shadow-[0_18px_40px_color-mix(in_oklab,var(--color-product)_18%,transparent)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        featured ? 'md:col-span-3 md:min-h-[340px]' : 'md:col-span-2'
      }`}
    >
      <div className="flex items-start justify-between gap-[var(--spacing-md)]">
        <div className="min-w-0">
          <StatusBadge status={product.status} />
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
        {product.tagline}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-x-[var(--spacing-md)] gap-y-[var(--spacing-sm)] pt-[var(--spacing-lg)]">
        {appUrl ? (
          <a href={appUrl} className={`${productButtonClass} relative z-10`}>
            Probar {product.shortName}
            <ArrowUpRightIcon />
          </a>
        ) : null}
        <Link
          href={`/${product.slug}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-md font-bold text-product no-underline after:absolute after:inset-0 after:content-[''] hover:underline"
        >
          Ver {product.shortName}
          <ArrowRightIcon className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

export default async function HomePage() {
  const { userId } = await auth();
  const isSignedIn = Boolean(userId);

  return (
    <main className="min-h-screen bg-suit-canvas text-text">
      <div className="mx-auto max-w-[1120px] px-[var(--spacing-md)] pb-[var(--spacing-x3l)] pt-[var(--spacing-md)] md:px-[var(--spacing-lg)] md:pb-[var(--spacing-x4l)] md:pt-[var(--spacing-lg)]">
        <SiteHeader />

        <section
          aria-labelledby="hero-title"
          className="grid grid-cols-1 items-end gap-[var(--spacing-xl)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-[var(--spacing-x3l)]"
        >
          <div className="pt-[var(--spacing-sm)] lg:pt-[var(--spacing-lg)]">
            <h1
              id="hero-title"
              className="m-0 max-w-[18ch] text-balance font-arvo text-[clamp(36px,4.8vw,60px)] font-bold leading-[1.04] tracking-[-0.025em] text-text"
            >
              Una app para cada pendiente. Una sola cuenta para todas.
            </h1>
            <p className="m-0 mt-[var(--spacing-lg)] max-w-[54ch] text-[clamp(17px,1.6vw,20px)] leading-[1.5] text-muted">
              Revisa tus gastos con Fifteen y reserva cancha con Seven. Pronto también podrás
              planear viajes, ordenar tu clóset y agendar tu corte. Entras una vez y sigues en
              cualquier app de 17Suit.
            </p>
            <div className="mt-[var(--spacing-xl)] flex flex-wrap items-center gap-[var(--spacing-sm)]">
              {isSignedIn ? (
                <Link href="/apps" className={primaryButtonClass}>
                  Abrir mis apps
                </Link>
              ) : (
                <Link href="/sign-up" className={primaryButtonClass}>
                  Crear cuenta
                </Link>
              )}
              <Link href="#productos" className={secondaryButtonClass}>
                Ver productos
              </Link>
            </div>
          </div>

          <NumeralMark />
        </section>

        <section
          id="productos"
          aria-labelledby="products-title"
          className="mt-[var(--spacing-x4l)] scroll-mt-[var(--spacing-lg)]"
        >
          <div className="flex flex-wrap items-end justify-between gap-[var(--spacing-sm)]">
            <h2 id="products-title" className={sectionHeadingClass}>
              Productos
            </h2>
            <p className="m-0 text-md leading-[1.5] text-muted">
              {availableCount} disponibles hoy y {upcomingCount} en camino.
            </p>
          </div>

          <div className="mt-[var(--spacing-lg)] grid grid-cols-1 gap-[var(--spacing-md)] md:grid-cols-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
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
            Con una sola cuenta:
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

        {isSignedIn ? null : (
          <section
            aria-labelledby="cta-title"
            className="mt-[var(--spacing-x3l)] flex flex-col items-start justify-between gap-[var(--spacing-md)] rounded-[var(--radius-xl)] border border-line bg-surface p-[var(--spacing-lg)] shadow-panel md:flex-row md:items-center md:p-[var(--spacing-xl)]"
          >
            <div>
              <h2 id="cta-title" className={sectionHeadingClass}>
                Empieza con una cuenta
              </h2>
              <p className="m-0 mt-[var(--spacing-xs)] text-md leading-[1.5] text-muted">
                Es la misma para todas las apps de 17Suit.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-[var(--spacing-sm)]">
              <Link href="/sign-up" className={primaryButtonClass}>
                Crear cuenta
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex min-h-11 items-center px-[var(--spacing-sm)] font-bold text-text underline underline-offset-4"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
