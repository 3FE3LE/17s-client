import { View, type ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/theme-context';

export interface AppSkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  style?: ViewStyle;
}

export function AppSkeleton({
  width = '100%',
  height = 16,
  rounded = 'md',
  style,
}: AppSkeletonProps) {
  const { theme } = useAppTheme();
  const radiusMap = {
    sm: theme.borderRadius.sm,
    md: theme.borderRadius.md,
    lg: theme.borderRadius.lg,
    full: theme.borderRadius.full,
  };

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: radiusMap[rounded],
          backgroundColor: theme.grayscale[3],
          opacity: 0.75,
        },
        style,
      ]}
    />
  );
}
