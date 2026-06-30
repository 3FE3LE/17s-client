import { expect, test } from '@playwright/test';

/**
 * Smoke test for the /sign-in redirect surface.
 *
 * Clerk is an external dependency and we don't have auth tokens in CI,
 * so we don't assert against the Clerk hosted UI. We only verify that:
 *   - /sign-in?redirect_url=/dashboard loads without crashing
 *   - the page settles on a non-malicious target (either same-origin
 *     `/` after Clerk middleware redirects, or a Clerk auth URL)
 *
 * The actual `resolveRedirectTarget` logic (relative vs absolute, allow-list)
 * is exhaustively covered by `app/lib/auth-redirect.spec.ts` (11 unit tests).
 */

test.describe('Sign-in redirect surface', () => {
  test('visits /sign-in?redirect_url=/dashboard without crashing', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (err) => {
      pageErrors.push(err);
    });

    const response = await page.goto('/sign-in?redirect_url=/dashboard', {
      waitUntil: 'domcontentloaded',
    });

    expect(response, 'expected a response for /sign-in').not.toBeNull();
    const status = response?.status() ?? 0;
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(500);

    // The page should resolve to a non-malicious target. We accept:
    //   - same-origin / or /sign-in (Clerk middleware rewriting)
    //   - a Clerk-hosted URL (clerk.accounts.dev / clerk.com / etc.)
    // We reject anything that looks like an open-redirect attempt
    // (raw http(s)://evil.example/...).
    const finalUrl = page.url();
    const url = new URL(finalUrl);
    const isSameOrigin =
      url.origin === new URL(page.context().baseURL ?? 'http://localhost:3000').origin;
    const isClerkHost = /(^|\.)clerk\.(com|accounts\.dev)$/i.test(url.hostname);

    expect(
      isSameOrigin || isClerkHost,
      `final URL ${finalUrl} is neither same-origin nor a Clerk host`,
    ).toBe(true);

    // Best-effort: should not have thrown a page-level exception.
    expect(
      pageErrors,
      `unexpected pageerror(s): ${pageErrors.map((e) => e.message).join('\n')}`,
    ).toEqual([]);
  });

  test('rejects open-redirect style absolute URLs (smoke-level)', async ({ page }) => {
    // We don't assert *which* page the server lands on — just that the
    // request completes (non-5xx) and does not redirect to the raw
    // attacker host. This mirrors the unit-tested fallback in
    // `resolveRedirectTarget`.
    const response = await page.goto('/sign-in?redirect_url=https://evil.example.com/steal', {
      waitUntil: 'domcontentloaded',
    });

    expect(response, 'expected a response for /sign-in').not.toBeNull();
    const status = response?.status() ?? 0;
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(500);

    const finalUrl = page.url();
    expect(
      finalUrl.startsWith('https://evil.example.com/'),
      'should not redirect to attacker host',
    ).toBe(false);
  });
});
