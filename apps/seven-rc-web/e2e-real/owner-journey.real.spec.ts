import { expect, test } from '@playwright/test';
import { hydrated } from './support/hydrated';
import { signInAs } from './support/session';

test('new owner picks the role, lands on /owner and creates a venue', async ({ context, page }) => {
  await signInAs(context, 'owner');

  await page.goto('/');
  await expect(page).toHaveURL(/\/onboarding\/role/);
  await page.getByRole('button', { name: 'Continuar como dueño de complejo' }).click();
  await expect(page).toHaveURL(/\/owner/);

  const venueName = `Complejo E2E ${Date.now()}`;
  const form = page.getByRole('form', { name: 'Nuevo complejo' });
  await expect(form).toBeVisible();
  await hydrated(form);
  await form.getByLabel('Nombre del complejo').fill(venueName);
  await form.getByRole('button', { name: 'Crear complejo' }).click();

  await expect(page.getByText(venueName).first()).toBeVisible();

  // The role persists: reloading the root goes straight back to the owner home.
  await page.goto('/');
  await expect(page).toHaveURL(/\/owner/);
});
