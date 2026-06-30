import { useCallback, useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { runOnJS, withTiming, type SharedValue } from 'react-native-reanimated';

export type SwipeDirection = 'left' | 'right';
export type ExitAnimator = (direction: SwipeDirection, onDone: () => void) => void;

export interface UseSwipeTransitionOptions {
  translateX: SharedValue<number>;
  /** Optional initial swipe-in animation duration in ms. Default 220. */
  enterDuration?: number;
  /** Default window transition exit duration in ms. Default 180. */
  exitDuration?: number;
  /** Read and clear the persisted swipe direction (left/right). */
  consumeLastDirection: () => SwipeDirection | null;
  /**
   * Register the imperative exit animator used when a route change
   * triggers a swipe transition. Pass `null` to clear on unmount.
   */
  setExitAnimator: (animator: ExitAnimator | null) => void;
  /** Runs `router.replace(href)` once the exit animation finishes. */
  replace: (href: string) => void;
}

export interface UseSwipeTransitionResult {
  runExit: (direction: SwipeDirection, href: string) => void;
}

/**
 * Models the "swipe between tabs" screen transition: an enter animation
 * from the persisted last swipe direction and an imperative exit
 * animator exposed via `setExitAnimator`. Imperative reanimated worklets
 * can only run as a side effect, so the `no-restricted-syntax` rule for
 * `useEffect` is intentionally isolated to this hook.
 *
 * The hook returns a `runExit(direction, href)` helper that the screen
 * can call from within `onEnd` callbacks to drive the same exit
 * animation that the registered animator uses.
 */
export function useSwipeTransition({
  translateX,
  enterDuration = 220,
  exitDuration = 180,
  consumeLastDirection,
  setExitAnimator,
  replace,
}: UseSwipeTransitionOptions): UseSwipeTransitionResult {
  const { width } = useWindowDimensions();

  const runExit = useCallback(
    (direction: SwipeDirection, href: string) => {
      const target = direction === 'left' ? -width : width;
      translateX.value = withTiming(target, { duration: exitDuration }, (finished) => {
        if (finished) {
          runOnJS(replace)(href);
        }
      });
    },
    [exitDuration, replace, translateX, width],
  );

  useEffect(() => {
    const direction = consumeLastDirection();
    if (direction === 'left') {
      translateX.value = width;
      translateX.value = withTiming(0, { duration: enterDuration });
    } else if (direction === 'right') {
      translateX.value = -width;
      translateX.value = withTiming(0, { duration: enterDuration });
    }

    const animator: ExitAnimator = (nextDirection, onDone) => {
      const target = nextDirection === 'left' ? -width : width;
      translateX.value = withTiming(target, { duration: exitDuration }, (finished) => {
        if (finished) {
          runOnJS(onDone)();
        }
      });
    };
    setExitAnimator(animator);
    return () => {
      setExitAnimator(null);
    };
  }, [consumeLastDirection, enterDuration, exitDuration, setExitAnimator, translateX, width]);

  return { runExit };
}
