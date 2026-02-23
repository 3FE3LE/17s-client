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
    },
  },
);
