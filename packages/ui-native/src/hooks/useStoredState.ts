import { useEffect, useState } from 'react';

export interface UseStoredStateOptions<T extends string> {
  /** When provided, only persisted strings that pass this predicate overwrite the state. */
  applyWhen?: (value: string) => value is T;
  /** Safe loader; return `null` when the store is unavailable. */
  load: () => Promise<string | null>;
  /** Default value used until `load` resolves. */
  defaultValue: T;
}

/**
 * Reads a single string value from an async store on mount (e.g. Expo
 * SecureStore) and exposes it as React state. Imperative async reads can
 * only run as a side effect, so the `no-restricted-syntax` rule for
 * `useEffect` is intentionally isolated to this single hook.
 *
 * Contract:
 *  - `defaultValue` is the initial state until the load resolves.
 *  - Once `load` resolves, `applyWhen(value)` decides if the persisted
 *    string should overwrite the state.
 *  - The component is allowed to keep mutating the returned setter;
 *    re-loading is intentionally not performed.
 */
export function useStoredState<T extends string>({
  applyWhen,
  load,
  defaultValue,
}: UseStoredStateOptions<T>): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    let isMounted = true;
    let cancelled = false;
    load()
      .then((persisted) => {
        if (cancelled || !isMounted || persisted === null) return;
        if (!applyWhen || applyWhen(persisted)) {
          setValue(persisted as T);
        }
      })
      .catch(() => {
        // Persistence failures are non-fatal; keep `defaultValue`.
      });
    return () => {
      isMounted = false;
      cancelled = true;
    };
  }, [applyWhen, load]);

  return [value, setValue];
}
