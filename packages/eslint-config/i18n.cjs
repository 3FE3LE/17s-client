/**
 * i18n literal inventory. Reports user-facing string literals in JSX that
 * should come from a catalog (`t('key')`). Starts as `warn`; promote to
 * `error` per app once its literals are migrated.
 *
 * Opt-in: apps lint with `--max-warnings=0`, so the rule is not part of
 * `pnpm lint`. Each app has `eslint.i18n.config.cjs` and `pnpm lint:i18n`
 * for the inventory. Spread this into the app's main config to gate it.
 */
module.exports = [
  {
    files: ['**/*.tsx'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        // Flat config replaces rule options: keep the base useEffect selector.
        {
          selector: "CallExpression[callee.name='useEffect']",
          message:
            'Avoid useEffect. Prefer React Server Components, event handlers, useSyncExternalStore, or derived state.',
        },
        {
          selector: 'JSXText[value=/[\\p{L}]/u]',
          message: 'User-facing text must come from the i18n catalog: use t(...) (@17suit/i18n).',
        },
        {
          selector:
            'JSXAttribute[name.name=/^(title|alt|placeholder|aria-label|label)$/] > Literal[value=/[\\p{L}]/u]',
          message:
            'User-facing attribute must come from the i18n catalog: use t(...) (@17suit/i18n).',
        },
      ],
    },
  },
];
