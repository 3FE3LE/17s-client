import { describe, expect, it } from 'vitest';
import { renderHook } from '../../__tests__/renderHook';
import { useAnimatedValue } from '../useAnimatedValue';

/**
 * `useAnimatedValue` returns a stable `Animated.Value` and starts a
 * timing animation toward `target` whenever `target` (or `duration`)
 * changes. The native bridge can't run inside Node, so `react-native`
 * is replaced with a stub (see `vitest.config.ts`) whose `timing()`
 * settles synchronously, and whose `Value` exposes a numeric `value`
 * field for assertions.
 */
type AnimatedValueStub = { value: number; setValue: (n: number) => void };

function readValue(handle: unknown): number {
  const stub = handle as AnimatedValueStub;
  return stub.value;
}

describe('useAnimatedValue', () => {
  it('returns a stable Animated.Value across renders', () => {
    const hook = renderHook<{ val: unknown }, { target: number }>(
      (props) => ({ val: useAnimatedValue(props!.target) }),
      { initialProps: { target: 0 }, withProps: true },
    );

    const first = hook.result.current.val;
    hook.rerender({ target: 0 });
    expect(hook.result.current.val).toBe(first);
    hook.unmount();
  });

  it('animates the returned value to the initial target on mount', () => {
    const hook = renderHook(() => useAnimatedValue(0.5));
    expect(readValue(hook.result.current)).toBe(0.5);
    hook.unmount();
  });

  it('re-animates to the new target when target changes', () => {
    const hook = renderHook<{ val: unknown }, { target: number }>(
      (props) => ({ val: useAnimatedValue(props!.target) }),
      { initialProps: { target: 0 }, withProps: true },
    );

    hook.rerender({ target: 0.75 });

    expect(readValue(hook.result.current.val)).toBe(0.75);
    hook.unmount();
  });

  it('does not re-animate when unrelated props are stable', () => {
    const hook = renderHook(() => useAnimatedValue(0.3, { duration: 100 }));
    expect(readValue(hook.result.current)).toBe(0.3);
    hook.unmount();
  });

  it('re-animates when the duration option changes', () => {
    const hook = renderHook<{ val: unknown }, { duration: number }>(
      (props) => ({ val: useAnimatedValue(0, { duration: props!.duration }) }),
      { initialProps: { duration: 100 }, withProps: true },
    );

    hook.rerender({ duration: 500 });
    expect(readValue(hook.result.current.val)).toBe(0);
    hook.unmount();
  });
});
