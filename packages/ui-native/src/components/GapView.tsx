import type { ReactNode } from 'react';
import { Children } from 'react';
import { View, type ViewProps } from 'react-native';
import type { SuitTheme } from '@17suit/design-system';
import { useAppTheme } from '../theme/theme-context';

type GapToken = keyof SuitTheme['spacing'];

type GapViewProps = {
  gap: GapToken;
  children: ReactNode;
} & ViewProps;

export function GapView({ gap, children, style, ...rest }: GapViewProps) {
  const { theme } = useAppTheme();
  const items = Children.toArray(children);
  return (
    <View {...rest} style={style}>
      {items.map((child, index) => (
        <View
          key={index}
          style={{ marginBottom: index === items.length - 1 ? 0 : theme.spacing[gap] }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}
