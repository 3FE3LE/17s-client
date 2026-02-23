import type { CSSProperties, PropsWithChildren } from 'react';
import type { SuitTheme } from '@17suit/design-system';
import { useAppTheme } from '../theme/theme-context';

export type GapToken = keyof SuitTheme['spacing'];

export interface GapViewProps extends PropsWithChildren {
  gap: GapToken;
  direction?: 'column' | 'row';
  style?: CSSProperties;
}

export function GapView({ gap, direction = 'column', style, children }: GapViewProps) {
  const { theme } = useAppTheme();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: theme.spacing[gap],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
