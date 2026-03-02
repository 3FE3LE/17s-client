import 'react-native-gesture-handler';
import '../global.css';
import { ExpoAuthProvider } from '@17suit/core/auth/expo';
import { AppProviders } from '@17suit/ui';
import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SevenRcClientProviders } from '../components/seven-rc-client-providers';
import * as SecureStore from 'expo-secure-store';
import type { ThemeModePreference } from '@17suit/ui';

const THEME_STORAGE_KEY = '17suit.theme.mode';

export default function Layout() {
  const [themeMode, setThemeMode] = useState<ThemeModePreference>('system');

  useEffect(() => {
    let isMounted = true;
    SecureStore.getItemAsync(THEME_STORAGE_KEY)
      .then((value) => {
        if (!isMounted || !value) return;
        if (value === 'system' || value === 'dark' || value === 'light') {
          setThemeMode(value);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

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
