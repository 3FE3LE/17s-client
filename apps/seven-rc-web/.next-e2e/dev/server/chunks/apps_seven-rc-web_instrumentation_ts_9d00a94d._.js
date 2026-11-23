module.exports = [
  '[project]/apps/seven-rc-web/instrumentation.ts [instrumentation] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    // Sentry instrumentation hook for Next.js.
    // Runs once per server runtime (Node or Edge) at boot. Bundlers entrypoint.
    // See https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
    __turbopack_context__.s(['register', () => register]);
    async function register() {
      if (('TURBOPACK compile-time truthy', 1)) {
        await __turbopack_context__.A(
          '[project]/apps/seven-rc-web/sentry.server.config.ts [instrumentation] (ecmascript, async loader)',
        );
      }
      if (('TURBOPACK compile-time falsy', 0)) //TURBOPACK unreachable
      ;
    }
  },
];

//# sourceMappingURL=apps_seven-rc-web_instrumentation_ts_9d00a94d._.js.map
