'use client';

import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo, useState, useSyncExternalStore } from 'react';
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

// The resolved scheme follows the `.dark` class on <html> (the same switch the CSS
// tokens use), so inline JS styles never disagree with Tailwind/CSS tokens.
// Server and first client render both report 'light' (the CSS default).
function getSystemScheme(): ThemeMode {
  if (typeof document === 'undefined') {
    return 'light';
  }
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getServerScheme(): ThemeMode {
  return 'light';
}

function subscribeToSystemScheme(onChange: () => void) {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
    return () => {};
  }
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

export function ThemeProvider({
  initialMode = 'system',
  mode,
  onModeChange,
  children,
}: ThemeProviderProps) {
  const [internalMode, setInternalMode] = useState<ThemeModePreference>(initialMode);
  const systemMode = useSyncExternalStore(
    subscribeToSystemScheme,
    getSystemScheme,
    getServerScheme,
  );
  const effectiveMode = mode ?? internalMode;
  const resolvedMode: ThemeMode = effectiveMode === 'system' ? systemMode : effectiveMode;
  const theme = useMemo(() => getSuitTheme(resolvedMode), [resolvedMode]);

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
      theme: getSuitTheme('light'),
      mode: 'system' as ThemeModePreference,
      resolvedMode: 'light' as ThemeMode,
      setMode: () => {},
    };
  }
  return context;
}
