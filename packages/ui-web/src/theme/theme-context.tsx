'use client';

import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSuitTheme } from '@17suit/design-system';
import type { SuitTheme, ThemeMode } from '@17suit/design-system';

export type ThemeModePreference = ThemeMode | 'system';

interface ThemeContextValue {
  theme: SuitTheme;
  mode: ThemeModePreference;
  resolvedMode: ThemeMode;
  setMode: (mode: ThemeModePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps extends PropsWithChildren {
  initialMode?: ThemeModePreference;
  mode?: ThemeModePreference;
  onModeChange?: (mode: ThemeModePreference) => void;
}

function getSystemScheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

export function ThemeProvider({
  initialMode = 'system',
  mode,
  onModeChange,
  children,
}: ThemeProviderProps) {
  const [internalMode, setInternalMode] = useState<ThemeModePreference>(initialMode);
  const [systemMode, setSystemMode] = useState<ThemeMode>(() => getSystemScheme());
  const effectiveMode = mode ?? internalMode;
  const resolvedMode: ThemeMode = effectiveMode === 'system' ? systemMode : effectiveMode;
  const theme = useMemo(() => getSuitTheme(resolvedMode), [resolvedMode]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (event: MediaQueryListEvent) => {
      setSystemMode(event.matches ? 'light' : 'dark');
    };
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, []);

  const setMode = (nextMode: ThemeModePreference) => {
    if (mode) {
      onModeChange?.(nextMode);
      return;
    }
    setInternalMode(nextMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode: effectiveMode, resolvedMode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: getSuitTheme('dark'),
      mode: 'system' as ThemeModePreference,
      resolvedMode: 'dark' as ThemeMode,
      setMode: () => {},
    };
  }
  return context;
}
