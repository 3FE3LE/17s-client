import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export interface UseReplaceOnceReadyOptions {
  /** When true, the imperative replace is allowed to run. */
  ready?: boolean;
  /** Destination to replace into. */
  href: string;
}

/**
 * Imperative `router.replace` that defers until `ready` is true. Used for
 * callback screens that must hand off once the root navigation tree has
 * mounted, otherwise `router.replace` throws. The
 * `no-restricted-syntax` rule for `useEffect` is intentionally isolated
 * to this single hook so every consumer stays a one-liner.
 */
export function useReplaceOnceReady({ ready = true, href }: UseReplaceOnceReadyOptions): void {
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    router.replace(href);
  }, [href, ready, router]);
}
