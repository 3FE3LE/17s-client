import type { SuitTheme } from '@17suit/design-system';
import type { CSSProperties, ElementType, PropsWithChildren } from 'react';
import { useAppTheme } from '../theme/theme-context';

type TypographyVariant = keyof SuitTheme['typography']['styles'];

export interface AppTypographyProps extends PropsWithChildren {
  as?: ElementType;
  variant?: TypographyVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  style?: CSSProperties;
}

export function AppTypography({
  as: Component = 'p',
  variant = 'body',
  color,
  align = 'left',
  style,
  children,
}: AppTypographyProps) {
  const { theme } = useAppTheme();
  const typeStyle = theme.typography.styles[variant];

  return (
    <Component
      style={{
        margin: 0,
        color: color ?? theme.colors.text,
        textAlign: align,
        fontFamily: typeStyle.webFamily,
        fontWeight: typeStyle.fontWeight,
        fontSize: typeStyle.fontSize,
        lineHeight: typeStyle.fontSize * typeStyle.lineHeightRecommended,
        letterSpacing: typeStyle.letterSpacingEm,
        ...style,
      }}
    >
      {children}
    </Component>
  );
}
