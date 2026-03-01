import type { CSSProperties } from 'react';
import { useAppTheme } from '../theme/theme-context';

export interface AppSeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  tone?: 'solid' | 'muted' | 'dashed';
  size?: number;
  style?: CSSProperties;
}

export function AppSeparator({
  orientation = 'horizontal',
  tone = 'muted',
  size = 1,
  style,
}: AppSeparatorProps) {
  const { theme } = useAppTheme();
  const borderColor = tone === 'solid' ? theme.colors.text : theme.grayscale[3];
  const borderStyle = tone === 'dashed' ? 'dashed' : 'solid';

  return (
    <div
      aria-hidden
      style={{
        width: orientation === 'horizontal' ? '100%' : size,
        height: orientation === 'horizontal' ? size : '100%',
        borderTop:
          orientation === 'horizontal' ? `${size}px ${borderStyle} ${borderColor}` : undefined,
        borderLeft:
          orientation === 'vertical' ? `${size}px ${borderStyle} ${borderColor}` : undefined,
        opacity: tone === 'muted' ? 0.65 : 1,
        ...style,
      }}
    />
  );
}
