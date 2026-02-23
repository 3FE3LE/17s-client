import { View } from 'react-native';
import { useAppTheme } from '../theme/theme-context';

export interface AppDividerProps {
  marginY?: number;
}

export function AppDivider({ marginY }: AppDividerProps) {
  const { theme } = useAppTheme();
  const resolvedMargin = marginY ?? theme.spacing.xs;
  return (
    <View
      style={{
        width: '100%',
        height: 1,
        marginTop: resolvedMargin,
        marginBottom: resolvedMargin,
        backgroundColor: theme.colors.surface,
      }}
    />
  );
}
