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

const APP_FRAME_BADGE = '17SUIT';

export function AppFrame({
  appName,
  subtitle,
  onBack,
  onRefresh,
  refreshing = false,
  children,
}: AppFrameProps) {
  const { theme } = useAppTheme();
  const overlineType = theme.typography.styles.overline;
  const bodyType = theme.typography.styles.body;

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
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
      <View style={{ width: '100%' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {typeof onBack === 'function' ? (
            <Pressable
              onPress={onBack}
              style={{
                paddingHorizontal: theme.spacing.sm,
                paddingVertical: theme.spacing.xs,
                borderRadius: theme.borderRadius.md,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: theme.grayscale[3],
                backgroundColor: theme.colors.surface,
              }}
            >
              <Feather name="chevron-left" size={20} color={theme.colors.text} />
            </Pressable>
          ) : null}
          {typeof onBack === 'function' ? <View style={{ width: theme.spacing.sm }} /> : null}
          <Text
            style={{
              color: theme.colors.info,
              fontSize: overlineType.fontSize,
              fontFamily: overlineType.nativeFamily,
              lineHeight: Math.round(overlineType.fontSize * overlineType.lineHeightRecommended),
              letterSpacing: overlineType.letterSpacingPx,
            }}
          >
            {APP_FRAME_BADGE}
          </Text>
        </View>
        <AppTitle text={appName} />
        {subtitle ? (
          <Text
            style={{
              color: theme.colors.muted,
              fontSize: bodyType.fontSize,
              fontFamily: bodyType.nativeFamily,
              lineHeight: Math.round(bodyType.fontSize * bodyType.lineHeightRecommended),
              letterSpacing: bodyType.letterSpacingPx,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
        <View style={{ marginTop: theme.spacing.lg }}>{withGap(children, theme.spacing.md)}</View>
      </View>
    </ScrollView>
  );
}
