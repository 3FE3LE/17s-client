import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['app/**/*.spec.ts'],
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
