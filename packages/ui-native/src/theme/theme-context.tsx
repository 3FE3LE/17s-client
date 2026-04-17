import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { getSuitTheme } from '@17suit/design-system';
import type { SuitTheme, ThemeMode } from '@17suit/design-system';
import { Uniwind } from 'uniwind';

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

export function ThemeProvider({
  initialMode = 'system',
  mode,
  onModeChange,
  children,
}: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [internalMode, setInternalMode] = useState<ThemeModePreference>(initialMode);
  const effectiveMode = mode ?? internalMode;
  const resolvedMode: ThemeMode =
    effectiveMode === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : effectiveMode;
  const theme = useMemo(() => getSuitTheme(resolvedMode), [resolvedMode]);

  useEffect(() => {
    Uniwind.setTheme(effectiveMode);
  }, [effectiveMode]);

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
