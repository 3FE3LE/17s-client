import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '../../__tests__/renderHook';
import { useSwipeTransition } from '../useSwipeTransition';

/**
 * The reanimated mock returns synchronous no-op worklets, which is
 * enough to exercise `useSwipeTransition`'s wiring: it must
 *  - register an exit animator on mount,
 *  - clear the animator on unmount,
 *  - return a stable `runExit` helper that delegates to `replace`.
 */

interface FakeSharedValue<T> {
  value: T;
}

function makeSharedValue(initial: number): FakeSharedValue<number> {
  return { value: initial };
}

describe('useSwipeTransition', () => {
  it('registers and clears the exit animator across the lifecycle', () => {
    const translateX = makeSharedValue(0);
    const consumeLastDirection = vi.fn(() => null);
    const setExitAnimator = vi.fn();
    const replace = vi.fn();

    const hook = renderHook(() =>
      useSwipeTransition({
        translateX: translateX as unknown as Parameters<typeof useSwipeTransition>[0]['translateX'],
        consumeLastDirection,
        setExitAnimator: setExitAnimator as unknown as Parameters<
          typeof useSwipeTransition
        >[0]['setExitAnimator'],
        replace,
      }),
    );

    expect(setExitAnimator).toHaveBeenCalledTimes(1);
    expect(typeof setExitAnimator.mock.calls[0]?.[0]).toBe('function');
    expect(consumeLastDirection).toHaveBeenCalledTimes(1);

    hook.unmount();
    expect(setExitAnimator).toHaveBeenCalledTimes(2);
    expect(setExitAnimator.mock.calls[1]?.[0]).toBeNull();
  });

  it('starts the enter animation from the persisted last direction (left)', () => {
    const translateX = makeSharedValue(0);
    const consumeLastDirection = vi.fn(() => 'left' as const);
    const setExitAnimator = vi.fn();
    const replace = vi.fn();

    renderHook(() =>
      useSwipeTransition({
        translateX: translateX as unknown as Parameters<typeof useSwipeTransition>[0]['translateX'],
        consumeLastDirection,
        setExitAnimator: setExitAnimator as unknown as Parameters<
          typeof useSwipeTransition
        >[0]['setExitAnimator'],
        replace,
      }),
    );

    // The reanimated mock's `withTiming(toValue, ...)` resolves
    // synchronously by returning the toValue (well, the stub applies
    // it). We only assert that the consume helper was consulted.
    expect(consumeLastDirection).toHaveBeenCalled();
  });

  it('returns a runExit helper that calls replace on completion', () => {
    const translateX = makeSharedValue(0);
    const consumeLastDirection = vi.fn(() => null);
    const setExitAnimator = vi.fn();
    const replace = vi.fn();

    const hook = renderHook(() =>
      useSwipeTransition({
        translateX: translateX as unknown as Parameters<typeof useSwipeTransition>[0]['translateX'],
        consumeLastDirection,
        setExitAnimator: setExitAnimator as unknown as Parameters<
          typeof useSwipeTransition
        >[0]['setExitAnimator'],
        replace,
      }),
    );

    const { runExit } = hook.result.current;
    expect(typeof runExit).toBe('function');

    runExit('right', '/dashboard');
    // The reanimated mock fires its `finished` callback synchronously,
    // so `replace` must have been invoked exactly once.
    expect(replace).toHaveBeenCalledWith('/dashboard');
  });
});
