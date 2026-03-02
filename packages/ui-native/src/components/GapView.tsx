import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import type { SuitTheme } from '@17suit/design-system';

type GapToken = keyof SuitTheme['spacing'];

type GapViewProps = {
  gap: GapToken;
  children: ReactNode;
} & ViewProps;

export function GapView({ gap, children, style, ...rest }: GapViewProps) {
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
    <View {...rest} className={`flex flex-col ${gapClassMap[gap]}`} style={style}>
      {children}
    </View>
  );
}
