import type { ReactNode } from 'react';
import { useAppTheme } from '../theme/theme-context';

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

function getActiveColors(tone: Tone, theme: ReturnType<typeof useAppTheme>['theme']) {
  if (tone === 'OWNER') {
    return {
      backgroundColor: theme.colors.success,
      textColor: theme.colors.brandDark,
    };
  }

  return {
    backgroundColor: theme.colors.brandPrimary,
    textColor: theme.colors.brandDark,
  };
}

export function AppBottomTabBar({ items, tone, showLabels = true }: AppBottomTabBarProps) {
  const { theme } = useAppTheme();
  const buttonType = theme.typography.styles.button;
  const lineHeight = buttonType.fontSize * buttonType.lineHeightRecommended;

  return (
    <div
      style={{
        width: '100%',
        borderTop: `1px solid ${theme.colors.surface}`,
        backgroundColor: theme.colors.brandDark,
        padding: `${theme.spacing.sm}px ${theme.spacing.md}px ${theme.spacing.md}px`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ width: '100%', gap: 8, display: 'flex', flexDirection: 'row' }}>
        {items.map((item) => {
          const activeColors = getActiveColors(tone, theme);
          const isActive = item.isActive;
          return (
            <button
              key={item.key}
              type="button"
              onClick={item.onPress}
              style={{
                backgroundColor: isActive ? activeColors.backgroundColor : theme.colors.surface,
                border: isActive ? 'none' : `1px solid ${theme.grayscale[1]}`,
                borderRadius: theme.borderRadius.md,
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: theme.sizes.control.md,
                flex: 1,
                minWidth: 0,
                padding: `0 ${theme.spacing.sm}px`,
                display: 'flex',
              }}
            >
              <div
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: showLabels ? 4 : 0,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {item.icon ? (
                  <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                    {item.icon}
                  </div>
                ) : null}
                {showLabels || !item.icon ? (
                  <span
                    style={{
                      margin: 0,
                      textAlign: 'center',
                      fontFamily: buttonType.webFamily,
                      fontSize: buttonType.fontSize,
                      lineHeight,
                      fontWeight: buttonType.fontWeight,
                      letterSpacing: buttonType.letterSpacingEm,
                      color: isActive ? activeColors.textColor : theme.colors.brandLight,
                    }}
                  >
                    {item.label}
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
