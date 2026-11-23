import {
  typographyRecipe,
  type TypographyAlign,
  type TypographyVariant,
} from '@17suit/design-system';
import type { CSSProperties, ElementType, PropsWithChildren } from 'react';

export interface AppTypographyProps extends PropsWithChildren {
  as?: ElementType;
  variant?: TypographyVariant;
  /** Overrides the theme text color (any CSS color or var()). */
  color?: string;
  align?: TypographyAlign;
  className?: string;
  style?: CSSProperties;
}

/** Web renderer of the shared typography contract (@17suit/design-system). */
export function AppTypography({
  as: Component = 'p',
  variant = 'body',
  color,
  align = 'left',
  className,
  style,
  children,
}: AppTypographyProps) {
  return (
    <Component
      className={typographyRecipe({ variant, align, platform: 'web', className })}
      style={color ? { color, ...style } : style}
    >
      {children}
    </Component>
  );
}
