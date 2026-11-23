/**
 * Badge contract shared by web and native AppBadge (promoted from the
 * universal-component PoC). Colors reproduce the previous inline-style
 * badges exactly; the label reuses the `caption` typography recipe.
 */
import { cx, type SuitPlatform } from './recipes';
import { typographyRecipe } from './typography';

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

export interface BadgeContractProps {
  variant?: BadgeVariant | undefined;
  size?: BadgeSize | undefined;
  rounded?: boolean | undefined;
  className?: string | undefined;
}

const SURFACE: Record<BadgeVariant, string> = {
  primary: 'bg-brand-primary',
  success: 'bg-success',
  destructive: 'bg-destructive',
  warning: 'bg-warning',
  info: 'bg-info',
  neutral: 'bg-neutral',
};

// WCAG AA (4.5:1 for caption text): the saturated light fills (#e10812, #1876ae) need
// pure white; the dark fills (#f8333c, #1e91d6) fail with any light text, so they take
// brand-dark. The other fills already pass with brand-dark.
const LABEL: Record<BadgeVariant, string> = {
  primary: 'text-brand-dark',
  success: 'text-brand-dark',
  destructive: 'text-white dark:text-brand-dark',
  warning: 'text-brand-dark',
  info: 'text-white dark:text-brand-dark',
  neutral: 'text-brand-dark',
};

/** Container classes (padding, shape, surface). */
export function badgeRecipe({
  variant = 'neutral',
  size = 'sm',
  rounded = true,
  platform,
  className,
}: BadgeContractProps & { platform: SuitPlatform }) {
  return cx(
    platform === 'web' ? 'inline-flex items-center justify-center whitespace-nowrap' : 'self-start',
    size === 'sm' ? 'px-sm py-xs' : 'px-md py-sm',
    rounded ? 'rounded-full' : 'rounded-sm',
    SURFACE[variant],
    className,
  );
}

/** Label classes: caption typography + variant text color (last wins). */
export function badgeLabelRecipe({
  variant = 'neutral',
  platform,
}: Pick<BadgeContractProps, 'variant'> & { platform: SuitPlatform }) {
  return typographyRecipe({ variant: 'caption', platform, colorClass: LABEL[variant] });
}
