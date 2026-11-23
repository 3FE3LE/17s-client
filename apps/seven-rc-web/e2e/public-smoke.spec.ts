import { expect, test } from '@playwright/test';

const SLUG = 'complejo-e2e';

/** Hydration noise is app-level and tracked apart; everything else is a real crash. */
function trackPageErrors(page: import('@playwright/test').Page): Error[] {
  const errors: Error[] = [];
  page.on('pageerror', (error) => {
    if (/hydrat/i.test(error.message)) return;
    errors.push(error);
  });
  return errors;
}

test.describe('Public routes render', () => {
  test('/c/[slug] renders the venue', async ({ page }) => {
    const errors = trackPageErrors(page);
    const response = await page.goto(`/c/${SLUG}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('main')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('/c/[slug] with an unknown slug is a 404', async ({ page }) => {
    const response = await page.goto('/c/no-existe');
    expect(response?.status()).toBe(404);
  });

  test('/c/[slug]/reserva/[token] with an unknown token is a 404', async ({ page }) => {
    const response = await page.goto(`/c/${SLUG}/reserva/00000000-0000-4000-8000-000000000000`);
    expect(response?.status()).toBe(404);
  });

  test('/c/[slug]/reserva/[token] with a malformed token is a 404', async ({ page }) => {
    const response = await page.goto(`/c/${SLUG}/reserva/not-a-uuid`);
    expect(response?.status()).toBe(404);
  });

  test('landing route renders without a server error', async ({ page }) => {
    const errors = trackPageErrors(page);
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response?.status() ?? 0).toBeLessThan(400);
    expect(errors).toEqual([]);
  });
});
