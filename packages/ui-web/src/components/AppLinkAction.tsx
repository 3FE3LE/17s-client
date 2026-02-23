import type { PropsWithChildren } from 'react';
import { useAppTheme } from '../theme/theme-context';

export interface AppLinkActionProps extends PropsWithChildren {
  onPress?: () => void;
}

export function AppLinkAction({ children, onPress }: AppLinkActionProps) {
  const { theme } = useAppTheme();
  const bodyType = theme.typography.styles.body;
  const lineHeight = bodyType.fontSize * bodyType.lineHeightRecommended;

  return (
    <button
      type="button"
      onClick={onPress}
      style={{
        margin: 0,
        padding: `${theme.spacing.xs}px 0`,
        color: theme.colors.info,
        textDecoration: 'none',
        fontFamily: bodyType.webFamily,
        fontSize: bodyType.fontSize,
        lineHeight,
        fontWeight: bodyType.fontWeight,
        letterSpacing: bodyType.letterSpacingEm,
        textAlign: 'left',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
      }}
    >
      {children}
    </button>
  );
}
