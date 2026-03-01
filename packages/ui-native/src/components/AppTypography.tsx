import type { SuitTheme } from '@17suit/design-system';
import type { PropsWithChildren } from 'react';
import { Text, type TextStyle } from 'react-native';
import { useAppTheme } from '../theme/theme-context';

type TypographyVariant = keyof SuitTheme['typography']['styles'];

export interface AppTypographyProps extends PropsWithChildren {
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
  numberOfLines?: number;
}

export function AppTypography({
  children,
  variant = 'body',
  color,
  align = 'left',
  style,
  numberOfLines,
}: AppTypographyProps) {
  const { theme } = useAppTheme();
  const typeStyle = theme.typography.styles[variant];

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          color: color ?? theme.colors.text,
          textAlign: align,
          fontFamily: typeStyle.nativeFamily,
          fontSize: typeStyle.fontSize,
          lineHeight: Math.round(typeStyle.fontSize * typeStyle.lineHeightRecommended),
          letterSpacing: typeStyle.letterSpacingPx,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
