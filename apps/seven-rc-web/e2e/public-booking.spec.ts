import { expect, test, type Locator } from '@playwright/test';

const SLUG = 'complejo-e2e';
const STUB = `http://127.0.0.1:${process.env.E2E_STUB_PORT ?? 4010}`;

/**
 * A submit before hydration is a plain POST that drops the form state (and, in dev, can stall the
 * server). React attaches `__reactProps$*` to a node once it has hydrated, so wait for that.
 */
async function hydrated(form: Locator): Promise<void> {
  await form.evaluate(
    (node) =>
      new Promise<void>((resolve) => {
        const ready = () => Object.keys(node).some((key) => key.startsWith('__reactProps'));
        const tick = () => (ready() ? resolve() : setTimeout(tick, 50));
        tick();
      }),
  );
}

test.describe('Public booking flow', () => {
  test.beforeAll(async () => {
    await fetch(`${STUB}/__e2e/reset`, { method: 'POST' });
  });

  test('guest books a slot and reopens the reservation by link', async ({ page }) => {
    await page.goto(`/c/${SLUG}`);
    await expect(page.getByRole('heading', { level: 1, name: 'Complejo E2E' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Canchas' })).toBeVisible();
    await expect(page.getByText('Cancha Uno').first()).toBeVisible();

    const firstFree = page.getByRole('link', { name: /^Reservar/ }).first();
    await expect(firstFree).toBeVisible();
    await firstFree.click();

    const form = page.getByRole('form', { name: 'Reserva este horario' });
    await expect(form).toBeVisible();
    await hydrated(form);
    await form.getByLabel('Tu nombre').fill('Ana Prueba');
    await form.getByLabel('Tu teléfono o WhatsApp').fill('+57 300 123 4567');
    await form.getByRole('button', { name: 'Reservar' }).click();

    await expect(page).toHaveURL(new RegExp(`/c/${SLUG}/reserva/[0-9a-f-]{36}(#.*)?$`));
    await expect(page.getByRole('heading', { level: 1, name: 'Tu reserva' })).toBeVisible();
    await expect(page.getByText('Pendiente de confirmación')).toBeVisible();
    await expect(page.getByText('Complejo E2E').first()).toBeVisible();

    // The reservation link is the receipt: it must load again with no session.
    const reservationUrl = page.url();
    await page.goto(`/c/${SLUG}`);
    await page.goto(reservationUrl);
    await expect(page.getByRole('heading', { level: 1, name: 'Tu reserva' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Detalle' })).toBeVisible();
  });

  test('a booked slot shows as taken on the venue page', async ({ page }) => {
    await page.goto(`/c/${SLUG}`);
    // Previous test booked one slot, so at least one "Ocupado" badge is listed.
    await expect(page.getByText('Ocupado').first()).toBeVisible();
  });

  test('shows validation errors inline and keeps the form', async ({ page }) => {
    await page.goto(`/c/${SLUG}`);
    await page
      .getByRole('link', { name: /^Reservar/ })
      .first()
      .click();
    const form = page.getByRole('form', { name: 'Reserva este horario' });
    await hydrated(form);
    await form.getByRole('button', { name: 'Reservar' }).click();
    await expect(form.getByText('Escribe tu nombre.')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/c/${SLUG}`));
  });
});
