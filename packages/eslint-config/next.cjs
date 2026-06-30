const base = require('@17suit/eslint-config/base');

module.exports = [
  ...base,
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['react-native', 'react-native/*'],
              message: 'Do not import react-native in Next.js apps.',
            },
            {
              group: ['@17suit/ui-native'],
              message: 'Use @17suit/ui (web) in Next.js apps.',
            },
          ],
        },
      ],
    },
  },
];
