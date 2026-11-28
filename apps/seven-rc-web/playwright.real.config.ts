import { defineConfig, devices } from '@playwright/test';

/**
 * Real end-to-end layer for the public booking flow (`/c/[slug]`).
 *
 * No stub: the Next server talks to a real 17s-server over real Postgres. The nightly workflow
 * (.github/workflows/e2e-real.yml) starts that server and seeds `cancha-la-70`; locally start it
 * yourself (`pnpm prisma:seed:7rc` in 17s-server) and set `API_BASE_URL`.
 *
 * Not part of PR gates and not selected by `select-e2e.mjs`: it lives in `e2e-real/`, outside the
 * stub suite's `testDir`.
 */
const WEB_PORT = 3108;
const WEB_URL = `http://localhost:${WEB_PORT}`;
const API_BASE_URL = process.env.API_BASE_URL ?? 'http://127.0.0.1:4000/api';

export default defineConfig({
  testDir: './e2e-real',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: WEB_URL,
    // Specs assert Spanish copy: pin the locale so they never depend on the runner.
    locale: 'es-ES',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Same Clerk dev-browser cookie trick as the stub suite: no real Clerk host in CI.
    storageState: {
      cookies: [
        {
          name: '__clerk_db_jwt',
          value: 'e2e',
          domain: 'localhost',
          path: '/',
          expires: -1,
          httpOnly: false,
          secure: false,
          sameSite: 'Lax',
        },
      ],
      origins: [],
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], browserName: 'chromium' } }],
  webServer: {
    command: `pnpm exec next dev --turbopack --port ${WEB_PORT}`,
    url: WEB_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      NEXT_DIST_DIR: '.next-e2e-real',
      API_BASE_URL,
      NEXT_PUBLIC_API_BASE_URL: API_BASE_URL,
      // Auth seam for owner/player journeys; the server runs the same flag (e2e-real.yml).
      E2E_FAKE_AUTH: '1',
      NEXT_PUBLIC_E2E_FAKE_AUTH: '1',
    },
  },
});
