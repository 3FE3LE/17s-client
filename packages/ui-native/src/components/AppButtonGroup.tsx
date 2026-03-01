import type { ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import type { SuitTheme } from '@17suit/design-system';
import { useAppTheme } from '../theme/theme-context';

export interface AppButtonGroupProps {
  children: ReactNode;
  direction?: 'row' | 'column';
  gap?: keyof SuitTheme['spacing'];
  stretch?: boolean;
  style?: ViewStyle;
}

export function AppButtonGroup({
  children,
  direction = 'row',
  gap = 'sm',
  stretch = true,
  style,
}: AppButtonGroupProps) {
  const { theme } = useAppTheme();
  const items = (Array.isArray(children) ? children : [children]).filter(
    (item): item is ReactNode => item !== null && item !== undefined && item !== false,
  );

  return (
    <View
      style={[
        {
          width: '100%',
          flexDirection: direction,
          gap: theme.spacing[gap],
        },
        style,
      ]}
    >
      {items.map((child, index) => (
        <View key={index} style={stretch ? { flex: 1 } : undefined}>
          {child}
        </View>
      ))}
    </View>
  );
}
