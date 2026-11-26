import { expect, test } from '@playwright/test';
import { signInAs } from './support/session';

test('new player picks the role and sees the seeded venue on /play', async ({ context, page }) => {
  await signInAs(context, 'player');

  await page.goto('/');
  await expect(page).toHaveURL(/\/onboarding\/role/);
  await page.getByRole('button', { name: 'Continuar como jugador' }).click();
  await expect(page).toHaveURL(/\/play/);
  await expect(page.getByText('Cancha La 70').first()).toBeVisible();

  // The role persists: reloading the root goes straight back to the player home.
  await page.goto('/');
  await expect(page).toHaveURL(/\/play/);
});
