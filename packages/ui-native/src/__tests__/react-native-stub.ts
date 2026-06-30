/**
 * Minimal `react-native` stub used by Vitest. The native bridge can't run
 * inside Node, so we expose just enough surface for the hooks under test:
 *
 *  - `Animated.Value`: stateful instance compatible with the `timing`,
 *    `loop` and `sequence` helpers (`setValue`, `stop`, listeners).
 *  - `Animated.timing(value, config).start(cb?)`: no-op that resolves
 *    with `finished = true` so tests can move forward.
 *  - `Animated.loop(seq)`: returns an object with `start()` / `stop()`.
 *  - `Animated.sequence([...])`: identity wrapper for tests.
 *  - `Modal` / `ScrollView` / `View`: typed no-op components.
 *  - `useWindowDimensions()`: returns `{ width: 360 }` by default.
 */

import type { ComponentType, ReactNode } from 'react';

type AnimatedListener = (value: { value: number }) => void;

class AnimatedValue {
  private listeners = new Set<AnimatedListener>();
  private currentValue: number;

  constructor(initial: number) {
    this.currentValue = initial;
  }

  setValue(value: number): void {
    if (this.currentValue === value) return;
    this.currentValue = value;
    for (const listener of this.listeners) listener({ value });
  }

  get value(): number {
    return this.currentValue;
  }

  addListener(listener: AnimatedListener): void {
    this.listeners.add(listener);
    listener({ value: this.currentValue });
  }

  removeListener(listener: AnimatedListener): void {
    this.listeners.delete(listener);
  }

  stopAnimation(): void {
    // no-op
  }

  // Used directly by Animated.timing(...) intermediate objects.
  _setValueSilent(value: number): void {
    this.currentValue = value;
  }
}

interface TimingHandle {
  start: (callback?: (result: { finished: boolean }) => void) => void;
  stop: () => void;
  reset: () => void;
}

function createTiming(
  value: AnimatedValue,
  config: { toValue: number; duration?: number },
): TimingHandle {
  const handle: TimingHandle = {
    start: (callback) => {
      // Synchronously settle so tests don't depend on real timers.
      value.setValue(config.toValue);
      if (callback) callback({ finished: true });
    },
    stop: () => {
      // no-op
    },
    reset: () => {
      // no-op
    },
  };
  return handle;
}

function createLoop(sequence: TimingHandle | TimingHandle[]): TimingHandle {
  const handle: TimingHandle = {
    start: (callback) => {
      const items = Array.isArray(sequence) ? sequence : [sequence];
      for (const item of items) item.start();
      if (callback) callback({ finished: true });
    },
    stop: () => {
      if (Array.isArray(sequence)) {
        for (const item of sequence) item.stop();
      } else {
        sequence.stop();
      }
    },
    reset: () => {
      // no-op
    },
  };
  return handle;
}

const Animated = {
  Value: AnimatedValue,
  timing: createTiming,
  loop: createLoop,
  sequence: (items: TimingHandle[]): TimingHandle => createLoop(items),
};

const StubComponent: ComponentType<{ children?: ReactNode }> = () => null;

export const Modal = StubComponent;
export const ScrollView = StubComponent;
export const View = StubComponent;

export function useWindowDimensions(): { width: number; height: number } {
  return { width: 360, height: 640 };
}

export { Animated };

// Silence unused exports from the type-checker when the stub is the only
// thing the test imports — keeps the public surface small and intentional.
export default { Animated, Modal, ScrollView, View, useWindowDimensions };
