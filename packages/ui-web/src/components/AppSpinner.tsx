import type { CSSProperties } from 'react';
import { useAppTheme } from '../theme/theme-context';

const SPINNER_KEYFRAMES = `
@keyframes appSpinnerRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

export interface AppSpinnerProps {
  size?: number;
  tone?: 'primary' | 'muted' | 'neutral';
  style?: CSSProperties;
}

export function AppSpinner({ size = 18, tone = 'primary', style }: AppSpinnerProps) {
  const { theme } = useAppTheme();
  const borderColor =
    tone === 'primary'
      ? theme.colors.brandPrimary
      : tone === 'muted'
        ? theme.colors.muted
        : theme.grayscale[3];

  return (
    <>
      <style>{SPINNER_KEYFRAMES}</style>
      <span
        aria-label="Loading"
        style={{
          display: 'inline-flex',
          width: size,
          height: size,
          borderRadius: theme.borderRadius.full,
          border: `${Math.max(2, Math.round(size / 8))}px solid ${theme.grayscale[3]}`,
          borderTopColor: borderColor,
          animation: 'appSpinnerRotate 0.75s linear infinite',
          ...style,
        }}
      />
    </>
  );
}
