import type { CSSProperties, PropsWithChildren } from 'react';
import type { SuitTheme } from '@17suit/design-system';

export type GapToken = keyof SuitTheme['spacing'];

export interface GapViewProps extends PropsWithChildren {
  gap: GapToken;
  direction?: 'column' | 'row';
  style?: CSSProperties;
}

export function GapView({ gap, direction = 'column', style, children }: GapViewProps) {
  const gapClassMap: Record<GapToken, string> = {
    xs: 'gap-xs',
    sm: 'gap-sm',
    md: 'gap-md',
    lg: 'gap-lg',
    xl: 'gap-xl',
    x2l: 'gap-x2l',
    x3l: 'gap-x3l',
    x4l: 'gap-x4l',
  };

  return (
    <div
      className={`flex ${direction === 'row' ? 'flex-row' : 'flex-col'} ${gapClassMap[gap]}`}
      style={{
        ...style,
      }}
    >
      {children}
    </div>
  );
}
