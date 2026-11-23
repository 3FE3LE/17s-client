'use client';

import { useSyncExternalStore } from 'react';

/**
 * Shared wall-clock tick for relative labels ("hace 3 min"). One interval serves
 * every subscriber and stops when the last one unmounts. Server render reads 0,
 * which callers treat as "just now".
 */
const TICK_MS = 15_000;
let current = 0;
let timer: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  current = Date.now();
  timer ??= setInterval(() => {
    current = Date.now();
    for (const notify of listeners) notify();
  }, TICK_MS);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const getSnapshot = () => current;
const getServerSnapshot = () => 0;

export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
