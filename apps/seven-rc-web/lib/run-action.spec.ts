import { beforeEach, describe, expect, it, vi } from 'vitest';

const success = vi.fn<(message: string) => void>();
const error = vi.fn<(message: string) => void>();
vi.mock('@17suit/ui/feedback/toast', () => ({
  notify: { success: (m: string): void => success(m), error: (m: string): void => error(m) },
}));

import { runAction } from '@17suit/ui/feedback';

describe('runAction', () => {
  beforeEach(() => {
    success.mockClear();
    error.mockClear();
  });

  it('shows success only after the action resolves', async () => {
    let resolve!: () => void;
    const pending = runAction(() => new Promise<void>((r) => (resolve = r)), { success: 'Saved' });
    expect(success).not.toHaveBeenCalled();
    resolve();
    expect((await pending).ok).toBe(true);
    expect(success).toHaveBeenCalledWith('Saved');
  });

  it('never shows success on failure and translates the errorKey', async () => {
    const result = await runAction(
      () => Promise.reject(Object.assign(new Error('x'), { errorKey: 'slotUnavailable' })),
      {
        success: 'Saved',
        locale: 'es',
      },
    );
    expect(result.ok).toBe(false);
    expect(success).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledWith(expect.stringContaining('Otra persona acaba de reservar'));
  });

  it('uses the fallback for errors without a key and can skip the toast', async () => {
    await runAction(() => Promise.reject(new Error('boom')), { errorFallback: 'No se pudo' });
    expect(error).toHaveBeenCalledWith('No se pudo');
    error.mockClear();
    await runAction(() => Promise.reject(new Error('boom')), { toastError: false });
    expect(error).not.toHaveBeenCalled();
  });
});
