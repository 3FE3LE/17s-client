import { createElement, type ComponentType, type PropsWithChildren } from 'react';
import { Button, Paragraph, isWeb } from 'tamagui';
import { suitTheme } from '../../theme';

type AppButtonVariant = 'primary' | 'success' | 'destructive' | 'warning' | 'info' | 'neutral';

const variantStyles: Record<
  AppButtonVariant,
  {
    backgroundColor: string;
    textColor: string;
  }
> = {
  primary: {
    backgroundColor: suitTheme.colors.brandPrimary,
    textColor: suitTheme.colors.brandDark,
  },
  success: {
    backgroundColor: suitTheme.colors.success,
    textColor: suitTheme.colors.brandDark,
  },
  destructive: {
    backgroundColor: suitTheme.colors.destructive,
    textColor: suitTheme.colors.brandLight,
  },
  warning: {
    backgroundColor: suitTheme.colors.warning,
    textColor: suitTheme.colors.background,
  },
  info: {
    backgroundColor: suitTheme.colors.info,
    textColor: suitTheme.colors.brandLight,
  },
  neutral: {
    backgroundColor: suitTheme.grayscale[4],
    textColor: suitTheme.colors.brandDark,
  },
};

const ButtonAny = Button as unknown as ComponentType<Record<string, unknown>>;
const ParagraphAny = Paragraph as unknown as ComponentType<Record<string, unknown>>;

export interface AppButtonProps extends PropsWithChildren {
  onPress?: (() => void) | undefined;
  variant?: AppButtonVariant;
}

export function AppButton({ children, onPress, variant = 'primary' }: AppButtonProps) {
  const colors = variantStyles[variant];
  const buttonType = suitTheme.typography.styles.button;
  const lineHeight = isWeb
    ? buttonType.fontSize * buttonType.lineHeightRecommended
    : Math.round(buttonType.fontSize * buttonType.lineHeightRecommended);

  return createElement(ButtonAny, {
    unstyled: true,
    onPress,
    backgroundColor: colors.backgroundColor,
    borderRadius: suitTheme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: suitTheme.sizes.control.md,
    paddingHorizontal: suitTheme.spacing.lg,
    paddingVertical: suitTheme.spacing.sm,
    '$platform-web': {
      cursor: 'pointer',
      boxShadow: '0 1px 2px rgba(0,0,0,0.35)',
      transition: 'transform 120ms ease, filter 120ms ease',
    },
    children: createElement(ParagraphAny, {
      style: {
        color: colors.textColor,
        margin: 0,
        textAlign: 'center',
        fontFamily: isWeb ? buttonType.webFamily : buttonType.nativeFamily,
        fontSize: buttonType.fontSize,
        lineHeight,
        fontWeight: isWeb ? buttonType.fontWeight : undefined,
        letterSpacing: isWeb ? buttonType.letterSpacingEm : buttonType.letterSpacingPx,
      },
      children,
    }),
  });
}
