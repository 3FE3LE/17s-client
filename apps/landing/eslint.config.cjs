const next = require('@17suit/eslint-config/next');

module.exports = [
  {
    ignores: ['e2e/**', 'playwright-report/**', 'test-results/**'],
  },
  ...next,
];
