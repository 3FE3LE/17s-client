'use client';

import type { PropsWithChildren } from 'react';
import { ToastProvider } from '../feedback/toast';
import { ThemeProvider } from '../theme/theme-context';
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

  // Theme tokens (background / text / accent) are applied via CSS custom
  // properties resolved by the browser via `prefers-color-scheme`. Import
  // the stylesheet once at the app entry — the same file ships in every
  // web app that consumes @17suit/ui-web.
  return (
    <ThemeProvider {...themeProviderProps}>
      {children}
      <ToastProvider />
    </ThemeProvider>
  );
}
