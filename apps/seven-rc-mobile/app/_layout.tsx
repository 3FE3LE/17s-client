import 'react-native-gesture-handler';
import '../global.css';
import * as Sentry from '@sentry/react-native';
import { ExpoAuthProvider } from '@17suit/core/auth/expo';
import { AppProviders, type ThemeModePreference } from '@17suit/ui';
import { useStoredState } from '@17suit/ui-native';
import Constants from 'expo-constants';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SevenRcClientProviders } from '../components/seven-rc-client-providers';
import * as SecureStore from 'expo-secure-store';

const THEME_STORAGE_KEY = '17suit.theme.mode';

const isThemeMode = (value: string): value is ThemeModePreference =>
  value === 'system' || value === 'dark' || value === 'light';

interface SentryExtra {
  sentryDsn?: string;
  sentryEnvironment?: string;
  sentryTracesSampleRate?: string;
}

// Resolve Sentry config from `expo.extra` in `app.json`. Expo injects the
// values at build time (EAS env / app config plugin), so we never need to
// touch `process.env` from React Native runtime, which has no `process`.
const extra = Constants.expoConfig?.extra as SentryExtra | undefined;
const sentryDsn = extra?.sentryDsn;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: extra?.sentryEnvironment,
    tracesSampleRate: extra?.sentryTracesSampleRate ? Number(extra.sentryTracesSampleRate) : 0.1,
    // Don't send PII by default; route through beforeSend if we ever need to.
    sendDefaultPii: false,
  });
}

function Layout() {
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

// Sentry.wrap adds an error boundary around the root. When Sentry is not
// configured (no DSN), the wrapper is a pass-through.
export default Sentry.wrap(Layout);
