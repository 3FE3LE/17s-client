const base = require('@17suit/eslint-config/base');

module.exports = [
  ...base,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
];
