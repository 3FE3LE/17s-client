import 'react-native-gesture-handler';
import '../global.css';
import { ExpoAuthProvider } from '@17suit/core/auth/expo';
import { AppProviders, type ThemeModePreference } from '@17suit/ui';
import { useStoredState } from '@17suit/ui-native';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SevenRcClientProviders } from '../components/seven-rc-client-providers';
import * as SecureStore from 'expo-secure-store';

const THEME_STORAGE_KEY = '17suit.theme.mode';

const isThemeMode = (value: string): value is ThemeModePreference =>
  value === 'system' || value === 'dark' || value === 'light';

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
            <Slot />
          </AppProviders>
        </SevenRcClientProviders>
      </ExpoAuthProvider>
    </GestureHandlerRootView>
  );
}
