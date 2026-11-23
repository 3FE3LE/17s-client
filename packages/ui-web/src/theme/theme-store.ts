/**
 * Single source of truth for the web theme.
 *
 * The DOM is the state: the `dark` class on <html> (set before first paint by
 * ThemeScript) is what CSS tokens and Tailwind `dark:` resolve against. This
 * store reads/writes the persisted preference, applies it to <html>, and lets
 * React subscribe via useSyncExternalStore — no effects, no context drift.
 */
import {
  DEFAULT_THEME_PREFERENCE,
  THEME_STORAGE_KEY,
  isThemePreference,
  resolveThemePreference,
  type ThemePreference,
} from '@17suit/design-system';
import type { ThemeMode } from '@17suit/design-system';

export interface ThemeSnapshot {
  preference: ThemePreference;
  resolved: ThemeMode;
}

const DARK_QUERY = '(prefers-color-scheme: dark)';

/** Rendered on the server and during hydration; ThemeScript fixes the DOM first. */
export const SERVER_THEME_SNAPSHOT: ThemeSnapshot = {
  preference: DEFAULT_THEME_PREFERENCE,
  resolved: resolveThemePreference(DEFAULT_THEME_PREFERENCE, false),
};

const listeners = new Set<() => void>();
let snapshot: ThemeSnapshot | null = null;

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.(DARK_QUERY).matches === true;
}

function readStoredPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : DEFAULT_THEME_PREFERENCE;
  } catch {
    return DEFAULT_THEME_PREFERENCE;
  }
}

function compute(preference: ThemePreference): ThemeSnapshot {
  return { preference, resolved: resolveThemePreference(preference, systemPrefersDark()) };
}

/** Mirrors ThemeScript: one class, plus `color-scheme` for native form controls. */
export function applyThemeToDocument(resolved: ThemeMode): void {
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
}

function emit(next: ThemeSnapshot) {
  snapshot = next;
  applyThemeToDocument(next.resolved);
  listeners.forEach((listener) => listener());
}

function onSystemChange() {
  const current = getThemeSnapshot();
  if (current.preference === 'system') emit(compute('system'));
}

function onStorage(event: StorageEvent) {
  // Keeps other tabs of the same origin in sync.
  if (event.key === THEME_STORAGE_KEY) emit(compute(readStoredPreference()));
}

export function getThemeSnapshot(): ThemeSnapshot {
  snapshot ??= compute(readStoredPreference());
  return snapshot;
}

export function getServerThemeSnapshot(): ThemeSnapshot {
  return SERVER_THEME_SNAPSHOT;
}

export function subscribeTheme(listener: () => void): () => void {
  if (listeners.size === 0) {
    window.matchMedia?.(DARK_QUERY).addEventListener?.('change', onSystemChange);
    window.addEventListener('storage', onStorage);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.matchMedia?.(DARK_QUERY).removeEventListener?.('change', onSystemChange);
      window.removeEventListener('storage', onStorage);
    }
  };
}

export function setThemePreference(preference: ThemePreference): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage blocked (private mode): the choice still applies for this page.
  }
  emit(compute(preference));
}

/** Test-only: drop the cached snapshot. */
export function __resetThemeStoreForTests(): void {
  snapshot = null;
}
