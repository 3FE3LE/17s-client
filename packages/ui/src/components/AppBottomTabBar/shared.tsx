import { createElement, type ComponentType, type ReactNode } from 'react';
import { Button, Paragraph, XStack, YStack, isWeb } from 'tamagui';
import { suitTheme } from '../../theme';

type Tone = 'OWNER' | 'PLAYER' | null | undefined;
export type AppBottomTabIconName = 'home' | 'profile';

export interface AppBottomTabItem {
  key: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
  iconName?: AppBottomTabIconName;
  icon?: ReactNode;
}

export interface AppBottomTabBarProps {
  items: AppBottomTabItem[];
  tone?: Tone;
  showLabels?: boolean;
}

const YStackAny = YStack as unknown as ComponentType<Record<string, unknown>>;
const XStackAny = XStack as unknown as ComponentType<Record<string, unknown>>;
const ButtonAny = Button as unknown as ComponentType<Record<string, unknown>>;
const ParagraphAny = Paragraph as unknown as ComponentType<Record<string, unknown>>;

function getActiveColors(tone: Tone) {
  if (tone === 'OWNER') {
    return {
      backgroundColor: suitTheme.colors.success,
      textColor: suitTheme.colors.brandDark,
    };
  }

  return {
    backgroundColor: suitTheme.colors.brandPrimary,
    textColor: suitTheme.colors.brandDark,
  };
}

export function AppBottomTabBar({ items, tone, showLabels = true }: AppBottomTabBarProps) {
  const buttonType = suitTheme.typography.styles.button;
  const lineHeight = isWeb
    ? buttonType.fontSize * buttonType.lineHeightRecommended
    : Math.round(buttonType.fontSize * buttonType.lineHeightRecommended);

  return createElement(YStackAny, {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: suitTheme.colors.surface,
    backgroundColor: suitTheme.colors.brandDark,
    paddingHorizontal: suitTheme.spacing.md,
    paddingTop: suitTheme.spacing.sm,
    paddingBottom: suitTheme.spacing.md,
    children: createElement(XStackAny, {
      width: '100%',
      style: {
        gap: 8,
      },
      children: items.map((item) => {
        const activeColors = getActiveColors(tone);
        const isActive = item.isActive;
        const content = showLabels
          ? [
              item.icon
                ? createElement(YStackAny, {
                    key: `${item.key}-icon`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    children: item.icon,
                  })
                : null,
              createElement(ParagraphAny, {
                key: `${item.key}-label`,
                style: {
                  margin: 0,
                  textAlign: 'center',
                  fontFamily: isWeb ? buttonType.webFamily : buttonType.nativeFamily,
                  fontSize: buttonType.fontSize,
                  lineHeight,
                  fontWeight: isWeb ? buttonType.fontWeight : undefined,
                  letterSpacing: isWeb ? buttonType.letterSpacingEm : buttonType.letterSpacingPx,
                  color: isActive ? activeColors.textColor : suitTheme.colors.brandLight,
                },
                children: item.label,
              }),
            ]
          : item.icon
            ? item.icon
            : createElement(ParagraphAny, {
                style: {
                  margin: 0,
                  textAlign: 'center',
                  fontFamily: isWeb ? buttonType.webFamily : buttonType.nativeFamily,
                  fontSize: buttonType.fontSize,
                  lineHeight,
                  fontWeight: isWeb ? buttonType.fontWeight : undefined,
                  letterSpacing: isWeb ? buttonType.letterSpacingEm : buttonType.letterSpacingPx,
                  color: isActive ? activeColors.textColor : suitTheme.colors.brandLight,
                },
                children: item.label,
              });

        return createElement(ButtonAny, {
          key: item.key,
          unstyled: true,
          onPress: item.onPress,
          backgroundColor: isActive ? activeColors.backgroundColor : suitTheme.colors.surface,
          borderWidth: isActive ? 0 : 1,
          borderColor: suitTheme.grayscale[1],
          borderRadius: suitTheme.borderRadius.md,
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: suitTheme.sizes.control.md,
          flex: 1,
          minWidth: 0,
          paddingHorizontal: suitTheme.spacing.sm,
          children: createElement(YStackAny, {
            alignItems: 'center',
            justifyContent: 'center',
            style: {
              gap: showLabels ? 4 : 0,
            },
            children: content,
          }),
        });
      }),
    }),
  });
}
