import * as Sentry from '@sentry/react-native';
import { ExpoAuthProvider } from '@17suit/core/auth/expo';
import { AppProviders } from '@17suit/ui';
import { useExpoAuthRedirect } from '@17suit/ui-native';
import Constants from 'expo-constants';
import { Slot } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

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

function AuthRouteGuard() {
  const { isLoaded } = useAuth();
  useExpoAuthRedirect({
    publicPaths: ['/sign-in', '/sign-up', '/forgot-password'],
    signedInPath: '/',
    signedOutPath: '/sign-in',
  });

  if (!isLoaded) return null;
  return <Slot />;
}

function Layout() {
  return (
    <ExpoAuthProvider>
      <AppProviders>
        <AuthRouteGuard />
      </AppProviders>
    </ExpoAuthProvider>
  );
}

// Sentry.wrap adds an error boundary around the root. When Sentry is not
// configured (no DSN), the wrapper is a pass-through.
export default Sentry.wrap(Layout);
