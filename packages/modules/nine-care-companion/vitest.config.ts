import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    // The module is a Day-1 placeholder until backend contracts land.
    // Once specs exist, vitest will run them; until then, don't fail CI.
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/**/__tests__/**'],
    },
  },
});
