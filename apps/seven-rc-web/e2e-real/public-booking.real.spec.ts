import { expect, test, type Locator } from '@playwright/test';

const SLUG = 'cancha-la-70';

/** Tomorrow in the venue's time zone: always inside the booking horizon and never already past. */
function tomorrowInBogota(): string {
  const bogota = new Date(Date.now() - 5 * 3_600_000);
  return new Date(bogota.getTime() + 24 * 3_600_000).toISOString().slice(0, 10);
}

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

test('guest books on the real server, reopens the link and cancels', async ({ page }) => {
  await page.goto(`/c/${SLUG}?fecha=${tomorrowInBogota()}`);
  await expect(page.getByRole('heading', { level: 1, name: /Cancha La 70/ })).toBeVisible();

  await page
    .getByRole('link', { name: /^Reservar/ })
    .first()
    .click();
  const form = page.getByRole('form', { name: 'Reserva este horario' });
  await expect(form).toBeVisible();
  await hydrated(form);
  await form.getByLabel('Tu nombre').fill(`Nightly ${Date.now()}`);
  await form.getByLabel('Tu teléfono o WhatsApp').fill('+57 300 123 4567');
  await form.getByRole('button', { name: 'Reservar' }).click();

  await expect(page).toHaveURL(new RegExp(`/c/${SLUG}/reserva/[0-9a-f-]{36}(#.*)?$`));
  await expect(page.getByRole('heading', { level: 1, name: 'Tu reserva' })).toBeVisible();
  await expect(page.getByText('Pendiente de confirmación')).toBeVisible();

  // The reservation link is the receipt: it must load again with no session.
  const reservationUrl = page.url();
  await page.goto(`/c/${SLUG}`);
  await page.goto(reservationUrl);
  await expect(page.getByRole('heading', { level: 1, name: 'Tu reserva' })).toBeVisible();

  await page.getByRole('button', { name: 'Cancelar reserva' }).click();
  const confirm = page.getByRole('form', { name: 'Confirmar cancelación' });
  await hydrated(confirm);
  await confirm.getByRole('button', { name: 'Sí, cancelar' }).click();
  await expect(page.getByText('Cancelada')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancelar reserva' })).toHaveCount(0);
});
