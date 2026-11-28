import { useClerk, useUser } from '@clerk/clerk-expo';
import { useTranslation } from '@17suit/i18n/react';
import {
  useCurrentUserRoleQuery,
  useSetCurrentUserRoleMutation,
} from '@17suit/module-seven-reservations-club/client';
import {
  AppBadge,
  AppButton,
  AppProfile,
  GapView,
  useAnimatedValue,
  useAppTheme,
} from '@17suit/ui-native';
import { Alert, Animated, Platform, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Screen } from '../../../components/screen';
import { useQueryClient } from '@tanstack/react-query';
import { humanizeError } from '../../../lib/error-messages';
import { feedback } from '../../../lib/feedback';

export default function ProfileScreen() {
  const { t } = useTranslation('mobile');
  const { signOut } = useClerk();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { role } = useCurrentUserRoleQuery({ userId: user?.id, enabled: Boolean(user?.id) });
  const setRoleMutation = useSetCurrentUserRoleMutation();
  const { mode, setMode, theme } = useAppTheme();
  const [selectorWidth, setSelectorWidth] = useState(0);

  const roleBadgeLabel = role === 'OWNER' ? t('profile.badgeOwner') : t('profile.badgePlayer');
  const nextRole = role === 'OWNER' ? 'PLAYER' : 'OWNER';
  const nextRoleLabel = nextRole === 'OWNER' ? t('profile.nextOwner') : t('profile.nextPlayer');

  const switchRole = async () => {
    try {
      await setRoleMutation.mutateAsync(nextRole);
      feedback.success(
        t('profile.switched'),
        nextRole === 'OWNER' ? t('profile.nowOwner') : t('profile.nowPlayer'),
      );
      router.replace('/home');
    } catch (error) {
      feedback.error(t('profile.switchFailed'), humanizeError(error, t, 'save'));
    }
  };

  const askSwitchRole = () => {
    const title = t('profile.askTitle');
    const message =
      nextRole === 'OWNER' ? t('profile.askMessageOwner') : t('profile.askMessagePlayer');
    if (Platform.OS === 'web') {
      const confirmFn = (globalThis as { confirm?: (text: string) => boolean }).confirm;
      if (confirmFn?.(`${title}\n\n${message}`)) void switchRole();
      return;
    }
    Alert.alert(title, message, [
      { text: t('common.back'), style: 'cancel' },
      { text: t('profile.change'), onPress: () => void switchRole() },
    ]);
  };

  const options = [
    { key: 'system', label: t('profile.themeSystem'), icon: 'smartphone' },
    { key: 'dark', label: t('profile.themeDark'), icon: 'moon' },
    { key: 'light', label: t('profile.themeLight'), icon: 'sun' },
  ] as const;

  const activeIndex = options.findIndex((item) => item.key === mode);
  const indicator = useAnimatedValue(activeIndex >= 0 ? activeIndex : 0, { duration: 180 });
  const indicatorWidth = selectorWidth / options.length;
  const indicatorTranslate = indicator.interpolate({
    inputRange: [0, 1],
    outputRange: [0, indicatorWidth * (options.length - 1)],
  });

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      // Account data only; the theme is a preference of this device and stays.
      queryClient.clear();
    }
  };

  return (
    <Screen
      title={t('profile.title')}
      subtitle={t('profile.subtitle')}
      back={false}
      showLanguageSelect
    >
      <GapView gap="md">
        {role ? (
          <View style={{ gap: theme.spacing.sm }}>
            <View style={{ flexDirection: 'row' }}>
              <AppBadge variant={role === 'OWNER' ? 'success' : 'info'}>{roleBadgeLabel}</AppBadge>
            </View>
            <AppButton
              variant="neutral"
              onPress={askSwitchRole}
              disabled={setRoleMutation.isPending}
              busy={setRoleMutation.isPending}
              accessibilityLabel={t('profile.switchA11y', { mode: nextRoleLabel })}
            >
              {setRoleMutation.isPending
                ? t('profile.switching')
                : t('profile.switchButton', { mode: nextRoleLabel })}
            </AppButton>
          </View>
        ) : null}
        <View
          style={{
            width: '100%',
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1,
            borderColor: theme.grayscale[3],
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.sm,
          }}
        >
          <Text
            style={{
              color: theme.colors.muted,
              fontFamily: theme.typography.styles.caption.nativeFamily,
              fontSize: theme.typography.styles.caption.fontSize,
              letterSpacing: theme.typography.styles.caption.letterSpacingPx,
              marginBottom: theme.spacing.sm,
            }}
          >
            {t('profile.theme')}
          </Text>
          <View
            onLayout={(event) => setSelectorWidth(event.nativeEvent.layout.width)}
            style={{
              borderRadius: theme.borderRadius.md,
              borderWidth: 1,
              borderColor: theme.grayscale[3],
              backgroundColor: theme.colors.background,
              padding: 4,
              overflow: 'hidden',
            }}
          >
            {selectorWidth > 0 ? (
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 4,
                  bottom: 4,
                  left: 4,
                  width: indicatorWidth - 8,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: theme.colors.brandPrimary,
                  shadowColor: theme.colors.brandPrimary,
                  shadowOpacity: 0.35,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 6,
                  transform: [{ translateX: indicatorTranslate }],
                }}
              />
            ) : null}
            <View style={{ flexDirection: 'row' }} accessibilityRole="radiogroup">
              {options.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => setMode(item.key)}
                    accessibilityRole="radio"
                    accessibilityLabel={t('profile.themeA11y', { theme: item.label.toLowerCase() })}
                    accessibilityState={{ checked: isActive }}
                    style={{
                      flex: 1,
                      minHeight: 44,
                      paddingVertical: theme.spacing.sm,
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <Feather
                      name={item.icon}
                      size={18}
                      color={isActive ? theme.colors.brandDark : theme.colors.muted}
                    />
                    <Text
                      style={{
                        color: isActive ? theme.colors.brandDark : theme.colors.muted,
                        fontFamily: theme.typography.styles.button.nativeFamily,
                        fontSize: theme.typography.styles.button.fontSize - 1,
                        letterSpacing: theme.typography.styles.button.letterSpacingPx,
                      }}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
        <AppProfile
          fullName={user?.fullName ?? null}
          email={user?.primaryEmailAddress?.emailAddress ?? null}
          onSignOut={handleSignOut}
        />
      </GapView>
    </Screen>
  );
}
