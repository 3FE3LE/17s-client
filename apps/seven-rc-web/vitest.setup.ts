import { afterEach } from 'vitest';

// Component specs opt in with `// @vitest-environment jsdom`; node specs skip this.
if (typeof document !== 'undefined') {
  const { cleanup } = await import('@testing-library/react');
  afterEach(() => cleanup());
}
