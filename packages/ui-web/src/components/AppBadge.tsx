import {
  badgeLabelRecipe,
  badgeRecipe,
  cx,
  type BadgeSize,
  type BadgeVariant,
} from '@17suit/design-system';
import type { CSSProperties, HTMLAttributes } from 'react';

export interface AppBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  style?: CSSProperties;
}

/** Web renderer of the shared badge contract (@17suit/design-system). */
export function AppBadge({
  children,
  variant = 'neutral',
  size = 'sm',
  rounded = true,
  className,
  style,
  ...rest
}: AppBadgeProps) {
  return (
    <span
      {...rest}
      className={cx(
        badgeRecipe({ variant, size, rounded, platform: 'web' }),
        badgeLabelRecipe({ variant, platform: 'web' }),
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}
