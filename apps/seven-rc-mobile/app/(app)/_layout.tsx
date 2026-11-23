import { useAuth } from '@clerk/clerk-expo';
import { useAppTheme } from '@17suit/ui-native';
import { Redirect, Stack } from 'expo-router';

/**
 * Authenticated area. A native stack sits above the tab navigator so every
 * pushed screen (complex detail, booking form, reservation detail) gets the
 * platform push transition, iOS edge-swipe back and Android system Back.
 */
export default function AppLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { theme } = useAppTheme();

  if (isLoaded && !isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="venues/[venueId]"
        options={{
          presentation: 'modal',
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      />
    </Stack>
  );
}
