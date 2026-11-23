import { expect, test } from '@playwright/test';
import {
  SLUG,
  failNext,
  fillAndSubmit,
  hydrated,
  openBookingForm,
  resetStub,
} from './support/helpers';

const RESERVATION_URL = new RegExp(`/c/${SLUG}/reserva/[0-9a-f-]{36}(#.*)?$`);

async function book(page: import('@playwright/test').Page): Promise<string> {
  const form = await openBookingForm(page);
  await fillAndSubmit(form);
  await expect(page).toHaveURL(RESERVATION_URL);
  return page.url();
}

test.describe('Public reservation: cancel, conflict and throttle', () => {
  test.beforeEach(async () => {
    await resetStub();
  });

  test('guest cancels by link and the slot is free again', async ({ page }) => {
    await book(page);
    await expect(page.getByText('Pendiente de confirmación')).toBeVisible();

    await page.getByRole('button', { name: 'Cancelar reserva' }).click();
    const confirm = page.getByRole('form', { name: 'Confirmar cancelación' });
    await hydrated(confirm);
    await confirm.getByRole('button', { name: 'Sí, cancelar' }).click();

    await expect(page.getByText('Cancelada')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancelar reserva' })).toHaveCount(0);

    await page.goto(`/c/${SLUG}`);
    await expect(page.getByText('Ocupado')).toHaveCount(0);
  });

  test('"Volver" keeps the reservation untouched', async ({ page }) => {
    await book(page);
    await page.getByRole('button', { name: 'Cancelar reserva' }).click();
    await page.getByRole('button', { name: 'Volver' }).click();
    await expect(page.getByRole('button', { name: 'Cancelar reserva' })).toBeVisible();
    await expect(page.getByText('Pendiente de confirmación')).toBeVisible();
  });

  test('409 on booking shows the conflict notice and the form is not stuck', async ({ page }) => {
    const form = await openBookingForm(page);
    await failNext('reserve', 409);
    await fillAndSubmit(form);

    await expect(page).toHaveURL(/conflicto=1/);
    await expect(
      page.getByRole('alert').filter({ hasText: 'Otra persona acaba de reservar' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Complejo E2E' })).toBeVisible();
  });

  test('429 on booking shows the retry message inline and keeps the form', async ({ page }) => {
    const form = await openBookingForm(page);
    await failNext('reserve', 429);
    await fillAndSubmit(form);

    await expect(form.getByText('Demasiados intentos seguidos')).toBeVisible();
    await expect(page).not.toHaveURL(RESERVATION_URL);
    await expect(form.getByLabel('Tu nombre')).toHaveValue('Ana Prueba');
  });

  test('cancel answered 400 explains it is no longer cancellable online', async ({ page }) => {
    await book(page);
    await failNext('cancel', 400);
    await page.getByRole('button', { name: 'Cancelar reserva' }).click();
    const confirm = page.getByRole('form', { name: 'Confirmar cancelación' });
    await hydrated(confirm);
    await confirm.getByRole('button', { name: 'Sí, cancelar' }).click();

    await expect(confirm.getByText('Ya no se puede cancelar en línea')).toBeVisible();
    await expect(page.getByText('Pendiente de confirmación')).toBeVisible();
  });

  test('cancel answered 429 asks to wait a minute', async ({ page }) => {
    await book(page);
    await failNext('cancel', 429);
    await page.getByRole('button', { name: 'Cancelar reserva' }).click();
    const confirm = page.getByRole('form', { name: 'Confirmar cancelación' });
    await hydrated(confirm);
    await confirm.getByRole('button', { name: 'Sí, cancelar' }).click();

    await expect(confirm.getByText('Demasiados intentos. Espera un minuto.')).toBeVisible();
  });
});
