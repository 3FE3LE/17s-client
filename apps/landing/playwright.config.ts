import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the landing app.
 *
 * Landing runs on port 3000 (see `dev` script in package.json).
 * The webServer block is configured for local runs; CI should set
 * `PLAYWRIGHT_BASE_URL` (or override `use.baseURL`) and either run
 * `pnpm dev` itself or set CI=1 so `reuseExistingServer` is honored
 * against an externally-started server.
 *
 * The e2e suite is intentionally NOT wired into the `turbo run test`
 * pipeline — Playwright tests are slow and need a running dev server.
 * Run them opt-in via `pnpm --filter @17suit/landing test:e2e`.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
