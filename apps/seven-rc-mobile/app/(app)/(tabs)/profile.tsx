import { useClerk, useUser } from '@clerk/clerk-expo';
import {
  useCurrentUserRoleQuery,
  useSetCurrentUserRoleMutation,
} from '@17suit/module-seven-reservations-club/client';
import { AppBadge, AppProfile, GapView, useAppTheme, useAppToast } from '@17suit/ui';
import { AppButton, useAnimatedValue } from '@17suit/ui-native';
import { Alert, Animated, Platform, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Screen } from '../../../components/screen';
import { useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { humanizeError } from '../../../lib/error-messages';

const THEME_STORAGE_KEY = '17suit.theme.mode';

export default function ProfileScreen() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const toast = useAppToast();
  const { role } = useCurrentUserRoleQuery({ userId: user?.id, enabled: Boolean(user?.id) });
  const setRoleMutation = useSetCurrentUserRoleMutation();
  const { mode, setMode, theme } = useAppTheme();
  const [selectorWidth, setSelectorWidth] = useState(0);

  const roleBadgeLabel = role === 'OWNER' ? 'Administras un complejo' : 'Reservas como jugador';
  const nextRole = role === 'OWNER' ? 'PLAYER' : 'OWNER';
  const nextRoleLabel = nextRole === 'OWNER' ? 'Administrar un complejo' : 'Reservar como jugador';

  const switchRole = async () => {
    try {
      await setRoleMutation.mutateAsync(nextRole);
      toast.success(
        'Modo cambiado',
        nextRole === 'OWNER' ? 'Ahora administras complejos.' : 'Ahora reservas como jugador.',
      );
      router.replace('/home');
    } catch (error) {
      toast.error('No se pudo cambiar el modo', humanizeError(error, 'save'));
    }
  };

  const askSwitchRole = () => {
    const title = '¿Cambiar de modo?';
    const message =
      nextRole === 'OWNER'
        ? 'Verás tus complejos y las reservas que reciben. Tus reservas como jugador se mantienen.'
        : 'Verás los complejos disponibles y tus reservas. Tus complejos se mantienen.';
    if (Platform.OS === 'web') {
      const confirmFn = (globalThis as { confirm?: (text: string) => boolean }).confirm;
      if (confirmFn?.(`${title}\n\n${message}`)) void switchRole();
      return;
    }
    Alert.alert(title, message, [
      { text: 'Volver', style: 'cancel' },
      { text: 'Cambiar', onPress: () => void switchRole() },
    ]);
  };

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
    <Screen title="Perfil" subtitle="Tu cuenta y preferencias" back={false}>
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
              accessibilityLabel={`Cambiar modo: ${nextRoleLabel}`}
            >
              {setRoleMutation.isPending ? 'Cambiando…' : `Cambiar modo · ${nextRoleLabel}`}
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
            <View style={{ flexDirection: 'row' }} accessibilityRole="radiogroup">
              {options.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => setMode(item.key)}
                    accessibilityRole="radio"
                    accessibilityLabel={`Tema ${item.label.toLowerCase()}`}
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
