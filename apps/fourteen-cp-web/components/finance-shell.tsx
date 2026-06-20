'use client';

import { useClerk } from '@clerk/nextjs';
import {
  AppWorkspaceShell,
  Banknote,
  CalendarClock,
  CreditCard,
  Gauge,
  Inbox,
  ListChecks,
  ReceiptText,
  Repeat2,
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

export function FinanceShell({
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
      productName="Fourteen Cash Pulse"
      productKicker="17Suit finance"
      title={title}
      eyebrow={eyebrow}
      navItems={navItems}
      activePath={pathname}
      onSignOut={() => signOut({ redirectUrl: signInUrl })}
      linkComponent={Link}
    >
      {children}
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
    neutral: 'border-[rgba(0,23,31,0.12)] bg-white/82',
    good: 'border-[#00916e]/35 bg-[#00916e]/10',
    warn: 'border-[#f3863d]/35 bg-[#f3863d]/10',
    hot: 'border-[#ff495c]/35 bg-[#ff495c]/10',
  }[tone];

  return (
    <article className={`rounded-[var(--radius-md)] border p-[var(--spacing-md)] ${toneClass}`}>
      <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-muted">{label}</p>
      <p className="m-0 mt-[var(--spacing-sm)] font-amaranth text-[clamp(28px,4vw,40px)] leading-[1.1] text-brand-dark">
        {value}
      </p>
    </article>
  );
}

export function LoadingBlock() {
  return (
    <div className="rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.12)] bg-white/80 p-[var(--spacing-lg)]">
      Loading finance data...
    </div>
  );
}

export function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[#f8333c]/40 bg-[#f8333c]/10 p-[var(--spacing-lg)] text-brand-dark">
      {message}
    </div>
  );
}
