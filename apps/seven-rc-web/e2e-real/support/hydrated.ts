import type { Locator } from '@playwright/test';

/** Waits until React attached its handlers, so a fill + submit is not lost to a native submit. */
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
