import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import type { MobileT } from './i18n';

/**
 * Tracks whether the screen is focused and calls `onRefocus` when the user
 * comes back to it (not on the first focus, where queries already load).
 * `onRefocus` must be stable (wrap it in `useCallback`).
 */
export function useScreenFocus(onRefocus?: () => unknown): boolean {
  const [focused, setFocused] = useState(true);
  const seenFirstFocus = useRef(false);

  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      if (seenFirstFocus.current) {
        void onRefocus?.();
      } else {
        seenFirstFocus.current = true;
      }
      return () => setFocused(false);
    }, [onRefocus]),
  );

  return focused;
}

/**
 * Current time that ticks every `intervalMs` while the screen is focused, and
 * refreshes on every return to it. Lets time-dependent UI (past slots, "hace X")
 * stay correct without re-rendering hidden screens.
 */
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now());

  useFocusEffect(
    useCallback(() => {
      setNow(Date.now());
      const timer = setInterval(() => setNow(Date.now()), intervalMs);
      return () => clearInterval(timer);
    }, [intervalMs]),
  );

  return now;
}

/** "Updated just now" / "Updated 3 min ago" / "Updated 2 h ago" (per locale). */
export function formatUpdatedAgo(updatedAt: number, now: number, t: MobileT): string | null {
  if (!updatedAt) return null;
  const seconds = Math.max(0, Math.round((now - updatedAt) / 1000));
  if (seconds < 60) return t('updatedAgo.now');
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return t('updatedAgo.minutes', { count: minutes });
  const hours = Math.floor(minutes / 60);
  return t('updatedAgo.hours', { count: hours });
}
