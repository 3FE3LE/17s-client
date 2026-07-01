'use client';

import { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { ToastProvider } from '../feedback/toast';
import { ThemeProvider, useAppTheme } from '../theme/theme-context';
import type { ThemeModePreference } from '../theme/theme-context';

export interface AppProvidersProps extends PropsWithChildren {
  themeMode?: ThemeModePreference;
  onThemeModeChange?: (mode: ThemeModePreference) => void;
}

export function AppProviders({ children, themeMode, onThemeModeChange }: AppProvidersProps) {
  const themeProviderProps: {
    mode?: ThemeModePreference;
    onModeChange?: (mode: ThemeModePreference) => void;
  } = {};

  if (themeMode !== undefined) {
    themeProviderProps.mode = themeMode;
  }

  if (onThemeModeChange !== undefined) {
    themeProviderProps.onModeChange = onThemeModeChange;
  }

  return (
    <ThemeProvider {...themeProviderProps}>
      <ThemeStyles>{children}</ThemeStyles>
      <ToastProvider />
    </ThemeProvider>
  );
}

/**
 * Renders the theme-dependent global <style>.
 *
 * Why this gates on `mounted`: the theme depends on `prefers-color-scheme`
 * (via `getSystemScheme()`), which on the server always falls back to
 * `'dark'` (no window). A user on a light system therefore gets a different
 * theme on first client render than the SSR HTML had — React 19 surfaces
 * this as both `console.error` and a `pageerror`.
 *
 * Pre-mount we render a deterministic stylesheet that's identical on
 * server and client (only the box-sizing rule). Post-mount we swap to the
 * themed styles. The brief flash is the cost of avoiding a hydration
 * mismatch — both states ship the same DOM up to the swap.
 */
function ThemeStyles({ children }: PropsWithChildren) {
  const { theme } = useAppTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line no-restricted-syntax -- TODO(useEffect): gates SSR/CSR theme swap; see PR #35
  useEffect(() => {
    setMounted(true);
  }, []);

  const css = mounted
    ? `
        html, body {
          margin: 0;
          padding: 0;
          background: ${theme.colors.background};
          color: ${theme.colors.text};
        }
        * {
          box-sizing: border-box;
        }
      `
    : `
        * {
          box-sizing: border-box;
        }
      `;

  return (
    <>
      <style suppressHydrationWarning>{css}</style>
      {children}
    </>
  );
}
