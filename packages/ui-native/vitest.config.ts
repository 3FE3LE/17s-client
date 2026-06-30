import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts', 'src/**/*.spec.tsx'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.spec.tsx', 'src/**/__tests__/**'],
    },
  },
  resolve: {
    alias: {
      // Reanimated doesn't ship a working mock in v4.1.x (the bundled
      // `mock.js` requires a source path that isn't published). We
      // provide our own minimal stub that mirrors the surface
      // `useSwipeTransition` consumes.
      'react-native-reanimated': new URL('./src/__tests__/reanimated-stub.ts', import.meta.url)
        .pathname,
      // The native bridge can't run inside Node. Swap `react-native` for a
      // focused stub that exposes only what the hooks under test consume.
      'react-native': new URL('./src/__tests__/react-native-stub.ts', import.meta.url).pathname,
      // Expo Router hooks are stubbed through `expo-router` so the redirect
      // and replace hooks can run without an EXRouterContext.
      'expo-router': new URL('./src/__tests__/expo-router-stub.ts', import.meta.url).pathname,
      // @clerk/clerk-expo is replaced with a minimal hook surface.
      '@clerk/clerk-expo': new URL('./src/__tests__/clerk-stub.ts', import.meta.url).pathname,
    },
  },
});
