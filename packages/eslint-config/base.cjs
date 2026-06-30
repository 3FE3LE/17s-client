const js = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  {
    ignores: ['**/dist/**', '**/.next/**', '**/build/**', '**/coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'tamagui',
              message: 'Tamagui has been removed. Use @17suit/ui instead.',
            },
          ],
          patterns: [
            {
              group: ['@tamagui/*'],
              message: 'Tamagui has been removed. Use @17suit/ui instead.',
            },
          ],
        },
      ],
      // Repository rule: avoid useEffect; prefer RSC, events, or derived
      // state (see user memory and AGENTS.md). Reported as a warning today
      // so we can inventory current call sites; promote to 'error' once
      // every existing call has an inline disable with a TODO migration
      // note or has been refactored away.
      'no-restricted-syntax': [
        'warn',
        {
          selector: "CallExpression[callee.name='useEffect']",
          message:
            'Avoid useEffect. Prefer React Server Components, event handlers, useSyncExternalStore, or derived state.',
        },
      ],
    },
  },
);
