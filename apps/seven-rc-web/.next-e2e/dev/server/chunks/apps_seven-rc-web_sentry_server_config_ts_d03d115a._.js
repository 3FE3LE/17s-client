module.exports = [
  '[project]/apps/seven-rc-web/sentry.server.config.ts [instrumentation] (ecmascript, async loader)',
  (__turbopack_context__) => {
    __turbopack_context__.v((parentImport) => {
      return Promise.all(
        ['server/chunks/apps_seven-rc-web_sentry_server_config_ts_bc116f0b._.js'].map((chunk) =>
          __turbopack_context__.l(chunk),
        ),
      ).then(() => {
        return parentImport(
          '[project]/apps/seven-rc-web/sentry.server.config.ts [instrumentation] (ecmascript)',
        );
      });
    });
  },
];
