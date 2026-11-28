import 'react-native-gesture-handler';
import '../global.css';
import { ExpoAuthProvider } from '@17suit/core/auth/expo';
import {
  AppProviders,
  useAppTheme,
  useStoredState,
  type ThemeModePreference,
} from '@17suit/ui-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SevenRcClientProviders } from '../components/seven-rc-client-providers';
import * as SecureStore from 'expo-secure-store';

const THEME_STORAGE_KEY = '17suit.theme.mode';

const isThemeMode = (value: string): value is ThemeModePreference =>
  value === 'system' || value === 'dark' || value === 'light';

function RootStack() {
  const { theme } = useAppTheme();
  // Native stack so auth pushes (sign-in -> sign-up -> verify) get the
  // platform push transition and iOS edge-swipe back.
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}

export default function Layout() {
  const [themeMode, setThemeMode] = useStoredState<ThemeModePreference>({
    defaultValue: 'system',
    load: () => SecureStore.getItemAsync(THEME_STORAGE_KEY),
    applyWhen: isThemeMode,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ExpoAuthProvider>
        <SevenRcClientProviders>
          <AppProviders
            themeMode={themeMode}
            onThemeModeChange={(mode) => {
              setThemeMode(mode);
              void SecureStore.setItemAsync(THEME_STORAGE_KEY, mode);
            }}
          >
            <RootStack />
          </AppProviders>
        </SevenRcClientProviders>
      </ExpoAuthProvider>
    </GestureHandlerRootView>
  );
}
