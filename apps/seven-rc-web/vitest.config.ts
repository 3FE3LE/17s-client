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
      include: ['lib/**/*.ts', 'app/**/actions.ts', 'components/**/*.tsx'],
      exclude: ['**/*.spec.{ts,tsx}'],
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': new URL('./', import.meta.url).pathname,
    },
  },
});
