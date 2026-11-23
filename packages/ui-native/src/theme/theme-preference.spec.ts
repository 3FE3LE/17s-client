import { describe, expect, it } from 'vitest';

import {
  DEFAULT_THEME_PREFERENCE,
  THEME_PREFERENCES,
  THEME_STORAGE_KEY,
  createThemeBootScript,
  isThemePreference,
  resolveThemePreference,
  themeToggleOptionRecipe,
} from '@17suit/design-system';

function runBootScript({ stored, systemDark }: { stored: string | null; systemDark: boolean }) {
  const classes = new Set<string>();
  const root = {
    classList: {
      toggle: (name: string, on: boolean) => (on ? classes.add(name) : classes.delete(name)),
    },
    style: { colorScheme: '' },
  };
  const window = {
    matchMedia: (query: string) => ({ matches: query.includes('dark') && systemDark }),
  };
  // Runs the exact inline script with browser globals injected as parameters.
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const boot = new Function('window', 'document', 'localStorage', createThemeBootScript()) as (
    ...globals: unknown[]
  ) => void;
  boot(
    window,
    { documentElement: root },
    { getItem: (key: string) => (key === THEME_STORAGE_KEY ? stored : null) },
  );
  return { dark: classes.has('dark'), colorScheme: root.style.colorScheme };
}

describe('theme preference contract', () => {
  it('offers system, light and dark', () => {
    expect([...THEME_PREFERENCES]).toEqual(['system', 'light', 'dark']);
  });

  it('defaults to light until screens are dark-audited', () => {
    expect(DEFAULT_THEME_PREFERENCE).toBe('light');
  });

  it('resolves system from the OS and keeps explicit choices', () => {
    expect(resolveThemePreference('system', true)).toBe('dark');
    expect(resolveThemePreference('system', false)).toBe('light');
    expect(resolveThemePreference('dark', false)).toBe('dark');
    expect(resolveThemePreference('light', true)).toBe('light');
  });

  it('rejects unknown stored values', () => {
    expect(isThemePreference('dark')).toBe(true);
    expect(isThemePreference('sepia')).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });

  it('uses theme-reactive tokens for the selected option on both platforms', () => {
    for (const platform of ['web', 'native'] as const) {
      expect(themeToggleOptionRecipe({ selected: true, platform })).toContain('bg-brand-secondary');
    }
  });
});

describe('web boot script (single mechanism: `dark` class on <html>)', () => {
  it('applies an explicit dark choice regardless of the OS', () => {
    expect(runBootScript({ stored: 'dark', systemDark: false })).toEqual({
      dark: true,
      colorScheme: 'dark',
    });
  });

  it('follows the OS when the preference is system', () => {
    expect(runBootScript({ stored: 'system', systemDark: true }).dark).toBe(true);
    expect(runBootScript({ stored: 'system', systemDark: false }).dark).toBe(false);
  });

  it('falls back to the default for missing or invalid values', () => {
    expect(runBootScript({ stored: null, systemDark: true })).toEqual({
      dark: false,
      colorScheme: 'light',
    });
    expect(runBootScript({ stored: 'sepia', systemDark: true }).dark).toBe(false);
  });
});
