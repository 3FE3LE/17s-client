/**
 * Theme preference contract shared by every product (web and native).
 *
 * One mechanism per platform:
 * - web: the `dark` class on <html>, set before first paint by ThemeScript
 *   and kept in sync by the ui-web theme store; tokens switch via CSS vars.
 * - native: Uniwind.setTheme + the JS theme in ui-native's ThemeProvider.
 *
 * `system` follows the OS color scheme and updates live when it changes.
 */
import { cx, type SuitPlatform } from './recipes';
import type { ThemeMode } from './tokens';

export const THEME_PREFERENCES = ['system', 'light', 'dark'] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

/** Storage key for the persisted preference (web localStorage). */
export const THEME_STORAGE_KEY = 'suit-theme';

/**
 * Default when nothing is stored. Web screens are still authored for light
 * (hardcoded light classes remain), so `light` avoids a visual regression for
 * OS-dark users; switch to `system` once screens are dark-audited.
 */
export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'light';

export const THEME_PREFERENCE_LABELS: Record<ThemePreference, string> = {
  system: 'Sistema',
  light: 'Claro',
  dark: 'Oscuro',
};

export function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && (THEME_PREFERENCES as readonly string[]).includes(value);
}

export function resolveThemePreference(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ThemeMode {
  if (preference === 'system') return systemPrefersDark ? 'dark' : 'light';
  return preference;
}

/** Segmented control container. */
export function themeToggleRecipe({ platform }: { platform: SuitPlatform }) {
  return cx(
    // Theme-reactive tokens only (surface/muted/text switch with the theme);
    // semantic.css control tokens are still light-only.
    'flex-row items-center gap-xs rounded-full border border-muted/30 bg-surface p-xs',
    platform === 'web' && 'inline-flex',
    platform === 'native' && 'self-start',
  );
}

/** One option of the segmented control. */
export function themeToggleOptionRecipe({
  selected,
  platform,
}: {
  selected: boolean;
  platform: SuitPlatform;
}) {
  return cx(
    'items-center justify-center rounded-full px-sm py-xs',
    platform === 'web' &&
      'inline-flex cursor-pointer transition-colors duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-action-primary/30',
    selected ? 'bg-brand-secondary' : 'bg-transparent',
  );
}

export function themeToggleLabelRecipe({ selected }: { selected: boolean }) {
  return cx('font-zilla text-xs font-bold leading-[1.4]', selected ? 'text-white' : 'text-text');
}

/**
 * Source of the blocking <head> script used on web (see ui-web ThemeScript).
 * Mirrors the web theme store: resolves the stored preference (or the
 * default) and applies it as the `dark` class + `color-scheme` on <html>
 * before first paint. Built only from the constants above.
 */
export function createThemeBootScript(): string {
  return `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)},a=${JSON.stringify(
    THEME_PREFERENCES,
  )},d=${JSON.stringify(
    DEFAULT_THEME_PREFERENCE,
  )},p=null;try{p=localStorage.getItem(k)}catch(_){}if(a.indexOf(p)<0)p=d;var r=p==='system'?(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;var e=document.documentElement;e.classList.toggle('dark',r==='dark');e.style.colorScheme=r;}catch(_){}})();`;
}
