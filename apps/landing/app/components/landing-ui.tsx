import { SignOutButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import type { SVGProps } from 'react';
import { statusLabel, type ProductStatus } from '../lib/products';
import { SiteLogo } from './site-logo';

/*
 * Shared landing primitives. Colors come from design tokens only
 * (text, muted, surface, line, product, action-primary) so `.dark` works.
 */

const buttonBase =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 text-md font-bold leading-[1.3] no-underline transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0';

/* Dark mode drops the green glow for a neutral offset shadow (see globals.css too). */
export const primaryButtonClass = `${buttonBase} border-action-primary-border bg-action-primary text-white shadow-action-primary hover:shadow-[0_16px_30px_rgb(0_145_110/0.3)] dark:shadow-[0_4px_12px_rgb(0_0_0/0.28)] dark:hover:shadow-[0_8px_18px_rgb(0_0_0/0.32)]`;

export const secondaryButtonClass = `${buttonBase} border-line bg-surface text-text hover:border-[color-mix(in_oklab,var(--color-text)_32%,transparent)]`;

/** Accent button for a product's own CTA; must sit inside a `[data-product]`. */
export const productButtonClass = `${buttonBase} border-product bg-product text-on-product hover:shadow-[0_14px_28px_color-mix(in_oklab,var(--landing-product)_32%,transparent)] dark:hover:shadow-[0_8px_18px_rgb(0_0_0/0.32)]`;

/** Compact header control: same shape as the buttons, smaller padding. */
const compactButtonBase =
  'inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-4 text-md font-bold leading-[1.3] no-underline transition-[background-color,border-color] duration-200 ease-out motion-reduce:transition-none';

export const compactSecondaryButtonClass = `${compactButtonBase} border-line bg-surface text-text hover:border-[color-mix(in_oklab,var(--color-text)_32%,transparent)]`;

/** One heading style for every section h2 on landing pages. */
export const sectionHeadingClass =
  'm-0 font-arvo text-[clamp(28px,3.6vw,40px)] font-bold leading-[1.15] tracking-[-0.015em] text-text';

/* Icon geometry from lucide (ISC): arrow-right, arrow-up-right, arrow-down; 24px grid, 2px stroke. */
function IconBase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </IconBase>
  );
}

export function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </IconBase>
  );
}

export function ArrowDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </IconBase>
  );
}

/** Underlined text link for tertiary actions ("Volver al inicio", "Ya tengo cuenta"). */
export const textLinkClass =
  'inline-flex min-h-11 items-center px-[var(--spacing-sm)] font-bold text-text underline underline-offset-4';

export function StatusBadge({ status }: { status: ProductStatus }) {
  const tone: Record<ProductStatus, string> = {
    live: 'border-product bg-product text-on-product',
    beta: 'border-product bg-surface text-product',
    soon: 'border-line bg-surface text-muted',
  };

  return (
    <span
      className={`inline-flex w-fit items-center self-start rounded-full border px-2.5 py-0.5 text-sm font-bold leading-[18px] ${tone[status]}`}
    >
      {statusLabel[status]}
    </span>
  );
}

interface SiteHeaderProps {
  /** Where "Entrar" goes; product pages pass a `redirect_url` back to the product. */
  signInHref?: string;
}

/*
 * Server component: reads the Clerk session so signed-in visitors see
 * "Mis apps" and "Cerrar sesión" instead of the sign-in entry point.
 */
export async function SiteHeader({ signInHref = '/sign-in' }: SiteHeaderProps) {
  const { userId } = await auth();

  return (
    <header className="mb-[var(--spacing-xl)] flex flex-nowrap items-center justify-between gap-[var(--spacing-sm)] md:mb-[var(--spacing-x3l)]">
      <SiteLogo />

      <nav
        aria-label="Cuenta"
        className="flex items-center gap-[var(--spacing-xs)] md:gap-[var(--spacing-sm)]"
      >
        {userId ? (
          <>
            <Link href="/apps" className={compactSecondaryButtonClass}>
              Mis apps
            </Link>
            <SignOutButton redirectUrl="/">
              <button
                type="button"
                className="inline-flex min-h-11 cursor-pointer items-center whitespace-nowrap rounded-full border-0 bg-transparent px-3 text-md font-bold leading-[1.3] text-text underline underline-offset-4"
              >
                Cerrar sesión
              </button>
            </SignOutButton>
          </>
        ) : (
          <Link href={signInHref} className={compactSecondaryButtonClass}>
            Entrar
          </Link>
        )}
      </nav>
    </header>
  );
}
