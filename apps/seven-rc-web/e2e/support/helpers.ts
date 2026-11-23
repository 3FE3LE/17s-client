import { type Locator, type Page } from '@playwright/test';

export const SLUG = 'complejo-e2e';
export const STUB = `http://127.0.0.1:${process.env.E2E_STUB_PORT ?? 4010}`;

/**
 * A submit before hydration is a plain POST that drops the form state (and, in dev, can stall the
 * server). React attaches `__reactProps$*` to a node once it has hydrated, so wait for that.
 */
export async function hydrated(form: Locator): Promise<void> {
  await form.evaluate(
    (node) =>
      new Promise<void>((resolve) => {
        const ready = () => Object.keys(node).some((key) => key.startsWith('__reactProps'));
        const tick = () => (ready() ? resolve() : setTimeout(tick, 50));
        tick();
      }),
  );
}

export async function resetStub(): Promise<void> {
  await fetch(`${STUB}/__e2e/reset`, { method: 'POST' });
}

/** Make the stub answer the next request on `route` with `status`, once. */
export async function failNext(route: 'reserve' | 'cancel', status: number): Promise<void> {
  await fetch(`${STUB}/__e2e/fail-next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ route, status }),
  });
}

/** Opens the first free slot's booking form and waits until it can be submitted. */
export async function openBookingForm(page: Page): Promise<Locator> {
  await page.goto(`/c/${SLUG}`);
  await page
    .getByRole('link', { name: /^Reservar/ })
    .first()
    .click();
  const form = page.getByRole('form', { name: 'Reserva este horario' });
  await hydrated(form);
  return form;
}

export async function fillAndSubmit(form: Locator): Promise<void> {
  await form.getByLabel('Tu nombre').fill('Ana Prueba');
  await form.getByLabel('Tu teléfono o WhatsApp').fill('+57 300 123 4567');
  await form.getByRole('button', { name: 'Reservar' }).click();
}
