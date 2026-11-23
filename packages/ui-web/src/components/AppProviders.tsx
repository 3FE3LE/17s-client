'use client';

import type { PropsWithChildren } from 'react';
import { ToastProvider } from '../feedback/toast';
import { ThemeProvider } from '../theme/theme-context';

export type AppProvidersProps = PropsWithChildren;

/**
 * Web theme: one mechanism, the `dark` class on <html>. Render
 * `<ThemeScript />` inside <head> of the root layout (with
 * `suppressHydrationWarning` on <html>) so the stored preference applies
 * before first paint; ThemeProvider and AppThemeToggle read the same store.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      {children}
      <ToastProvider />
    </ThemeProvider>
  );
}
