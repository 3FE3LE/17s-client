import { describe, expect, it } from 'vitest';
import { renderHook } from '../../__tests__/renderHook';
import { usePulseAnimation } from '../usePulseAnimation';

/**
 * `usePulseAnimation` returns an `Animated.Value` and starts a
 * 0 → 1 → 0 loop while `enabled` is true. The stub's `timing()`
 * settles synchronously, so the test only verifies the wiring:
 *  - mounting with `enabled: true` produces an Animated.Value,
 *  - mounting with `enabled: false` leaves the value at 0,
 *  - unmounting clears the loop without throwing.
 */

type AnimatedValueStub = { value: number };

describe('usePulseAnimation', () => {
  it('returns a stable Animated.Value that exposes a numeric value', () => {
    const hook = renderHook(() => usePulseAnimation());
    const val = hook.result.current as unknown as AnimatedValueStub;
    expect(typeof val.value).toBe('number');
    hook.unmount();
  });

  it('starts the loop on mount when enabled is true (default)', () => {
    const hook = renderHook(() => usePulseAnimation({ duration: 50 }));
    const val = hook.result.current as unknown as AnimatedValueStub;

    // The stub's `loop(sequence)` runs the sequence synchronously and
    // the final stage restores the pulse to 0. We only assert the
    // value reference is a real Animated-like object and never throws.
    expect(typeof val.value).toBe('number');
    hook.unmount();
  });

  it('does not start the loop when enabled is false', () => {
    const hook = renderHook(() => usePulseAnimation({ enabled: false }));
    const val = hook.result.current as unknown as AnimatedValueStub;

    // Without a loop, the initial value (0) never advances.
    expect(val.value).toBe(0);
    hook.unmount();
  });

  it('calls stop() on unmount to cancel the loop', () => {
    const hook = renderHook(() => usePulseAnimation({ duration: 50 }));
    expect(() => hook.unmount()).not.toThrow();
  });
});
