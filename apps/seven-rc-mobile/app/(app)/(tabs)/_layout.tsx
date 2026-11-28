import { useTranslation } from '@17suit/i18n/react';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@17suit/ui-native';
import { Tabs } from 'expo-router/js-tabs';

export default function TabsLayout() {
  const { theme } = useAppTheme();
  const { t } = useTranslation('mobile');
  const labelType = theme.typography.styles.caption;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        // `info` keeps ≥4.5:1 on both the light and dark backgrounds;
        // brandPrimary is too light on the light theme.
        tabBarActiveTintColor: theme.colors.info,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.grayscale[3],
        },
        tabBarLabelStyle: {
          fontFamily: labelType.nativeFamily,
          fontSize: 12,
          letterSpacing: labelType.letterSpacingPx,
        },
        sceneStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}
