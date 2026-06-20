'use client';

import { LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ElementType, PropsWithChildren, ReactNode } from 'react';

export type AppWorkspaceNavItem = {
  href: string;
  label: string;
  mark?: string;
  icon?: LucideIcon;
};

export interface AppWorkspaceShellProps extends PropsWithChildren {
  productName: string;
  productKicker?: string;
  title: string;
  eyebrow: string;
  navItems: AppWorkspaceNavItem[];
  activePath?: string;
  homeHref?: string;
  onSignOut?: () => void;
  signOutLabel?: string;
  linkComponent?: ElementType<{ href: string; className?: string; children: ReactNode }>;
}

export function AppWorkspaceShell({
  productName,
  productKicker = '17Suit product',
  title,
  eyebrow,
  navItems,
  activePath = '',
  homeHref = '/',
  onSignOut,
  signOutLabel = 'Log out',
  linkComponent: LinkComponent = 'a',
  children,
}: AppWorkspaceShellProps) {
  return (
    <main className="relative min-h-screen overflow-clip bg-[radial-gradient(circle_at_8%_1%,rgba(53,167,255,0.22),transparent_40%),radial-gradient(circle_at_96%_4%,rgba(255,73,92,0.14),transparent_34%),linear-gradient(155deg,#fbfcff_0%,#f7f8fa_46%,#eef4f8_100%)] text-text">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[24vw] -top-[24vw] z-0 h-[min(58vw,690px)] w-[min(58vw,690px)] rotate-[-15deg] rounded-[var(--radius-xl)] bg-[conic-gradient(from_180deg,rgba(0,145,110,0.18),rgba(53,167,255,0.15),rgba(255,73,92,0.14))]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-52px] left-[6vw] z-0 h-[140px] w-[min(64vw,720px)] skew-x-[-24deg] bg-[linear-gradient(90deg,rgba(53,167,255,0.2),rgba(0,145,110,0))]"
      />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[286px_1fr]">
        <aside className="border-b border-[rgba(0,23,31,0.12)] bg-white/82 px-[var(--spacing-md)] py-[var(--spacing-md)] backdrop-blur-sm lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-[var(--spacing-lg)] lg:py-[var(--spacing-lg)]">
          <div className="flex items-center justify-between gap-[var(--spacing-md)] lg:block">
            <LinkComponent href={homeHref} className="inline-flex flex-col no-underline">
              <span className="text-xs font-light uppercase tracking-plus1_5 text-brand-secondary">
                {productKicker}
              </span>
              <span className="mt-1 font-arvo text-2xl font-bold leading-none text-brand-dark">
                {productName}
              </span>
            </LinkComponent>
            {onSignOut ? (
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(0,23,31,0.12)] bg-white/90 px-3 py-2 text-sm font-bold text-brand-dark transition-transform duration-200 hover:-translate-y-px lg:hidden"
              >
                <LogOut size={16} strokeWidth={2.2} aria-hidden />
                {signOutLabel}
              </button>
            ) : null}
          </div>

          <nav className="mt-[var(--spacing-md)] flex max-w-full gap-[var(--spacing-sm)] overflow-x-auto pb-[var(--spacing-xs)] lg:grid lg:overflow-visible lg:pb-0">
            {navItems.map((item, index) => {
              const isActive =
                item.href === '/' ? activePath === '/' : activePath.startsWith(item.href);
              const Icon = item.icon;
              return (
                <LinkComponent
                  key={item.href}
                  href={item.href}
                  className={`grid min-w-[156px] grid-cols-[32px_1fr] items-center gap-2 rounded-[var(--radius-lg)] border px-3 py-[10px] text-sm font-bold no-underline transition-transform duration-200 hover:-translate-y-px lg:min-w-0 ${
                    isActive
                      ? 'border-[#01695b] bg-[linear-gradient(95deg,#00916e,#007666)] text-white shadow-[0_12px_26px_rgba(0,145,110,0.22)]'
                      : 'border-[rgba(0,23,31,0.12)] bg-white/74 text-brand-dark'
                  }`}
                >
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                      isActive ? 'bg-white/15 text-white' : 'bg-brand-primary/12 text-muted'
                    }`}
                  >
                    {Icon ? (
                      <Icon size={17} strokeWidth={2.2} aria-hidden />
                    ) : (
                      (item.mark ?? String(index + 1).padStart(2, '0'))
                    )}
                  </span>
                  <span>{item.label}</span>
                </LinkComponent>
              );
            })}
          </nav>

          {onSignOut ? (
            <button
              type="button"
              onClick={onSignOut}
              className="mt-[var(--spacing-md)] hidden w-full items-center justify-center gap-2 rounded-full border border-[rgba(0,23,31,0.12)] bg-white/90 px-3 py-2 text-sm font-bold text-brand-dark transition-transform duration-200 hover:-translate-y-px lg:flex"
            >
              <LogOut size={16} strokeWidth={2.2} aria-hidden />
              {signOutLabel}
            </button>
          ) : null}
        </aside>

        <section className="grid content-start gap-[var(--spacing-lg)] px-[var(--spacing-md)] py-[var(--spacing-lg)] md:px-[var(--spacing-xl)] lg:px-[var(--spacing-x2l)]">
          <header className="rounded-[var(--radius-xl)] border border-[rgba(0,23,31,0.12)] bg-white/80 p-[clamp(20px,3vw,36px)] backdrop-blur-sm">
            <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-brand-secondary">
              {eyebrow}
            </p>
            <h1 className="m-0 mt-[var(--spacing-xs)] max-w-[980px] font-arvo text-[clamp(38px,5vw,64px)] font-bold leading-[1.06] tracking-minus1_5 text-text">
              {title}
            </h1>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
