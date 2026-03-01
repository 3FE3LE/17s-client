import { ActivityIndicator, View, type ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/theme-context';

export interface AppSpinnerProps {
  size?: 'small' | 'large' | number;
  tone?: 'primary' | 'muted' | 'neutral';
  style?: ViewStyle;
}

export function AppSpinner({ size = 'small', tone = 'primary', style }: AppSpinnerProps) {
  const { theme } = useAppTheme();
  const color =
    tone === 'primary'
      ? theme.colors.brandPrimary
      : tone === 'muted'
        ? theme.colors.muted
        : theme.grayscale[3];

  return (
    <View style={style}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
