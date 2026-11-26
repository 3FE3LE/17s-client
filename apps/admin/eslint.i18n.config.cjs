const base = require('./eslint.config.cjs');
const i18n = require('@17suit/eslint-config/i18n');

module.exports = [...base, ...i18n];
