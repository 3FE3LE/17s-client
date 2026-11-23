(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'chunks/[root-of-the-server]__a749914f._.js',
  '[externals]/node:buffer [external] (node:buffer, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x('node:buffer', () => require('node:buffer'));

    module.exports = mod;
  },
  '[project]/apps/seven-rc-web/sentry.server.config.ts [instrumentation-edge] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([]);
    // This file configures the initialization of Sentry on the server.
    // The config you add here will be used whenever the server handles a request.
    //
    // See https://docs.sentry.io/platforms/javascript/guides/nextjs/ for more information.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$10$2e$62$2e$0_$40$opentelemetry$2b$core$40$2$2e$8$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$5f40$opentelemet_b2cdf5962ab0a7d7da6790a9ab6d14d0$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$esm$2f$edge$2f$index$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@sentry+nextjs@10.62.0_@opentelemetry+core@2.8.0_@opentelemetry+api@1.9.1__@opentelemet_b2cdf5962ab0a7d7da6790a9ab6d14d0/node_modules/@sentry/nextjs/build/esm/edge/index.js [instrumentation-edge] (ecmascript) <locals>',
      );
    const dsn = process.env.SENTRY_DSN;
    if (dsn) {
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$sentry$2b$nextjs$40$10$2e$62$2e$0_$40$opentelemetry$2b$core$40$2$2e$8$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$5f40$opentelemet_b2cdf5962ab0a7d7da6790a9ab6d14d0$2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$esm$2f$edge$2f$index$2e$js__$5b$instrumentation$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
        'init'
      ]({
        dsn,
        environment:
          process.env.SENTRY_ENVIRONMENT ?? ('TURBOPACK compile-time value', 'development'),
        tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE
          ? Number(process.env.SENTRY_TRACES_SAMPLE_RATE)
          : 0.1,
        // Don't send PII by default; route through beforeSend if we ever need to.
        sendDefaultPii: false,
      });
    }
  },
  '[project]/apps/seven-rc-web/instrumentation.ts [instrumentation-edge] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    // Sentry instrumentation hook for Next.js.
    // Runs once per server runtime (Node or Edge) at boot. Bundlers entrypoint.
    // See https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
    __turbopack_context__.s(['register', () => register]);
    async function register() {
      if (('TURBOPACK compile-time falsy', 0)) //TURBOPACK unreachable
      ;
      if (('TURBOPACK compile-time truthy', 1)) {
        await Promise.resolve().then(() =>
          __turbopack_context__.i(
            '[project]/apps/seven-rc-web/sentry.server.config.ts [instrumentation-edge] (ecmascript)',
          ),
        );
      }
    }
  },
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__a749914f._.js.map
