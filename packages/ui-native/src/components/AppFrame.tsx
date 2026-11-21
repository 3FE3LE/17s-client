import type { PropsWithChildren } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../theme/theme-context';
import { AppTitle } from './AppTitle';
import { withGap } from '../utils/withGap';

export interface AppFrameProps extends PropsWithChildren {
  appName: string;
  subtitle?: string;
  onBack?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function AppFrame({
  appName,
  subtitle,
  onBack,
  onRefresh,
  refreshing = false,
  children,
}: AppFrameProps) {
  const { theme } = useAppTheme();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.x2l,
        flexGrow: 1,
      }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.muted}
          />
        ) : undefined
      }
      keyboardShouldPersistTaps="handled"
    >
      <View className="w-full">
        {typeof onBack === 'function' ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Volver"
            hitSlop={8}
            className="h-11 w-11 items-center justify-center self-start rounded-md border border-black/20 bg-surface"
          >
            <Feather name="chevron-left" size={20} color={theme.colors.text} />
          </Pressable>
        ) : null}
        <AppTitle text={appName} />
        {subtitle ? (
          <Text className="font-zilla text-md leading-[24px] tracking-normal text-muted">
            {subtitle}
          </Text>
        ) : null}
        <View style={{ marginTop: theme.spacing.lg }}>{withGap(children, theme.spacing.md)}</View>
      </View>
    </ScrollView>
  );
}
