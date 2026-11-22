'use client';

import { buttonRecipe, cardRecipe, cx, pageContainerRecipe } from '@17suit/design-system';
import { LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  Fragment,
  useSyncExternalStore,
  type CSSProperties,
  type ElementType,
  type PropsWithChildren,
  type ReactNode,
} from 'react';

// Scroll distance (px) over which the header fully shrinks.
const SHRINK_RANGE = 160;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}

function subscribeToNothing() {
  return () => {};
}

// Continuous 0 -> 1 scroll progress over SHRINK_RANGE, without useEffect
// (external-store subscription). Quantized so it only re-renders on a
// meaningful change. Drives the sticky header shrink via a CSS variable.
// Disabled (no scroll listener, constant 0) for the compact density, whose
// header is neither sticky nor shrinking.
function useScrollShrinkProgress(enabled: boolean): number {
  return useSyncExternalStore(
    enabled ? subscribeToScroll : subscribeToNothing,
    () =>
      enabled ? Math.round(Math.min(1, Math.max(0, window.scrollY / SHRINK_RANGE)) * 50) / 50 : 0,
    () => 0,
  );
}

export type AppWorkspaceNavItem = {
  href: string;
  label: string;
  mark?: string;
  icon?: LucideIcon;
  /**
   * Short muted tag rendered after the label, e.g. "Pendiente" for a section
   * that exists as a route but is not built yet. Omit for working sections.
   */
  badge?: string;
  /**
   * Optional group label. Consecutive items that share a group render under a
   * muted divider with this text (e.g. "Próximamente"). Items without a group
   * render exactly as before, with no divider.
   */
  group?: string;
};

// Exact match, or a nested route under the item (`/billing/invoices` for
// `/billing`). A bare prefix match would mark `/billing` active on `/billingx`.
function isNavItemActive(href: string, activePath: string): boolean {
  if (href === '/') {
    return activePath === '/';
  }
  const base = href.endsWith('/') ? href.slice(0, -1) : href;
  return activePath === base || activePath.startsWith(`${base}/`);
}

/**
 * `default` is the branded workspace (large sticky card header, ambient
 * decoration). `compact` is for operate consoles: small static header, flat
 * `bg-background` canvas with no decoration, tighter nav tiles without hover
 * lift, and below `lg` a collapsed sidebar (brand row, scrollable nav with a
 * fade edge, smaller account row) so the page heading stays above the fold.
 */
export type AppWorkspaceShellDensity = 'default' | 'compact';

export interface AppWorkspaceShellProps extends PropsWithChildren {
  productName: string;
  productKicker?: string;
  title: string;
  eyebrow?: string;
  navItems: AppWorkspaceNavItem[];
  activePath?: string;
  homeHref?: string;
  onSignOut?: () => void;
  signOutLabel?: string;
  density?: AppWorkspaceShellDensity;
  /**
   * Signed-in identity (e.g. the operator email). When set, it renders in the
   * sidebar together with the sign-out button at every breakpoint, instead of
   * sign-out sitting alone next to the product name on small screens.
   */
  account?: ReactNode;
  /**
   * Persistent status shown in the sidebar brand row (e.g. an environment
   * badge). Right of the product name below `lg`, under it from `lg` up, where
   * the sidebar is sticky. Omit to render nothing.
   */
  statusSlot?: ReactNode;
  linkComponent?: ElementType<{
    href: string;
    className?: string;
    children: ReactNode;
    'aria-current'?: 'page' | undefined;
  }>;
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
  density = 'default',
  account,
  statusSlot,
  linkComponent: LinkComponent = 'a',
  children,
}: AppWorkspaceShellProps) {
  const isCompact = density === 'compact';
  const shrink = useScrollShrinkProgress(!isCompact);
  const signOutButton = onSignOut ? (
    <button
      type="button"
      onClick={onSignOut}
      className={cx(buttonRecipe({ intent: 'secondary', size: 'sm', platform: 'web' }), 'gap-2')}
    >
      <LogOut size={16} strokeWidth={2.2} aria-hidden />
      {signOutLabel}
    </button>
  ) : null;
  return (
    <main
      className={cx(
        'relative min-h-screen text-text',
        isCompact ? 'bg-background' : 'bg-suit-canvas',
      )}
    >
      {isCompact ? null : (
        <>
          <div
            aria-hidden
            className="pointer-events-none fixed -right-[24vw] -top-[24vw] z-0 h-[min(58vw,690px)] w-[min(58vw,690px)] rotate-[-15deg] rounded-[var(--radius-xl)] bg-ambient-brand-conic"
          />
          <div
            aria-hidden
            className="pointer-events-none fixed bottom-[-52px] left-[6vw] z-0 h-[140px] w-[min(64vw,720px)] skew-x-[-24deg] bg-ambient-cyan-line"
          />
        </>
      )}

      <div className={pageContainerRecipe({ kind: 'workspace' })}>
        <aside
          className={cx(
            'min-w-0 border-b border-border-default lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-[var(--spacing-lg)] lg:py-[var(--spacing-lg)]',
            isCompact
              ? 'bg-surface px-[var(--spacing-md)] py-[var(--spacing-sm)]'
              : 'bg-surface-panel px-[var(--spacing-md)] py-[var(--spacing-md)] backdrop-blur-sm',
          )}
        >
          <div className="flex items-center justify-between gap-[var(--spacing-md)] lg:block">
            <LinkComponent href={homeHref} className="inline-flex flex-col no-underline">
              <span
                className={cx(
                  'text-xs font-light uppercase tracking-plus1_5 text-brand-secondary',
                  isCompact && 'hidden lg:block',
                )}
              >
                {productKicker}
              </span>
              <span
                className={cx(
                  'font-arvo font-bold leading-none text-brand-dark',
                  isCompact ? 'text-xl lg:mt-1 lg:text-2xl' : 'mt-1 text-2xl',
                )}
              >
                {productName}
              </span>
            </LinkComponent>
            {statusSlot ? (
              <div className="min-w-0 lg:mt-[var(--spacing-sm)]">{statusSlot}</div>
            ) : null}
            {onSignOut && !account ? (
              <button
                type="button"
                onClick={onSignOut}
                className={cx(
                  buttonRecipe({
                    intent: 'secondary',
                    size: 'sm',
                    platform: 'web',
                    fullWidth: false,
                  }),
                  'gap-2 lg:hidden',
                )}
              >
                <LogOut size={16} strokeWidth={2.2} aria-hidden />
                {signOutLabel}
              </button>
            ) : null}
          </div>

          <nav
            className={cx(
              'flex max-w-full overflow-x-auto pb-[var(--spacing-xs)] lg:grid lg:overflow-visible lg:pb-0',
              isCompact
                ? // Below lg the nav scrolls sideways: the mask fades the trailing edge so
                  // clipped items read as "more this way", and the trailing spacer lets the
                  // last item scroll clear of the fade.
                  "mt-[var(--spacing-sm)] gap-[var(--spacing-xs)] [mask-image:linear-gradient(to_right,#000_calc(100%-32px),transparent)] after:w-6 after:shrink-0 after:content-[''] lg:[mask-image:none] lg:after:hidden"
                : 'mt-[var(--spacing-md)] gap-[var(--spacing-sm)]',
            )}
          >
            {navItems.map((item, index) => {
              const isActive = isNavItemActive(item.href, activePath);
              const Icon = item.icon;
              const startsGroup = Boolean(item.group) && item.group !== navItems[index - 1]?.group;
              const link = (
                <LinkComponent
                  key={item.href}
                  href={item.href}
                  {...(isActive ? { 'aria-current': 'page' as const } : {})}
                  className={cx(
                    isCompact
                      ? 'grid shrink-0 grid-cols-[24px_auto] items-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] border px-[10px] py-[6px] text-sm font-bold no-underline transition-colors duration-150 lg:min-w-0 lg:grid-cols-[24px_1fr]'
                      : 'grid min-w-[156px] grid-cols-[32px_1fr] items-center gap-2 rounded-[var(--radius-lg)] border px-3 py-[10px] text-sm font-bold no-underline transition-transform duration-200 motion-safe:hover:-translate-y-px lg:min-w-0',
                    isActive
                      ? cx(
                          'border-action-primary-border bg-action-primary text-white',
                          !isCompact && 'shadow-action-primary-soft',
                        )
                      : cx(
                          'border-border-default text-brand-dark',
                          isCompact
                            ? 'bg-surface hover:border-border-emphasis hover:bg-background'
                            : 'bg-surface-navigation',
                        ),
                  )}
                >
                  <span
                    className={`inline-flex ${isCompact ? 'h-6 w-6' : 'h-8 w-8'} items-center justify-center rounded-full ${
                      isActive ? 'bg-white/15 text-white' : 'bg-brand-primary/12 text-muted'
                    }`}
                  >
                    {Icon ? (
                      <Icon size={isCompact ? 15 : 17} strokeWidth={2.2} aria-hidden />
                    ) : (
                      (item.mark ?? String(index + 1).padStart(2, '0'))
                    )}
                  </span>
                  {item.badge ? (
                    <span className="flex min-w-0 items-center justify-between gap-2">
                      <span>{item.label}</span>
                      <span
                        className={cx(
                          'whitespace-nowrap rounded-[var(--radius-sm)] border px-[6px] text-xs font-normal leading-[18px]',
                          isActive
                            ? 'border-white/40 text-white'
                            : 'border-border-default text-muted',
                        )}
                      >
                        {item.badge}
                      </span>
                    </span>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </LinkComponent>
              );
              if (!startsGroup) {
                return link;
              }
              return (
                <Fragment key={item.href}>
                  <span className="flex shrink-0 items-center gap-2 self-center whitespace-nowrap px-[var(--spacing-xs)] text-xs font-bold leading-[18px] text-muted lg:mt-[var(--spacing-sm)] lg:self-auto lg:px-0">
                    <span aria-hidden className="h-4 w-px bg-border-strong lg:hidden" />
                    {item.group}
                    <span aria-hidden className="hidden h-px flex-1 bg-border-default lg:block" />
                  </span>
                  {link}
                </Fragment>
              );
            })}
          </nav>

          {account ? (
            <div
              className={cx(
                'flex flex-wrap items-center justify-between gap-[var(--spacing-sm)] lg:mt-[var(--spacing-md)] lg:grid lg:justify-start',
                isCompact ? 'mt-[var(--spacing-xs)]' : 'mt-[var(--spacing-md)]',
              )}
            >
              <div
                className={cx(
                  'min-w-0 leading-[1.4]',
                  isCompact ? 'flex-1 text-xs lg:text-sm' : 'text-sm',
                )}
              >
                {account}
              </div>
              {signOutButton ? <div>{signOutButton}</div> : null}
            </div>
          ) : onSignOut ? (
            // Wrapper owns visibility: the button recipe sets its own display, which would
            // override `hidden` on the button itself and duplicate the mobile sign-out.
            <div className="mt-[var(--spacing-md)] hidden lg:block">{signOutButton}</div>
          ) : null}
        </aside>

        <section
          className={cx(
            'grid min-w-0 content-start px-[var(--spacing-md)] py-[var(--spacing-lg)] md:px-[var(--spacing-xl)] lg:px-[var(--spacing-x2l)]',
            isCompact ? 'gap-[var(--spacing-md)]' : 'gap-[var(--spacing-lg)]',
          )}
        >
          {isCompact ? (
            <header className="grid gap-[var(--spacing-xs)]">
              {eyebrow ? <p className="m-0 text-sm leading-[1.4] text-muted">{eyebrow}</p> : null}
              <h1 className="m-0 text-balance font-arvo text-[26px] font-bold leading-[1.2] text-text">
                {title}
              </h1>
            </header>
          ) : (
            <header
              style={{ '--app-hdr': shrink } as CSSProperties}
              className={cx(
                cardRecipe({ variant: 'workspaceHeader' }),
                'app-workspace-header-sticky',
              )}
            >
              {eyebrow ? (
                <p className="m-0 text-xs font-light uppercase tracking-plus1_5 text-brand-secondary">
                  {eyebrow}
                </p>
              ) : null}
              <h1 className="m-0 mt-[var(--spacing-xs)] max-w-[980px] font-arvo text-[clamp(38px,5vw,64px)] font-bold leading-[1.06] tracking-minus1_5 text-text">
                {title}
              </h1>
            </header>
          )}
          {children}
        </section>
      </div>
    </main>
  );
}
