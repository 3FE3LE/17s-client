import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface UsePulseAnimationOptions {
  /** Animation cycle duration in ms (each half = duration). Default 900. */
  duration?: number;
  /** When false, animation is not started. Default true. */
  enabled?: boolean;
}

/**
 * Loops a 0 -> 1 -> 0 pulse on a React Native `Animated.Value` while
 * `enabled` is true. Imperative Animated.loop can't be expressed as
 * derived state, so the `no-restricted-syntax` rule for `useEffect` is
 * scoped to this single hook.
 *
 * Contract: returns the same `Animated.Value` for the lifetime of the
 * component. Cleanup stops the loop.
 */
export function usePulseAnimation({
  duration = 900,
  enabled = true,
}: UsePulseAnimationOptions = {}): Animated.Value {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!enabled) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [duration, enabled, pulse]);

  return pulse;
}
