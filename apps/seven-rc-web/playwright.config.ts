import { defineConfig, devices } from '@playwright/test';

/**
 * E2E for the public booking flow (`/c/[slug]`).
 *
 * The Next server fetches the venue API server-side, so the browser cannot mock it.
 * `e2e/support/stub-api.mjs` stands in for 17s-server and `API_BASE_URL` points at it.
 * No Docker, Postgres or Clerk session is needed: the owner "publish" step is covered by
 * component tests; here the venue is already published.
 *
 * Opt-in locally: `pnpm --filter @17suit/seven-rc-web test:e2e`. CI runs it only on PRs
 * to `development` and `preview` (see .github/workflows/e2e-seven-rc-web.yml).
 */
// Own port + dist dir: never reuse (or collide with) a developer's `next dev` on 3007, which
// would talk to the real API instead of the stub.
const WEB_PORT = 3107;
const STUB_PORT = Number(process.env.E2E_STUB_PORT ?? 4010);
const WEB_URL = `http://localhost:${WEB_PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? WEB_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Clerk dev instances redirect a browser with no dev-browser cookie to their handshake
    // endpoint. CI uses a placeholder key with no such host, so present the cookie up front.
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
  webServer: [
    {
      command: 'node e2e/support/stub-api.mjs',
      url: `http://127.0.0.1:${STUB_PORT}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 15_000,
    },
    {
      command: `pnpm exec next dev --turbopack --port ${WEB_PORT}`,
      url: WEB_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      stdout: 'pipe',
      stderr: 'pipe',
      env: {
        NEXT_DIST_DIR: '.next-e2e',
        API_BASE_URL: `http://127.0.0.1:${STUB_PORT}/api`,
        NEXT_PUBLIC_API_BASE_URL: `http://127.0.0.1:${STUB_PORT}/api`,
        // Never inherit a developer's real Sentry DSN into test runs.
        SENTRY_DSN: '',
      },
    },
  ],
});
