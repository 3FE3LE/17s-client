'use client';

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

function ThemeStyles({ children }: PropsWithChildren) {
  const { theme } = useAppTheme();
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Amaranth:wght@400;700&family=Arvo:wght@400;700&family=Zilla+Slab:wght@300;400;500;700&display=swap');
          html, body {
            margin: 0;
            padding: 0;
            background: ${theme.colors.background};
            color: ${theme.colors.text};
          }
          * {
            box-sizing: border-box;
          }
        `}
      </style>
      {children}
    </>
  );
}
