/**
 * PoC — universal component contract (not exported from the package index).
 *
 * One platform-agnostic module owns the component's public props and its
 * visual recipe (Tailwind v4 class strings resolved against the shared
 * tokens in @17suit/tailwind-config). Web renders the classes with Tailwind;
 * native renders the same classes with Uniwind. Each platform only owns
 * its primitive (`span` vs `View`/`Text`) and platform-only behavior.
 *
 * Compare with the current AppBadge, which duplicates the variant map in
 * ui-web and ui-native with inline styles and divergent prop types.
 */
import { cx, type SuitPlatform } from '../recipes';

export const BADGE_VARIANTS = [
  'primary',
  'success',
  'destructive',
  'warning',
  'info',
  'neutral',
] as const;
export type BadgeVariant = (typeof BADGE_VARIANTS)[number];
export type BadgeSize = 'sm' | 'md';

/** Props every platform implementation must accept, with identical meaning. */
export interface BadgeContractProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  /** Accessible label when the visible text is not self-explanatory. */
  accessibilityLabel?: string;
  /** Extra classes; same class language on web and native. */
  className?: string;
}

const variantClass: Record<BadgeVariant, string> = {
  primary: 'bg-action-primary',
  success: 'bg-action-primary-soft',
  destructive: 'bg-feedback-error-soft',
  warning: 'bg-feedback-warning-soft',
  info: 'bg-feedback-info-soft',
  neutral: 'bg-surface-inset-strong',
};

const labelClass: Record<BadgeVariant, string> = {
  primary: 'text-foreground-inverse',
  success: 'text-brand-dark',
  destructive: 'text-brand-dark',
  warning: 'text-brand-dark',
  info: 'text-brand-dark',
  neutral: 'text-brand-dark',
};

export function badgeRecipe({
  variant = 'neutral',
  size = 'sm',
  rounded = true,
  platform,
  className,
}: BadgeContractProps & { platform: SuitPlatform }) {
  return cx(
    'items-center justify-center',
    // Layout primitives differ: inline element on web, self-sized View on native.
    platform === 'web' ? 'inline-flex whitespace-nowrap' : 'self-start',
    size === 'sm' ? 'px-sm py-xs' : 'px-md py-sm',
    rounded ? 'rounded-full' : 'rounded-[var(--radius-control)]',
    variantClass[variant],
    className,
  );
}

export function badgeLabelRecipe({ variant = 'neutral' }: Pick<BadgeContractProps, 'variant'>) {
  return cx('font-zilla text-xs font-bold leading-[1.4]', labelClass[variant]);
}
