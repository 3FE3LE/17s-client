import Image from 'next/image';
import Link from 'next/link';
import { products } from '../lib/products';

const legalLinks = [
  { href: '/privacidad', label: 'Privacidad' },
  { href: '/terminos', label: 'Términos' },
  { href: '/contacto', label: 'Contacto' },
] as const;

/*
 * Landing-owned footer. Replaces the shared AppProductFooter here because the
 * landing needs token-based colors (dark mode), 44px tap targets and the
 * product list from `app/lib/products.ts`. Account actions live in the header only.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface text-text">
      <div className="mx-auto grid max-w-[1120px] gap-[var(--spacing-lg)] px-[var(--spacing-md)] py-[var(--spacing-xl)] md:px-[var(--spacing-lg)]">
        <div className="flex flex-wrap items-center justify-between gap-[var(--spacing-md)]">
          <div>
            <Image
              src="/logo-17suit@4x.svg"
              alt="17Suit"
              width={196}
              height={62}
              className="h-[32px] w-auto dark:brightness-0 dark:invert"
            />
            <p className="m-0 mt-[var(--spacing-xs)] text-sm leading-[1.5] text-muted">
              Una cuenta para todas las apps de 17Suit.
            </p>
          </div>
        </div>

        <nav aria-label="Productos">
          <ul className="m-0 flex list-none flex-wrap gap-x-[var(--spacing-md)] p-0">
            <li>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center text-md text-muted no-underline hover:text-text hover:underline"
              >
                Inicio
              </Link>
            </li>
            {products.map((product) => (
              <li key={product.slug}>
                <Link
                  href={`/${product.slug}`}
                  className="inline-flex min-h-11 items-center text-md text-muted no-underline hover:text-text hover:underline"
                >
                  {product.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-x-[var(--spacing-md)] gap-y-[var(--spacing-xs)] border-t border-line pt-[var(--spacing-md)]">
          <p className="m-0 text-sm leading-[1.5] text-muted">© 2026 17Suit</p>
          <nav aria-label="Legal y contacto">
            <ul className="m-0 flex list-none flex-wrap gap-x-[var(--spacing-md)] p-0">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-sm text-muted no-underline hover:text-text hover:underline"
                  >
                    {link.label}
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
