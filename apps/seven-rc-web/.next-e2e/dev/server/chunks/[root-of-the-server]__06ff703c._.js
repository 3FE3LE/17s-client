module.exports = [
  '[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x(
      'next/dist/server/app-render/work-async-storage.external.js',
      () => require('next/dist/server/app-render/work-async-storage.external.js'),
    );

    module.exports = mod;
  },
  '[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x(
      'next/dist/server/app-render/work-unit-async-storage.external.js',
      () => require('next/dist/server/app-render/work-unit-async-storage.external.js'),
    );

    module.exports = mod;
  },
  '[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x(
      'next/dist/server/lib/incremental-cache/tags-manifest.external.js',
      () => require('next/dist/server/lib/incremental-cache/tags-manifest.external.js'),
    );

    module.exports = mod;
  },
  '[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x(
      'next/dist/server/app-render/after-task-async-storage.external.js',
      () => require('next/dist/server/app-render/after-task-async-storage.external.js'),
    );

    module.exports = mod;
  },
  '[externals]/node:async_hooks [external] (node:async_hooks, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x('node:async_hooks', () => require('node:async_hooks'));

    module.exports = mod;
  },
  '[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x(
      'next/dist/compiled/next-server/app-page-turbo.runtime.dev.js',
      () => require('next/dist/compiled/next-server/app-page-turbo.runtime.dev.js'),
    );

    module.exports = mod;
  },
  '[externals]/node:crypto [external] (node:crypto, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x('node:crypto', () => require('node:crypto'));

    module.exports = mod;
  },
  '[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x(
      'next/dist/server/app-render/action-async-storage.external.js',
      () => require('next/dist/server/app-render/action-async-storage.external.js'),
    );

    module.exports = mod;
  },
  '[project]/packages/core/src/auth/dev-browser-handoff.ts [middleware] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'expireStaleDevBrowserCookies',
      () => expireStaleDevBrowserCookies,
      'staleDevBrowserCookies',
      () => staleDevBrowserCookies,
    ]);
    const DEV_BROWSER_NAME = '__clerk_db_jwt';
    const SUFFIXED_COOKIE = new RegExp(`^${DEV_BROWSER_NAME}_[A-Za-z0-9_-]+$`);
    function staleDevBrowserCookies(request, publishableKey) {
      if (!publishableKey?.startsWith('pk_test_')) return [];
      const handedOver = new URL(request.url).searchParams.get(DEV_BROWSER_NAME);
      if (!handedOver) return [];
      return (request.headers.get('cookie') ?? '').split(';').flatMap((pair) => {
        const separator = pair.indexOf('=');
        if (separator < 0) return [];
        const name = pair.slice(0, separator).trim();
        const value = pair.slice(separator + 1).trim();
        return SUFFIXED_COOKIE.test(name) && value !== handedOver ? [name] : [];
      });
    }
    function expireStaleDevBrowserCookies(request, response, publishableKey) {
      if (!response.headers.get('location')?.includes('/v1/client/handshake')) return;
      const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
      for (const name of staleDevBrowserCookies(request, publishableKey)) {
        response.headers.append('set-cookie', `${name}=; Path=/; Max-Age=0${secure}`);
      }
    }
  },
  '[project]/packages/core/src/auth/next.tsx [middleware] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'DEFAULT_NEXT_PUBLIC_ROUTES',
      () => DEFAULT_NEXT_PUBLIC_ROUTES,
      'WebAuthProvider',
      () => WebAuthProvider,
      'createNextClerkMiddleware',
      () => createNextClerkMiddleware,
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [middleware] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@clerk+nextjs@6.37.5_next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwrigh_7fc3a0f00d05671a4e13335581eb0f57/node_modules/@clerk/nextjs/dist/esm/index.js [middleware] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkMiddleware$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@clerk+nextjs@6.37.5_next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwrigh_7fc3a0f00d05671a4e13335581eb0f57/node_modules/@clerk/nextjs/dist/esm/server/clerkMiddleware.js [middleware] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$routeMatcher$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@clerk+nextjs@6.37.5_next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwrigh_7fc3a0f00d05671a4e13335581eb0f57/node_modules/@clerk/nextjs/dist/esm/server/routeMatcher.js [middleware] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$auth$2f$dev$2d$browser$2d$handoff$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/core/src/auth/dev-browser-handoff.ts [middleware] (ecmascript)',
      );
    const DEFAULT_NEXT_PUBLIC_ROUTES = ['/sign-in(.*)', '/sign-up(.*)'];
    function resolveSignInUrl(explicit) {
      if (explicit && explicit.trim().length > 0) {
        return explicit;
      }
      const envValue = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL;
      if (envValue && envValue.trim().length > 0) {
        return envValue;
      }
      return '/sign-in';
    }
    function resolveSignUpUrl(explicit) {
      if (explicit && explicit.trim().length > 0) {
        return explicit;
      }
      const envValue = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL;
      if (envValue && envValue.trim().length > 0) {
        return envValue;
      }
      return '/sign-up';
    }
    function resolvePublishableKey() {
      if (('TURBOPACK compile-time truthy', 1)) {
        return ('TURBOPACK compile-time value', 'pk_test_ZmFrZS5jbGVyay5hY2NvdW50cy5kZXYk');
      }
      //TURBOPACK unreachable
    }
    function createNextClerkMiddleware(options) {
      const publicRoutes = options?.publicRoutes ?? [...DEFAULT_NEXT_PUBLIC_ROUTES];
      const isPublicRoute = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$routeMatcher$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
        'createRouteMatcher'
      ])(publicRoutes);
      const signInUrl = resolveSignInUrl(options?.signInUrl);
      const signUpUrl = resolveSignUpUrl(options?.signUpUrl);
      const middleware = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkMiddleware$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
        'clerkMiddleware'
      ])(
        async (auth, req) => {
          if (!isPublicRoute(req)) {
            await auth.protect();
          }
        },
        {
          signInUrl,
          signUpUrl,
        },
      );
      return async (request, event) => {
        const response = await middleware(request, event);
        if (response instanceof Response) {
          (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$auth$2f$dev$2d$browser$2d$handoff$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__[
            'expireStaleDevBrowserCookies'
          ])(request, response, resolvePublishableKey());
        }
        return response;
      };
    }
    function WebAuthProvider({
      children,
      signInUrl,
      signUpUrl,
      signInForceRedirectUrl,
      signUpForceRedirectUrl,
    }) {
      const resolvedSignInUrl = resolveSignInUrl(signInUrl);
      const resolvedSignUpUrl = resolveSignUpUrl(signUpUrl);
      const publishableKey = resolvePublishableKey();
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$index$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
          'ClerkProvider'
        ],
        {
          ...(publishableKey
            ? {
                publishableKey,
              }
            : {}),
          signInUrl: resolvedSignInUrl,
          signUpUrl: resolvedSignUpUrl,
          signInForceRedirectUrl: signInForceRedirectUrl ?? '/',
          signUpForceRedirectUrl: signUpForceRedirectUrl ?? '/',
          children: children,
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/core/src/auth/next.tsx',
          lineNumber: 97,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/apps/seven-rc-web/proxy.ts [middleware] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'config',
      () => config,
      'default',
      () => __TURBOPACK__default__export__,
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$auth$2f$next$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/core/src/auth/next.tsx [middleware] (ecmascript)',
      );
    const PUBLIC_AUTH_BRIDGE_ROUTES = [
      '/',
      '/c/(.*)',
      '/sign-in(.*)',
      '/sign-up(.*)',
      '/forgot-password(.*)',
      '/sso-callback(.*)',
    ];
    const __TURBOPACK__default__export__ = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$auth$2f$next$2e$tsx__$5b$middleware$5d$__$28$ecmascript$29$__[
      'createNextClerkMiddleware'
    ])({
      publicRoutes: [...PUBLIC_AUTH_BRIDGE_ROUTES],
      signInUrl: '/sign-in',
      signUpUrl: '/sign-up',
    });
    const config = {
      matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|gif|png|svg|ttf|woff2?|ico)).*)',
        '/(api|trpc)(.*)',
      ],
    };
  },
];

//# sourceMappingURL=%5Broot-of-the-server%5D__06ff703c._.js.map
