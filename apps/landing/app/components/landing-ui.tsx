import Image from 'next/image';
import Link from 'next/link';
import type { SVGProps } from 'react';
import { statusLabel, type ProductStatus } from '../lib/products';

/*
 * Shared landing primitives. Colors come from design tokens only
 * (text, muted, surface, line, product, action-primary) so `.dark` works.
 */

const buttonBase =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-5 text-md font-bold leading-[1.3] no-underline transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0';

export const primaryButtonClass = `${buttonBase} border-action-primary-border bg-action-primary text-white shadow-action-primary hover:shadow-[0_16px_30px_rgb(0_145_110/0.3)]`;

export const secondaryButtonClass = `${buttonBase} border-line bg-surface text-text hover:border-[color-mix(in_oklab,var(--color-text)_32%,transparent)]`;

/** Accent button for a product's own CTA; must sit inside a `[data-product]`. */
export const productButtonClass = `${buttonBase} border-product bg-product text-on-product hover:shadow-[0_14px_28px_color-mix(in_oklab,var(--color-product)_32%,transparent)]`;

/* Icon geometry from lucide (ISC): arrow-right and arrow-up-right, 24px grid, 2px stroke. */
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

export function StatusBadge({ status }: { status: ProductStatus }) {
  const tone: Record<ProductStatus, string> = {
    live: 'border-product bg-product text-on-product',
    beta: 'border-product text-product',
    soon: 'border-line text-muted',
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
  signInHref?: string;
  signUpHref?: string;
}

export function SiteHeader({ signInHref = '/sign-in', signUpHref = '/sign-up' }: SiteHeaderProps) {
  return (
    <header className="mb-[var(--spacing-xl)] flex flex-wrap items-center justify-between gap-[var(--spacing-md)] md:mb-[var(--spacing-x3l)]">
      <Link href="/" className="inline-flex min-h-11 items-center rounded-md no-underline">
        <Image
          src="/logo-17suit@4x.svg"
          alt="17Suit, inicio"
          width={196}
          height={62}
          className="h-[40px] w-auto dark:brightness-0 dark:invert"
          priority
        />
      </Link>

      <nav aria-label="Cuenta" className="flex items-center gap-[var(--spacing-sm)]">
        <Link href={signInHref} className={secondaryButtonClass}>
          Iniciar sesión
        </Link>
        <Link href={signUpHref} className={primaryButtonClass}>
          Crear cuenta
        </Link>
      </nav>
    </header>
  );
}
