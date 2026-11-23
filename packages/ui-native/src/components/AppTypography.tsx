import {
  typographyRecipe,
  type TypographyAlign,
  type TypographyVariant,
} from '@17suit/design-system';
import type { PropsWithChildren } from 'react';
import { Text, type TextStyle } from 'react-native';

export interface AppTypographyProps extends PropsWithChildren {
  variant?: TypographyVariant;
  /** Overrides the theme text color. */
  color?: string;
  align?: TypographyAlign;
  className?: string;
  style?: TextStyle;
  numberOfLines?: number;
  /** Pass `'header'` when the text titles a section, so screen readers can jump to it. */
  accessibilityRole?: 'header' | 'text';
}

/** Native renderer of the shared typography contract (Uniwind classes). */
export function AppTypography({
  children,
  variant = 'body',
  color,
  align = 'left',
  className,
  style,
  numberOfLines,
  accessibilityRole,
}: AppTypographyProps) {
  return (
    <Text
      numberOfLines={numberOfLines}
      {...(accessibilityRole ? { accessibilityRole } : {})}
      className={typographyRecipe({ variant, align, platform: 'native', className })}
      style={color ? [{ color }, style] : style}
    >
      {children}
    </Text>
  );
}
