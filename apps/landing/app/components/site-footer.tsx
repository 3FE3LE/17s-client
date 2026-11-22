import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import { products } from '../lib/products';
import { primaryButtonClass, secondaryButtonClass } from './landing-ui';

/*
 * Landing-owned footer. Replaces the shared AppProductFooter here because the
 * landing needs token-based colors (dark mode), 44px tap targets and the
 * product list from `app/lib/products.ts`.
 */
export function SiteFooter({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <footer className="border-t border-line bg-surface text-text">
      <div className="mx-auto grid max-w-[1120px] gap-[var(--spacing-lg)] px-[var(--spacing-md)] py-[var(--spacing-xl)] md:px-[var(--spacing-lg)]">
        <div className="flex flex-wrap items-center justify-between gap-[var(--spacing-md)]">
          <div>
            <p className="m-0 font-arvo text-lg font-bold leading-[1.25]">17Suit</p>
            <p className="m-0 mt-[var(--spacing-xs)] text-sm leading-[1.5] text-muted">
              Una cuenta para todas las apps de 17Suit.
            </p>
          </div>
          <div className="flex flex-wrap gap-[var(--spacing-sm)]">
            {isSignedIn ? (
              <SignOutButton redirectUrl="/sign-in">
                <button type="button" className={`${secondaryButtonClass} cursor-pointer`}>
                  Cerrar sesión
                </button>
              </SignOutButton>
            ) : (
              <>
                <Link href="/sign-in" className={secondaryButtonClass}>
                  Iniciar sesión
                </Link>
                <Link href="/sign-up" className={primaryButtonClass}>
                  Crear cuenta
                </Link>
              </>
            )}
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

        <p className="m-0 text-sm leading-[1.5] text-muted">© 2026 17Suit</p>
      </div>
    </footer>
  );
}
