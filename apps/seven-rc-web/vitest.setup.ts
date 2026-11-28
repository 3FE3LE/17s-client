import { afterEach } from 'vitest';

// Component specs opt in with `// @vitest-environment jsdom`; node specs skip this.
if (typeof document !== 'undefined') {
  const { cleanup } = await import('@testing-library/react');
  afterEach(() => cleanup());
}

// Components read copy through react-i18next; specs assert the Spanish copy, so register the `es`
// catalogs as the global instance (no provider needed in each spec).
{
  const { createI18n } = await import('@17suit/i18n');
  const { setI18n } = await import('@17suit/i18n/react');
  const { sevenRcResources } = await import('@17suit/module-seven-reservations-club/i18n');
  setI18n(createI18n({ locale: 'es', resources: sevenRcResources }));
}
