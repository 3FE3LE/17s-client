module.exports = {
  root: true,
  extends: ['@17suit/eslint-config/base'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react-native',
            importNames: ['Modal', 'ScrollView'],
            message:
              'Usa wrappers de @17suit/ui para evitar crashes de bridge y mantener compatibilidad cross-platform.',
          },
        ],
      },
    ],
  },
};
