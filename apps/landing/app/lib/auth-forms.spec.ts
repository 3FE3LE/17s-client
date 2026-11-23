import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

// A form submitted before hydration uses the browser default, so every auth
// form has to declare its method instead of relying on `onSubmit`.
const authForms = [
  '../sign-in/[[...sign-in]]/sign-in-client.tsx',
  '../sign-up/[[...sign-up]]/sign-up-client.tsx',
  '../forgot-password/page.tsx',
];

describe('auth forms', () => {
  it.each(authForms)('%s declares method="post" on every form', (file) => {
    const forms = readFileSync(new URL(file, import.meta.url), 'utf8').match(/<form\b[^>]*/g) ?? [];

    expect(forms.length).toBeGreaterThan(0);
    for (const form of forms) {
      expect(form).toContain('method="post"');
    }
  });
});
