import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['app/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', '.next', 'e2e/**'],
    coverage: {
      provider: 'v8',
      include: ['app/**/*.ts'],
      exclude: ['app/**/*.spec.ts', 'app/**/__tests__/**'],
    },
  },
  resolve: {
    alias: {
      '@': new URL('./app', import.meta.url).pathname,
    },
  },
});
