import Link from 'next/link';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  SiteHeader,
  StatusBadge,
  primaryButtonClass,
  productButtonClass,
  secondaryButtonClass,
} from './components/landing-ui';
import { getProductAppUrl, hasApp, productCount, products, type Product } from './lib/products';

const availableCount = products.filter(hasApp).length;
const upcomingCount = productCount - availableCount;

const benefits = [
  {
    title: 'Entras una vez',
    body: 'La misma cuenta abre todas las apps de 17Suit.',
  },
  {
    title: 'Vuelves a donde ibas',
    body: 'Después de iniciar sesión regresas a la app desde la que llegaste.',
  },
  {
    title: 'Recuperas el acceso tú mismo',
    body: 'Si olvidas tu contraseña, te enviamos un código a tu correo.',
  },
];

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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-suit-canvas text-text">
      <div className="mx-auto max-w-[1120px] px-[var(--spacing-md)] pb-[var(--spacing-x3l)] pt-[var(--spacing-md)] md:px-[var(--spacing-lg)] md:pb-[var(--spacing-x4l)] md:pt-[var(--spacing-lg)]">
        <SiteHeader />

        <section
          aria-labelledby="hero-title"
          className="grid grid-cols-1 items-start gap-[var(--spacing-xl)] lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-[var(--spacing-x3l)]"
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
              <Link href="/sign-up" className={primaryButtonClass}>
                Crear cuenta
              </Link>
              <Link href="#productos" className={secondaryButtonClass}>
                Ver productos
              </Link>
            </div>
          </div>

          <nav
            aria-labelledby="index-title"
            className="rounded-[var(--radius-xl)] border border-line bg-surface p-[var(--spacing-lg)] shadow-panel"
          >
            <h2
              id="index-title"
              className="m-0 font-amaranth text-[clamp(22px,2.4vw,26px)] font-bold leading-[1.2] text-text"
            >
              {productCount} productos, una cuenta
            </h2>
            <ul className="m-0 mt-[var(--spacing-md)] grid list-none p-0">
              {products.map((product) => (
                <li
                  key={product.slug}
                  data-product={product.accentKey}
                  className="border-t border-line first:border-t-0"
                >
                  <Link
                    href={`/${product.slug}`}
                    className="group grid min-h-14 grid-cols-[3.25rem_minmax(0,1fr)_auto] items-center gap-[var(--spacing-md)] rounded-md px-[var(--spacing-xs)] py-[var(--spacing-sm)] no-underline transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--color-product)_8%,transparent)]"
                  >
                    <span
                      aria-hidden="true"
                      className="text-right font-arvo text-[34px] font-bold leading-none tracking-[-0.03em] text-product tabular-nums"
                    >
                      {product.numeral}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-bold leading-[1.3] text-text">
                        {product.name}
                      </span>
                      <span className="block text-sm leading-[18px] text-muted">
                        {product.status === 'soon' ? 'Próximamente' : 'Ya puedes usarla'}
                      </span>
                    </span>
                    <ArrowRightIcon className="text-product transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        <section aria-labelledby="benefits-title" className="mt-[var(--spacing-x4l)]">
          <h2
            id="benefits-title"
            className="m-0 font-amaranth text-[clamp(30px,4vw,42px)] font-bold leading-[1.15] text-text"
          >
            Lo que ganas con una sola cuenta
          </h2>
          <dl className="m-0 mt-[var(--spacing-lg)] grid grid-cols-1 gap-[var(--spacing-lg)] md:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="border-t-2 border-text pt-[var(--spacing-md)]">
                <dt className="font-arvo text-lg font-bold leading-[1.25] text-text">
                  {benefit.title}
                </dt>
                <dd className="m-0 mt-[var(--spacing-sm)] max-w-[34ch] text-md leading-[1.5] text-muted">
                  {benefit.body}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          id="productos"
          aria-labelledby="products-title"
          className="mt-[var(--spacing-x4l)] scroll-mt-[var(--spacing-lg)]"
        >
          <div className="flex flex-wrap items-end justify-between gap-[var(--spacing-sm)]">
            <h2
              id="products-title"
              className="m-0 font-amaranth text-[clamp(30px,4vw,42px)] font-bold leading-[1.15] text-text"
            >
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
          aria-labelledby="cta-title"
          className="mt-[var(--spacing-x3l)] flex flex-col items-start justify-between gap-[var(--spacing-md)] rounded-[var(--radius-xl)] border border-line bg-surface p-[var(--spacing-lg)] shadow-panel md:flex-row md:items-center md:p-[var(--spacing-xl)]"
        >
          <div>
            <h2
              id="cta-title"
              className="m-0 font-arvo text-[clamp(24px,3vw,32px)] font-bold leading-[1.2] text-text"
            >
              Empieza con una cuenta
            </h2>
            <p className="m-0 mt-[var(--spacing-xs)] text-md leading-[1.5] text-muted">
              Es la misma para todas las apps de 17Suit.
            </p>
          </div>
          <div className="flex flex-wrap gap-[var(--spacing-sm)]">
            <Link href="/sign-up" className={primaryButtonClass}>
              Crear cuenta
            </Link>
            <Link href="/sign-in" className={secondaryButtonClass}>
              Iniciar sesión
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
