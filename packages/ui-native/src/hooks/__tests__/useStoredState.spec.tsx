import { describe, expect, it } from 'vitest';
import { renderHook } from '../../__tests__/renderHook';
import { useStoredState } from '../useStoredState';

/**
 * `useStoredState` reads a single string from an async store (e.g.
 * Expo SecureStore) on mount and exposes it as React state. The
 * `load` callback is expected to resolve with the persisted value
 * or `null` when nothing was stored.
 *
 * Because `useEffect` schedules the load via `Promise.then`, tests
 * must `await hook.act(() => resolveLoad(...))` so the resulting
 * `setState` flushes through React's `act()` boundary.
 */
describe('useStoredState', () => {
  it('exposes the default value until load() resolves', () => {
    let resolveLoad!: (value: string | null) => void;
    const load = () =>
      new Promise<string | null>((resolve) => {
        resolveLoad = resolve;
      });

    const hook = renderHook(() =>
      useStoredState({ load, defaultValue: 'guest' as 'guest' | 'admin' }),
    );

    expect(hook.result.current[0]).toBe('guest');
    // Resolving on a later tick (out of band) is safe; we just exit.
    resolveLoad(null);
    hook.unmount();
  });

  it('overwrites the state with the persisted value when accepted', async () => {
    let resolveLoad!: (value: string | null) => void;
    const load = () =>
      new Promise<string | null>((resolve) => {
        resolveLoad = resolve;
      });

    const hook = renderHook(() =>
      useStoredState({ load, defaultValue: 'guest' as 'guest' | 'admin' }),
    );

    await hook.act(async () => {
      resolveLoad('admin');
      // Drain a microtask so the `.then` schedules a setState, then
      // another so React commits the update.
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(hook.result.current[0]).toBe('admin');
    hook.unmount();
  });

  it('keeps the default value when load() resolves with null', async () => {
    let resolveLoad!: (value: string | null) => void;
    const load = () =>
      new Promise<string | null>((resolve) => {
        resolveLoad = resolve;
      });

    const hook = renderHook(() =>
      useStoredState({ load, defaultValue: 'guest' as 'guest' | 'admin' }),
    );

    await hook.act(async () => {
      resolveLoad(null);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(hook.result.current[0]).toBe('guest');
    hook.unmount();
  });

  it('runs the applyWhen predicate and skips values that fail it', async () => {
    let resolveLoad!: (value: string | null) => void;
    const load = () =>
      new Promise<string | null>((resolve) => {
        resolveLoad = resolve;
      });

    const applyWhen = (value: string): value is 'admin' => value === 'admin';

    const hook = renderHook(() =>
      useStoredState({
        load,
        defaultValue: 'guest' as 'guest' | 'admin',
        applyWhen,
      }),
    );

    await hook.act(async () => {
      resolveLoad('not-a-role');
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(hook.result.current[0]).toBe('guest');
    hook.unmount();
  });

  it('uses the predicate to narrow the persisted value when it matches', async () => {
    let resolveLoad!: (value: string | null) => void;
    const load = () =>
      new Promise<string | null>((resolve) => {
        resolveLoad = resolve;
      });

    const applyWhen = (value: string): value is 'admin' => value === 'admin';

    const hook = renderHook(() =>
      useStoredState({
        load,
        defaultValue: 'guest' as 'guest' | 'admin',
        applyWhen,
      }),
    );

    await hook.act(async () => {
      resolveLoad('admin');
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(hook.result.current[0]).toBe('admin');
    hook.unmount();
  });

  it('ignores load() rejections and keeps the default value', async () => {
    let rejectLoad!: (reason?: unknown) => void;
    const load = () =>
      new Promise<string | null>((_resolve, reject) => {
        rejectLoad = reject;
      });

    const hook = renderHook(() =>
      useStoredState({ load, defaultValue: 'guest' as 'guest' | 'admin' }),
    );

    await hook.act(async () => {
      rejectLoad(new Error('store offline'));
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(hook.result.current[0]).toBe('guest');
    hook.unmount();
  });

  it('returns a setter that mutates the value', async () => {
    const hook = renderHook(() =>
      useStoredState({
        load: () => Promise.resolve(null),
        defaultValue: 'guest' as 'guest' | 'admin',
      }),
    );

    await hook.act(() => {
      const [, setValue] = hook.result.current;
      setValue('admin');
    });

    expect(hook.result.current[0]).toBe('admin');
    hook.unmount();
  });
});
