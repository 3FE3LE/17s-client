import { useClerk, useUser } from '@clerk/clerk-expo';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppButton, AppProfile, GapView, useAppTheme } from '@17suit/ui';
import { useAnimatedValue } from '@17suit/ui-native';
import { Animated, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { AuthTabScreen } from '../../components/auth-tab-screen';
import { useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

const THEME_STORAGE_KEY = '17suit.theme.mode';

export default function ProfileScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { role } = useCurrentUserRoleQuery({ userId: user?.id, enabled: Boolean(user?.id) });
  const { mode, setMode, theme } = useAppTheme();
  const [selectorWidth, setSelectorWidth] = useState(0);

  const roleBadgeLabel = role === 'OWNER' ? 'Cuenta OWNER' : 'Cuenta PLAYER';

  const options = [
    { key: 'system', label: 'Sistema', icon: 'smartphone' },
    { key: 'dark', label: 'Oscuro', icon: 'moon' },
    { key: 'light', label: 'Claro', icon: 'sun' },
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
      queryClient.clear();
      await SecureStore.deleteItemAsync(THEME_STORAGE_KEY).catch(() => {});
    }
  };

  return (
    <AuthTabScreen
      appName="Perfil"
      subtitle="Informacion del usuario logueado y acciones de sesion"
      role={role}
      swipeRoutes={{ right: '/home' }}
    >
      <GapView gap="md">
        <AppButton variant={role === 'OWNER' ? 'success' : 'info'} disabled>
          {roleBadgeLabel}
        </AppButton>
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
            Tema
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
            <View style={{ flexDirection: 'row' }}>
              {options.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => setMode(item.key)}
                    style={{
                      flex: 1,
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
          userId={user?.id ?? null}
          onSignOut={handleSignOut}
        />
      </GapView>
    </AuthTabScreen>
  );
}
