import { createThemeBootScript } from '@17suit/design-system';

/**
 * Blocking inline script for <head>. Applies the stored theme to <html>
 * before first paint, so there is no flash and pages stay statically
 * renderable (no cookie read on the server). Pair with
 * `suppressHydrationWarning` on <html>, since its class is set here.
 */
export const THEME_BOOT_SCRIPT = createThemeBootScript();

export function ThemeScript({ nonce }: { nonce?: string }) {
  return (
    <script
      // Static string built from design-system constants; no user input.
      dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }}
      {...(nonce ? { nonce } : {})}
    />
  );
}
