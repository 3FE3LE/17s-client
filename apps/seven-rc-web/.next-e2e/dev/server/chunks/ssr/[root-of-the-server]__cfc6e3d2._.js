module.exports = [
  '[externals]/node:crypto [external] (node:crypto, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x('node:crypto', () => require('node:crypto'));

    module.exports = mod;
  },
  '[externals]/node:async_hooks [external] (node:async_hooks, cjs)',
  (__turbopack_context__, module, exports) => {
    const mod = __turbopack_context__.x('node:async_hooks', () => require('node:async_hooks'));

    module.exports = mod;
  },
  '[project]/packages/core/src/auth/dev-browser-handoff.ts [app-rsc] (ecmascript)',
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
  '[project]/packages/core/src/auth/next.tsx [app-rsc] (ecmascript)',
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
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@clerk+nextjs@6.37.5_next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwrigh_7fc3a0f00d05671a4e13335581eb0f57/node_modules/@clerk/nextjs/dist/esm/index.js [app-rsc] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkMiddleware$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@clerk+nextjs@6.37.5_next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwrigh_7fc3a0f00d05671a4e13335581eb0f57/node_modules/@clerk/nextjs/dist/esm/server/clerkMiddleware.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$routeMatcher$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@clerk+nextjs@6.37.5_next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwrigh_7fc3a0f00d05671a4e13335581eb0f57/node_modules/@clerk/nextjs/dist/esm/server/routeMatcher.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$auth$2f$dev$2d$browser$2d$handoff$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/core/src/auth/dev-browser-handoff.ts [app-rsc] (ecmascript)',
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
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$routeMatcher$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'createRouteMatcher'
      ])(publicRoutes);
      const signInUrl = resolveSignInUrl(options?.signInUrl);
      const signUpUrl = resolveSignUpUrl(options?.signUpUrl);
      const middleware = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkMiddleware$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
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
          __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$auth$2f$dev$2d$browser$2d$handoff$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
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
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
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
  '[project]/packages/design-system/src/tokens.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'getSuitTheme',
      () => getSuitTheme,
      'suitTheme',
      () => suitTheme,
      'suitThemeDark',
      () => suitThemeDark,
      'suitThemeLight',
      () => suitThemeLight,
    ]);
    const letterSpacingFromPercent = (percent) => `${percent / 100}em`;
    const letterSpacingPx = (fontSize, percent) => Number(((fontSize * percent) / 100).toFixed(3));
    const fontFamilies = {
      web: {
        arvo: 'Arvo, serif',
        amaranth: 'Amaranth, sans-serif',
        zillaSlab: '"Zilla Slab", serif',
      },
      native: {
        arvoRegular: 'Arvo_400Regular',
        arvoBold: 'Arvo_700Bold',
        amaranthRegular: 'Amaranth_400Regular',
        amaranthBold: 'Amaranth_700Bold',
        zillaSlabLight: 'ZillaSlab_300Light',
        zillaSlabRegular: 'ZillaSlab_400Regular',
        zillaSlabMedium: 'ZillaSlab_500Medium',
        zillaSlabBold: 'ZillaSlab_700Bold',
      },
    };
    const fontWeights = {
      light: '300',
      regular: '400',
      medium: '500',
      bold: '700',
    };
    const fontSizes = {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 24,
      xl: 34,
      x2l: 48,
      x3l: 60,
      x4l: 96,
    };
    const letterSpacings = {
      minus1_5: letterSpacingFromPercent(-1.5),
      minus0_5: letterSpacingFromPercent(-0.5),
      zero: letterSpacingFromPercent(0),
      plus0_25: letterSpacingFromPercent(0.25),
      plus0_4: letterSpacingFromPercent(0.4),
      plus1_25: letterSpacingFromPercent(1.25),
      plus1_5: letterSpacingFromPercent(1.5),
    };
    const baseTheme = {
      palette: ['#35a7ff', '#00916e', '#ff495c', '#eeeeee', '#00171f'],
      grayscale: ['#00151c', '#394448', '#717171', '#cfcfcf', '#f0f0f0'],
      semantic: ['#44af69', '#f8333c', '#f3863d', '#edd83d', '#1e91d6'],
      fontFamilies,
      fontWeights,
      fontSizes,
      letterSpacings,
      typography: {
        styles: {
          heading1: {
            webFamily: fontFamilies.web.arvo,
            nativeFamily: fontFamilies.native.arvoRegular,
            fontWeight: fontWeights.regular,
            fontSize: fontSizes.x4l,
            letterSpacingEm: letterSpacings.minus1_5,
            letterSpacingPx: letterSpacingPx(fontSizes.x4l, -1.5),
            lineHeightRecommended: 1.08,
          },
          heading2: {
            webFamily: fontFamilies.web.amaranth,
            nativeFamily: fontFamilies.native.amaranthRegular,
            fontWeight: fontWeights.regular,
            fontSize: fontSizes.x3l,
            letterSpacingEm: letterSpacings.minus0_5,
            letterSpacingPx: letterSpacingPx(fontSizes.x3l, -0.5),
            lineHeightRecommended: 1.1,
          },
          heading3: {
            webFamily: fontFamilies.web.amaranth,
            nativeFamily: fontFamilies.native.amaranthBold,
            fontWeight: fontWeights.bold,
            fontSize: fontSizes.x2l,
            letterSpacingEm: letterSpacings.zero,
            letterSpacingPx: letterSpacingPx(fontSizes.x2l, 0),
            lineHeightRecommended: 1.16,
          },
          subtitle1: {
            webFamily: fontFamilies.web.amaranth,
            nativeFamily: fontFamilies.native.amaranthRegular,
            fontWeight: fontWeights.regular,
            fontSize: fontSizes.xl,
            letterSpacingEm: letterSpacings.plus0_25,
            letterSpacingPx: letterSpacingPx(fontSizes.xl, 0.25),
            lineHeightRecommended: 1.2,
          },
          subtitle2: {
            webFamily: fontFamilies.web.arvo,
            nativeFamily: fontFamilies.native.arvoBold,
            fontWeight: fontWeights.bold,
            fontSize: fontSizes.lg,
            letterSpacingEm: letterSpacings.zero,
            letterSpacingPx: letterSpacingPx(fontSizes.lg, 0),
            lineHeightRecommended: 1.25,
          },
          body: {
            webFamily: fontFamilies.web.zillaSlab,
            nativeFamily: fontFamilies.native.zillaSlabRegular,
            fontWeight: fontWeights.regular,
            fontSize: fontSizes.md,
            letterSpacingEm: letterSpacings.zero,
            letterSpacingPx: letterSpacingPx(fontSizes.md, 0),
            lineHeightRecommended: 1.5,
          },
          button: {
            webFamily: fontFamilies.web.zillaSlab,
            nativeFamily: fontFamilies.native.zillaSlabBold,
            fontWeight: fontWeights.bold,
            fontSize: fontSizes.md,
            letterSpacingEm: letterSpacings.plus1_25,
            letterSpacingPx: letterSpacingPx(fontSizes.md, 1.25),
            lineHeightRecommended: 1.4,
          },
          caption: {
            webFamily: fontFamilies.web.zillaSlab,
            nativeFamily: fontFamilies.native.zillaSlabRegular,
            fontWeight: fontWeights.regular,
            fontSize: fontSizes.xs,
            letterSpacingEm: letterSpacings.plus0_4,
            letterSpacingPx: letterSpacingPx(fontSizes.xs, 0.4),
            lineHeightRecommended: 1.35,
          },
          overline: {
            webFamily: fontFamilies.web.zillaSlab,
            nativeFamily: fontFamilies.native.zillaSlabLight,
            fontWeight: fontWeights.light,
            fontSize: fontSizes.xs,
            letterSpacingEm: letterSpacings.plus1_5,
            letterSpacingPx: letterSpacingPx(fontSizes.xs, 1.5),
            lineHeightRecommended: 1.4,
          },
        },
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        x2l: 40,
        x3l: 48,
        x4l: 56,
      },
      borderRadius: {
        sm: 8,
        md: 12,
        lg: 20,
        xl: 28,
        full: 999,
      },
      sizes: {
        control: {
          sm: 40,
          md: 44,
          lg: 52,
          inputPaddingX: 12,
        },
        layout: {
          form: 420,
          content: 960,
          wideContent: 1080,
          bodyMeasure: 760,
          bodyNarrow: 720,
        },
      },
    };
    const darkColors = {
      background: '#00151c',
      surface: '#394448',
      accent: '#35a7ff',
      text: '#f0f0f0',
      muted: '#cfcfcf',
      success: '#44af69',
      error: '#f8333c',
      destructive: '#f8333c',
      warning: '#f3863d',
      caution: '#edd83d',
      info: '#1e91d6',
      brandPrimary: '#35a7ff',
      brandSecondary: '#00916e',
      brandAccent: '#ff495c',
      brandLight: '#eeeeee',
      brandDark: '#00171f',
    };
    const lightColors = {
      background: '#f7f8fa',
      surface: '#ffffff',
      accent: '#35a7ff',
      text: '#00151c',
      muted: '#394448',
      success: '#44af69',
      error: '#e10812',
      destructive: '#e10812',
      warning: '#f3863d',
      caution: '#edd83d',
      info: '#1876ae',
      brandPrimary: '#35a7ff',
      brandSecondary: '#007f60',
      brandAccent: '#ff495c',
      brandLight: '#f0f0f0',
      brandDark: '#00171f',
    };
    const suitThemeDark = {
      ...baseTheme,
      colors: darkColors,
    };
    const suitThemeLight = {
      ...baseTheme,
      colors: lightColors,
    };
    const getSuitTheme = (mode) => (mode === 'light' ? suitThemeLight : suitThemeDark);
    const suitTheme = suitThemeDark;
  },
  '[project]/packages/design-system/src/recipes.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'buttonLabelRecipe',
      () => buttonLabelRecipe,
      'buttonRecipe',
      () => buttonRecipe,
      'cardRecipe',
      () => cardRecipe,
      'cx',
      () => cx,
      'inputRecipe',
      () => inputRecipe,
      'pageContainerRecipe',
      () => pageContainerRecipe,
    ]);
    const cx = (...values) => values.filter(Boolean).join(' ');
    function buttonRecipe({
      intent = 'primary',
      size = 'md',
      shape = 'pill',
      platform = 'web',
      fullWidth = true,
      disabled = false,
    } = {}) {
      const intentClass = {
        primary:
          'border-action-primary-border bg-action-primary text-foreground-inverse shadow-action-primary',
        secondary: 'border-border-default bg-surface-control text-brand-dark',
        danger: 'border-destructive/35 bg-feedback-error-soft text-brand-dark',
        dark: 'border-brand-dark bg-brand-dark text-white',
        success: 'border-action-primary/35 bg-action-primary-soft text-brand-dark',
        warning: 'border-warning/35 bg-feedback-warning-soft text-brand-dark',
        info: 'border-info/35 bg-feedback-info-soft text-brand-dark',
        neutral: 'border-border-default bg-brand-light text-brand-dark',
      };
      const sizeClass = {
        sm: 'min-h-10 px-4 py-2 text-sm',
        md: 'min-h-11 px-md py-sm text-md',
        lg: 'min-h-[52px] px-5 py-[13px] text-md',
      };
      const shapeClass = {
        md: 'rounded-[var(--radius-control)]',
        pill: 'rounded-full',
      };
      return cx(
        'items-center justify-center border font-zilla font-bold leading-[1.4] tracking-plus1_25',
        platform === 'web' &&
          'inline-flex transition-transform duration-200 enabled:hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary/30',
        platform === 'native' && 'active:opacity-85',
        fullWidth ? 'w-full' : 'w-auto',
        disabled && 'cursor-not-allowed opacity-60',
        shapeClass[shape],
        sizeClass[size],
        intentClass[intent],
      );
    }
    function buttonLabelRecipe({ intent = 'primary' } = {}) {
      const labelClass = {
        primary: 'text-foreground-inverse',
        secondary: 'text-brand-dark',
        danger: 'text-brand-dark',
        dark: 'text-white',
        success: 'text-brand-dark',
        warning: 'text-brand-dark',
        info: 'text-brand-dark',
        neutral: 'text-brand-dark',
      };
      return cx(
        'text-center font-zilla text-md font-bold leading-[22px] tracking-plus1_25',
        labelClass[intent],
      );
    }
    function cardRecipe({ variant = 'panel', shadow = 'none' } = {}) {
      const variantClass = {
        panel: 'rounded-[var(--radius-md)] p-[var(--spacing-md)]',
        list: 'overflow-hidden rounded-[var(--radius-md)] p-0',
        feature: 'rounded-[var(--radius-lg)] p-[var(--spacing-lg)] backdrop-blur-sm',
        hero: 'rounded-[var(--radius-xl)] p-[clamp(24px,4vw,44px)] backdrop-blur-sm',
        workspaceHeader: 'rounded-[var(--radius-xl)] p-[clamp(20px,3vw,36px)] backdrop-blur-sm',
        inset:
          'rounded-[var(--radius-sm)] border-border-hairline bg-surface-inset p-[var(--spacing-sm)]',
      };
      const shadowClass = {
        none: '',
        panel: 'shadow-panel',
        strong: 'shadow-panel-strong',
      };
      return cx(
        'border border-border-default bg-surface-panel',
        variantClass[variant],
        shadowClass[shadow],
      );
    }
    function inputRecipe({
      state = 'default',
      compact = false,
      hasLeftAccessory = false,
      hasRightAccessory = false,
      platform = 'web',
    } = {}) {
      return {
        root: platform === 'web' ? 'grid w-full gap-xs' : 'w-full',
        label: 'grid gap-1 text-sm font-bold text-brand-dark',
        fieldLabel:
          platform === 'web'
            ? 'font-zilla text-sm leading-[1.5] tracking-normal text-muted'
            : 'mb-xs font-zilla text-sm leading-[21px] text-muted',
        control: cx(
          'w-full rounded-[var(--radius-control)] border bg-surface font-zilla text-md text-text',
          platform === 'web'
            ? 'outline-none transition-colors placeholder:text-muted'
            : 'leading-[24px]',
          compact ? 'h-10' : 'h-11',
          hasLeftAccessory ? 'pl-10' : 'pl-3',
          hasRightAccessory ? 'pr-11' : 'pr-3',
          state === 'error' ? 'border-destructive' : 'border-border-strong',
          state === 'disabled' && 'opacity-60',
        ),
      };
    }
    function pageContainerRecipe({ kind = 'content' } = {}) {
      const kindClass = {
        landing:
          'relative z-10 mx-auto max-w-[1080px] px-[var(--spacing-md)] pb-[var(--spacing-x2l)] pt-[var(--spacing-md)] md:px-[var(--spacing-lg)] md:pb-[var(--spacing-x4l)] md:pt-[var(--spacing-lg)]',
        workspace:
          'relative z-10 mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[286px_1fr]',
        content:
          'mx-auto w-full max-w-container-content px-[var(--spacing-md)] md:px-[var(--spacing-lg)]',
      };
      return kindClass[kind];
    }
  },
  '[project]/packages/design-system/src/index.ts [app-rsc] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$tokens$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/tokens.ts [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/recipes.ts [app-rsc] (ecmascript)',
      );
  },
  '[project]/packages/ui-web/src/components/AppButton.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppButton', () => AppButton]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/index.ts [app-rsc] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/recipes.ts [app-rsc] (ecmascript)',
      );
    function AppButton({
      children,
      onPress,
      variant = 'primary',
      disabled = false,
      fullWidth = true,
      compact = false,
      type = 'button',
      style,
      ...rest
    }) {
      const variantClasses = {
        primary: 'primary',
        success: 'success',
        destructive: 'danger',
        warning: 'warning',
        info: 'info',
        neutral: 'neutral',
      };
      const buttonClassName = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'cx'
      ])(
        (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'buttonRecipe'
        ])({
          intent: variantClasses[variant],
          size: compact ? 'sm' : 'md',
          shape: 'md',
          platform: 'web',
          fullWidth,
          disabled,
        }),
        disabled ? '' : 'cursor-pointer',
        typeof rest.className === 'string' ? rest.className : '',
      );
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'button',
        {
          ...rest,
          type: type,
          onClick: onPress,
          disabled: disabled,
          className: buttonClassName,
          style: {
            ...style,
          },
          children: /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            'span',
            {
              className: 'm-0 text-center',
              children: children,
            },
            void 0,
            false,
            {
              fileName: '[project]/packages/ui-web/src/components/AppButton.tsx',
              lineNumber: 58,
              columnNumber: 7,
            },
            this,
          ),
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/components/AppButton.tsx',
          lineNumber: 48,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (client reference proxy) <module evaluation>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'ThemeProvider',
      () => ThemeProvider,
      'useAppTheme',
      () => useAppTheme,
    ]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const ThemeProvider = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call ThemeProvider() from the server but ThemeProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/theme/theme-context.tsx <module evaluation>',
      'ThemeProvider',
    );
    const useAppTheme = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call useAppTheme() from the server but useAppTheme is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/theme/theme-context.tsx <module evaluation>',
      'useAppTheme',
    );
  },
  '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (client reference proxy)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'ThemeProvider',
      () => ThemeProvider,
      'useAppTheme',
      () => useAppTheme,
    ]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const ThemeProvider = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call ThemeProvider() from the server but ThemeProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/theme/theme-context.tsx',
      'ThemeProvider',
    );
    const useAppTheme = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call useAppTheme() from the server but useAppTheme is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/theme/theme-context.tsx',
      'useAppTheme',
    );
  },
  '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (client reference proxy) <module evaluation>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (client reference proxy)',
      );
    __turbopack_context__.n(
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__,
    );
  },
  '[project]/packages/ui-web/src/components/AppBottomTabBar.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppBottomTabBar', () => AppBottomTabBar]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (ecmascript)',
      );
    function getActiveColors(tone, theme) {
      if (tone === 'OWNER') {
        return {
          backgroundColor: theme.colors.success,
          textColor: theme.colors.brandDark,
        };
      }
      return {
        backgroundColor: theme.colors.brandPrimary,
        textColor: theme.colors.brandDark,
      };
    }
    function AppBottomTabBar({ items, tone, showLabels = true }) {
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const buttonType = theme.typography.styles.button;
      const lineHeight = buttonType.lineHeightRecommended;
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          style: {
            width: '100%',
            borderTop: `1px solid ${theme.colors.surface}`,
            backgroundColor: theme.colors.brandDark,
            padding: `${theme.spacing.sm}px ${theme.spacing.md}px ${theme.spacing.md}px`,
            display: 'flex',
            flexDirection: 'column',
          },
          children: /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            'div',
            {
              style: {
                width: '100%',
                gap: 8,
                display: 'flex',
                flexDirection: 'row',
              },
              children: items.map((item) => {
                const activeColors = getActiveColors(tone, theme);
                const isActive = item.isActive;
                return /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'button',
                  {
                    type: 'button',
                    onClick: item.onPress,
                    style: {
                      backgroundColor: isActive
                        ? activeColors.backgroundColor
                        : theme.colors.surface,
                      border: isActive ? 'none' : `1px solid ${theme.grayscale[1]}`,
                      borderRadius: theme.borderRadius.md,
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: theme.sizes.control.md,
                      flex: 1,
                      minWidth: 0,
                      padding: `0 ${theme.spacing.sm}px`,
                      display: 'flex',
                    },
                    children: /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                      'jsxDEV'
                    ])(
                      'div',
                      {
                        style: {
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: showLabels ? 4 : 0,
                          display: 'flex',
                          flexDirection: 'column',
                        },
                        children: [
                          item.icon
                            ? /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                'div',
                                {
                                  style: {
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    display: 'flex',
                                  },
                                  children: item.icon,
                                },
                                void 0,
                                false,
                                {
                                  fileName:
                                    '[project]/packages/ui-web/src/components/AppBottomTabBar.tsx',
                                  lineNumber: 84,
                                  columnNumber: 19,
                                },
                                this,
                              )
                            : null,
                          showLabels || !item.icon
                            ? /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                'span',
                                {
                                  style: {
                                    margin: 0,
                                    textAlign: 'center',
                                    fontFamily: buttonType.webFamily,
                                    fontSize: buttonType.fontSize,
                                    lineHeight,
                                    fontWeight: buttonType.fontWeight,
                                    letterSpacing: buttonType.letterSpacingEm,
                                    color: isActive
                                      ? activeColors.textColor
                                      : theme.colors.brandLight,
                                  },
                                  children: item.label,
                                },
                                void 0,
                                false,
                                {
                                  fileName:
                                    '[project]/packages/ui-web/src/components/AppBottomTabBar.tsx',
                                  lineNumber: 89,
                                  columnNumber: 19,
                                },
                                this,
                              )
                            : null,
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: '[project]/packages/ui-web/src/components/AppBottomTabBar.tsx',
                        lineNumber: 74,
                        columnNumber: 15,
                      },
                      this,
                    ),
                  },
                  item.key,
                  false,
                  {
                    fileName: '[project]/packages/ui-web/src/components/AppBottomTabBar.tsx',
                    lineNumber: 57,
                    columnNumber: 13,
                  },
                  this,
                );
              }),
            },
            void 0,
            false,
            {
              fileName: '[project]/packages/ui-web/src/components/AppBottomTabBar.tsx',
              lineNumber: 52,
              columnNumber: 7,
            },
            this,
          ),
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/components/AppBottomTabBar.tsx',
          lineNumber: 42,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/components/AppButtonGroup.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppButtonGroup', () => AppButtonGroup]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (ecmascript)',
      );
    function AppButtonGroup({ children, direction = 'row', gap = 'sm', stretch = true, style }) {
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const items =
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'Children'
        ].toArray(children);
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: direction,
            gap: theme.spacing[gap],
            width: '100%',
            ...style,
          },
          children: items.map((child, index) =>
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'div',
              {
                style: stretch
                  ? {
                      flex: 1,
                    }
                  : undefined,
                children: child,
              },
              index,
              false,
              {
                fileName: '[project]/packages/ui-web/src/components/AppButtonGroup.tsx',
                lineNumber: 34,
                columnNumber: 9,
              },
              this,
            ),
          ),
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/components/AppButtonGroup.tsx',
          lineNumber: 24,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/components/AppDivider.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppDivider', () => AppDivider]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    function AppDivider({ marginY }) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          className: 'h-px w-full bg-surface',
          style: {
            marginTop: marginY ?? 4,
            marginBottom: marginY ?? 4,
          },
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/components/AppDivider.tsx',
          lineNumber: 7,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/components/AppBadge.tsx [app-rsc] (client reference proxy) <module evaluation>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppBadge', () => AppBadge]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const AppBadge = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call AppBadge() from the server but AppBadge is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/components/AppBadge.tsx <module evaluation>',
      'AppBadge',
    );
  },
  '[project]/packages/ui-web/src/components/AppBadge.tsx [app-rsc] (client reference proxy)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppBadge', () => AppBadge]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const AppBadge = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call AppBadge() from the server but AppBadge is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/components/AppBadge.tsx',
      'AppBadge',
    );
  },
  '[project]/packages/ui-web/src/components/AppBadge.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppBadge.tsx [app-rsc] (client reference proxy) <module evaluation>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppBadge.tsx [app-rsc] (client reference proxy)',
      );
    __turbopack_context__.n(
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__,
    );
  },
  '[project]/packages/ui-web/src/components/AppCard.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppCard', () => AppCard]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/index.ts [app-rsc] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/recipes.ts [app-rsc] (ecmascript)',
      );
    function AppCard({
      children,
      title,
      subtitle,
      footer,
      tone = 'default',
      onPress,
      style,
      ...rest
    }) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          ...rest,
          onClick: onPress,
          role: onPress ? 'button' : undefined,
          tabIndex: onPress ? 0 : undefined,
          className: (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
            'cx'
          ])(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'cardRecipe'
            ])({
              variant: 'feature',
              shadow: 'panel',
            }),
            'grid w-full gap-sm',
            tone === 'accent' && 'border-brand-primary',
            onPress
              ? 'cursor-pointer transition-transform duration-150 hover:-translate-y-px'
              : 'cursor-default',
            typeof rest.className === 'string' ? rest.className : '',
          ),
          style: style,
          children: [
            title
              ? /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'p',
                  {
                    className: 'm-0 font-arvo text-lg font-bold leading-[1.25] text-text',
                    children: title,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/packages/ui-web/src/components/AppCard.tsx',
                    lineNumber: 44,
                    columnNumber: 9,
                  },
                  this,
                )
              : null,
            subtitle
              ? /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'p',
                  {
                    className: 'm-0 font-zilla text-md leading-[1.5] text-muted',
                    children: subtitle,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/packages/ui-web/src/components/AppCard.tsx',
                    lineNumber: 47,
                    columnNumber: 9,
                  },
                  this,
                )
              : null,
            children,
            footer
              ? /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'div',
                  {
                    className: 'mt-xs border-t border-border-default pt-sm',
                    children: footer,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/packages/ui-web/src/components/AppCard.tsx',
                    lineNumber: 50,
                    columnNumber: 17,
                  },
                  this,
                )
              : null,
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/packages/ui-web/src/components/AppCard.tsx',
          lineNumber: 27,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/components/AppAlert.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppAlert', () => AppAlert]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (ecmascript)',
      );
    function AppAlert({ variant = 'info', title, description, icon, action, style, ...rest }) {
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const subtitleType = theme.typography.styles.subtitle2;
      const bodyType = theme.typography.styles.body;
      const variantStyles = {
        info: {
          border: theme.colors.info,
          background: `${theme.colors.info}22`,
          icon: theme.colors.info,
        },
        success: {
          border: theme.colors.success,
          background: `${theme.colors.success}22`,
          icon: theme.colors.success,
        },
        warning: {
          border: theme.colors.warning,
          background: `${theme.colors.warning}22`,
          icon: theme.colors.warning,
        },
        destructive: {
          border: theme.colors.destructive,
          background: `${theme.colors.destructive}22`,
          icon: theme.colors.destructive,
        },
      };
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          ...rest,
          role: 'alert',
          style: {
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: theme.spacing.sm,
            border: `1px solid ${variantStyles[variant].border}`,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
            backgroundColor: variantStyles[variant].background,
            ...style,
          },
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'span',
              {
                'aria-hidden': true,
                style: {
                  width: 24,
                  height: 24,
                  borderRadius: theme.borderRadius.full,
                  border: `1px solid ${variantStyles[variant].icon}`,
                  color: variantStyles[variant].icon,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: subtitleType.webFamily,
                  fontSize: 12,
                  fontWeight: subtitleType.fontWeight,
                },
                children: icon ?? '!',
              },
              void 0,
              false,
              {
                fileName: '[project]/packages/ui-web/src/components/AppAlert.tsx',
                lineNumber: 69,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'div',
              {
                style: {
                  display: 'grid',
                  gap: theme.spacing.xs,
                },
                children: [
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'p',
                    {
                      style: {
                        margin: 0,
                        color: theme.colors.text,
                        fontFamily: subtitleType.webFamily,
                        fontWeight: subtitleType.fontWeight,
                        fontSize: subtitleType.fontSize,
                        lineHeight: subtitleType.lineHeightRecommended,
                        letterSpacing: subtitleType.letterSpacingEm,
                      },
                      children: title,
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/packages/ui-web/src/components/AppAlert.tsx',
                      lineNumber: 88,
                      columnNumber: 9,
                    },
                    this,
                  ),
                  description
                    ? /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        'p',
                        {
                          style: {
                            margin: 0,
                            color: theme.colors.muted,
                            fontFamily: bodyType.webFamily,
                            fontWeight: bodyType.fontWeight,
                            fontSize: bodyType.fontSize,
                            lineHeight: bodyType.lineHeightRecommended,
                            letterSpacing: bodyType.letterSpacingEm,
                          },
                          children: description,
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/packages/ui-web/src/components/AppAlert.tsx',
                          lineNumber: 102,
                          columnNumber: 11,
                        },
                        this,
                      )
                    : null,
                  action
                    ? /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        'div',
                        {
                          style: {
                            marginTop: theme.spacing.xs,
                          },
                          children: action,
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/packages/ui-web/src/components/AppAlert.tsx',
                          lineNumber: 116,
                          columnNumber: 19,
                        },
                        this,
                      )
                    : null,
                ],
              },
              void 0,
              true,
              {
                fileName: '[project]/packages/ui-web/src/components/AppAlert.tsx',
                lineNumber: 87,
                columnNumber: 7,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/packages/ui-web/src/components/AppAlert.tsx',
          lineNumber: 54,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/components/AppAvatar.tsx [app-rsc] (client reference proxy) <module evaluation>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppAvatar', () => AppAvatar]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const AppAvatar = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call AppAvatar() from the server but AppAvatar is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/components/AppAvatar.tsx <module evaluation>',
      'AppAvatar',
    );
  },
  '[project]/packages/ui-web/src/components/AppAvatar.tsx [app-rsc] (client reference proxy)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppAvatar', () => AppAvatar]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const AppAvatar = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call AppAvatar() from the server but AppAvatar is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/components/AppAvatar.tsx',
      'AppAvatar',
    );
  },
  '[project]/packages/ui-web/src/components/AppAvatar.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppAvatar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppAvatar.tsx [app-rsc] (client reference proxy) <module evaluation>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppAvatar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppAvatar.tsx [app-rsc] (client reference proxy)',
      );
    __turbopack_context__.n(
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppAvatar$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__,
    );
  },
  '[project]/packages/ui-web/src/components/AppEmpty.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppEmpty', () => AppEmpty]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/inbox.js [app-rsc] (ecmascript) <export default as Inbox>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppButton.tsx [app-rsc] (ecmascript)',
      );
    function AppEmpty({ title, description, icon, actionLabel, onAction, style, children }) {
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const subtitleType = theme.typography.styles.subtitle2;
      const bodyType = theme.typography.styles.body;
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          style: {
            width: '100%',
            border: `1px dashed ${theme.grayscale[3]}`,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.lg,
            display: 'grid',
            gap: theme.spacing.sm,
            justifyItems: 'center',
            textAlign: 'center',
            ...style,
          },
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'span',
              {
                'aria-hidden': true,
                style: {
                  width: 44,
                  height: 44,
                  borderRadius: theme.borderRadius.full,
                  backgroundColor: `${theme.colors.brandPrimary}22`,
                  color: theme.colors.brandPrimary,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: subtitleType.webFamily,
                  fontSize: 18,
                  fontWeight: subtitleType.fontWeight,
                },
                children:
                  icon ??
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__[
                      'Inbox'
                    ],
                    {
                      size: 20,
                      strokeWidth: 2,
                      'aria-hidden': true,
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/packages/ui-web/src/components/AppEmpty.tsx',
                      lineNumber: 59,
                      columnNumber: 18,
                    },
                    this,
                  ),
              },
              void 0,
              false,
              {
                fileName: '[project]/packages/ui-web/src/components/AppEmpty.tsx',
                lineNumber: 43,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'p',
              {
                style: {
                  margin: 0,
                  color: theme.colors.text,
                  fontFamily: subtitleType.webFamily,
                  fontWeight: subtitleType.fontWeight,
                  fontSize: subtitleType.fontSize,
                  lineHeight: subtitleType.lineHeightRecommended,
                  letterSpacing: subtitleType.letterSpacingEm,
                },
                children: title,
              },
              void 0,
              false,
              {
                fileName: '[project]/packages/ui-web/src/components/AppEmpty.tsx',
                lineNumber: 61,
                columnNumber: 7,
              },
              this,
            ),
            description
              ? /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'p',
                  {
                    style: {
                      margin: 0,
                      color: theme.colors.muted,
                      fontFamily: bodyType.webFamily,
                      fontWeight: bodyType.fontWeight,
                      fontSize: bodyType.fontSize,
                      lineHeight: bodyType.lineHeightRecommended,
                      letterSpacing: bodyType.letterSpacingEm,
                      maxWidth: 480,
                    },
                    children: description,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/packages/ui-web/src/components/AppEmpty.tsx',
                    lineNumber: 75,
                    columnNumber: 9,
                  },
                  this,
                )
              : null,
            children,
            actionLabel && onAction
              ? /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'div',
                  {
                    style: {
                      width: '100%',
                      maxWidth: 260,
                    },
                    children: /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                      'jsxDEV'
                    ])(
                      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                        'AppButton'
                      ],
                      {
                        variant: 'info',
                        onPress: onAction,
                        children: actionLabel,
                      },
                      void 0,
                      false,
                      {
                        fileName: '[project]/packages/ui-web/src/components/AppEmpty.tsx',
                        lineNumber: 93,
                        columnNumber: 11,
                      },
                      this,
                    ),
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/packages/ui-web/src/components/AppEmpty.tsx',
                    lineNumber: 92,
                    columnNumber: 9,
                  },
                  this,
                )
              : null,
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/packages/ui-web/src/components/AppEmpty.tsx',
          lineNumber: 29,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/components/AppSeparator.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppSeparator', () => AppSeparator]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (ecmascript)',
      );
    function AppSeparator({ orientation = 'horizontal', tone = 'muted', size = 1, style }) {
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const borderColor = tone === 'solid' ? theme.colors.text : theme.grayscale[3];
      const borderStyle = tone === 'dashed' ? 'dashed' : 'solid';
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          'aria-hidden': true,
          style: {
            width: orientation === 'horizontal' ? '100%' : size,
            height: orientation === 'horizontal' ? size : '100%',
            borderTop:
              orientation === 'horizontal' ? `${size}px ${borderStyle} ${borderColor}` : undefined,
            borderLeft:
              orientation === 'vertical' ? `${size}px ${borderStyle} ${borderColor}` : undefined,
            opacity: tone === 'muted' ? 0.65 : 1,
            ...style,
          },
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/components/AppSeparator.tsx',
          lineNumber: 22,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/components/Separator.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['Separator', () => Separator]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/index.ts [app-rsc] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/recipes.ts [app-rsc] (ecmascript)',
      );
    function Separator({ orientation = 'horizontal', className, ...props }) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          ...props,
          'aria-hidden': 'true',
          className: (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
            'cx'
          ])(
            'shrink-0 bg-[rgba(0,23,31,0.12)]',
            orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px self-stretch',
            className,
          ),
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/components/Separator.tsx',
          lineNumber: 10,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/components/AppSkeleton.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppSkeleton', () => AppSkeleton]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (ecmascript)',
      );
    const SKELETON_KEYFRAMES = `
@keyframes appSkeletonPulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}
`;
    function AppSkeleton({ width = '100%', height = 16, rounded = 'md', style, ...rest }) {
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const radiusMap = {
        sm: theme.borderRadius.sm,
        md: theme.borderRadius.md,
        lg: theme.borderRadius.lg,
        full: theme.borderRadius.full,
      };
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'Fragment'
        ],
        {
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'style',
              {
                children: SKELETON_KEYFRAMES,
              },
              void 0,
              false,
              {
                fileName: '[project]/packages/ui-web/src/components/AppSkeleton.tsx',
                lineNumber: 36,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'div',
              {
                ...rest,
                'aria-hidden': true,
                style: {
                  width,
                  height,
                  borderRadius: radiusMap[rounded],
                  backgroundColor: theme.grayscale[3],
                  animation: 'appSkeletonPulse 1.2s ease-in-out infinite',
                  ...style,
                },
              },
              void 0,
              false,
              {
                fileName: '[project]/packages/ui-web/src/components/AppSkeleton.tsx',
                lineNumber: 37,
                columnNumber: 7,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
      );
    }
  },
  '[project]/packages/ui-web/src/components/AppSpinner.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppSpinner', () => AppSpinner]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (ecmascript)',
      );
    const SPINNER_KEYFRAMES = `
@keyframes appSpinnerRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
    function AppSpinner({ size = 18, tone = 'primary', style }) {
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const borderColor =
        tone === 'primary'
          ? theme.colors.brandPrimary
          : tone === 'muted'
            ? theme.colors.muted
            : theme.grayscale[3];
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'Fragment'
        ],
        {
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'style',
              {
                children: SPINNER_KEYFRAMES,
              },
              void 0,
              false,
              {
                fileName: '[project]/packages/ui-web/src/components/AppSpinner.tsx',
                lineNumber: 28,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'span',
              {
                'aria-label': 'Loading',
                style: {
                  display: 'inline-flex',
                  width: size,
                  height: size,
                  borderRadius: theme.borderRadius.full,
                  border: `${Math.max(2, Math.round(size / 8))}px solid ${theme.grayscale[3]}`,
                  borderTopColor: borderColor,
                  animation: 'appSpinnerRotate 0.75s linear infinite',
                  ...style,
                },
              },
              void 0,
              false,
              {
                fileName: '[project]/packages/ui-web/src/components/AppSpinner.tsx',
                lineNumber: 29,
                columnNumber: 7,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
      );
    }
  },
  '[project]/packages/ui-web/src/components/AppTypography.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppTypography', () => AppTypography]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (ecmascript)',
      );
    function AppTypography({
      as: Component = 'p',
      variant = 'body',
      color,
      align = 'left',
      style,
      children,
    }) {
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const typeStyle = theme.typography.styles[variant];
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        Component,
        {
          style: {
            margin: 0,
            color: color ?? theme.colors.text,
            textAlign: align,
            fontFamily: typeStyle.webFamily,
            fontWeight: typeStyle.fontWeight,
            fontSize: typeStyle.fontSize,
            lineHeight: typeStyle.lineHeightRecommended,
            letterSpacing: typeStyle.letterSpacingEm,
            ...style,
          },
          children: children,
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/components/AppTypography.tsx',
          lineNumber: 27,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/components/AppTitle.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppTitle', () => AppTitle]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (ecmascript)',
      );
    function AppTitle({ text, as: Tag = 'p' }) {
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const titleType = theme.typography.styles.subtitle1;
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        Tag,
        {
          // Color comes from the CSS token so it follows the resolved light/dark class,
          // not the JS theme (which can disagree with the DOM during SSR/hydration).
          className: 'text-text',
          style: {
            marginTop: theme.spacing.sm,
            marginBottom: theme.spacing.sm,
            fontSize: titleType.fontSize,
            fontFamily: titleType.webFamily,
            lineHeight: titleType.lineHeightRecommended,
            letterSpacing: titleType.letterSpacingEm,
            fontWeight: titleType.fontWeight,
          },
          children: text,
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/components/AppTitle.tsx',
          lineNumber: 15,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/components/AppFrame.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppFrame', () => AppFrame]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-rsc] (ecmascript) <export default as ArrowLeft>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppTitle$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppTitle.tsx [app-rsc] (ecmascript)',
      );
    function AppFrame({ appName, subtitle, onBack, landmark = true, children }) {
      const Root = landmark ? 'main' : 'div';
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        Root,
        {
          className: 'flex flex-1 flex-col bg-background p-lg',
          children: /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            'div',
            {
              className:
                'mt-md flex w-full max-w-[var(--container-content)] flex-col self-center rounded-xl border border-border-default bg-surface p-lg shadow-panel',
              children: [
                typeof onBack === 'function'
                  ? /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                      'jsxDEV'
                    ])(
                      'button',
                      {
                        type: 'button',
                        onClick: onBack,
                        'aria-label': 'Volver',
                        className:
                          'inline-flex h-11 w-11 cursor-pointer items-center justify-center self-start rounded-md border border-border-default bg-transparent text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary/30',
                        children: /*#__PURE__*/ (0,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                          'jsxDEV'
                        ])(
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__[
                            'ArrowLeft'
                          ],
                          {
                            size: 18,
                            'aria-hidden': 'true',
                          },
                          void 0,
                          false,
                          {
                            fileName: '[project]/packages/ui-web/src/components/AppFrame.tsx',
                            lineNumber: 28,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: '[project]/packages/ui-web/src/components/AppFrame.tsx',
                        lineNumber: 22,
                        columnNumber: 11,
                      },
                      this,
                    )
                  : null,
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppTitle$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                    'AppTitle'
                  ],
                  {
                    as: landmark ? 'h1' : 'h2',
                    text: appName,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/packages/ui-web/src/components/AppFrame.tsx',
                    lineNumber: 31,
                    columnNumber: 9,
                  },
                  this,
                ),
                subtitle
                  ? /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                      'jsxDEV'
                    ])(
                      'p',
                      {
                        className:
                          'm-0 max-w-[var(--container-measure)] font-zilla text-md leading-[1.5] tracking-normal text-muted',
                        children: subtitle,
                      },
                      void 0,
                      false,
                      {
                        fileName: '[project]/packages/ui-web/src/components/AppFrame.tsx',
                        lineNumber: 33,
                        columnNumber: 11,
                      },
                      this,
                    )
                  : null,
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'div',
                  {
                    className: 'mt-lg flex flex-col gap-md',
                    children: children,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/packages/ui-web/src/components/AppFrame.tsx',
                    lineNumber: 37,
                    columnNumber: 9,
                  },
                  this,
                ),
              ],
            },
            void 0,
            true,
            {
              fileName: '[project]/packages/ui-web/src/components/AppFrame.tsx',
              lineNumber: 20,
              columnNumber: 7,
            },
            this,
          ),
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/components/AppFrame.tsx',
          lineNumber: 19,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/components/AppInput.tsx [app-rsc] (client reference proxy) <module evaluation>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppInput', () => AppInput]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const AppInput = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call AppInput() from the server but AppInput is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/components/AppInput.tsx <module evaluation>',
      'AppInput',
    );
  },
  '[project]/packages/ui-web/src/components/AppInput.tsx [app-rsc] (client reference proxy)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppInput', () => AppInput]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const AppInput = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call AppInput() from the server but AppInput is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/components/AppInput.tsx',
      'AppInput',
    );
  },
  '[project]/packages/ui-web/src/components/AppInput.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppInput$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppInput.tsx [app-rsc] (client reference proxy) <module evaluation>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppInput$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppInput.tsx [app-rsc] (client reference proxy)',
      );
    __turbopack_context__.n(
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppInput$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__,
    );
  },
  '[project]/packages/ui-web/src/components/AppLinkAction.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppLinkAction', () => AppLinkAction]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    function AppLinkAction({ children, onPress }) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'button',
        {
          type: 'button',
          onClick: onPress,
          className:
            'm-0 cursor-pointer border-0 bg-transparent py-xs text-left font-zilla text-md leading-[1.5] tracking-normal text-info no-underline',
          children: children,
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/components/AppLinkAction.tsx',
          lineNumber: 9,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/components/AppProfile.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppProfile', () => AppProfile]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppButton.tsx [app-rsc] (ecmascript)',
      );
    function AppProfile({ fullName, email, userId, onSignOut }) {
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const subtitleType = theme.typography.styles.subtitle2;
      const bodyType = theme.typography.styles.body;
      const captionType = theme.typography.styles.caption;
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          style: {
            width: '100%',
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.surface}`,
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.md,
            gap: theme.spacing.sm,
            display: 'flex',
            flexDirection: 'column',
          },
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'p',
              {
                style: {
                  margin: 0,
                  color: theme.colors.text,
                  fontFamily: subtitleType.webFamily,
                  fontSize: subtitleType.fontSize,
                  lineHeight: subtitleType.lineHeightRecommended,
                  fontWeight: subtitleType.fontWeight,
                  letterSpacing: subtitleType.letterSpacingEm,
                },
                children: fullName || 'Usuario',
              },
              void 0,
              false,
              {
                fileName: '[project]/packages/ui-web/src/components/AppProfile.tsx',
                lineNumber: 30,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'p',
              {
                style: {
                  margin: 0,
                  color: theme.colors.muted,
                  fontFamily: bodyType.webFamily,
                  fontSize: bodyType.fontSize,
                  lineHeight: bodyType.lineHeightRecommended,
                  fontWeight: bodyType.fontWeight,
                  letterSpacing: bodyType.letterSpacingEm,
                },
                children: email || 'Sin email',
              },
              void 0,
              false,
              {
                fileName: '[project]/packages/ui-web/src/components/AppProfile.tsx',
                lineNumber: 43,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'p',
              {
                style: {
                  margin: 0,
                  color: theme.colors.muted,
                  fontFamily: captionType.webFamily,
                  fontSize: captionType.fontSize,
                  lineHeight: captionType.lineHeightRecommended,
                  fontWeight: captionType.fontWeight,
                  letterSpacing: captionType.letterSpacingEm,
                },
                children: `ID: ${userId || '-'}`,
              },
              void 0,
              false,
              {
                fileName: '[project]/packages/ui-web/src/components/AppProfile.tsx',
                lineNumber: 56,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'div',
              {
                style: {
                  marginTop: theme.spacing.xs,
                  display: 'flex',
                  flexDirection: 'column',
                },
                children: /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                    'AppButton'
                  ],
                  {
                    variant: 'destructive',
                    onPress: onSignOut,
                    children: 'Cerrar sesion',
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/packages/ui-web/src/components/AppProfile.tsx',
                    lineNumber: 76,
                    columnNumber: 9,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: '[project]/packages/ui-web/src/components/AppProfile.tsx',
                lineNumber: 69,
                columnNumber: 7,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/packages/ui-web/src/components/AppProfile.tsx',
          lineNumber: 18,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/components/AppSelect.tsx [app-rsc] (client reference proxy) <module evaluation>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppSelect', () => AppSelect]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const AppSelect = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call AppSelect() from the server but AppSelect is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/components/AppSelect.tsx <module evaluation>',
      'AppSelect',
    );
  },
  '[project]/packages/ui-web/src/components/AppSelect.tsx [app-rsc] (client reference proxy)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppSelect', () => AppSelect]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const AppSelect = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call AppSelect() from the server but AppSelect is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/components/AppSelect.tsx',
      'AppSelect',
    );
  },
  '[project]/packages/ui-web/src/components/AppSelect.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSelect$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSelect.tsx [app-rsc] (client reference proxy) <module evaluation>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSelect$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSelect.tsx [app-rsc] (client reference proxy)',
      );
    __turbopack_context__.n(
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSelect$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__,
    );
  },
  '[project]/packages/ui-web/src/components/GapView.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['GapView', () => GapView]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    function GapView({ gap, direction = 'column', style, children }) {
      const gapClassMap = {
        xs: 'gap-xs',
        sm: 'gap-sm',
        md: 'gap-md',
        lg: 'gap-lg',
        xl: 'gap-xl',
        x2l: 'gap-x2l',
        x3l: 'gap-x3l',
        x4l: 'gap-x4l',
      };
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          className: `flex ${direction === 'row' ? 'flex-row' : 'flex-col'} ${gapClassMap[gap]}`,
          style: {
            ...style,
          },
          children: children,
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/components/GapView.tsx',
          lineNumber: 25,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx [app-rsc] (client reference proxy) <module evaluation>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppWorkspaceShell', () => AppWorkspaceShell]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const AppWorkspaceShell = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call AppWorkspaceShell() from the server but AppWorkspaceShell is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx <module evaluation>',
      'AppWorkspaceShell',
    );
  },
  '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx [app-rsc] (client reference proxy)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppWorkspaceShell', () => AppWorkspaceShell]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const AppWorkspaceShell = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call AppWorkspaceShell() from the server but AppWorkspaceShell is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
      'AppWorkspaceShell',
    );
  },
  '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppWorkspaceShell$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx [app-rsc] (client reference proxy) <module evaluation>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppWorkspaceShell$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx [app-rsc] (client reference proxy)',
      );
    __turbopack_context__.n(
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppWorkspaceShell$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__,
    );
  },
  '[project]/packages/ui-web/src/components/AppProviders.tsx [app-rsc] (client reference proxy) <module evaluation>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppProviders', () => AppProviders]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const AppProviders = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call AppProviders() from the server but AppProviders is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/components/AppProviders.tsx <module evaluation>',
      'AppProviders',
    );
  },
  '[project]/packages/ui-web/src/components/AppProviders.tsx [app-rsc] (client reference proxy)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppProviders', () => AppProviders]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const AppProviders = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call AppProviders() from the server but AppProviders is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/components/AppProviders.tsx',
      'AppProviders',
    );
  },
  '[project]/packages/ui-web/src/components/AppProviders.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProviders$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppProviders.tsx [app-rsc] (client reference proxy) <module evaluation>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProviders$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppProviders.tsx [app-rsc] (client reference proxy)',
      );
    __turbopack_context__.n(
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProviders$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__,
    );
  },
  '[project]/packages/ui-web/src/components/ProductShell.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['ProductShell', () => ProductShell]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (ecmascript)',
      );
    function ProductShell({ productName, subtitle, children }) {
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const overlineType = theme.typography.styles.overline;
      const titleType = theme.typography.styles.subtitle1;
      const bodyType = theme.typography.styles.body;
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          style: {
            flex: 1,
            paddingTop: theme.spacing.x2l,
            paddingLeft: theme.spacing.x2l,
            paddingRight: theme.spacing.x2l,
            background: `radial-gradient(circle at 10% 10%, ${theme.colors.surface}, ${theme.colors.background})`,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          },
          children: /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            'div',
            {
              style: {
                maxWidth: theme.sizes.layout.wideContent,
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'flex',
                flexDirection: 'column',
              },
              children: [
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'p',
                  {
                    style: {
                      margin: 0,
                      color: theme.colors.brandSecondary,
                      fontFamily: overlineType.webFamily,
                      fontSize: overlineType.fontSize,
                      lineHeight: overlineType.lineHeightRecommended,
                      fontWeight: overlineType.fontWeight,
                      letterSpacing: overlineType.letterSpacingEm,
                    },
                    children: '17SUIT PRODUCT',
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/packages/ui-web/src/components/ProductShell.tsx',
                    lineNumber: 37,
                    columnNumber: 9,
                  },
                  this,
                ),
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'p',
                  {
                    style: {
                      margin: 0,
                      color: theme.colors.text,
                      fontFamily: titleType.webFamily,
                      fontSize: titleType.fontSize,
                      lineHeight: titleType.lineHeightRecommended,
                      fontWeight: titleType.fontWeight,
                      letterSpacing: titleType.letterSpacingEm,
                    },
                    children: productName,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/packages/ui-web/src/components/ProductShell.tsx',
                    lineNumber: 50,
                    columnNumber: 9,
                  },
                  this,
                ),
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'p',
                  {
                    style: {
                      margin: 0,
                      color: theme.colors.muted,
                      maxWidth: theme.sizes.layout.bodyNarrow,
                      fontFamily: bodyType.webFamily,
                      fontSize: bodyType.fontSize,
                      lineHeight: bodyType.lineHeightRecommended,
                      fontWeight: bodyType.fontWeight,
                      letterSpacing: bodyType.letterSpacingEm,
                    },
                    children: subtitle,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/packages/ui-web/src/components/ProductShell.tsx',
                    lineNumber: 63,
                    columnNumber: 9,
                  },
                  this,
                ),
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'div',
                  {
                    style: {
                      marginTop: theme.spacing.xl,
                      display: 'flex',
                      flexDirection: 'column',
                    },
                    children: children,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/packages/ui-web/src/components/ProductShell.tsx',
                    lineNumber: 77,
                    columnNumber: 9,
                  },
                  this,
                ),
              ],
            },
            void 0,
            true,
            {
              fileName: '[project]/packages/ui-web/src/components/ProductShell.tsx',
              lineNumber: 28,
              columnNumber: 7,
            },
            this,
          ),
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/components/ProductShell.tsx',
          lineNumber: 16,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/feedback/toast/toast.provider.tsx [app-rsc] (client reference proxy) <module evaluation>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['ToastProvider', () => ToastProvider]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const ToastProvider = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call ToastProvider() from the server but ToastProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/feedback/toast/toast.provider.tsx <module evaluation>',
      'ToastProvider',
    );
  },
  '[project]/packages/ui-web/src/feedback/toast/toast.provider.tsx [app-rsc] (client reference proxy)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['ToastProvider', () => ToastProvider]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const ToastProvider = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call ToastProvider() from the server but ToastProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/packages/ui-web/src/feedback/toast/toast.provider.tsx',
      'ToastProvider',
    );
  },
  '[project]/packages/ui-web/src/feedback/toast/toast.provider.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$provider$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/feedback/toast/toast.provider.tsx [app-rsc] (client reference proxy) <module evaluation>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$provider$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/feedback/toast/toast.provider.tsx [app-rsc] (client reference proxy)',
      );
    __turbopack_context__.n(
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$provider$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__,
    );
  },
  '[project]/packages/ui-web/src/feedback/toast/toast.service.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['notify', () => notify]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/sonner@2.0.7_react-dom@19.3.0_react@19.3.0__react@19.3.0/node_modules/sonner/dist/index.mjs [app-rsc] (ecmascript)',
      );
    const notify = {
      success: (message, options) =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'toast'
        ].success(message, options),
      error: (message, options) =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'toast'
        ].error(message, options),
      info: (message, options) =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'toast'
        ].info(message, options),
      warning: (message, options) =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'toast'
        ].warning(message, options),
      loading: (message, options) =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'toast'
        ].loading(message, options),
      promise: (promise, options) =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'toast'
        ].promise(promise, options),
      dismiss: (id) =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'toast'
        ].dismiss(id),
    };
  },
  '[project]/packages/ui-web/src/feedback/toast/index.ts [app-rsc] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$provider$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/feedback/toast/toast.provider.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/feedback/toast/toast.service.ts [app-rsc] (ecmascript)',
      );
  },
  '[project]/packages/ui-web/src/components/AppProductFooter.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'AppProductFooter',
      () => AppProductFooter,
      'appProductFooterButtonStyle',
      () => appProductFooterButtonStyle,
      'appProductFooterTextLinkStyle',
      () => appProductFooterTextLinkStyle,
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    const containerStyle = {
      width: '100%',
      background: 'var(--color-surface, #ffffff)',
      borderTop: '1px solid var(--color-border-default, rgba(0, 23, 31, 0.12))',
    };
    const contentStyle = {
      maxWidth: 1080,
      margin: '0 auto',
      padding: '24px 16px',
      display: 'grid',
      gap: 16,
    };
    const brandRowStyle = {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    };
    const actionRowStyle = {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
    };
    const baseButtonStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      borderRadius: 'var(--radius-md, 8px)',
      border: '1px solid var(--color-border-default, rgba(0, 23, 31, 0.12))',
      minHeight: 44,
      padding: '10px 16px',
      fontFamily: '"Zilla Slab", serif',
      fontSize: 16,
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: '0.0125em',
    };
    const appProductFooterButtonStyle = baseButtonStyle;
    const textLinkStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 44,
      color: 'var(--color-muted, #394448)',
      textDecoration: 'none',
      fontFamily: '"Zilla Slab", serif',
      fontSize: 16,
      lineHeight: 1.5,
    };
    const appProductFooterTextLinkStyle = textLinkStyle;
    function renderLink(link, index) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'a',
        {
          href: link.href,
          style: textLinkStyle,
          target: link.external ? '_blank' : undefined,
          rel: link.external ? 'noreferrer noopener' : undefined,
          children: link.label,
        },
        `${link.label}-${index}`,
        false,
        {
          fileName: '[project]/packages/ui-web/src/components/AppProductFooter.tsx',
          lineNumber: 87,
          columnNumber: 5,
        },
        this,
      );
    }
    function AppProductFooter({
      productName,
      productSlug,
      productTagline,
      suiteName = '17Suit',
      homeHref = '/',
      signInHref = '/sign-in',
      signUpHref = '/sign-up',
      isSignedIn = false,
      signOutControl,
      actionControls,
      productLinks = [],
      productLinkControls,
      legalLinks = [],
      legalLinkControls,
    }) {
      const year = new Date().getFullYear();
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'footer',
        {
          style: containerStyle,
          children: /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            'div',
            {
              style: contentStyle,
              children: [
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'div',
                  {
                    style: brandRowStyle,
                    children: [
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        'div',
                        {
                          style: {
                            display: 'grid',
                            gap: 4,
                          },
                          children: [
                            /*#__PURE__*/ (0,
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                              'jsxDEV'
                            ])(
                              'p',
                              {
                                style: {
                                  margin: 0,
                                  color: 'var(--color-brand-dark, #00171f)',
                                  fontFamily: '"Arvo", serif',
                                  fontSize: 24,
                                  lineHeight: 1.25,
                                  fontWeight: 700,
                                },
                                children: productName,
                              },
                              void 0,
                              false,
                              {
                                fileName:
                                  '[project]/packages/ui-web/src/components/AppProductFooter.tsx',
                                lineNumber: 122,
                                columnNumber: 13,
                              },
                              this,
                            ),
                            /*#__PURE__*/ (0,
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                              'jsxDEV'
                            ])(
                              'p',
                              {
                                style: {
                                  margin: 0,
                                  color: 'var(--color-muted, #394448)',
                                  fontFamily: '"Zilla Slab", serif',
                                  fontSize: 14,
                                  lineHeight: 1.5,
                                },
                                children:
                                  productTagline ??
                                  `Producto de ${suiteName}${productSlug ? ` · ${productSlug}` : ''}`,
                              },
                              void 0,
                              false,
                              {
                                fileName:
                                  '[project]/packages/ui-web/src/components/AppProductFooter.tsx',
                                lineNumber: 134,
                                columnNumber: 13,
                              },
                              this,
                            ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: '[project]/packages/ui-web/src/components/AppProductFooter.tsx',
                          lineNumber: 121,
                          columnNumber: 11,
                        },
                        this,
                      ),
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        'div',
                        {
                          style: actionRowStyle,
                          children:
                            actionControls ??
                            /*#__PURE__*/ (0,
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                              'jsxDEV'
                            ])(
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                'Fragment'
                              ],
                              {
                                children: [
                                  /*#__PURE__*/ (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                    'jsxDEV'
                                  ])(
                                    'a',
                                    {
                                      href: homeHref,
                                      style: {
                                        ...baseButtonStyle,
                                        color: 'var(--color-brand-dark, #00171f)',
                                      },
                                      children: 'Ir al inicio',
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        '[project]/packages/ui-web/src/components/AppProductFooter.tsx',
                                      lineNumber: 151,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  isSignedIn
                                    ? signOutControl
                                    : /*#__PURE__*/ (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                        'jsxDEV'
                                      ])(
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                          'Fragment'
                                        ],
                                        {
                                          children: [
                                            /*#__PURE__*/ (0,
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                              'jsxDEV'
                                            ])(
                                              'a',
                                              {
                                                href: signInHref,
                                                style: {
                                                  ...baseButtonStyle,
                                                  color: 'var(--color-brand-dark, #00171f)',
                                                },
                                                children: 'Iniciar sesión',
                                              },
                                              void 0,
                                              false,
                                              {
                                                fileName:
                                                  '[project]/packages/ui-web/src/components/AppProductFooter.tsx',
                                                lineNumber: 161,
                                                columnNumber: 21,
                                              },
                                              this,
                                            ),
                                            /*#__PURE__*/ (0,
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                              'jsxDEV'
                                            ])(
                                              'a',
                                              {
                                                href: signUpHref,
                                                style: {
                                                  ...baseButtonStyle,
                                                  color: '#ffffff',
                                                  border: '1px solid #01695b',
                                                  background:
                                                    'linear-gradient(95deg, var(--color-action-primary, #007f60), var(--color-action-primary-hover, #007666))',
                                                  boxShadow: '0 10px 22px rgba(0, 145, 110, 0.24)',
                                                },
                                                children: 'Crear cuenta',
                                              },
                                              void 0,
                                              false,
                                              {
                                                fileName:
                                                  '[project]/packages/ui-web/src/components/AppProductFooter.tsx',
                                                lineNumber: 167,
                                                columnNumber: 21,
                                              },
                                              this,
                                            ),
                                          ],
                                        },
                                        void 0,
                                        true,
                                      ),
                                ],
                              },
                              void 0,
                              true,
                            ),
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/packages/ui-web/src/components/AppProductFooter.tsx',
                          lineNumber: 148,
                          columnNumber: 11,
                        },
                        this,
                      ),
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: '[project]/packages/ui-web/src/components/AppProductFooter.tsx',
                    lineNumber: 120,
                    columnNumber: 9,
                  },
                  this,
                ),
                productLinkControls
                  ? /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                      'jsxDEV'
                    ])(
                      'div',
                      {
                        style: {
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 12,
                        },
                        children: productLinkControls,
                      },
                      void 0,
                      false,
                      {
                        fileName: '[project]/packages/ui-web/src/components/AppProductFooter.tsx',
                        lineNumber: 188,
                        columnNumber: 11,
                      },
                      this,
                    )
                  : productLinks.length > 0
                    ? /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        'div',
                        {
                          style: {
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 12,
                          },
                          children: productLinks.map((link, index) => renderLink(link, index)),
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/packages/ui-web/src/components/AppProductFooter.tsx',
                          lineNumber: 190,
                          columnNumber: 11,
                        },
                        this,
                      )
                    : null,
                legalLinkControls
                  ? /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                      'jsxDEV'
                    ])(
                      'div',
                      {
                        style: {
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 12,
                        },
                        children: legalLinkControls,
                      },
                      void 0,
                      false,
                      {
                        fileName: '[project]/packages/ui-web/src/components/AppProductFooter.tsx',
                        lineNumber: 196,
                        columnNumber: 11,
                      },
                      this,
                    )
                  : legalLinks.length > 0
                    ? /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        'div',
                        {
                          style: {
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 12,
                          },
                          children: legalLinks.map((link, index) => renderLink(link, index)),
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/packages/ui-web/src/components/AppProductFooter.tsx',
                          lineNumber: 198,
                          columnNumber: 11,
                        },
                        this,
                      )
                    : null,
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'p',
                  {
                    style: {
                      margin: 0,
                      color: 'var(--color-muted, #394448)',
                      fontFamily: '"Zilla Slab", serif',
                      fontSize: 14,
                      lineHeight: 1.5,
                    },
                    children: ['© ', year, ' ', suiteName, '. Todos los derechos reservados.'],
                  },
                  void 0,
                  true,
                  {
                    fileName: '[project]/packages/ui-web/src/components/AppProductFooter.tsx',
                    lineNumber: 203,
                    columnNumber: 9,
                  },
                  this,
                ),
              ],
            },
            void 0,
            true,
            {
              fileName: '[project]/packages/ui-web/src/components/AppProductFooter.tsx',
              lineNumber: 119,
              columnNumber: 7,
            },
            this,
          ),
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/components/AppProductFooter.tsx',
          lineNumber: 118,
          columnNumber: 5,
        },
        this,
      );
    }
  },
  '[project]/packages/ui-web/src/index.ts [app-rsc] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppButton.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppBottomTabBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppBottomTabBar.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButtonGroup$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppButtonGroup.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppDivider$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppDivider.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppBadge.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppCard.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppAlert$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppAlert.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppAvatar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppAvatar.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppEmpty$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppEmpty.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSeparator$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSeparator.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$Separator$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/Separator.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSkeleton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSkeleton.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSpinner$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSpinner.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppTypography$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppTypography.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppFrame$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppFrame.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppInput$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppInput.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppLinkAction$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppLinkAction.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProfile$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppProfile.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSelect$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSelect.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$GapView$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/GapView.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppTitle$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppTitle.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppWorkspaceShell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProviders$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppProviders.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$ProductShell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/ProductShell.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/feedback/toast/index.ts [app-rsc] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProductFooter$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppProductFooter.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/index.ts [app-rsc] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (ecmascript)',
      );
  },
  '[project]/packages/ui/src/hooks/useAppToast.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['useAppToast', () => useAppToast]);
    function useAppToast() {
      return {
        show(_title, _options) {
          void _title;
          void _options;
          // No-op: toast system removed.
        },
        success(_title, _message) {
          void _title;
          void _message;
          // No-op: toast system removed.
        },
        error(_title, _message) {
          void _title;
          void _message;
          // No-op: toast system removed.
        },
        hide() {
          // No-op: toast system removed.
        },
      };
    }
  },
  '[project]/packages/ui/src/theme.ts [app-rsc] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/index.ts [app-rsc] (ecmascript) <locals>',
      );
  },
  '[project]/packages/ui/src/index.ts [app-rsc] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/index.ts [app-rsc] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$hooks$2f$useAppToast$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui/src/hooks/useAppToast.ts [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$theme$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i('[project]/packages/ui/src/theme.ts [app-rsc] (ecmascript) <locals>');
  },
  '[project]/packages/ui-web/src/index.ts [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'AppAlert',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppAlert$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppAlert'
        ],
      'AppAvatar',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppAvatar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppAvatar'
        ],
      'AppBadge',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppBadge'
        ],
      'AppBottomTabBar',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppBottomTabBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppBottomTabBar'
        ],
      'AppButton',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppButton'
        ],
      'AppButtonGroup',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButtonGroup$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppButtonGroup'
        ],
      'AppCard',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppCard'
        ],
      'AppDivider',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppDivider$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppDivider'
        ],
      'AppEmpty',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppEmpty$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppEmpty'
        ],
      'AppFrame',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppFrame$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppFrame'
        ],
      'AppInput',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppInput$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppInput'
        ],
      'AppLinkAction',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppLinkAction$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppLinkAction'
        ],
      'AppProductFooter',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProductFooter$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppProductFooter'
        ],
      'AppProfile',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProfile$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppProfile'
        ],
      'AppProviders',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProviders$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppProviders'
        ],
      'AppSelect',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSelect$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppSelect'
        ],
      'AppSeparator',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSeparator$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppSeparator'
        ],
      'AppSkeleton',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSkeleton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppSkeleton'
        ],
      'AppSpinner',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSpinner$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppSpinner'
        ],
      'AppTitle',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppTitle$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppTitle'
        ],
      'AppTypography',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppTypography$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppTypography'
        ],
      'AppWorkspaceShell',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppWorkspaceShell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'AppWorkspaceShell'
        ],
      'Ban',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__[
          'Ban'
        ],
      'Banknote',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$banknote$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Banknote$3e$__[
          'Banknote'
        ],
      'CalendarClock',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__[
          'CalendarClock'
        ],
      'CheckCircle2',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__[
          'CheckCircle2'
        ],
      'CreditCard',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__[
          'CreditCard'
        ],
      'GapView',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$GapView$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'GapView'
        ],
      'Gauge',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__[
          'Gauge'
        ],
      'Inbox',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__[
          'Inbox'
        ],
      'Link2',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__[
          'Link2'
        ],
      'ListChecks',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$checks$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ListChecks$3e$__[
          'ListChecks'
        ],
      'PauseCircle',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$pause$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__PauseCircle$3e$__[
          'PauseCircle'
        ],
      'ProductShell',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$ProductShell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'ProductShell'
        ],
      'ReceiptText',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2d$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ReceiptText$3e$__[
          'ReceiptText'
        ],
      'RefreshCcw',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$ccw$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCcw$3e$__[
          'RefreshCcw'
        ],
      'Repeat2',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat2$3e$__[
          'Repeat2'
        ],
      'Search',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__[
          'Search'
        ],
      'Separator',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$Separator$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'Separator'
        ],
      'ThemeProvider',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'ThemeProvider'
        ],
      'ToastProvider',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$provider$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'ToastProvider'
        ],
      'Trash2',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__[
          'Trash2'
        ],
      'appProductFooterButtonStyle',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProductFooter$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'appProductFooterButtonStyle'
        ],
      'appProductFooterTextLinkStyle',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProductFooter$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'appProductFooterTextLinkStyle'
        ],
      'buttonLabelRecipe',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'buttonLabelRecipe'
        ],
      'buttonRecipe',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'buttonRecipe'
        ],
      'cardRecipe',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'cardRecipe'
        ],
      'cx',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'cx'
        ],
      'inputRecipe',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'inputRecipe'
        ],
      'notify',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'notify'
        ],
      'pageContainerRecipe',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'pageContainerRecipe'
        ],
      'suitTheme',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$tokens$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'suitTheme'
        ],
      'useAppTheme',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
          'useAppTheme'
        ],
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/index.ts [app-rsc] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppButton.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppBottomTabBar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppBottomTabBar.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButtonGroup$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppButtonGroup.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppDivider$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppDivider.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppBadge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppBadge.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppCard.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppAlert$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppAlert.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppAvatar$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppAvatar.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppEmpty$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppEmpty.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSeparator$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSeparator.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$Separator$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/Separator.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSkeleton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSkeleton.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSpinner$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSpinner.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppTypography$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppTypography.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppFrame$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppFrame.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppInput$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppInput.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppLinkAction$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppLinkAction.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProfile$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppProfile.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSelect$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSelect.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$GapView$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/GapView.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppTitle$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppTitle.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppWorkspaceShell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProviders$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppProviders.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$ProductShell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/ProductShell.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$provider$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/feedback/toast/toast.provider.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/feedback/toast/toast.service.ts [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProductFooter$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppProductFooter.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/ban.js [app-rsc] (ecmascript) <export default as Ban>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$banknote$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Banknote$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/banknote.js [app-rsc] (ecmascript) <export default as Banknote>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/calendar-clock.js [app-rsc] (ecmascript) <export default as CalendarClock>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-rsc] (ecmascript) <export default as CheckCircle2>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-rsc] (ecmascript) <export default as CreditCard>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/gauge.js [app-rsc] (ecmascript) <export default as Gauge>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/inbox.js [app-rsc] (ecmascript) <export default as Inbox>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/link-2.js [app-rsc] (ecmascript) <export default as Link2>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$checks$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ListChecks$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/list-checks.js [app-rsc] (ecmascript) <export default as ListChecks>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$pause$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__PauseCircle$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/circle-pause.js [app-rsc] (ecmascript) <export default as PauseCircle>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2d$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ReceiptText$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/receipt-text.js [app-rsc] (ecmascript) <export default as ReceiptText>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$ccw$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCcw$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/refresh-ccw.js [app-rsc] (ecmascript) <export default as RefreshCcw>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat2$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/repeat-2.js [app-rsc] (ecmascript) <export default as Repeat2>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/search.js [app-rsc] (ecmascript) <export default as Search>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-rsc] (ecmascript) <export default as Trash2>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$tokens$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/tokens.ts [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/recipes.ts [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-rsc] (ecmascript)',
      );
  },
  '[project]/packages/ui/src/app-providers.ts [app-rsc] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/index.ts [app-rsc] (ecmascript) <locals>',
      );
  },
  '[next]/internal/font/google/amaranth_d265ffec.module.css [app-rsc] (css module)',
  (__turbopack_context__) => {
    __turbopack_context__.v({
      className: 'amaranth_d265ffec-module__KDV0ma__className',
      variable: 'amaranth_d265ffec-module__KDV0ma__variable',
    });
  },
  '[next]/internal/font/google/amaranth_d265ffec.js [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['default', () => __TURBOPACK__default__export__]);
    var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$amaranth_d265ffec$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ =
      __turbopack_context__.i(
        '[next]/internal/font/google/amaranth_d265ffec.module.css [app-rsc] (css module)',
      );
    const fontData = {
      className:
        __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$amaranth_d265ffec$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__[
          'default'
        ].className,
      style: {
        fontFamily: "'Amaranth', 'Amaranth Fallback'",
        fontStyle: 'normal',
      },
    };
    if (
      __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$amaranth_d265ffec$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__[
        'default'
      ].variable != null
    ) {
      fontData.variable =
        __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$amaranth_d265ffec$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__[
          'default'
        ].variable;
    }
    const __TURBOPACK__default__export__ = fontData;
  },
  '[next]/internal/font/google/arvo_64345f9a.module.css [app-rsc] (css module)',
  (__turbopack_context__) => {
    __turbopack_context__.v({
      className: 'arvo_64345f9a-module__XxeC0q__className',
      variable: 'arvo_64345f9a-module__XxeC0q__variable',
    });
  },
  '[next]/internal/font/google/arvo_64345f9a.js [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['default', () => __TURBOPACK__default__export__]);
    var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$arvo_64345f9a$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ =
      __turbopack_context__.i(
        '[next]/internal/font/google/arvo_64345f9a.module.css [app-rsc] (css module)',
      );
    const fontData = {
      className:
        __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$arvo_64345f9a$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__[
          'default'
        ].className,
      style: {
        fontFamily: "'Arvo', 'Arvo Fallback'",
        fontStyle: 'normal',
      },
    };
    if (
      __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$arvo_64345f9a$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__[
        'default'
      ].variable != null
    ) {
      fontData.variable =
        __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$arvo_64345f9a$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__[
          'default'
        ].variable;
    }
    const __TURBOPACK__default__export__ = fontData;
  },
  '[next]/internal/font/google/zilla_slab_eb17f931.module.css [app-rsc] (css module)',
  (__turbopack_context__) => {
    __turbopack_context__.v({
      className: 'zilla_slab_eb17f931-module__s8_E1q__className',
      variable: 'zilla_slab_eb17f931-module__s8_E1q__variable',
    });
  },
  '[next]/internal/font/google/zilla_slab_eb17f931.js [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['default', () => __TURBOPACK__default__export__]);
    var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$zilla_slab_eb17f931$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__ =
      __turbopack_context__.i(
        '[next]/internal/font/google/zilla_slab_eb17f931.module.css [app-rsc] (css module)',
      );
    const fontData = {
      className:
        __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$zilla_slab_eb17f931$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__[
          'default'
        ].className,
      style: {
        fontFamily: "'Zilla Slab', 'Zilla Slab Fallback'",
        fontStyle: 'normal',
      },
    };
    if (
      __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$zilla_slab_eb17f931$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__[
        'default'
      ].variable != null
    ) {
      fontData.variable =
        __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$zilla_slab_eb17f931$2e$module$2e$css__$5b$app$2d$rsc$5d$__$28$css__module$29$__[
          'default'
        ].variable;
    }
    const __TURBOPACK__default__export__ = fontData;
  },
  '[project]/apps/seven-rc-web/components/role-switch.tsx [app-rsc] (client reference proxy) <module evaluation>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['RoleSwitch', () => RoleSwitch]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const RoleSwitch = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call RoleSwitch() from the server but RoleSwitch is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/apps/seven-rc-web/components/role-switch.tsx <module evaluation>',
      'RoleSwitch',
    );
  },
  '[project]/apps/seven-rc-web/components/role-switch.tsx [app-rsc] (client reference proxy)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['RoleSwitch', () => RoleSwitch]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const RoleSwitch = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call RoleSwitch() from the server but RoleSwitch is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/apps/seven-rc-web/components/role-switch.tsx',
      'RoleSwitch',
    );
  },
  '[project]/apps/seven-rc-web/components/role-switch.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$role$2d$switch$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/components/role-switch.tsx [app-rsc] (client reference proxy) <module evaluation>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$role$2d$switch$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/components/role-switch.tsx [app-rsc] (client reference proxy)',
      );
    __turbopack_context__.n(
      __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$role$2d$switch$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__,
    );
  },
  '[project]/apps/seven-rc-web/components/seven-rc-client-providers.tsx [app-rsc] (client reference proxy) <module evaluation>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['SevenRcClientProviders', () => SevenRcClientProviders]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const SevenRcClientProviders = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call SevenRcClientProviders() from the server but SevenRcClientProviders is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/apps/seven-rc-web/components/seven-rc-client-providers.tsx <module evaluation>',
      'SevenRcClientProviders',
    );
  },
  '[project]/apps/seven-rc-web/components/seven-rc-client-providers.tsx [app-rsc] (client reference proxy)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['SevenRcClientProviders', () => SevenRcClientProviders]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const SevenRcClientProviders = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call SevenRcClientProviders() from the server but SevenRcClientProviders is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/apps/seven-rc-web/components/seven-rc-client-providers.tsx',
      'SevenRcClientProviders',
    );
  },
  '[project]/apps/seven-rc-web/components/seven-rc-client-providers.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$seven$2d$rc$2d$client$2d$providers$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/components/seven-rc-client-providers.tsx [app-rsc] (client reference proxy) <module evaluation>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$seven$2d$rc$2d$client$2d$providers$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/components/seven-rc-client-providers.tsx [app-rsc] (client reference proxy)',
      );
    __turbopack_context__.n(
      __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$seven$2d$rc$2d$client$2d$providers$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__,
    );
  },
  '[project]/apps/seven-rc-web/components/sign-out-control.tsx [app-rsc] (client reference proxy) <module evaluation>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['SignOutControl', () => SignOutControl]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const SignOutControl = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call SignOutControl() from the server but SignOutControl is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/apps/seven-rc-web/components/sign-out-control.tsx <module evaluation>',
      'SignOutControl',
    );
  },
  '[project]/apps/seven-rc-web/components/sign-out-control.tsx [app-rsc] (client reference proxy)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['SignOutControl', () => SignOutControl]);
    // This file is generated by next-core EcmascriptClientReferenceModule.
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)',
      );
    const SignOutControl = (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
      'registerClientReference'
    ])(
      function () {
        throw new Error(
          "Attempted to call SignOutControl() from the server but SignOutControl is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.",
        );
      },
      '[project]/apps/seven-rc-web/components/sign-out-control.tsx',
      'SignOutControl',
    );
  },
  '[project]/apps/seven-rc-web/components/sign-out-control.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$sign$2d$out$2d$control$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/components/sign-out-control.tsx [app-rsc] (client reference proxy) <module evaluation>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$sign$2d$out$2d$control$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/components/sign-out-control.tsx [app-rsc] (client reference proxy)',
      );
    __turbopack_context__.n(
      __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$sign$2d$out$2d$control$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__,
    );
  },
  '[project]/apps/seven-rc-web/app/layout.tsx [app-rsc] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['default', () => RootLayout, 'metadata', () => metadata]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$auth$2f$next$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/core/src/auth/next.tsx [app-rsc] (ecmascript)');
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i('[project]/packages/ui/src/index.ts [app-rsc] (ecmascript) <locals>');
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/ui-web/src/index.ts [app-rsc] (ecmascript)');
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$app$2d$providers$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui/src/app-providers.ts [app-rsc] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProviders$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppProviders.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@clerk+nextjs@6.37.5_next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwrigh_7fc3a0f00d05671a4e13335581eb0f57/node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$amaranth_d265ffec$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[next]/internal/font/google/amaranth_d265ffec.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$arvo_64345f9a$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[next]/internal/font/google/arvo_64345f9a.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$zilla_slab_eb17f931$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[next]/internal/font/google/zilla_slab_eb17f931.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$role$2d$switch$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/components/role-switch.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$seven$2d$rc$2d$client$2d$providers$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/components/seven-rc-client-providers.tsx [app-rsc] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$sign$2d$out$2d$control$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/components/sign-out-control.tsx [app-rsc] (ecmascript)',
      );
    const metadata = {
      title: 'Seven Reservations Club | 17Suit',
      description:
        'Reserva canchas eligiendo un horario libre y recibe la confirmación del complejo, sin cadenas de WhatsApp.',
      icons: {
        icon: [
          {
            url: '/icon-17suit.ico',
            type: 'image/x-icon',
          },
          {
            url: '/icon-17suit.png',
            type: 'image/png',
            sizes: '200x200',
          },
        ],
        shortcut: '/icon-17suit.ico',
        apple: '/icon-17suit.png',
      },
    };
    const footerButton = (intent) =>
      (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'buttonRecipe'
      ])({
        intent,
        size: 'sm',
        platform: 'web',
        fullWidth: false,
      });
    async function RootLayout({ children }) {
      const { userId } = await (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'auth'
      ])();
      const isSignedIn = Boolean(userId);
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'html',
        {
          lang: 'es',
          className: `${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$amaranth_d265ffec$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__['default'].variable} ${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$arvo_64345f9a$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__['default'].variable} ${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$zilla_slab_eb17f931$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__['default'].variable}`,
          children: /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            'body',
            {
              children: /*#__PURE__*/ (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                'jsxDEV'
              ])(
                __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$auth$2f$next$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                  'WebAuthProvider'
                ],
                {
                  children: /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProviders$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                      'AppProviders'
                    ],
                    {
                      children: /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$seven$2d$rc$2d$client$2d$providers$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                          'SevenRcClientProviders'
                        ],
                        {
                          children: [
                            isSignedIn
                              ? /*#__PURE__*/ (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                  'jsxDEV'
                                ])(
                                  'header',
                                  {
                                    className: 'bg-background px-lg pt-sm',
                                    children: /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                      'jsxDEV'
                                    ])(
                                      'div',
                                      {
                                        className:
                                          'mx-auto flex w-full max-w-[var(--container-content)] flex-wrap justify-end gap-sm',
                                        children: [
                                          /*#__PURE__*/ (0,
                                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                            'jsxDEV'
                                          ])(
                                            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$role$2d$switch$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                              'RoleSwitch'
                                            ],
                                            {},
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                '[project]/apps/seven-rc-web/app/layout.tsx',
                                              lineNumber: 65,
                                              columnNumber: 21,
                                            },
                                            this,
                                          ),
                                          /*#__PURE__*/ (0,
                                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                            'jsxDEV'
                                          ])(
                                            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$sign$2d$out$2d$control$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                              'SignOutControl'
                                            ],
                                            {
                                              className: footerButton('secondary'),
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                '[project]/apps/seven-rc-web/app/layout.tsx',
                                              lineNumber: 66,
                                              columnNumber: 21,
                                            },
                                            this,
                                          ),
                                        ],
                                      },
                                      void 0,
                                      true,
                                      {
                                        fileName: '[project]/apps/seven-rc-web/app/layout.tsx',
                                        lineNumber: 64,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: '[project]/apps/seven-rc-web/app/layout.tsx',
                                    lineNumber: 63,
                                    columnNumber: 17,
                                  },
                                  this,
                                )
                              : null,
                            children,
                            /*#__PURE__*/ (0,
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                              'jsxDEV'
                            ])(
                              __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                'AppProductFooter'
                              ],
                              {
                                productName: 'Seven Reservations Club',
                                productSlug: 'seven-reservations-club',
                                productTagline:
                                  'Reservas de canchas y agenda para complejos deportivos.',
                                suiteName: '17Suit',
                                actionControls: isSignedIn
                                  ? /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                      'jsxDEV'
                                    ])(
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                        'Fragment'
                                      ],
                                      {
                                        children: [
                                          /*#__PURE__*/ (0,
                                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                            'jsxDEV'
                                          ])(
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                              'default'
                                            ],
                                            {
                                              href: '/',
                                              className: footerButton('secondary'),
                                              children: 'Ir a mi panel',
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                '[project]/apps/seven-rc-web/app/layout.tsx',
                                              lineNumber: 79,
                                              columnNumber: 23,
                                            },
                                            void 0,
                                          ),
                                          /*#__PURE__*/ (0,
                                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                            'jsxDEV'
                                          ])(
                                            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$sign$2d$out$2d$control$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                              'SignOutControl'
                                            ],
                                            {
                                              className: footerButton('secondary'),
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                '[project]/apps/seven-rc-web/app/layout.tsx',
                                              lineNumber: 82,
                                              columnNumber: 23,
                                            },
                                            void 0,
                                          ),
                                        ],
                                      },
                                      void 0,
                                      true,
                                    )
                                  : /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                      'jsxDEV'
                                    ])(
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                        'Fragment'
                                      ],
                                      {
                                        children: [
                                          /*#__PURE__*/ (0,
                                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                            'jsxDEV'
                                          ])(
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                              'default'
                                            ],
                                            {
                                              href: '/sign-in?redirect_url=/',
                                              className: footerButton('secondary'),
                                              children: 'Iniciar sesión',
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                '[project]/apps/seven-rc-web/app/layout.tsx',
                                              lineNumber: 86,
                                              columnNumber: 23,
                                            },
                                            void 0,
                                          ),
                                          /*#__PURE__*/ (0,
                                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                            'jsxDEV'
                                          ])(
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__[
                                              'default'
                                            ],
                                            {
                                              href: '/sign-up?redirect_url=/',
                                              className: footerButton('primary'),
                                              children: 'Crear cuenta',
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                '[project]/apps/seven-rc-web/app/layout.tsx',
                                              lineNumber: 89,
                                              columnNumber: 23,
                                            },
                                            void 0,
                                          ),
                                        ],
                                      },
                                      void 0,
                                      true,
                                    ),
                              },
                              void 0,
                              false,
                              {
                                fileName: '[project]/apps/seven-rc-web/app/layout.tsx',
                                lineNumber: 71,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: '[project]/apps/seven-rc-web/app/layout.tsx',
                          lineNumber: 61,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/apps/seven-rc-web/app/layout.tsx',
                      lineNumber: 60,
                      columnNumber: 11,
                    },
                    this,
                  ),
                },
                void 0,
                false,
                {
                  fileName: '[project]/apps/seven-rc-web/app/layout.tsx',
                  lineNumber: 59,
                  columnNumber: 9,
                },
                this,
              ),
            },
            void 0,
            false,
            {
              fileName: '[project]/apps/seven-rc-web/app/layout.tsx',
              lineNumber: 58,
              columnNumber: 7,
            },
            this,
          ),
        },
        void 0,
        false,
        {
          fileName: '[project]/apps/seven-rc-web/app/layout.tsx',
          lineNumber: 57,
          columnNumber: 5,
        },
        this,
      );
    }
  },
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cfc6e3d2._.js.map
