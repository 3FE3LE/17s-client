module.exports = {
  extends: ['@17suit/eslint-config/base'],
  env: {
    'react-native/react-native': true,
  },
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['next', 'next/*'],
            message: 'Do not import Next.js in React Native apps.',
          },
          {
            group: ['@17suit/ui-web'],
            message: 'Use @17suit/ui (native) in React Native apps.',
          },
        ],
      },
    ],
  },
};
