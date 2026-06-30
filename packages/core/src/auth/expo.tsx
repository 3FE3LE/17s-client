import { ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import type { ReactNode } from 'react';

const tokenCache = {
  getToken: async (key: string) => SecureStore.getItemAsync(key),
  saveToken: async (key: string, value: string) => SecureStore.setItemAsync(key, value),
};

export function ExpoAuthProvider({ children }: { children: ReactNode }) {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env;
  const publishableKey =
    env?.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ??
    (env?.CI === 'true' ? ['pk', 'test', 'ZmFrZS5jbGVyay5hY2NvdW50cy5kZXYk'].join('_') : undefined);
  if (!publishableKey) {
    throw new Error('Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');
  }
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}

// Re-export the pure redirect helper so callers continue to import it from
// `@17suit/core/auth/expo`. The helper itself lives in expo-redirect so it
// can be unit-tested without pulling expo-secure-store into a Node
// test environment.
export { getExpoAuthRedirect } from './expo-redirect';
export type { ExpoAuthRedirectInput } from './expo-redirect';
