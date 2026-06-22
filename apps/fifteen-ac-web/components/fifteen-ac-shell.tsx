'use client';

import { useClerk } from '@clerk/nextjs';
import {
  AppProductFooter,
  AppWorkspaceShell,
  Banknote,
  CalendarClock,
  CreditCard,
  Gauge,
  Inbox,
  ListChecks,
  ReceiptText,
  Repeat2,
  appProductFooterButtonStyle,
  appProductFooterTextLinkStyle,
  cardRecipe,
  cx,
} from '@17suit/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', mark: '01', icon: Gauge },
  { href: '/settings/email-sources', label: 'Ingestion', mark: '02', icon: Inbox },
  { href: '/review', label: 'Review', mark: '03', icon: ListChecks },
  { href: '/transactions', label: 'Ledger', mark: '04', icon: ReceiptText },
  { href: '/cards', label: 'Cards', mark: '05', icon: CreditCard },
  { href: '/income', label: 'Income', mark: '06', icon: Banknote },
  { href: '/fixed-obligations', label: 'Obligations', mark: '07', icon: CalendarClock },
  { href: '/subscriptions', label: 'Subscriptions', mark: '08', icon: Repeat2 },
];

const footerLinks = navItems.slice(0, 4).map((item) => ({
  href: item.href,
  label: item.label,
}));

export function FifteenAcShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  const { signOut } = useClerk();
  const pathname = usePathname();
  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '/sign-in';

  return (
    <AppWorkspaceShell
      productName="Fifteen All Check"
      productKicker="17Suit fifteenAc"
      title={title}
      eyebrow={eyebrow}
      navItems={navItems}
      activePath={pathname}
      onSignOut={() => signOut({ redirectUrl: signInUrl })}
      linkComponent={Link}
    >
      {children}
      <AppProductFooter
        productName="Fifteen All Check"
        productSlug="fifteen-all-check"
        productTagline="Cockpit financiero personal con evidencia y revision."
        suiteName="17Suit"
        actionControls={
          <>
            <Link
              href="/"
              style={{
                ...appProductFooterButtonStyle,
                color: 'var(--color-brand-dark, #00171f)',
              }}
            >
              Ir al inicio
            </Link>
            <button
              type="button"
              onClick={() => signOut({ redirectUrl: '/sign-in?redirect_url=/' })}
              style={appProductFooterButtonStyle}
            >
              Cerrar sesion
            </button>
          </>
        }
        productLinkControls={footerLinks.map((link) => (
          <Link key={link.href} href={link.href} style={appProductFooterTextLinkStyle}>
            {link.label}
          </Link>
        ))}
      />
    </AppWorkspaceShell>
  );
}

export function DataCard({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'neutral' | 'good' | 'warn' | 'hot';
}) {
  const toneClass = {
    neutral: '',
    good: 'border-action-primary/35 bg-action-primary-soft',
    warn: 'border-warning/35 bg-feedback-warning-soft',
    hot: 'border-brand-accent/35 bg-feedback-hot-soft',
  }[tone];

  return (
    <article className={cx(cardRecipe({ variant: 'panel' }), toneClass)}>
      <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-muted">{label}</p>
      <p className="m-0 mt-[var(--spacing-sm)] font-amaranth text-[clamp(28px,4vw,40px)] leading-[1.1] text-brand-dark">
        {value}
      </p>
    </article>
  );
}

export function LoadingBlock() {
  return <div className={cardRecipe({ variant: 'feature' })}>Loading fifteenAc data...</div>;
}

export function ErrorBlock({ message }: { message: string }) {
  return (
    <div
      className={cx(
        cardRecipe({ variant: 'feature' }),
        'border-destructive/40 bg-feedback-error-soft text-brand-dark',
      )}
    >
      {message}
    </div>
  );
}
