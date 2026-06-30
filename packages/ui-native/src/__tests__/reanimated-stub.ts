/**
 * Minimal `react-native-reanimated` stub used by Vitest.
 *
 * Reanimated ships an official mock via `react-native-reanimated/mock.js`,
 * but that mock depends on `./src/mock` which is not exported in the
 * published package layout we depend on (v4.1.x). This stub mirrors
 * the surface that `useSwipeTransition` consumes:
 *
 *  - `withTiming(toValue, config?, callback?)` — synchronously calls
 *    `callback({ finished: true })` so worklet completion fires on
 *    the same tick.
 *  - `runOnJS(fn)(...)` — invokes `fn` with the supplied args (the
 *    real bridge schedules this on the JS thread; in our tests we
 *    are already on the JS thread).
 *
 * `SharedValue` is declared as a structural type so the consumer's
 * compile-time types still resolve against the real package.
 */

export type SharedValue<T> = { value: T };

export function withTiming<T>(
  toValue: T,
  _config?: { duration?: number },
  callback?: (result: { finished: boolean }) => void,
): T {
  if (callback) callback({ finished: true });
  return toValue;
}

export function runOnJS<Args extends unknown[], R>(fn: (...args: Args) => R): (...args: Args) => R {
  return fn;
}

// The `useAnimatedValue` hook doesn't use reanimated, only the
// `useSwipeTransition` hook does. Keep the stub small.

export default {};
