import { View, type ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/theme-context';

export interface AppSeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  tone?: 'solid' | 'muted' | 'dashed';
  size?: number;
  style?: ViewStyle;
}

export function AppSeparator({
  orientation = 'horizontal',
  tone = 'muted',
  size = 1,
  style,
}: AppSeparatorProps) {
  const { theme } = useAppTheme();
  const borderColor = tone === 'solid' ? theme.colors.text : theme.grayscale[3];

  return (
    <View
      style={[
        {
          width: orientation === 'horizontal' ? '100%' : size,
          height: orientation === 'horizontal' ? size : '100%',
          backgroundColor: borderColor,
          opacity: tone === 'muted' ? 0.65 : 1,
        },
        style,
      ]}
    />
  );
}
