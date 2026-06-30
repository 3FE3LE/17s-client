import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface UseAnimatedValueOptions {
  /** Animation duration in ms. Default 220. */
  duration?: number;
  /** Whether the animation should use the native driver. Default true. */
  useNativeDriver?: boolean;
}

/**
 * Drives a React Native `Animated.Value` to `target` whenever `target`
 * changes. Imperative animations can only run as a side effect, so the
 * `no-restricted-syntax` rule for `useEffect` is intentionally isolated to
 * this wrapper.
 *
 * Contract:
 *  - Returns a stable `Animated.Value` reference owned by the caller.
 *  - Re-animates on every `target` change (and on `duration` /
 *    `useNativeDriver` change).
 */
export function useAnimatedValue(
  target: number,
  options: UseAnimatedValueOptions = {},
): Animated.Value {
  const { duration = 220, useNativeDriver = true } = options;
  const value = useRef(new Animated.Value(target)).current;

  useEffect(() => {
    Animated.timing(value, {
      toValue: target,
      duration,
      useNativeDriver,
    }).start();
  }, [duration, target, useNativeDriver, value]);

  return value;
}
