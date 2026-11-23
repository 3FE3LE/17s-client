(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  'chunks/_f37a456c._.js',
  '[project]/apps/seven-rc-web/sentry.server.config.ts [instrumentation-edge] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    // This file configures the initialization of Sentry on the server.
    // The config you add here will be used whenever the server handles a request.
    //
    // See https://docs.sentry.io/platforms/javascript/guides/nextjs/ for more information.
    __turbopack_context__.s([]);
    const dsn = ('TURBOPACK compile-time value', '');
    if (('TURBOPACK compile-time falsy', 0)) //TURBOPACK unreachable
    ;
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
  '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/esm/build/templates/edge-wrapper.js { MODULE => "[project]/apps/seven-rc-web/instrumentation.ts [instrumentation-edge] (ecmascript)" } [instrumentation-edge] (ecmascript)',
  (__turbopack_context__, module, exports) => {
    // The wrapped module could be an async module, we handle that with the proxy
    // here. The comma expression makes sure we don't call the function with the
    // module as the "this" arg.
    // Turn exports into functions that are also a thenable. This way you can await the whole object
    // or  exports (e.g. for Components) or call them directly as though they are async functions
    // (e.g. edge functions/middleware, this is what the Edge Runtime does).
    // Catch promise to prevent UnhandledPromiseRejectionWarning, this will be propagated through
    // the awaited export(s) anyway.
    self._ENTRIES ||= {};
    const modProm = Promise.resolve().then(() =>
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/instrumentation.ts [instrumentation-edge] (ecmascript)',
      ),
    );
    modProm.catch(() => {});
    self._ENTRIES['middleware_instrumentation'] = new Proxy(modProm, {
      get(innerModProm, name) {
        if (name === 'then') {
          return (res, rej) => innerModProm.then(res, rej);
        }
        let result = (...args) => innerModProm.then((mod) => (0, mod[name])(...args));
        result.then = (res, rej) => innerModProm.then((mod) => mod[name]).then(res, rej);
        return result;
      },
    }); //# sourceMappingURL=edge-wrapper.js.map
  },
]);

//# sourceMappingURL=_f37a456c._.js.map
