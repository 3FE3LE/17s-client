'use client';

import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
import { getSuitTheme } from '@17suit/design-system';
import type { SuitTheme, ThemeMode, ThemePreference } from '@17suit/design-system';

import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  setThemePreference,
  subscribeTheme,
} from './theme-store';

export type ThemeModePreference = ThemePreference;

interface ThemeContextValue {
  /** JS theme for components not yet migrated to class recipes. */
  theme: SuitTheme;
  mode: ThemeModePreference;
  resolvedMode: ThemeMode;
  setMode: (mode: ThemeModePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Subscribes to the global theme store (the `dark` class on <html>). */
export function useThemeSnapshot() {
  return useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);
}

/**
 * Exposes the web theme store to React. There is no local state: the
 * preference lives in the store (persisted, applied to <html> by
 * ThemeScript before paint), so every consumer and every CSS token agree.
 */
export function ThemeProvider({ children }: PropsWithChildren) {
  const { preference, resolved } = useThemeSnapshot();
  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: getSuitTheme(resolved),
      mode: preference,
      resolvedMode: resolved,
      setMode: setThemePreference,
    }),
    [preference, resolved],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: getSuitTheme('light'),
      mode: 'light',
      resolvedMode: 'light',
      setMode: setThemePreference,
    };
  }
  return context;
}
