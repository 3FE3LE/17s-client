import { defineConfig } from 'vitest/config';

export default defineConfig({
  oxc: { jsx: { runtime: 'automatic' } },
  test: {
    environment: 'node',
    include: ['lib/**/*.spec.{ts,tsx}', 'app/**/*.spec.{ts,tsx}', 'components/**/*.spec.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'e2e/**'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      // Gate scope: domain (lib) and services (server actions) only. Components are covered by
      // component tests and E2E, not by a number.
      include: ['lib/**/*.ts', 'app/**/actions.ts'],
      exclude: ['**/*.spec.{ts,tsx}'],
      // Ratchet: floors sit just under the measured baseline (2026-11-23: 48.8 / 67.7 / 27.4 / 46.4).
      // Raise them when coverage grows; never lower them to land a change.
      thresholds: { statements: 45, branches: 62, functions: 25, lines: 43 },
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': new URL('./', import.meta.url).pathname,
    },
  },
});
