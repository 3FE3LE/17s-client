(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  typeof document === 'object' ? document.currentScript : undefined,
  '[project]/packages/design-system/src/tokens.ts [app-client] (ecmascript)',
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
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/design-system/src/recipes.ts [app-client] (ecmascript)',
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
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/design-system/src/index.ts [app-client] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/tokens.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/recipes.ts [app-client] (ecmascript)',
      );
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'ThemeProvider',
      () => ThemeProvider,
      'useAppTheme',
      () => useAppTheme,
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/index.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/tokens.ts [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature(),
      _s1 = __turbopack_context__.k.signature();
    ('use client');
    const ThemeContext = /*#__PURE__*/ (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
      'createContext'
    ])(null);
    // The resolved scheme follows the `.dark` class on <html> (the same switch the CSS
    // tokens use), so inline JS styles never disagree with Tailwind/CSS tokens.
    // Server and first client render both report 'light' (the CSS default).
    function getSystemScheme() {
      if (typeof document === 'undefined') {
        return 'light';
      }
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    function getServerScheme() {
      return 'light';
    }
    function subscribeToSystemScheme(onChange) {
      if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
        return () => {};
      }
      const observer = new MutationObserver(onChange);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
      return () => observer.disconnect();
    }
    function ThemeProvider({ initialMode = 'system', mode, onModeChange, children }) {
      _s();
      const [internalMode, setInternalMode] = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useState'
      ])(initialMode);
      const systemMode = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useSyncExternalStore'
      ])(subscribeToSystemScheme, getSystemScheme, getServerScheme);
      const effectiveMode = mode ?? internalMode;
      const resolvedMode = effectiveMode === 'system' ? systemMode : effectiveMode;
      const theme = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMemo'
      ])(
        {
          'ThemeProvider.useMemo[theme]': () =>
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'getSuitTheme'
            ])(resolvedMode),
        }['ThemeProvider.useMemo[theme]'],
        [resolvedMode],
      );
      const setMode = (nextMode) => {
        if (mode) {
          onModeChange?.(nextMode);
          return;
        }
        setInternalMode(nextMode);
      };
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        ThemeContext.Provider,
        {
          value: {
            theme,
            mode: effectiveMode,
            resolvedMode,
            setMode,
          },
          children: children,
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/theme/theme-context.tsx',
          lineNumber: 73,
          columnNumber: 5,
        },
        this,
      );
    }
    _s(ThemeProvider, 'NH7jpqb1XAEfdu1OlugucmcfTWs=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useSyncExternalStore'
        ],
      ];
    });
    _c = ThemeProvider;
    function useAppTheme() {
      _s1();
      const context = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useContext'
      ])(ThemeContext);
      if (!context) {
        return {
          theme: (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'getSuitTheme'
          ])('light'),
          mode: 'system',
          resolvedMode: 'light',
          setMode: () => {},
        };
      }
      return context;
    }
    _s1(useAppTheme, 'b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=');
    var _c;
    __turbopack_context__.k.register(_c, 'ThemeProvider');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppBadge.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppBadge', () => AppBadge]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    ('use client');
    function AppBadge({
      children,
      variant = 'neutral',
      size = 'sm',
      rounded = true,
      style,
      ...rest
    }) {
      _s();
      const { theme, resolvedMode } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const captionType = theme.typography.styles.caption;
      // Text on the saturated destructive/info fills (WCAG AA, 4.5:1 for caption text):
      // light #e10812 / #1876ae need pure white (4.95:1; brandLight #f0f0f0 was 4.34:1).
      // dark #f8333c / #1e91d6 fail with any light text (white 3.80 / 3.46:1), so they
      // take brandDark (4.84 / 5.32:1). The other fills already pass with brandDark
      // (primary 7.11, success 6.64, warning 7.26, neutral 11.8:1).
      const onSaturatedFill = resolvedMode === 'light' ? '#ffffff' : theme.colors.brandDark;
      const variantStyles = {
        primary: {
          backgroundColor: theme.colors.brandPrimary,
          color: theme.colors.brandDark,
        },
        success: {
          backgroundColor: theme.colors.success,
          color: theme.colors.brandDark,
        },
        destructive: {
          backgroundColor: theme.colors.destructive,
          color: onSaturatedFill,
        },
        warning: {
          backgroundColor: theme.colors.warning,
          color: theme.colors.brandDark,
        },
        info: {
          backgroundColor: theme.colors.info,
          color: onSaturatedFill,
        },
        neutral: {
          backgroundColor: theme.grayscale[3],
          color: theme.colors.brandDark,
        },
      };
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'span',
        {
          ...rest,
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding:
              size === 'sm'
                ? `${theme.spacing.xs}px ${theme.spacing.sm}px`
                : `${theme.spacing.sm}px ${theme.spacing.md}px`,
            borderRadius: rounded ? theme.borderRadius.full : theme.borderRadius.sm,
            fontFamily: captionType.webFamily,
            fontWeight: captionType.fontWeight,
            fontSize: captionType.fontSize,
            lineHeight: captionType.lineHeightRecommended,
            letterSpacing: captionType.letterSpacingEm,
            whiteSpace: 'nowrap',
            backgroundColor: variantStyles[variant].backgroundColor,
            color: variantStyles[variant].color,
            ...style,
          },
          children: children,
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/components/AppBadge.tsx',
          lineNumber: 60,
          columnNumber: 5,
        },
        this,
      );
    }
    _s(AppBadge, 'ELBfi0oDSN4Mc7eQODTbHFsyJJI=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useAppTheme'
        ],
      ];
    });
    _c = AppBadge;
    var _c;
    __turbopack_context__.k.register(_c, 'AppBadge');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppAvatar.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppAvatar', () => AppAvatar]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    ('use client');
    function initialsFromName(name) {
      const tokens = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
      return tokens.map((token) => token[0]?.toUpperCase() ?? '').join('') || 'U';
    }
    function AppAvatar({ src, alt, name, size = 40, shape = 'circle', style, ...rest }) {
      _s();
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const subtitleType = theme.typography.styles.subtitle2;
      const initials = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMemo'
      ])(
        {
          'AppAvatar.useMemo[initials]': () => initialsFromName(name ?? alt ?? 'User'),
        }['AppAvatar.useMemo[initials]'],
        [alt, name],
      );
      const borderRadius = shape === 'circle' ? theme.borderRadius.full : theme.borderRadius.md;
      if (src) {
        return /*#__PURE__*/ (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'jsxDEV'
        ])(
          'img',
          {
            ...rest,
            src: src,
            alt: alt ?? name ?? 'Avatar',
            style: {
              width: size,
              height: size,
              borderRadius,
              objectFit: 'cover',
              border: `1px solid ${theme.grayscale[3]}`,
              ...style,
            },
          },
          void 0,
          false,
          {
            fileName: '[project]/packages/ui-web/src/components/AppAvatar.tsx',
            lineNumber: 40,
            columnNumber: 7,
          },
          this,
        );
      }
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'span',
        {
          'aria-label': alt ?? name ?? 'Avatar',
          style: {
            width: size,
            height: size,
            borderRadius,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${theme.grayscale[3]}`,
            backgroundColor: theme.grayscale[4],
            color: theme.colors.brandDark,
            fontFamily: subtitleType.webFamily,
            fontWeight: subtitleType.fontWeight,
            fontSize: Math.max(12, Math.floor(size * 0.38)),
            lineHeight: 1,
            letterSpacing: subtitleType.letterSpacingEm,
            ...style,
          },
          children: initials,
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/components/AppAvatar.tsx',
          lineNumber: 57,
          columnNumber: 5,
        },
        this,
      );
    }
    _s(AppAvatar, 'WdMPgb0GIGCgE/fU+dGrOgLFRgM=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useAppTheme'
        ],
      ];
    });
    _c = AppAvatar;
    var _c;
    __turbopack_context__.k.register(_c, 'AppAvatar');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppInput.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppInput', () => AppInput]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/index.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/recipes.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    ('use client');
    function AppInput({
      value,
      onChangeText,
      label,
      placeholder,
      error = false,
      compact = false,
      disabled = false,
      leftIcon,
      rightIcon,
      onRightIconPress,
      showPasswordToggle = true,
      keyboardType,
      autoCapitalize,
      secureTextEntry,
      type,
      id,
      ...rest
    }) {
      _s();
      void keyboardType;
      void autoCapitalize;
      const [isPasswordVisible, setIsPasswordVisible] = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useState'
      ])(false);
      const generatedId = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useId'
      ])();
      const inputId = id ?? generatedId;
      const isPasswordField = secureTextEntry || type === 'password';
      const shouldShowPasswordToggle = isPasswordField && showPasswordToggle;
      const resolvedType = shouldShowPasswordToggle
        ? isPasswordVisible
          ? 'text'
          : 'password'
        : secureTextEntry && !type
          ? 'password'
          : type;
      const resolvedLabel = label ?? placeholder;
      const hasRightAction = Boolean(shouldShowPasswordToggle || rightIcon);
      const inputClasses = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'inputRecipe'
      ])({
        state: error ? 'error' : disabled ? 'disabled' : 'default',
        compact,
        hasLeftAccessory: Boolean(leftIcon),
        hasRightAccessory: hasRightAction,
        platform: 'web',
      });
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          className: inputClasses.root,
          children: [
            resolvedLabel
              ? /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'label',
                  {
                    htmlFor: inputId,
                    className: inputClasses.fieldLabel,
                    children: resolvedLabel,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/packages/ui-web/src/components/AppInput.tsx',
                    lineNumber: 74,
                    columnNumber: 9,
                  },
                  this,
                )
              : null,
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'div',
              {
                className: 'relative w-full',
                children: [
                  leftIcon
                    ? /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        'span',
                        {
                          className:
                            'absolute left-3 top-1/2 inline-flex -translate-y-1/2 items-center text-muted',
                          children: leftIcon,
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/packages/ui-web/src/components/AppInput.tsx',
                          lineNumber: 80,
                          columnNumber: 11,
                        },
                        this,
                      )
                    : null,
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'input',
                    {
                      ...rest,
                      id: inputId,
                      value: value,
                      placeholder: placeholder,
                      disabled: disabled,
                      'aria-invalid': error,
                      type: resolvedType,
                      className: (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        'cx'
                      ])(inputClasses.control, disabled && 'cursor-not-allowed'),
                      onChange: (event) => onChangeText(event.target.value),
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/packages/ui-web/src/components/AppInput.tsx',
                      lineNumber: 84,
                      columnNumber: 9,
                    },
                    this,
                  ),
                  shouldShowPasswordToggle
                    ? /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        'button',
                        {
                          type: 'button',
                          onClick: () => setIsPasswordVisible((current) => !current),
                          className:
                            'absolute right-0 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-muted',
                          'aria-label': isPasswordVisible
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña',
                          children: isPasswordVisible
                            ? /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__[
                                  'EyeOff'
                                ],
                                {
                                  size: 16,
                                },
                                void 0,
                                false,
                                {
                                  fileName: '[project]/packages/ui-web/src/components/AppInput.tsx',
                                  lineNumber: 110,
                                  columnNumber: 34,
                                },
                                this,
                              )
                            : /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__[
                                  'Eye'
                                ],
                                {
                                  size: 16,
                                },
                                void 0,
                                false,
                                {
                                  fileName: '[project]/packages/ui-web/src/components/AppInput.tsx',
                                  lineNumber: 110,
                                  columnNumber: 57,
                                },
                                this,
                              ),
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/packages/ui-web/src/components/AppInput.tsx',
                          lineNumber: 104,
                          columnNumber: 11,
                        },
                        this,
                      )
                    : null,
                  !shouldShowPasswordToggle && rightIcon
                    ? /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        'button',
                        {
                          type: 'button',
                          onClick: onRightIconPress,
                          className:
                            'absolute right-0 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-muted',
                          style: {
                            cursor: onRightIconPress ? 'pointer' : 'default',
                          },
                          'aria-label': 'Acción del campo',
                          children: rightIcon,
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/packages/ui-web/src/components/AppInput.tsx',
                          lineNumber: 114,
                          columnNumber: 11,
                        },
                        this,
                      )
                    : null,
                ],
              },
              void 0,
              true,
              {
                fileName: '[project]/packages/ui-web/src/components/AppInput.tsx',
                lineNumber: 78,
                columnNumber: 7,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/packages/ui-web/src/components/AppInput.tsx',
          lineNumber: 72,
          columnNumber: 5,
        },
        this,
      );
    }
    _s(AppInput, 'Yd25NZcy2r01JCKHseGWt/7xpm4=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useId'
        ],
      ];
    });
    _c = AppInput;
    var _c;
    __turbopack_context__.k.register(_c, 'AppInput');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppSelect.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppSelect', () => AppSelect]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    ('use client');
    function AppSelect({
      value,
      onChangeValue,
      options,
      label,
      placeholder = 'Seleccionar',
      error = false,
      disabled = false,
      ...rest
    }) {
      _s();
      const [open, setOpen] = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useState'
      ])(false);
      const triggerId = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useId'
      ])();
      const rootRef = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useRef'
      ])(null);
      const resolvedLabel = label ?? placeholder;
      const selectedOption = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMemo'
      ])(
        {
          'AppSelect.useMemo[selectedOption]': () =>
            options.find(
              {
                'AppSelect.useMemo[selectedOption]': (option) => option.value === value,
              }['AppSelect.useMemo[selectedOption]'],
            ) ?? null,
        }['AppSelect.useMemo[selectedOption]'],
        [options, value],
      );
      if (value.trim().length > 0 && selectedOption === null) {
        throw new Error(`[AppSelect] Received value "${value}" that is not present in options.`);
      }
      // eslint-disable-next-line no-restricted-syntax -- outside-click + escape listener; standard useEffect idiom
      (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useEffect'
      ])(
        {
          'AppSelect.useEffect': () => {
            if (!open) return;
            const onPointerDown = {
              'AppSelect.useEffect.onPointerDown': (event) => {
                const root = rootRef.current;
                if (!root) return;
                if (!root.contains(event.target)) {
                  setOpen(false);
                }
              },
            }['AppSelect.useEffect.onPointerDown'];
            const onEscape = {
              'AppSelect.useEffect.onEscape': (event) => {
                if (event.key === 'Escape') {
                  setOpen(false);
                }
              },
            }['AppSelect.useEffect.onEscape'];
            window.addEventListener('pointerdown', onPointerDown);
            window.addEventListener('keydown', onEscape);
            return {
              'AppSelect.useEffect': () => {
                window.removeEventListener('pointerdown', onPointerDown);
                window.removeEventListener('keydown', onEscape);
              },
            }['AppSelect.useEffect'];
          },
        }['AppSelect.useEffect'],
        [open],
      );
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          ref: rootRef,
          className: 'relative grid w-full gap-xs',
          children: [
            resolvedLabel
              ? /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'label',
                  {
                    htmlFor: triggerId,
                    className: 'font-zilla text-sm leading-[1.5] tracking-normal text-muted',
                    children: resolvedLabel,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/packages/ui-web/src/components/AppSelect.tsx',
                    lineNumber: 77,
                    columnNumber: 9,
                  },
                  this,
                )
              : null,
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'select',
              {
                ...rest,
                value: value,
                onChange: (event) => onChangeValue(event.target.value),
                tabIndex: -1,
                'aria-hidden': true,
                style: {
                  position: 'absolute',
                  width: 0,
                  height: 0,
                  opacity: 0,
                  pointerEvents: 'none',
                },
                children: [
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'option',
                    {
                      value: '',
                      disabled: true,
                      children: placeholder,
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/packages/ui-web/src/components/AppSelect.tsx',
                      lineNumber: 99,
                      columnNumber: 9,
                    },
                    this,
                  ),
                  options.map((option) =>
                    /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                      'jsxDEV'
                    ])(
                      'option',
                      {
                        value: option.value,
                        children: option.label,
                      },
                      `hidden-${option.value}`,
                      false,
                      {
                        fileName: '[project]/packages/ui-web/src/components/AppSelect.tsx',
                        lineNumber: 103,
                        columnNumber: 11,
                      },
                      this,
                    ),
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: '[project]/packages/ui-web/src/components/AppSelect.tsx',
                lineNumber: 85,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'button',
              {
                id: triggerId,
                type: 'button',
                disabled: disabled,
                'aria-haspopup': 'listbox',
                'aria-expanded': open,
                onClick: () => setOpen((current) => !current),
                className: `flex min-h-11 w-full items-center justify-between gap-sm rounded-[var(--radius-control)] border bg-surface px-3 text-left font-zilla text-md leading-[1.5] tracking-normal ${error ? 'border-destructive' : 'border-border-strong'} ${disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'} ${selectedOption ? 'text-text' : 'text-muted'}`,
                children: [
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'span',
                    {
                      className: 'flex-1 overflow-hidden text-ellipsis whitespace-nowrap',
                      children: selectedOption?.label ?? placeholder,
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/packages/ui-web/src/components/AppSelect.tsx',
                      lineNumber: 122,
                      columnNumber: 9,
                    },
                    this,
                  ),
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'span',
                    {
                      'aria-hidden': true,
                      children: open ? '▲' : '▼',
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/packages/ui-web/src/components/AppSelect.tsx',
                      lineNumber: 125,
                      columnNumber: 9,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: '[project]/packages/ui-web/src/components/AppSelect.tsx',
                lineNumber: 109,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'div',
              {
                role: 'listbox',
                'aria-hidden': !open,
                className:
                  'overflow-hidden rounded-[var(--radius-md)] border border-border-default bg-background',
                style: {
                  maxHeight: open ? 280 : 0,
                  opacity: open ? 1 : 0,
                  transform: open ? 'translateY(0)' : 'translateY(-6px)',
                  transition: 'max-height 180ms ease, opacity 140ms ease, transform 180ms ease',
                  pointerEvents: open ? 'auto' : 'none',
                },
                children: [
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'div',
                    {
                      className:
                        'border-b border-border-default px-md py-sm font-zilla text-sm leading-[1.5] tracking-normal text-text',
                      children: resolvedLabel,
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/packages/ui-web/src/components/AppSelect.tsx',
                      lineNumber: 140,
                      columnNumber: 9,
                    },
                    this,
                  ),
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'div',
                    {
                      className: 'max-h-[220px] overflow-y-auto py-xs',
                      children: options.map((option) => {
                        const isSelected = option.value === value;
                        return /*#__PURE__*/ (0,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                          'jsxDEV'
                        ])(
                          'button',
                          {
                            type: 'button',
                            role: 'option',
                            'aria-selected': isSelected,
                            // Closed listbox stays mounted for the transition; keep it out of the tab order.
                            tabIndex: open ? 0 : -1,
                            onClick: () => {
                              onChangeValue(option.value);
                              setOpen(false);
                            },
                            className: `flex min-h-11 w-full items-center justify-between gap-sm border-0 px-md text-left font-zilla text-md leading-[1.5] tracking-normal text-text ${isSelected ? 'bg-surface' : 'bg-transparent'}`,
                            children: [
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                'span',
                                {
                                  children: option.label,
                                },
                                void 0,
                                false,
                                {
                                  fileName:
                                    '[project]/packages/ui-web/src/components/AppSelect.tsx',
                                  lineNumber: 162,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                              isSelected
                                ? /*#__PURE__*/ (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    'jsxDEV'
                                  ])(
                                    'span',
                                    {
                                      'aria-hidden': true,
                                      children: '✓',
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        '[project]/packages/ui-web/src/components/AppSelect.tsx',
                                      lineNumber: 163,
                                      columnNumber: 31,
                                    },
                                    this,
                                  )
                                : null,
                            ],
                          },
                          option.value,
                          true,
                          {
                            fileName: '[project]/packages/ui-web/src/components/AppSelect.tsx',
                            lineNumber: 147,
                            columnNumber: 15,
                          },
                          this,
                        );
                      }),
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/packages/ui-web/src/components/AppSelect.tsx',
                      lineNumber: 143,
                      columnNumber: 9,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: '[project]/packages/ui-web/src/components/AppSelect.tsx',
                lineNumber: 128,
                columnNumber: 7,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/packages/ui-web/src/components/AppSelect.tsx',
          lineNumber: 75,
          columnNumber: 5,
        },
        this,
      );
    }
    _s(AppSelect, 'cFJR+D2C/bOX0KWb8fdMceOH71w=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useId'
        ],
      ];
    });
    _c = AppSelect;
    var _c;
    __turbopack_context__.k.register(_c, 'AppSelect');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppWorkspaceShell', () => AppWorkspaceShell]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/index.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/recipes.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature(),
      _s1 = __turbopack_context__.k.signature();
    ('use client');
    // Scroll distance (px) over which the header fully shrinks.
    const SHRINK_RANGE = 160;
    function subscribeToScroll(onChange) {
      window.addEventListener('scroll', onChange, {
        passive: true,
      });
      return () => window.removeEventListener('scroll', onChange);
    }
    function subscribeToNothing() {
      return () => {};
    }
    // Continuous 0 -> 1 scroll progress over SHRINK_RANGE, without useEffect
    // (external-store subscription). Quantized so it only re-renders on a
    // meaningful change. Drives the sticky header shrink via a CSS variable.
    // Disabled (no scroll listener, constant 0) for the compact density, whose
    // header is neither sticky nor shrinking.
    function useScrollShrinkProgress(enabled) {
      _s();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useSyncExternalStore'
      ])(
        enabled ? subscribeToScroll : subscribeToNothing,
        {
          'useScrollShrinkProgress.useSyncExternalStore': () =>
            enabled
              ? Math.round(Math.min(1, Math.max(0, window.scrollY / SHRINK_RANGE)) * 50) / 50
              : 0,
        }['useScrollShrinkProgress.useSyncExternalStore'],
        {
          'useScrollShrinkProgress.useSyncExternalStore': () => 0,
        }['useScrollShrinkProgress.useSyncExternalStore'],
      );
    }
    _s(useScrollShrinkProgress, 'FpwL93IKMLJZuQQXefVtWynbBPQ=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useSyncExternalStore'
        ],
      ];
    });
    // Exact match, or a nested route under the item (`/billing/invoices` for
    // `/billing`). A bare prefix match would mark `/billing` active on `/billingx`.
    function isNavItemActive(href, activePath) {
      if (href === '/') {
        return activePath === '/';
      }
      const base = href.endsWith('/') ? href.slice(0, -1) : href;
      return activePath === base || activePath.startsWith(`${base}/`);
    }
    function AppWorkspaceShell({
      productName,
      productKicker = '17Suit product',
      title,
      eyebrow,
      navItems,
      activePath = '',
      homeHref = '/',
      onSignOut,
      signOutLabel = 'Log out',
      density = 'default',
      account,
      statusSlot,
      linkComponent: LinkComponent = 'a',
      children,
    }) {
      _s1();
      const isCompact = density === 'compact';
      const shrink = useScrollShrinkProgress(!isCompact);
      const signOutButton = onSignOut
        ? /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            'button',
            {
              type: 'button',
              onClick: onSignOut,
              className: (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                'cx'
              ])(
                (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'buttonRecipe'
                ])({
                  intent: 'secondary',
                  size: 'sm',
                  platform: 'web',
                }),
                'gap-2',
              ),
              children: [
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__[
                    'LogOut'
                  ],
                  {
                    size: 16,
                    strokeWidth: 2.2,
                    'aria-hidden': true,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                    lineNumber: 133,
                    columnNumber: 7,
                  },
                  this,
                ),
                signOutLabel,
              ],
            },
            void 0,
            true,
            {
              fileName: '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
              lineNumber: 128,
              columnNumber: 5,
            },
            this,
          )
        : null;
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'main',
        {
          className: (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'cx'
          ])('relative min-h-screen text-text', isCompact ? 'bg-background' : 'bg-suit-canvas'),
          children: [
            isCompact
              ? null
              : /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                    'Fragment'
                  ],
                  {
                    children: [
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        'div',
                        {
                          'aria-hidden': true,
                          className:
                            'pointer-events-none fixed -right-[24vw] -top-[24vw] z-0 h-[min(58vw,690px)] w-[min(58vw,690px)] rotate-[-15deg] rounded-[var(--radius-xl)] bg-ambient-brand-conic',
                        },
                        void 0,
                        false,
                        {
                          fileName:
                            '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                          lineNumber: 146,
                          columnNumber: 11,
                        },
                        this,
                      ),
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        'div',
                        {
                          'aria-hidden': true,
                          className:
                            'pointer-events-none fixed bottom-[-52px] left-[6vw] z-0 h-[140px] w-[min(64vw,720px)] skew-x-[-24deg] bg-ambient-cyan-line',
                        },
                        void 0,
                        false,
                        {
                          fileName:
                            '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                          lineNumber: 150,
                          columnNumber: 11,
                        },
                        this,
                      ),
                    ],
                  },
                  void 0,
                  true,
                ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'div',
              {
                className: (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'pageContainerRecipe'
                ])({
                  kind: 'workspace',
                }),
                children: [
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'aside',
                    {
                      className: (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        'cx'
                      ])(
                        'min-w-0 border-b border-border-default lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-[var(--spacing-lg)] lg:py-[var(--spacing-lg)]',
                        isCompact
                          ? 'bg-surface px-[var(--spacing-md)] py-[var(--spacing-sm)]'
                          : 'bg-surface-panel px-[var(--spacing-md)] py-[var(--spacing-md)] backdrop-blur-sm',
                      ),
                      children: [
                        /*#__PURE__*/ (0,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                          'jsxDEV'
                        ])(
                          'div',
                          {
                            className:
                              'flex items-center justify-between gap-[var(--spacing-md)] lg:block',
                            children: [
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                LinkComponent,
                                {
                                  href: homeHref,
                                  className: 'inline-flex flex-col no-underline',
                                  children: [
                                    /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                      'jsxDEV'
                                    ])(
                                      'span',
                                      {
                                        className: (0,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          'cx'
                                        ])(
                                          'text-xs font-light uppercase tracking-plus1_5 text-brand-secondary',
                                          isCompact && 'hidden lg:block',
                                        ),
                                        children: productKicker,
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                        lineNumber: 168,
                                        columnNumber: 15,
                                      },
                                      this,
                                    ),
                                    /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                      'jsxDEV'
                                    ])(
                                      'span',
                                      {
                                        className: (0,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          'cx'
                                        ])(
                                          'font-arvo font-bold leading-none text-brand-dark',
                                          isCompact
                                            ? 'text-xl lg:mt-1 lg:text-2xl'
                                            : 'mt-1 text-2xl',
                                        ),
                                        children: productName,
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                        lineNumber: 176,
                                        columnNumber: 15,
                                      },
                                      this,
                                    ),
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName:
                                    '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                  lineNumber: 167,
                                  columnNumber: 13,
                                },
                                this,
                              ),
                              statusSlot
                                ? /*#__PURE__*/ (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    'jsxDEV'
                                  ])(
                                    'div',
                                    {
                                      className: 'min-w-0 lg:mt-[var(--spacing-sm)]',
                                      children: statusSlot,
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                      lineNumber: 186,
                                      columnNumber: 15,
                                    },
                                    this,
                                  )
                                : null,
                              onSignOut && !account
                                ? /*#__PURE__*/ (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    'jsxDEV'
                                  ])(
                                    'button',
                                    {
                                      type: 'button',
                                      onClick: onSignOut,
                                      className: (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        'cx'
                                      ])(
                                        (0,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          'buttonRecipe'
                                        ])({
                                          intent: 'secondary',
                                          size: 'sm',
                                          platform: 'web',
                                          fullWidth: false,
                                        }),
                                        'gap-2 lg:hidden',
                                      ),
                                      children: [
                                        /*#__PURE__*/ (0,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          'jsxDEV'
                                        ])(
                                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__[
                                            'LogOut'
                                          ],
                                          {
                                            size: 16,
                                            strokeWidth: 2.2,
                                            'aria-hidden': true,
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                            lineNumber: 202,
                                            columnNumber: 17,
                                          },
                                          this,
                                        ),
                                        signOutLabel,
                                      ],
                                    },
                                    void 0,
                                    true,
                                    {
                                      fileName:
                                        '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                      lineNumber: 189,
                                      columnNumber: 15,
                                    },
                                    this,
                                  )
                                : null,
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName:
                              '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                            lineNumber: 166,
                            columnNumber: 11,
                          },
                          this,
                        ),
                        /*#__PURE__*/ (0,
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                          'jsxDEV'
                        ])(
                          'nav',
                          {
                            className: (0,
                            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                              'cx'
                            ])(
                              'flex max-w-full overflow-x-auto pb-[var(--spacing-xs)] lg:grid lg:overflow-visible lg:pb-0',
                              isCompact // clipped items read as "more this way", and the trailing spacer lets the
                                ? // last item scroll clear of the fade.
                                  "mt-[var(--spacing-sm)] gap-[var(--spacing-xs)] [mask-image:linear-gradient(to_right,#000_calc(100%-32px),transparent)] after:w-6 after:shrink-0 after:content-[''] lg:[mask-image:none] lg:after:hidden"
                                : 'mt-[var(--spacing-md)] gap-[var(--spacing-sm)]',
                            ),
                            children: navItems.map((item, index) => {
                              const isActive = isNavItemActive(item.href, activePath);
                              const Icon = item.icon;
                              const startsGroup =
                                Boolean(item.group) && item.group !== navItems[index - 1]?.group;
                              const link = /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                LinkComponent,
                                {
                                  href: item.href,
                                  ...(isActive
                                    ? {
                                        'aria-current': 'page',
                                      }
                                    : {}),
                                  className: (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    'cx'
                                  ])(
                                    isCompact
                                      ? 'grid shrink-0 grid-cols-[24px_auto] items-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] border px-[10px] py-[6px] text-sm font-bold no-underline transition-colors duration-150 lg:min-w-0 lg:grid-cols-[24px_1fr]'
                                      : 'grid min-w-[156px] grid-cols-[32px_1fr] items-center gap-2 rounded-[var(--radius-lg)] border px-3 py-[10px] text-sm font-bold no-underline transition-transform duration-200 motion-safe:hover:-translate-y-px lg:min-w-0',
                                    isActive
                                      ? (0,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          'cx'
                                        ])(
                                          'border-action-primary-border bg-action-primary text-white',
                                          !isCompact && 'shadow-action-primary-soft',
                                        )
                                      : (0,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          'cx'
                                        ])(
                                          'border-border-default text-brand-dark',
                                          isCompact
                                            ? 'bg-surface hover:border-border-emphasis hover:bg-background'
                                            : 'bg-surface-navigation',
                                        ),
                                  ),
                                  children: [
                                    /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                      'jsxDEV'
                                    ])(
                                      'span',
                                      {
                                        className: `inline-flex ${isCompact ? 'h-6 w-6' : 'h-8 w-8'} items-center justify-center rounded-full ${isActive ? 'bg-white/15 text-white' : 'bg-brand-primary/12 text-muted'}`,
                                        children: Icon
                                          ? /*#__PURE__*/ (0,
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                              'jsxDEV'
                                            ])(
                                              Icon,
                                              {
                                                size: isCompact ? 15 : 17,
                                                strokeWidth: 2.2,
                                                'aria-hidden': true,
                                              },
                                              void 0,
                                              false,
                                              {
                                                fileName:
                                                  '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                                lineNumber: 251,
                                                columnNumber: 23,
                                              },
                                              this,
                                            )
                                          : (item.mark ?? String(index + 1).padStart(2, '0')),
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                        lineNumber: 245,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                    item.badge
                                      ? /*#__PURE__*/ (0,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          'jsxDEV'
                                        ])(
                                          'span',
                                          {
                                            className:
                                              'flex min-w-0 items-center justify-between gap-2',
                                            children: [
                                              /*#__PURE__*/ (0,
                                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                'jsxDEV'
                                              ])(
                                                'span',
                                                {
                                                  children: item.label,
                                                },
                                                void 0,
                                                false,
                                                {
                                                  fileName:
                                                    '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                                  lineNumber: 258,
                                                  columnNumber: 23,
                                                },
                                                this,
                                              ),
                                              /*#__PURE__*/ (0,
                                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                'jsxDEV'
                                              ])(
                                                'span',
                                                {
                                                  className: (0,
                                                  __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                                    'cx'
                                                  ])(
                                                    'whitespace-nowrap rounded-[var(--radius-sm)] border px-[6px] text-xs font-normal leading-[18px]',
                                                    isActive
                                                      ? 'border-white/40 text-white'
                                                      : 'border-border-default text-muted',
                                                  ),
                                                  children: item.badge,
                                                },
                                                void 0,
                                                false,
                                                {
                                                  fileName:
                                                    '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                                  lineNumber: 259,
                                                  columnNumber: 23,
                                                },
                                                this,
                                              ),
                                            ],
                                          },
                                          void 0,
                                          true,
                                          {
                                            fileName:
                                              '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                            lineNumber: 257,
                                            columnNumber: 21,
                                          },
                                          this,
                                        )
                                      : /*#__PURE__*/ (0,
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          'jsxDEV'
                                        ])(
                                          'span',
                                          {
                                            children: item.label,
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                            lineNumber: 271,
                                            columnNumber: 21,
                                          },
                                          this,
                                        ),
                                  ],
                                },
                                item.href,
                                true,
                                {
                                  fileName:
                                    '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                  lineNumber: 224,
                                  columnNumber: 17,
                                },
                                this,
                              );
                              if (!startsGroup) {
                                return link;
                              }
                              return /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  'Fragment'
                                ],
                                {
                                  children: [
                                    /*#__PURE__*/ (0,
                                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                      'jsxDEV'
                                    ])(
                                      'span',
                                      {
                                        className:
                                          'flex shrink-0 items-center gap-2 self-center whitespace-nowrap px-[var(--spacing-xs)] text-xs font-bold leading-[18px] text-muted lg:mt-[var(--spacing-sm)] lg:self-auto lg:px-0',
                                        children: [
                                          /*#__PURE__*/ (0,
                                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                            'jsxDEV'
                                          ])(
                                            'span',
                                            {
                                              'aria-hidden': true,
                                              className: 'h-4 w-px bg-border-strong lg:hidden',
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                              lineNumber: 281,
                                              columnNumber: 21,
                                            },
                                            this,
                                          ),
                                          item.group,
                                          /*#__PURE__*/ (0,
                                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                            'jsxDEV'
                                          ])(
                                            'span',
                                            {
                                              'aria-hidden': true,
                                              className:
                                                'hidden h-px flex-1 bg-border-default lg:block',
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                              lineNumber: 283,
                                              columnNumber: 21,
                                            },
                                            this,
                                          ),
                                        ],
                                      },
                                      void 0,
                                      true,
                                      {
                                        fileName:
                                          '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                        lineNumber: 280,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                    link,
                                  ],
                                },
                                item.href,
                                true,
                                {
                                  fileName:
                                    '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                  lineNumber: 279,
                                  columnNumber: 17,
                                },
                                this,
                              );
                            }),
                          },
                          void 0,
                          false,
                          {
                            fileName:
                              '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                            lineNumber: 208,
                            columnNumber: 11,
                          },
                          this,
                        ),
                        account
                          ? /*#__PURE__*/ (0,
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                              'jsxDEV'
                            ])(
                              'div',
                              {
                                className: (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  'cx'
                                ])(
                                  'flex flex-wrap items-center justify-between gap-[var(--spacing-sm)] lg:mt-[var(--spacing-md)] lg:grid lg:justify-start',
                                  isCompact ? 'mt-[var(--spacing-xs)]' : 'mt-[var(--spacing-md)]',
                                ),
                                children: [
                                  /*#__PURE__*/ (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    'jsxDEV'
                                  ])(
                                    'div',
                                    {
                                      className: (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        'cx'
                                      ])(
                                        'min-w-0 leading-[1.4]',
                                        isCompact ? 'flex-1 text-xs lg:text-sm' : 'text-sm',
                                      ),
                                      children: account,
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                      lineNumber: 298,
                                      columnNumber: 15,
                                    },
                                    this,
                                  ),
                                  signOutButton
                                    ? /*#__PURE__*/ (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        'jsxDEV'
                                      ])(
                                        'div',
                                        {
                                          children: signOutButton,
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                          lineNumber: 306,
                                          columnNumber: 32,
                                        },
                                        this,
                                      )
                                    : null,
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName:
                                  '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                lineNumber: 292,
                                columnNumber: 13,
                              },
                              this,
                            )
                          : onSignOut // Wrapper owns visibility: the button recipe sets its own display, which would
                            ? // override `hidden` on the button itself and duplicate the mobile sign-out.
                              /*#__PURE__*/ (0,
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                'jsxDEV'
                              ])(
                                'div',
                                {
                                  className: 'mt-[var(--spacing-md)] hidden lg:block',
                                  children: signOutButton,
                                },
                                void 0,
                                false,
                                {
                                  fileName:
                                    '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                  lineNumber: 311,
                                  columnNumber: 13,
                                },
                                this,
                              )
                            : null,
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                      lineNumber: 158,
                      columnNumber: 9,
                    },
                    this,
                  ),
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'section',
                    {
                      className: (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        'cx'
                      ])(
                        'grid min-w-0 content-start px-[var(--spacing-md)] py-[var(--spacing-lg)] md:px-[var(--spacing-xl)] lg:px-[var(--spacing-x2l)]',
                        isCompact ? 'gap-[var(--spacing-md)]' : 'gap-[var(--spacing-lg)]',
                      ),
                      children: [
                        isCompact
                          ? /*#__PURE__*/ (0,
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                              'jsxDEV'
                            ])(
                              'header',
                              {
                                className: 'grid gap-[var(--spacing-xs)]',
                                children: [
                                  eyebrow
                                    ? /*#__PURE__*/ (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        'jsxDEV'
                                      ])(
                                        'p',
                                        {
                                          className: 'm-0 text-sm leading-[1.4] text-muted',
                                          children: eyebrow,
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                          lineNumber: 323,
                                          columnNumber: 26,
                                        },
                                        this,
                                      )
                                    : null,
                                  /*#__PURE__*/ (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    'jsxDEV'
                                  ])(
                                    'h1',
                                    {
                                      className:
                                        'm-0 text-balance font-arvo text-[26px] font-bold leading-[1.2] text-text',
                                      children: title,
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                      lineNumber: 324,
                                      columnNumber: 15,
                                    },
                                    this,
                                  ),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName:
                                  '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                lineNumber: 322,
                                columnNumber: 13,
                              },
                              this,
                            )
                          : /*#__PURE__*/ (0,
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                              'jsxDEV'
                            ])(
                              'header',
                              {
                                style: {
                                  '--app-hdr': shrink,
                                },
                                className: (0,
                                __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                  'cx'
                                ])(
                                  (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    'cardRecipe'
                                  ])({
                                    variant: 'workspaceHeader',
                                  }),
                                  'app-workspace-header-sticky',
                                ),
                                children: [
                                  eyebrow
                                    ? /*#__PURE__*/ (0,
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        'jsxDEV'
                                      ])(
                                        'p',
                                        {
                                          className:
                                            'm-0 text-xs font-light uppercase tracking-plus1_5 text-brand-secondary',
                                          children: eyebrow,
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                          lineNumber: 337,
                                          columnNumber: 17,
                                        },
                                        this,
                                      )
                                    : null,
                                  /*#__PURE__*/ (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                    'jsxDEV'
                                  ])(
                                    'h1',
                                    {
                                      className:
                                        'm-0 mt-[var(--spacing-xs)] max-w-[980px] font-arvo text-[clamp(38px,5vw,64px)] font-bold leading-[1.06] tracking-minus1_5 text-text',
                                      children: title,
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                      lineNumber: 341,
                                      columnNumber: 15,
                                    },
                                    this,
                                  ),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName:
                                  '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                                lineNumber: 329,
                                columnNumber: 13,
                              },
                              this,
                            ),
                        children,
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                      lineNumber: 315,
                      columnNumber: 9,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
                lineNumber: 157,
                columnNumber: 7,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx',
          lineNumber: 138,
          columnNumber: 5,
        },
        this,
      );
    }
    _s1(AppWorkspaceShell, 'Dor+LGVlYPIjhz3/s7PHvGFZCZE=', false, function () {
      return [useScrollShrinkProgress];
    });
    _c = AppWorkspaceShell;
    var _c;
    __turbopack_context__.k.register(_c, 'AppWorkspaceShell');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/feedback/toast/toast.provider.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['ToastProvider', () => ToastProvider]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/sonner@2.0.7_react-dom@19.3.0_react@19.3.0__react@19.3.0/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)',
      );
    ('use client');
    const DEFAULT_TOAST_DURATION_MS = 4_000;
    function ToastProvider({
      position = 'top-right',
      richColors = true,
      closeButton = true,
      duration = DEFAULT_TOAST_DURATION_MS,
      ...props
    }) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'Toaster'
        ],
        {
          position: position,
          richColors: richColors,
          closeButton: closeButton,
          duration: duration,
          ...props,
        },
        void 0,
        false,
        {
          fileName: '[project]/packages/ui-web/src/feedback/toast/toast.provider.tsx',
          lineNumber: 16,
          columnNumber: 5,
        },
        this,
      );
    }
    _c = ToastProvider;
    var _c;
    __turbopack_context__.k.register(_c, 'ToastProvider');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/feedback/toast/toast.service.ts [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['notify', () => notify]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/sonner@2.0.7_react-dom@19.3.0_react@19.3.0__react@19.3.0/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)',
      );
    const notify = {
      success: (message, options) =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'toast'
        ].success(message, options),
      error: (message, options) =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'toast'
        ].error(message, options),
      info: (message, options) =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'toast'
        ].info(message, options),
      warning: (message, options) =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'toast'
        ].warning(message, options),
      loading: (message, options) =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'toast'
        ].loading(message, options),
      promise: (promise, options) =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'toast'
        ].promise(promise, options),
      dismiss: (id) =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$sonner$40$2$2e$0$2e$7_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'toast'
        ].dismiss(id),
    };
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/feedback/toast/index.ts [app-client] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/feedback/toast/toast.provider.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/feedback/toast/toast.service.ts [app-client] (ecmascript)',
      );
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppProviders.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppProviders', () => AppProviders]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/feedback/toast/index.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/feedback/toast/toast.provider.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
      );
    ('use client');
    function AppProviders({ children, themeMode, onThemeModeChange }) {
      const themeProviderProps = {};
      if (themeMode !== undefined) {
        themeProviderProps.mode = themeMode;
      }
      if (onThemeModeChange !== undefined) {
        themeProviderProps.onModeChange = onThemeModeChange;
      }
      // Theme tokens (background / text / accent) are applied via CSS custom
      // properties resolved by the browser via `prefers-color-scheme`. Import
      // the stylesheet once at the app entry — the same file ships in every
      // web app that consumes @17suit/ui-web.
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'ThemeProvider'
        ],
        {
          ...themeProviderProps,
          children: [
            children,
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                'ToastProvider'
              ],
              {},
              void 0,
              false,
              {
                fileName: '[project]/packages/ui-web/src/components/AppProviders.tsx',
                lineNumber: 34,
                columnNumber: 7,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/packages/ui-web/src/components/AppProviders.tsx',
          lineNumber: 32,
          columnNumber: 5,
        },
        this,
      );
    }
    _c = AppProviders;
    var _c;
    __turbopack_context__.k.register(_c, 'AppProviders');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/modules/seven-reservations-club/src/onboarding-role.ts [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'SevenReservationsClubRoleOptions',
      () => SevenReservationsClubRoleOptions,
      'SevenReservationsClubRoles',
      () => SevenReservationsClubRoles,
      'extractSevenReservationsClubRoleFromMePayload',
      () => extractSevenReservationsClubRoleFromMePayload,
      'getSevenReservationsClubPostAuthPath',
      () => getSevenReservationsClubPostAuthPath,
      'getSevenReservationsClubRoleHint',
      () => getSevenReservationsClubRoleHint,
      'getSevenReservationsClubRoleHomePath',
      () => getSevenReservationsClubRoleHomePath,
      'isSevenReservationsClubRole',
      () => isSevenReservationsClubRole,
    ]);
    const SevenReservationsClubRoles = ['OWNER', 'PLAYER'];
    const SevenReservationsClubRoleOptions = [
      {
        role: 'OWNER',
        title: 'Soy dueno de un complejo',
        subtitle: 'Administra complejos, canchas y reservas de tus clientes.',
        cta: 'Continuar como OWNER',
      },
      {
        role: 'PLAYER',
        title: 'Soy jugador',
        subtitle: 'Busca complejos, reserva canchas y gestiona tus partidos.',
        cta: 'Continuar como PLAYER',
      },
    ];
    function isSevenReservationsClubRole(value) {
      return typeof value === 'string' && SevenReservationsClubRoles.includes(value);
    }
    function getSevenReservationsClubRoleHomePath(role) {
      return role === 'OWNER' ? '/owner' : '/play';
    }
    function getSevenReservationsClubPostAuthPath(role) {
      if (!role) {
        return '/onboarding/role';
      }
      return getSevenReservationsClubRoleHomePath(role);
    }
    function getSevenReservationsClubRoleHint(role, source) {
      if (!role) {
        return 'Selecciona tu rol para continuar.';
      }
      return `Rol actual detectado por ${source}: ${role}`;
    }
    function extractSevenReservationsClubRoleFromMePayload(payload) {
      if (!payload || typeof payload !== 'object') {
        return null;
      }
      const asRecord = payload;
      if (isSevenReservationsClubRole(asRecord.role)) {
        return asRecord.role;
      }
      const user = asRecord.user;
      if (user && typeof user === 'object') {
        const role = user.role;
        if (isSevenReservationsClubRole(role)) {
          return role;
        }
      }
      return null;
    }
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/core/src/api-types.ts [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    /**
     * Typed access to the generated OpenAPI contract (`api-schema.ts`).
     *
     * Use these helpers instead of hand-written response interfaces so server
     * DTO changes surface as client type errors. Regenerate the schema with
     * `pnpm --filter @17suit/core gen:api-schema` after `pnpm export:openapi`
     * in 17s-server.
     *
     * Paths are relative to the API prefix (the base URL already includes
     * `/api`), matching how ApiClient and the product SDKs build URLs.
     */ __turbopack_context__.s(['apiPath', () => apiPath]);
    function apiPath(template, params = {}) {
      return template.replace(/\{([^}]+)\}/g, (_, name) => {
        const value = params[name];
        if (value === undefined) {
          throw new Error(`Missing path parameter "${name}" for ${template}`);
        }
        return encodeURIComponent(String(value));
      });
    }
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/modules/seven-reservations-club/src/sdk/seven-rc-api.ts [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'SevenRcApiError',
      () => SevenRcApiError,
      'createSevenRcOwnerApi',
      () => createSevenRcOwnerApi,
      'createSevenRcPlayerApi',
      () => createSevenRcPlayerApi,
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/core/src/api-types.ts [app-client] (ecmascript)');
    function normalizeApiBaseUrl(value) {
      return value.replace(/\/+$/, '');
    }
    function normalizeApiBaseUrls(values) {
      const unique = [];
      for (const raw of values) {
        const value = raw?.trim();
        if (!value) {
          continue;
        }
        const normalized = normalizeApiBaseUrl(value);
        if (!unique.includes(normalized)) {
          unique.push(normalized);
        }
      }
      return unique;
    }
    async function fetchWithTimeout(url, init, timeoutMs = 8_000) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(url, {
          ...init,
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }
    }
    async function parseJsonSafe(response) {
      try {
        return await response.json();
      } catch {
        return null;
      }
    }
    function extractErrorMessage(payload, fallback) {
      // Nest sends `{ message: 'Timeslot is unavailable', error: 'Conflict' }`: `message` is
      // the specific reason. The web BFF and validation errors only have a usable `error`.
      if (payload && typeof payload === 'object' && 'message' in payload) {
        const message = payload.message;
        if (typeof message === 'string' && message.length > 0) {
          return message;
        }
      }
      if (payload && typeof payload === 'object' && 'error' in payload) {
        const error = payload.error;
        if (typeof error === 'string' && error.length > 0) {
          return error;
        }
      }
      return fallback;
    }
    function toError(error, fallbackMessage) {
      return error instanceof Error ? error : new Error(fallbackMessage);
    }
    class SevenRcApiError extends Error {
      status;
      /** Parsed JSON body of the error response, when there was one. */ payload;
      constructor(message, status, payload = null) {
        super(message);
        this.name = 'SevenRcApiError';
        this.status = status;
        this.payload = payload;
      }
      /** Reservations that overlap a rejected pitch block (409 from the block endpoint). */ get conflicts() {
        const value =
          this.payload && typeof this.payload === 'object' ? this.payload.conflicts : null;
        return Array.isArray(value) ? value : [];
      }
    }
    function createRequest(options) {
      const apiBaseUrls = normalizeApiBaseUrls(options.apiBaseUrls);
      const { getAccessToken, timeoutMs = 8_000 } = options;
      return async function request(path, init) {
        const token = await getAccessToken();
        if (!token) {
          throw new Error('Unauthorized');
        }
        // Fail over to the next base URL only when no HTTP response arrived (network
        // error / timeout), and only for idempotent reads. Any HTTP response — 4xx or
        // 5xx — is the server's answer and must surface as-is; re-sending a POST to
        // another host risks a duplicate write.
        const method = (init.method ?? 'GET').toUpperCase();
        const canFailOver = method === 'GET' || method === 'HEAD';
        const candidates = canFailOver ? apiBaseUrls : apiBaseUrls.slice(0, 1);
        let lastError = null;
        for (const baseUrl of candidates) {
          let response;
          try {
            response = await fetchWithTimeout(
              `${baseUrl}${path}`,
              {
                ...init,
                headers: {
                  Accept: 'application/json',
                  Authorization: `Bearer ${token}`,
                  ...(init.headers ?? {}),
                },
              },
              timeoutMs,
            );
          } catch (error) {
            lastError = error;
            continue;
          }
          if (response.ok) {
            return await response.json();
          }
          const payload = await parseJsonSafe(response);
          throw new SevenRcApiError(
            extractErrorMessage(payload, `Request failed (${response.status})`),
            response.status,
            payload,
          );
        }
        throw toError(lastError, 'Unable to reach API');
      };
    }
    function createSevenRcOwnerApi(options) {
      const request = createRequest(options);
      return {
        listOwnerVenues() {
          return request('/7rc/owner/venues', {
            method: 'GET',
            cache: 'no-store',
          });
        },
        createVenue(input) {
          return request('/7rc/venues', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
          });
        },
        listOwnerVenuePitches(venueId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/owner/venues/{venueId}/pitches', {
              venueId,
            }),
            {
              method: 'GET',
              cache: 'no-store',
            },
          );
        },
        createPitchForVenue(venueId, input) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/venues/{venueId}/pitches', {
              venueId,
            }),
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(input),
            },
          );
        },
        configurePitchSlots(pitchId, input) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/pitches/{pitchId}/slots', {
              pitchId,
            }),
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(input),
            },
          );
        },
        listVenueReservations(venueId, dateFrom, dateTo, cacheBuster) {
          const query = new URLSearchParams({
            dateFrom,
            dateTo,
          });
          if (cacheBuster) {
            query.set('_', cacheBuster);
          }
          return request(
            `${(0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/venues/{venueId}/reservations', {
              venueId,
            })}?${query}`,
            {
              method: 'GET',
              cache: 'no-store',
            },
          );
        },
        confirmReservation(reservationId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/reservations/{id}/confirm', {
              id: reservationId,
            }),
            {
              method: 'PATCH',
            },
          );
        },
        rejectReservation(reservationId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/reservations/{id}/reject', {
              id: reservationId,
            }),
            {
              method: 'PATCH',
            },
          );
        },
        updateVenueSettings(venueId, input) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/venues/{venueId}/settings', {
              venueId,
            }),
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(input),
            },
          );
        },
        configurePitchPricing(pitchId, input) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/pitches/{pitchId}/pricing', {
              pitchId,
            }),
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(input),
            },
          );
        },
        recordReservationPayment(reservationId, input) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/reservations/{id}/payments', {
              id: reservationId,
            }),
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(input),
            },
          );
        },
        markNoShow(reservationId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/reservations/{id}/no-show', {
              id: reservationId,
            }),
            {
              method: 'POST',
            },
          );
        },
        completeReservation(reservationId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/reservations/{id}/complete', {
              id: reservationId,
            }),
            {
              method: 'POST',
            },
          );
        },
        ownerCancelReservation(reservationId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/reservations/{id}/owner-cancel', {
              id: reservationId,
            }),
            {
              method: 'POST',
            },
          );
        },
        createOwnerReservation(venueId, input) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/venues/{venueId}/reservations', {
              venueId,
            }),
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(input),
            },
          );
        },
        listPitchBlocks(pitchId, from) {
          const query = from
            ? `?${new URLSearchParams({
                from,
              })}`
            : '';
          return request(
            `${(0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/pitches/{pitchId}/blocks', {
              pitchId,
            })}${query}`,
            {
              method: 'GET',
              cache: 'no-store',
            },
          );
        },
        createPitchBlock(pitchId, input) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/pitches/{pitchId}/blocks', {
              pitchId,
            }),
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(input),
            },
          );
        },
        deletePitchBlock(pitchId, blockId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/pitches/{pitchId}/blocks/{blockId}', {
              pitchId,
              blockId,
            }),
            {
              method: 'DELETE',
            },
          );
        },
      };
    }
    function createSevenRcPlayerApi(options) {
      const request = createRequest(options);
      return {
        listVenues(query) {
          const search = query ? `?q=${encodeURIComponent(query)}` : '';
          return request(`/7rc/venues${search}`, {
            method: 'GET',
            cache: 'no-store',
          });
        },
        listVenuePitches(venueId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/venues/{venueId}/pitches', {
              venueId,
            }),
            {
              method: 'GET',
              cache: 'no-store',
            },
          );
        },
        getPitchAvailability(pitchId, date) {
          const query = new URLSearchParams({
            date,
          });
          return request(
            `${(0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/pitches/{pitchId}/availability', {
              pitchId,
            })}?${query}`,
            {
              method: 'GET',
              cache: 'no-store',
            },
          );
        },
        listMyReservations() {
          return request('/7rc/reservations', {
            method: 'GET',
            cache: 'no-store',
          });
        },
        createReservation(input) {
          return request('/7rc/reservations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
          });
        },
        cancelReservation(reservationId) {
          return request(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'apiPath'
            ])('/7rc/reservations/{id}/cancel', {
              id: reservationId,
            }),
            {
              method: 'POST',
            },
          );
        },
      };
    }
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppButton.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppButton', () => AppButton]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/index.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/recipes.ts [app-client] (ecmascript)',
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
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'cx'
      ])(
        (0,
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _c = AppButton;
    var _c;
    __turbopack_context__.k.register(_c, 'AppButton');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppBottomTabBar.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppBottomTabBar', () => AppBottomTabBar]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
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
      _s();
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const buttonType = theme.typography.styles.button;
      const lineHeight = buttonType.lineHeightRecommended;
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _s(AppBottomTabBar, 'dWoOZ2enUYh/wPweRSuAeoep/Fo=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useAppTheme'
        ],
      ];
    });
    _c = AppBottomTabBar;
    var _c;
    __turbopack_context__.k.register(_c, 'AppBottomTabBar');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppButtonGroup.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppButtonGroup', () => AppButtonGroup]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    function AppButtonGroup({ children, direction = 'row', gap = 'sm', stretch = true, style }) {
      _s();
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const items =
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'Children'
        ].toArray(children);
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _s(AppButtonGroup, 'dWoOZ2enUYh/wPweRSuAeoep/Fo=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useAppTheme'
        ],
      ];
    });
    _c = AppButtonGroup;
    var _c;
    __turbopack_context__.k.register(_c, 'AppButtonGroup');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppDivider.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppDivider', () => AppDivider]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    function AppDivider({ marginY }) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _c = AppDivider;
    var _c;
    __turbopack_context__.k.register(_c, 'AppDivider');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppCard.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppCard', () => AppCard]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/index.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/recipes.ts [app-client] (ecmascript)',
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
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          ...rest,
          onClick: onPress,
          role: onPress ? 'button' : undefined,
          tabIndex: onPress ? 0 : undefined,
          className: (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'cx'
          ])(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _c = AppCard;
    var _c;
    __turbopack_context__.k.register(_c, 'AppCard');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppAlert.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppAlert', () => AppAlert]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    function AppAlert({ variant = 'info', title, description, icon, action, style, ...rest }) {
      _s();
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _s(AppAlert, 'dWoOZ2enUYh/wPweRSuAeoep/Fo=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useAppTheme'
        ],
      ];
    });
    _c = AppAlert;
    var _c;
    __turbopack_context__.k.register(_c, 'AppAlert');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppEmpty.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppEmpty', () => AppEmpty]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/inbox.js [app-client] (ecmascript) <export default as Inbox>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppButton.tsx [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    function AppEmpty({ title, description, icon, actionLabel, onAction, style, children }) {
      _s();
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const subtitleType = theme.typography.styles.subtitle2;
      const bodyType = theme.typography.styles.body;
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__[
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'div',
                  {
                    style: {
                      width: '100%',
                      maxWidth: 260,
                    },
                    children: /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                      'jsxDEV'
                    ])(
                      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _s(AppEmpty, 'dWoOZ2enUYh/wPweRSuAeoep/Fo=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useAppTheme'
        ],
      ];
    });
    _c = AppEmpty;
    var _c;
    __turbopack_context__.k.register(_c, 'AppEmpty');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppSeparator.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppSeparator', () => AppSeparator]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    function AppSeparator({ orientation = 'horizontal', tone = 'muted', size = 1, style }) {
      _s();
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const borderColor = tone === 'solid' ? theme.colors.text : theme.grayscale[3];
      const borderStyle = tone === 'dashed' ? 'dashed' : 'solid';
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _s(AppSeparator, 'dWoOZ2enUYh/wPweRSuAeoep/Fo=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useAppTheme'
        ],
      ];
    });
    _c = AppSeparator;
    var _c;
    __turbopack_context__.k.register(_c, 'AppSeparator');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/Separator.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['Separator', () => Separator]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/index.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/recipes.ts [app-client] (ecmascript)',
      );
    function Separator({ orientation = 'horizontal', className, ...props }) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          ...props,
          'aria-hidden': 'true',
          className: (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _c = Separator;
    var _c;
    __turbopack_context__.k.register(_c, 'Separator');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppSkeleton.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppSkeleton', () => AppSkeleton]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    const SKELETON_KEYFRAMES = `
@keyframes appSkeletonPulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}
`;
    function AppSkeleton({ width = '100%', height = 16, rounded = 'md', style, ...rest }) {
      _s();
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const radiusMap = {
        sm: theme.borderRadius.sm,
        md: theme.borderRadius.md,
        lg: theme.borderRadius.lg,
        full: theme.borderRadius.full,
      };
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'Fragment'
        ],
        {
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _s(AppSkeleton, 'dWoOZ2enUYh/wPweRSuAeoep/Fo=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useAppTheme'
        ],
      ];
    });
    _c = AppSkeleton;
    var _c;
    __turbopack_context__.k.register(_c, 'AppSkeleton');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppSpinner.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppSpinner', () => AppSpinner]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    const SPINNER_KEYFRAMES = `
@keyframes appSpinnerRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
    function AppSpinner({ size = 18, tone = 'primary', style }) {
      _s();
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const borderColor =
        tone === 'primary'
          ? theme.colors.brandPrimary
          : tone === 'muted'
            ? theme.colors.muted
            : theme.grayscale[3];
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'Fragment'
        ],
        {
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _s(AppSpinner, 'dWoOZ2enUYh/wPweRSuAeoep/Fo=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useAppTheme'
        ],
      ];
    });
    _c = AppSpinner;
    var _c;
    __turbopack_context__.k.register(_c, 'AppSpinner');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppTypography.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppTypography', () => AppTypography]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    function AppTypography({
      as: Component = 'p',
      variant = 'body',
      color,
      align = 'left',
      style,
      children,
    }) {
      _s();
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const typeStyle = theme.typography.styles[variant];
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _s(AppTypography, 'dWoOZ2enUYh/wPweRSuAeoep/Fo=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useAppTheme'
        ],
      ];
    });
    _c = AppTypography;
    var _c;
    __turbopack_context__.k.register(_c, 'AppTypography');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppTitle.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppTitle', () => AppTitle]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    function AppTitle({ text, as: Tag = 'p' }) {
      _s();
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const titleType = theme.typography.styles.subtitle1;
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _s(AppTitle, 'dWoOZ2enUYh/wPweRSuAeoep/Fo=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useAppTheme'
        ],
      ];
    });
    _c = AppTitle;
    var _c;
    __turbopack_context__.k.register(_c, 'AppTitle');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppFrame.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppFrame', () => AppFrame]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppTitle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppTitle.tsx [app-client] (ecmascript)',
      );
    function AppFrame({ appName, subtitle, onBack, landmark = true, children }) {
      const Root = landmark ? 'main' : 'div';
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        Root,
        {
          className: 'flex flex-1 flex-col bg-background p-lg',
          children: /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            'div',
            {
              className:
                'mt-md flex w-full max-w-[var(--container-content)] flex-col self-center rounded-xl border border-border-default bg-surface p-lg shadow-panel',
              children: [
                typeof onBack === 'function'
                  ? /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                          'jsxDEV'
                        ])(
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__[
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppTitle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _c = AppFrame;
    var _c;
    __turbopack_context__.k.register(_c, 'AppFrame');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppLinkAction.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppLinkAction', () => AppLinkAction]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    function AppLinkAction({ children, onPress }) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _c = AppLinkAction;
    var _c;
    __turbopack_context__.k.register(_c, 'AppLinkAction');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppProfile.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['AppProfile', () => AppProfile]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppButton.tsx [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    function AppProfile({ fullName, email, userId, onSignOut }) {
      _s();
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const subtitleType = theme.typography.styles.subtitle2;
      const bodyType = theme.typography.styles.body;
      const captionType = theme.typography.styles.caption;
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _s(AppProfile, 'dWoOZ2enUYh/wPweRSuAeoep/Fo=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useAppTheme'
        ],
      ];
    });
    _c = AppProfile;
    var _c;
    __turbopack_context__.k.register(_c, 'AppProfile');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/GapView.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['GapView', () => GapView]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
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
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _c = GapView;
    var _c;
    __turbopack_context__.k.register(_c, 'GapView');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/ProductShell.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['ProductShell', () => ProductShell]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    function ProductShell({ productName, subtitle, children }) {
      _s();
      const { theme } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useAppTheme'
      ])();
      const overlineType = theme.typography.styles.overline;
      const titleType = theme.typography.styles.subtitle1;
      const bodyType = theme.typography.styles.body;
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _s(ProductShell, 'dWoOZ2enUYh/wPweRSuAeoep/Fo=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useAppTheme'
        ],
      ];
    });
    _c = ProductShell;
    var _c;
    __turbopack_context__.k.register(_c, 'ProductShell');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/components/AppProductFooter.tsx [app-client] (ecmascript)',
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
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
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
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'footer',
        {
          style: containerStyle,
          children: /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            'div',
            {
              style: contentStyle,
              children: [
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'div',
                  {
                    style: brandRowStyle,
                    children: [
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        'div',
                        {
                          style: actionRowStyle,
                          children:
                            actionControls ??
                            /*#__PURE__*/ (0,
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                              'jsxDEV'
                            ])(
                              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                'Fragment'
                              ],
                              {
                                children: [
                                  /*#__PURE__*/ (0,
                                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                        'jsxDEV'
                                      ])(
                                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                                          'Fragment'
                                        ],
                                        {
                                          children: [
                                            /*#__PURE__*/ (0,
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
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
    _c = AppProductFooter;
    var _c;
    __turbopack_context__.k.register(_c, 'AppProductFooter');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/index.ts [app-client] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppButton.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppBottomTabBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppBottomTabBar.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButtonGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppButtonGroup.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppDivider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppDivider.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppBadge.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppCard.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppAlert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppAlert.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppAvatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppAvatar.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppEmpty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppEmpty.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSeparator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSeparator.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$Separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/Separator.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSkeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSkeleton.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSpinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSpinner.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppTypography$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppTypography.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppFrame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppFrame.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppInput.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppLinkAction$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppLinkAction.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProfile$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppProfile.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSelect$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSelect.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$GapView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/GapView.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppTitle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppTitle.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppWorkspaceShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProviders$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppProviders.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$ProductShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/ProductShell.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/feedback/toast/index.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProductFooter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppProductFooter.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/index.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
      );
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui/src/hooks/useAppToast.ts [app-client] (ecmascript)',
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
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui/src/theme.ts [app-client] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/index.ts [app-client] (ecmascript) <locals>',
      );
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui/src/index.ts [app-client] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/index.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$hooks$2f$useAppToast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui/src/hooks/useAppToast.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$theme$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui/src/theme.ts [app-client] (ecmascript) <locals>',
      );
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/ui-web/src/index.ts [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'AppAlert',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppAlert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppAlert'
        ],
      'AppAvatar',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppAvatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppAvatar'
        ],
      'AppBadge',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppBadge'
        ],
      'AppBottomTabBar',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppBottomTabBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppBottomTabBar'
        ],
      'AppButton',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppButton'
        ],
      'AppButtonGroup',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButtonGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppButtonGroup'
        ],
      'AppCard',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppCard'
        ],
      'AppDivider',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppDivider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppDivider'
        ],
      'AppEmpty',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppEmpty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppEmpty'
        ],
      'AppFrame',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppFrame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppFrame'
        ],
      'AppInput',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppInput'
        ],
      'AppLinkAction',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppLinkAction$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppLinkAction'
        ],
      'AppProductFooter',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProductFooter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppProductFooter'
        ],
      'AppProfile',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProfile$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppProfile'
        ],
      'AppProviders',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProviders$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppProviders'
        ],
      'AppSelect',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSelect$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppSelect'
        ],
      'AppSeparator',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSeparator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppSeparator'
        ],
      'AppSkeleton',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSkeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppSkeleton'
        ],
      'AppSpinner',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSpinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppSpinner'
        ],
      'AppTitle',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppTitle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppTitle'
        ],
      'AppTypography',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppTypography$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppTypography'
        ],
      'AppWorkspaceShell',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppWorkspaceShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'AppWorkspaceShell'
        ],
      'Ban',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__[
          'Ban'
        ],
      'Banknote',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$banknote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Banknote$3e$__[
          'Banknote'
        ],
      'CalendarClock',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__[
          'CalendarClock'
        ],
      'CheckCircle2',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__[
          'CheckCircle2'
        ],
      'CreditCard',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__[
          'CreditCard'
        ],
      'GapView',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$GapView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'GapView'
        ],
      'Gauge',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__[
          'Gauge'
        ],
      'Inbox',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__[
          'Inbox'
        ],
      'Link2',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__[
          'Link2'
        ],
      'ListChecks',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$checks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListChecks$3e$__[
          'ListChecks'
        ],
      'PauseCircle',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PauseCircle$3e$__[
          'PauseCircle'
        ],
      'ProductShell',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$ProductShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'ProductShell'
        ],
      'ReceiptText',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ReceiptText$3e$__[
          'ReceiptText'
        ],
      'RefreshCcw',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCcw$3e$__[
          'RefreshCcw'
        ],
      'Repeat2',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat2$3e$__[
          'Repeat2'
        ],
      'Search',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__[
          'Search'
        ],
      'Separator',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$Separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'Separator'
        ],
      'ThemeProvider',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'ThemeProvider'
        ],
      'ToastProvider',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'ToastProvider'
        ],
      'Trash2',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__[
          'Trash2'
        ],
      'appProductFooterButtonStyle',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProductFooter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'appProductFooterButtonStyle'
        ],
      'appProductFooterTextLinkStyle',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProductFooter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'appProductFooterTextLinkStyle'
        ],
      'buttonLabelRecipe',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'buttonLabelRecipe'
        ],
      'buttonRecipe',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'buttonRecipe'
        ],
      'cardRecipe',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'cardRecipe'
        ],
      'cx',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'cx'
        ],
      'inputRecipe',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'inputRecipe'
        ],
      'notify',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'notify'
        ],
      'pageContainerRecipe',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'pageContainerRecipe'
        ],
      'suitTheme',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'suitTheme'
        ],
      'useAppTheme',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useAppTheme'
        ],
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/index.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppButton.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppBottomTabBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppBottomTabBar.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppButtonGroup$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppButtonGroup.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppDivider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppDivider.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppBadge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppBadge.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppCard.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppAlert$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppAlert.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppAvatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppAvatar.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppEmpty$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppEmpty.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSeparator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSeparator.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$Separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/Separator.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSkeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSkeleton.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSpinner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSpinner.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppTypography$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppTypography.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppFrame$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppFrame.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppInput.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppLinkAction$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppLinkAction.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProfile$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppProfile.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppSelect$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppSelect.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$GapView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/GapView.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppTitle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppTitle.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppWorkspaceShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppWorkspaceShell.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProviders$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppProviders.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$ProductShell$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/ProductShell.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/feedback/toast/toast.provider.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$feedback$2f$toast$2f$toast$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/feedback/toast/toast.service.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$components$2f$AppProductFooter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/components/AppProductFooter.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ban$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ban$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/ban.js [app-client] (ecmascript) <export default as Ban>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$banknote$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Banknote$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/banknote.js [app-client] (ecmascript) <export default as Banknote>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarClock$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/calendar-clock.js [app-client] (ecmascript) <export default as CalendarClock>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-client] (ecmascript) <export default as CreditCard>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gauge$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gauge$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/gauge.js [app-client] (ecmascript) <export default as Gauge>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/inbox.js [app-client] (ecmascript) <export default as Inbox>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/link-2.js [app-client] (ecmascript) <export default as Link2>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2d$checks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ListChecks$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/list-checks.js [app-client] (ecmascript) <export default as ListChecks>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$pause$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PauseCircle$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/circle-pause.js [app-client] (ecmascript) <export default as PauseCircle>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ReceiptText$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/receipt-text.js [app-client] (ecmascript) <export default as ReceiptText>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCcw$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/refresh-ccw.js [app-client] (ecmascript) <export default as RefreshCcw>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$repeat$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Repeat2$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/repeat-2.js [app-client] (ecmascript) <export default as Repeat2>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$542$2e$0_react$40$19$2e$3$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/lucide-react@0.542.0_react@19.3.0/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/tokens.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$recipes$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/recipes.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$theme$2f$theme$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/ui-web/src/theme/theme-context.tsx [app-client] (ecmascript)',
      );
  },
  '[project]/packages/modules/seven-reservations-club/src/components/OnboardingRoleSelector.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['OnboardingRoleSelector', () => OnboardingRoleSelector]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui/src/index.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/ui-web/src/index.ts [app-client] (ecmascript)');
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/design-system/src/tokens.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/onboarding-role.ts [app-client] (ecmascript)',
      );
    ('use client');
    const paragraphStyle = {
      margin: 0,
      fontFamily:
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'suitTheme'
        ].typography.styles.body.webFamily,
      fontSize:
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'suitTheme'
        ].typography.styles.body.fontSize,
      lineHeight:
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'suitTheme'
        ].typography.styles.body.fontSize *
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'suitTheme'
        ].typography.styles.body.lineHeightRecommended,
      letterSpacing:
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'suitTheme'
        ].typography.styles.body.letterSpacingEm,
      color:
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$design$2d$system$2f$src$2f$tokens$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'suitTheme'
        ].colors.text,
    };
    function OnboardingRoleSelector({
      role,
      source,
      isSubmittingRole,
      roleError,
      submitError,
      onRetryLoad,
      onClearSubmitError,
      onSelectRole,
    }) {
      const roleHint = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'getSevenReservationsClubRoleHint'
      ])(role, source);
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          style: {
            gap: 12,
            display: 'flex',
            flexDirection: 'column',
          },
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'p',
              {
                style: paragraphStyle,
                children: roleHint,
              },
              void 0,
              false,
              {
                fileName:
                  '[project]/packages/modules/seven-reservations-club/src/components/OnboardingRoleSelector.tsx',
                lineNumber: 48,
                columnNumber: 7,
              },
              this,
            ),
            roleError
              ? /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'div',
                  {
                    style: {
                      gap: 8,
                      display: 'flex',
                      flexDirection: 'column',
                    },
                    children: [
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        'p',
                        {
                          style: {
                            ...paragraphStyle,
                            color: '#ff7676',
                          },
                          children: roleError,
                        },
                        void 0,
                        false,
                        {
                          fileName:
                            '[project]/packages/modules/seven-reservations-club/src/components/OnboardingRoleSelector.tsx',
                          lineNumber: 52,
                          columnNumber: 11,
                        },
                        this,
                      ),
                      onRetryLoad
                        ? /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                            'jsxDEV'
                          ])(
                            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                              'AppButton'
                            ],
                            {
                              onPress: onRetryLoad,
                              variant: 'info',
                              children: 'Reintentar carga de rol',
                            },
                            void 0,
                            false,
                            {
                              fileName:
                                '[project]/packages/modules/seven-reservations-club/src/components/OnboardingRoleSelector.tsx',
                              lineNumber: 54,
                              columnNumber: 13,
                            },
                            this,
                          )
                        : null,
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName:
                      '[project]/packages/modules/seven-reservations-club/src/components/OnboardingRoleSelector.tsx',
                    lineNumber: 51,
                    columnNumber: 9,
                  },
                  this,
                )
              : null,
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'div',
              {
                style: {
                  gap: 12,
                  display: 'flex',
                  flexDirection: 'column',
                },
                children:
                  __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                    'SevenReservationsClubRoleOptions'
                  ].map((option) =>
                    /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                      'jsxDEV'
                    ])(
                      'div',
                      {
                        style: {
                          gap: 8,
                          padding: 16,
                          borderRadius: 12,
                          border: '1px solid rgba(255,255,255,0.12)',
                          display: 'flex',
                          flexDirection: 'column',
                        },
                        children: [
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                            'jsxDEV'
                          ])(
                            'p',
                            {
                              style: {
                                ...paragraphStyle,
                                fontWeight: 700,
                              },
                              children: option.title,
                            },
                            void 0,
                            false,
                            {
                              fileName:
                                '[project]/packages/modules/seven-reservations-club/src/components/OnboardingRoleSelector.tsx',
                              lineNumber: 74,
                              columnNumber: 13,
                            },
                            this,
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                            'jsxDEV'
                          ])(
                            'p',
                            {
                              style: {
                                ...paragraphStyle,
                                opacity: 0.8,
                              },
                              children: option.subtitle,
                            },
                            void 0,
                            false,
                            {
                              fileName:
                                '[project]/packages/modules/seven-reservations-club/src/components/OnboardingRoleSelector.tsx',
                              lineNumber: 75,
                              columnNumber: 13,
                            },
                            this,
                          ),
                          /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                            'jsxDEV'
                          ])(
                            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                              'AppButton'
                            ],
                            {
                              variant: option.role === 'OWNER' ? 'success' : 'primary',
                              onPress: () => onSelectRole(option.role),
                              disabled: Boolean(isSubmittingRole),
                              children:
                                isSubmittingRole === option.role ? 'Guardando...' : option.cta,
                            },
                            void 0,
                            false,
                            {
                              fileName:
                                '[project]/packages/modules/seven-reservations-club/src/components/OnboardingRoleSelector.tsx',
                              lineNumber: 76,
                              columnNumber: 13,
                            },
                            this,
                          ),
                        ],
                      },
                      option.role,
                      true,
                      {
                        fileName:
                          '[project]/packages/modules/seven-reservations-club/src/components/OnboardingRoleSelector.tsx',
                        lineNumber: 63,
                        columnNumber: 11,
                      },
                      this,
                    ),
                  ),
              },
              void 0,
              false,
              {
                fileName:
                  '[project]/packages/modules/seven-reservations-club/src/components/OnboardingRoleSelector.tsx',
                lineNumber: 61,
                columnNumber: 7,
              },
              this,
            ),
            submitError
              ? /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'div',
                  {
                    style: {
                      gap: 6,
                      display: 'flex',
                      flexDirection: 'column',
                    },
                    children: [
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        'p',
                        {
                          style: {
                            ...paragraphStyle,
                            color: '#ff7676',
                          },
                          children: submitError,
                        },
                        void 0,
                        false,
                        {
                          fileName:
                            '[project]/packages/modules/seven-reservations-club/src/components/OnboardingRoleSelector.tsx',
                          lineNumber: 89,
                          columnNumber: 11,
                        },
                        this,
                      ),
                      onClearSubmitError
                        ? /*#__PURE__*/ (0,
                          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                            'jsxDEV'
                          ])(
                            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                              'AppButton'
                            ],
                            {
                              onPress: onClearSubmitError,
                              variant: 'destructive',
                              children: 'Cerrar error y reintentar',
                            },
                            void 0,
                            false,
                            {
                              fileName:
                                '[project]/packages/modules/seven-reservations-club/src/components/OnboardingRoleSelector.tsx',
                              lineNumber: 91,
                              columnNumber: 13,
                            },
                            this,
                          )
                        : null,
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName:
                      '[project]/packages/modules/seven-reservations-club/src/components/OnboardingRoleSelector.tsx',
                    lineNumber: 88,
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
          fileName:
            '[project]/packages/modules/seven-reservations-club/src/components/OnboardingRoleSelector.tsx',
          lineNumber: 47,
          columnNumber: 5,
        },
        this,
      );
    }
    _c = OnboardingRoleSelector;
    var _c;
    __turbopack_context__.k.register(_c, 'OnboardingRoleSelector');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/modules/seven-reservations-club/src/query/RoleDataSourceProvider.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'SevenReservationsClubRoleDataSourceProvider',
      () => SevenReservationsClubRoleDataSourceProvider,
      'useSevenReservationsClubRoleDataSource',
      () => useSevenReservationsClubRoleDataSource,
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    ('use client');
    const RoleDataSourceContext = /*#__PURE__*/ (0,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
      'createContext'
    ])(null);
    function SevenReservationsClubRoleDataSourceProvider({ dataSource, children }) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        RoleDataSourceContext.Provider,
        {
          value: dataSource,
          children: children,
        },
        void 0,
        false,
        {
          fileName:
            '[project]/packages/modules/seven-reservations-club/src/query/RoleDataSourceProvider.tsx',
          lineNumber: 17,
          columnNumber: 5,
        },
        this,
      );
    }
    _c = SevenReservationsClubRoleDataSourceProvider;
    function useSevenReservationsClubRoleDataSource() {
      _s();
      const context = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useContext'
      ])(RoleDataSourceContext);
      if (!context) {
        throw new Error(
          'SevenReservationsClubRoleDataSourceProvider is missing in the component tree',
        );
      }
      return context;
    }
    _s(useSevenReservationsClubRoleDataSource, 'b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=');
    var _c;
    __turbopack_context__.k.register(_c, 'SevenReservationsClubRoleDataSourceProvider');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/modules/seven-reservations-club/src/query/role-data-source.ts [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'createExternalPlatformRoleDataSource',
      () => createExternalPlatformRoleDataSource,
      'createWebBffRoleDataSource',
      () => createWebBffRoleDataSource,
    ]);
    function buildApiUrl(baseUrl, path) {
      const trimmedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const normalizedBase = trimmedBase.replace(/\/api$/, '');
      return `${normalizedBase}${path}`;
    }
    async function fetchWithTimeout(url, init, timeoutMs = 8000) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(url, {
          ...init,
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timer);
      }
    }
    async function parseJsonSafe(response) {
      try {
        return await response.json();
      } catch {
        return null;
      }
    }
    function extractErrorMessage(payload, fallback) {
      if (payload && typeof payload === 'object' && 'error' in payload) {
        const error = payload.error;
        if (typeof error === 'string' && error.length > 0) {
          return error;
        }
      }
      return fallback;
    }
    function createWebBffRoleDataSource(options) {
      async function authHeaders() {
        const token = await options?.getAccessToken?.();
        return token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {};
      }
      return {
        async getCurrentUserRole() {
          const response = await fetch('/api/me', {
            method: 'GET',
            headers: await authHeaders(),
            cache: 'no-store',
          });
          if (!response.ok) {
            const payload = await parseJsonSafe(response);
            throw new Error(
              extractErrorMessage(payload, `Failed to load /api/me (${response.status})`),
            );
          }
          return await response.json();
        },
        async setCurrentUserRole(role) {
          const response = await fetch('/api/onboarding/role', {
            method: 'POST',
            headers: {
              ...(await authHeaders()),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              role,
            }),
          });
          if (!response.ok) {
            const payload = await parseJsonSafe(response);
            throw new Error(
              extractErrorMessage(payload, `No se pudo guardar el rol (${response.status})`),
            );
          }
          return await response.json();
        },
      };
    }
    function createExternalPlatformRoleDataSource(options) {
      const { apiBaseUrl, getAccessToken } = options;
      return {
        async getCurrentUserRole() {
          const token = await getAccessToken();
          if (!token) {
            throw new Error('Unauthorized');
          }
          const headers = {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          };
          const primaryResponse = await fetchWithTimeout(
            buildApiUrl(apiBaseUrl, '/api/platform/me'),
            {
              method: 'GET',
              headers,
              cache: 'no-store',
            },
          );
          let response = primaryResponse;
          if (response.status === 404) {
            response = await fetchWithTimeout(buildApiUrl(apiBaseUrl, '/api/me'), {
              method: 'GET',
              headers,
              cache: 'no-store',
            });
          }
          if (response.status === 404) {
            response = await fetchWithTimeout(buildApiUrl(apiBaseUrl, '/me'), {
              method: 'GET',
              headers,
              cache: 'no-store',
            });
          }
          if (!response.ok) {
            const payload = await parseJsonSafe(response);
            throw new Error(
              extractErrorMessage(payload, `Failed to fetch platform user (${response.status})`),
            );
          }
          const payload = await response.json();
          return {
            role: payload.role ?? null,
            source: payload.role ? 'backend' : 'none',
          };
        },
        async setCurrentUserRole(role) {
          const token = await getAccessToken();
          if (!token) {
            throw new Error('Unauthorized');
          }
          const response = await fetchWithTimeout(
            buildApiUrl(apiBaseUrl, '/api/platform/onboarding/role'),
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
              body: JSON.stringify({
                role,
              }),
            },
          );
          if (!response.ok) {
            const payload = await parseJsonSafe(response);
            throw new Error(
              extractErrorMessage(payload, `No se pudo guardar el rol (${response.status})`),
            );
          }
          return await response.json();
        },
      };
    }
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/modules/seven-reservations-club/src/query/role-query.ts [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'sevenReservationsClubQueryKeys',
      () => sevenReservationsClubQueryKeys,
      'useCurrentUserRoleQuery',
      () => useCurrentUserRoleQuery,
      'useSetCurrentUserRoleMutation',
      () => useSetCurrentUserRoleMutation,
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@tanstack+react-query@5.90.21_react@19.3.0/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@tanstack+react-query@5.90.21_react@19.3.0/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@tanstack+react-query@5.90.21_react@19.3.0/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$RoleDataSourceProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/query/RoleDataSourceProvider.tsx [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature(),
      _s1 = __turbopack_context__.k.signature();
    ('use client');
    const sevenReservationsClubQueryKeys = {
      currentRole: (userId) => ['seven-reservations-club', 'current-role', userId ?? 'anonymous'],
    };
    function useCurrentUserRoleQuery(options) {
      _s();
      const dataSource = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$RoleDataSourceProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useSevenReservationsClubRoleDataSource'
      ])();
      const userId = options?.userId ?? null;
      const enabled = options?.enabled ?? true;
      const query = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQuery'
      ])({
        queryKey: sevenReservationsClubQueryKeys.currentRole(userId),
        queryFn: {
          'useCurrentUserRoleQuery.useQuery[query]': () => dataSource.getCurrentUserRole(),
        }['useCurrentUserRoleQuery.useQuery[query]'],
        staleTime: 15_000,
        enabled,
      });
      return {
        role: query.data?.role ?? null,
        source: query.data?.source ?? 'none',
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error instanceof Error ? query.error.message : null,
        refetch: query.refetch,
      };
    }
    _s(useCurrentUserRoleQuery, 'fnH6/MB+ddW4R0uUIzuRqgU5UmQ=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$RoleDataSourceProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useSevenReservationsClubRoleDataSource'
        ],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQuery'
        ],
      ];
    });
    function useSetCurrentUserRoleMutation() {
      _s1();
      const queryClient = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQueryClient'
      ])();
      const dataSource = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$RoleDataSourceProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useSevenReservationsClubRoleDataSource'
      ])();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSetCurrentUserRoleMutation.useMutation': (role) =>
            dataSource.setCurrentUserRole(role),
        }['useSetCurrentUserRoleMutation.useMutation'],
        onSuccess: {
          'useSetCurrentUserRoleMutation.useMutation': (user) => {
            const cachePayload = {
              role: user.role,
              source: 'backend',
            };
            queryClient.setQueryData(
              sevenReservationsClubQueryKeys.currentRole(user.id),
              cachePayload,
            );
            queryClient.setQueryData(
              sevenReservationsClubQueryKeys.currentRole(user.clerkUserId),
              cachePayload,
            );
          },
        }['useSetCurrentUserRoleMutation.useMutation'],
      });
    }
    _s1(useSetCurrentUserRoleMutation, 'MFqjIA7OXIMoJzjUPeGxFh8ms4E=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQueryClient'
        ],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$RoleDataSourceProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useSevenReservationsClubRoleDataSource'
        ],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useMutation'
        ],
      ];
    });
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/core/src/api-client.ts [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'ApiClient',
      () => ApiClient,
      'ApiError',
      () => ApiError,
      'TRACE_ID_HEADER',
      () => TRACE_ID_HEADER,
      'generateTraceId',
      () => generateTraceId,
      'getApiErrorDisplayMessage',
      () => getApiErrorDisplayMessage,
      'isApiError',
      () => isApiError,
      'normalizeApiBaseUrl',
      () => normalizeApiBaseUrl,
    ]);
    const TRACE_ID_HEADER = 'x-trace-id';
    class ApiError extends Error {
      code;
      status;
      path;
      payload;
      constructor(options) {
        super(options.message);
        this.name = 'ApiError';
        this.code = options.code;
        if (options.status !== undefined) {
          this.status = options.status;
        }
        if (options.path !== undefined) {
          this.path = options.path;
        }
        if (options.payload !== undefined) {
          this.payload = options.payload;
        }
        if (options.cause !== undefined) {
          this.cause = options.cause;
        }
      }
    }
    function isApiError(error) {
      return error instanceof ApiError;
    }
    function normalizeApiBaseUrl(value) {
      return value.replace(/\/+$/, '');
    }
    function getApiErrorDisplayMessage(error) {
      if (error instanceof TypeError) {
        return 'Unable to reach the API server. Check that the backend and database are running.';
      }
      if (!isApiError(error)) {
        return error instanceof Error ? error.message : 'Unexpected request error.';
      }
      if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
        return 'Unable to reach the API server. Check that the backend and database are running.';
      }
      return error.message;
    }
    class ApiClient {
      options;
      constructor(options) {
        this.options = options;
      }
      async request(path, init = {}) {
        const token = await this.options.getAccessToken?.();
        const headers = new Headers(init.headers);
        if (!headers.has('Content-Type') && init.body) {
          headers.set('Content-Type', 'application/json');
        }
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        if (!headers.has(TRACE_ID_HEADER)) {
          const fallbackTraceId = this.options.traceId ?? generateTraceId();
          headers.set(TRACE_ID_HEADER, fallbackTraceId);
        }
        const response = await fetchWithTimeout(
          `${normalizeApiBaseUrl(this.options.baseUrl)}${path}`,
          {
            ...init,
            headers,
          },
          this.options.timeoutMs,
          path,
        );
        if (!response.ok) {
          const payload = await parseResponsePayload(response);
          throw new ApiError({
            message: extractErrorMessage(
              payload,
              `Request failed (${response.status}) for ${path}`,
            ),
            code: 'HTTP_ERROR',
            status: response.status,
            path,
            payload,
          });
        }
        return await parseJsonResponse(response, path);
      }
    }
    async function fetchWithTimeout(url, init, timeoutMs = 8_000, path) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(url, {
          ...init,
          signal: init.signal ?? controller.signal,
        });
      } catch (error) {
        const isTimeout =
          error instanceof DOMException
            ? error.name === 'AbortError'
            : error instanceof Error && error.name === 'AbortError';
        throw new ApiError({
          message: isTimeout ? 'Request timed out.' : 'Unable to reach API server.',
          code: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
          cause: error,
          ...(path === undefined
            ? {}
            : {
                path,
              }),
        });
      } finally {
        clearTimeout(timer);
      }
    }
    async function parseJsonResponse(response, path) {
      if (response.status === 204) {
        return undefined;
      }
      try {
        return await response.json();
      } catch (error) {
        throw new ApiError({
          message: `Invalid JSON response for ${path}`,
          code: 'PARSE_ERROR',
          status: response.status,
          path,
          cause: error,
        });
      }
    }
    async function parseResponsePayload(response) {
      try {
        return await response.json();
      } catch {
        try {
          return await response.text();
        } catch {
          return null;
        }
      }
    }
    function extractErrorMessage(payload, fallback) {
      if (payload && typeof payload === 'object' && 'message' in payload) {
        const message = payload.message;
        if (Array.isArray(message)) return message.join(', ');
        if (typeof message === 'string' && message.length > 0) return message;
      }
      if (payload && typeof payload === 'object' && 'error' in payload) {
        const error = payload.error;
        if (typeof error === 'string' && error.length > 0) return error;
      }
      if (typeof payload === 'string' && payload.length > 0) {
        return payload;
      }
      return fallback;
    }
    function generateTraceId() {
      return crypto.randomUUID();
    }
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/core/src/query-client.ts [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'apiQueryClientConfig',
      () => apiQueryClientConfig,
      'createApiQueryClient',
      () => createApiQueryClient,
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$20$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@tanstack+query-core@5.90.20/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/core/src/api-client.ts [app-client] (ecmascript)',
      );
    ('use client');
    const apiQueryClientConfig = {
      defaultOptions: {
        queries: {
          retry(failureCount, error) {
            if (
              (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                'isApiError'
              ])(error) &&
              error.status !== undefined &&
              error.status < 500
            ) {
              return false;
            }
            return failureCount < 1;
          },
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          refetchOnMount: false,
          staleTime: 5 * 60 * 1000,
          gcTime: 30 * 60 * 1000,
        },
        mutations: {
          retry: 0,
        },
      },
    };
    function createApiQueryClient(config = {}) {
      return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$query$2d$core$40$5$2e$90$2e$20$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'QueryClient'
      ]({
        ...apiQueryClientConfig,
        ...config,
        defaultOptions: {
          ...apiQueryClientConfig.defaultOptions,
          ...config.defaultOptions,
          queries: {
            ...apiQueryClientConfig.defaultOptions?.queries,
            ...config.defaultOptions?.queries,
          },
          mutations: {
            ...apiQueryClientConfig.defaultOptions?.mutations,
            ...config.defaultOptions?.mutations,
          },
        },
      });
    }
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/modules/seven-reservations-club/src/query/query-client.ts [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['createSevenRcQueryClient', () => createSevenRcQueryClient]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$query$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/core/src/query-client.ts [app-client] (ecmascript)',
      );
    ('use client');
    function createSevenRcQueryClient() {
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$core$2f$src$2f$query$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'createApiQueryClient'
      ])();
    }
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/modules/seven-reservations-club/src/query/seven-rc-query.ts [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'sevenRcQueryKeys',
      () => sevenRcQueryKeys,
      'useSevenRcCancelReservationMutation',
      () => useSevenRcCancelReservationMutation,
      'useSevenRcCompleteReservationMutation',
      () => useSevenRcCompleteReservationMutation,
      'useSevenRcConfigurePitchPricingMutation',
      () => useSevenRcConfigurePitchPricingMutation,
      'useSevenRcConfigurePitchSlotsMutation',
      () => useSevenRcConfigurePitchSlotsMutation,
      'useSevenRcConfirmVenueReservationMutation',
      () => useSevenRcConfirmVenueReservationMutation,
      'useSevenRcCreateOwnerReservationMutation',
      () => useSevenRcCreateOwnerReservationMutation,
      'useSevenRcCreatePitchBlockMutation',
      () => useSevenRcCreatePitchBlockMutation,
      'useSevenRcCreateReservationMutation',
      () => useSevenRcCreateReservationMutation,
      'useSevenRcCreateVenueMutation',
      () => useSevenRcCreateVenueMutation,
      'useSevenRcCreateVenuePitchMutation',
      () => useSevenRcCreateVenuePitchMutation,
      'useSevenRcDeletePitchBlockMutation',
      () => useSevenRcDeletePitchBlockMutation,
      'useSevenRcMarkNoShowMutation',
      () => useSevenRcMarkNoShowMutation,
      'useSevenRcMyReservationsQuery',
      () => useSevenRcMyReservationsQuery,
      'useSevenRcOwnerCancelReservationMutation',
      () => useSevenRcOwnerCancelReservationMutation,
      'useSevenRcOwnerVenuePitchesQuery',
      () => useSevenRcOwnerVenuePitchesQuery,
      'useSevenRcOwnerVenueReservationsQuery',
      () => useSevenRcOwnerVenueReservationsQuery,
      'useSevenRcOwnerVenuesQuery',
      () => useSevenRcOwnerVenuesQuery,
      'useSevenRcPitchAvailabilityQuery',
      () => useSevenRcPitchAvailabilityQuery,
      'useSevenRcPitchBlocksQuery',
      () => useSevenRcPitchBlocksQuery,
      'useSevenRcPlayerVenuePitchesQuery',
      () => useSevenRcPlayerVenuePitchesQuery,
      'useSevenRcPlayerVenuesQuery',
      () => useSevenRcPlayerVenuesQuery,
      'useSevenRcRecordReservationPaymentMutation',
      () => useSevenRcRecordReservationPaymentMutation,
      'useSevenRcRejectVenueReservationMutation',
      () => useSevenRcRejectVenueReservationMutation,
      'useSevenRcUpdateVenueSettingsMutation',
      () => useSevenRcUpdateVenueSettingsMutation,
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@tanstack+react-query@5.90.21_react@19.3.0/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@tanstack+react-query@5.90.21_react@19.3.0/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@tanstack+react-query@5.90.21_react@19.3.0/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature(),
      _s1 = __turbopack_context__.k.signature(),
      _s2 = __turbopack_context__.k.signature(),
      _s3 = __turbopack_context__.k.signature(),
      _s4 = __turbopack_context__.k.signature(),
      _s5 = __turbopack_context__.k.signature(),
      _s6 = __turbopack_context__.k.signature(),
      _s7 = __turbopack_context__.k.signature(),
      _s8 = __turbopack_context__.k.signature(),
      _s9 = __turbopack_context__.k.signature(),
      _s10 = __turbopack_context__.k.signature(),
      _s11 = __turbopack_context__.k.signature(),
      _s12 = __turbopack_context__.k.signature(),
      _s13 = __turbopack_context__.k.signature(),
      _s14 = __turbopack_context__.k.signature(),
      _s15 = __turbopack_context__.k.signature(),
      _s16 = __turbopack_context__.k.signature(),
      _s17 = __turbopack_context__.k.signature(),
      _s18 = __turbopack_context__.k.signature(),
      _s19 = __turbopack_context__.k.signature(),
      _s20 = __turbopack_context__.k.signature(),
      _s21 = __turbopack_context__.k.signature(),
      _s22 = __turbopack_context__.k.signature(),
      _s23 = __turbopack_context__.k.signature(),
      _s24 = __turbopack_context__.k.signature(),
      _s25 = __turbopack_context__.k.signature();
    ('use client');
    const sevenRcQueryKeys = {
      ownerVenues: ['seven-rc', 'owner', 'venues'],
      ownerVenuePitches: (venueId) => ['seven-rc', 'owner', 'venues', venueId, 'pitches'],
      ownerVenueReservationsBase: (venueId) => [
        'seven-rc',
        'owner',
        'venues',
        venueId,
        'reservations',
      ],
      ownerVenueReservations: (venueId, dateFrom, dateTo) => [
        'seven-rc',
        'owner',
        'venues',
        venueId,
        'reservations',
        dateFrom,
        dateTo,
      ],
      playerReservations: ['seven-rc', 'player', 'reservations'],
      playerVenues: (query) => ['seven-rc', 'player', 'venues', query ?? 'all'],
      playerVenuePitches: (venueId) => ['seven-rc', 'player', 'venues', venueId, 'pitches'],
      pitchBlocks: (pitchId) => ['seven-rc', 'pitches', pitchId, 'blocks'],
      pitchAvailabilityBase: (pitchId) => ['seven-rc', 'pitches', pitchId, 'availability'],
      pitchAvailability: (pitchId, date) => ['seven-rc', 'pitches', pitchId, 'availability', date],
    };
    function useSevenRcOwnerVenuesQuery(api) {
      _s();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQuery'
      ])({
        queryKey: sevenRcQueryKeys.ownerVenues,
        queryFn: {
          'useSevenRcOwnerVenuesQuery.useQuery': () => api.listOwnerVenues(),
        }['useSevenRcOwnerVenuesQuery.useQuery'],
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnMount: false,
        refetchOnReconnect: false,
      });
    }
    _s(useSevenRcOwnerVenuesQuery, '4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQuery'
        ],
      ];
    });
    function useSevenRcCreateVenueMutation(api) {
      _s1();
      const queryClient = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQueryClient'
      ])();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSevenRcCreateVenueMutation.useMutation': (input) => api.createVenue(input),
        }['useSevenRcCreateVenueMutation.useMutation'],
        onSuccess: {
          'useSevenRcCreateVenueMutation.useMutation': () => {
            void queryClient.invalidateQueries({
              queryKey: sevenRcQueryKeys.ownerVenues,
            });
          },
        }['useSevenRcCreateVenueMutation.useMutation'],
      });
    }
    _s1(useSevenRcCreateVenueMutation, 'YK0wzM21ECnncaq5SECwU+/SVdQ=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQueryClient'
        ],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useMutation'
        ],
      ];
    });
    function useSevenRcOwnerVenuePitchesQuery(api, venueId) {
      _s2();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQuery'
      ])({
        queryKey: sevenRcQueryKeys.ownerVenuePitches(venueId ?? 'missing'),
        queryFn: {
          'useSevenRcOwnerVenuePitchesQuery.useQuery': () => {
            if (!venueId) {
              throw new Error('Venue id is required');
            }
            return api.listOwnerVenuePitches(venueId);
          },
        }['useSevenRcOwnerVenuePitchesQuery.useQuery'],
        enabled: Boolean(venueId),
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnMount: false,
        refetchOnReconnect: false,
      });
    }
    _s2(useSevenRcOwnerVenuePitchesQuery, '4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQuery'
        ],
      ];
    });
    function useSevenRcCreateVenuePitchMutation(api, venueId) {
      _s3();
      const queryClient = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQueryClient'
      ])();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSevenRcCreateVenuePitchMutation.useMutation': (input) =>
            api.createPitchForVenue(venueId, input),
        }['useSevenRcCreateVenuePitchMutation.useMutation'],
        onSuccess: {
          'useSevenRcCreateVenuePitchMutation.useMutation': () => {
            void queryClient.invalidateQueries({
              queryKey: sevenRcQueryKeys.ownerVenuePitches(venueId),
            });
            void queryClient.invalidateQueries({
              queryKey: sevenRcQueryKeys.ownerVenues,
            });
          },
        }['useSevenRcCreateVenuePitchMutation.useMutation'],
      });
    }
    _s3(useSevenRcCreateVenuePitchMutation, 'YK0wzM21ECnncaq5SECwU+/SVdQ=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQueryClient'
        ],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useMutation'
        ],
      ];
    });
    function useSevenRcConfigurePitchSlotsMutation(api, pitchId, venueId) {
      _s4();
      const queryClient = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQueryClient'
      ])();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSevenRcConfigurePitchSlotsMutation.useMutation': (input) =>
            api.configurePitchSlots(pitchId, input),
        }['useSevenRcConfigurePitchSlotsMutation.useMutation'],
        onSuccess: {
          'useSevenRcConfigurePitchSlotsMutation.useMutation': (result) => {
            if (venueId) {
              const queryKey = sevenRcQueryKeys.ownerVenuePitches(venueId);
              // The endpoint replaces the whole week: the next save must start from this result,
              // not from the list that is still refetching.
              queryClient.setQueryData(
                queryKey,
                {
                  'useSevenRcConfigurePitchSlotsMutation.useMutation': (pitches) =>
                    pitches?.map(
                      {
                        'useSevenRcConfigurePitchSlotsMutation.useMutation': (pitch) =>
                          pitch.id === result.id
                            ? {
                                ...pitch,
                                ...result,
                              }
                            : pitch,
                      }['useSevenRcConfigurePitchSlotsMutation.useMutation'],
                    ),
                }['useSevenRcConfigurePitchSlotsMutation.useMutation'],
              );
              void queryClient.invalidateQueries({
                queryKey,
              });
            }
            void queryClient.invalidateQueries({
              queryKey: sevenRcQueryKeys.pitchAvailabilityBase(pitchId),
            });
          },
        }['useSevenRcConfigurePitchSlotsMutation.useMutation'],
      });
    }
    _s4(useSevenRcConfigurePitchSlotsMutation, 'YK0wzM21ECnncaq5SECwU+/SVdQ=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQueryClient'
        ],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useMutation'
        ],
      ];
    });
    function useSevenRcOwnerVenueReservationsQuery(api, venueId, dateFrom, dateTo, options) {
      _s5();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQuery'
      ])({
        queryKey: sevenRcQueryKeys.ownerVenueReservations(venueId ?? 'missing', dateFrom, dateTo),
        queryFn: {
          'useSevenRcOwnerVenueReservationsQuery.useQuery': () => {
            if (!venueId) {
              throw new Error('Venue id is required');
            }
            return api.listVenueReservations(venueId, dateFrom, dateTo);
          },
        }['useSevenRcOwnerVenueReservationsQuery.useQuery'],
        enabled: Boolean(venueId),
        staleTime: 60 * 1000,
        gcTime: 15 * 60 * 1000,
        refetchOnMount: false,
        refetchOnReconnect: false,
        ...options,
      });
    }
    _s5(useSevenRcOwnerVenueReservationsQuery, '4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQuery'
        ],
      ];
    });
    function useSevenRcConfirmVenueReservationMutation(api, venueId) {
      _s6();
      const invalidate = useInvalidateOwnerReservation(venueId);
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSevenRcConfirmVenueReservationMutation.useMutation': (reservationId) =>
            api.confirmReservation(reservationId),
        }['useSevenRcConfirmVenueReservationMutation.useMutation'],
        onSuccess: invalidate,
      });
    }
    _s6(
      useSevenRcConfirmVenueReservationMutation,
      'AzLaC6caUgKB0fgPTVYbDOJBKDk=',
      false,
      function () {
        return [
          useInvalidateOwnerReservation,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'useMutation'
          ],
        ];
      },
    );
    function useSevenRcRejectVenueReservationMutation(api, venueId) {
      _s7();
      const invalidate = useInvalidateOwnerReservation(venueId);
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSevenRcRejectVenueReservationMutation.useMutation': (reservationId) =>
            api.rejectReservation(reservationId),
        }['useSevenRcRejectVenueReservationMutation.useMutation'],
        onSuccess: invalidate,
      });
    }
    _s7(
      useSevenRcRejectVenueReservationMutation,
      'AzLaC6caUgKB0fgPTVYbDOJBKDk=',
      false,
      function () {
        return [
          useInvalidateOwnerReservation,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'useMutation'
          ],
        ];
      },
    );
    function useSevenRcUpdateVenueSettingsMutation(api, venueId) {
      _s8();
      const queryClient = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQueryClient'
      ])();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSevenRcUpdateVenueSettingsMutation.useMutation': (input) =>
            api.updateVenueSettings(venueId, input),
        }['useSevenRcUpdateVenueSettingsMutation.useMutation'],
        onSuccess: {
          'useSevenRcUpdateVenueSettingsMutation.useMutation': () => {
            void queryClient.invalidateQueries({
              queryKey: sevenRcQueryKeys.ownerVenues,
            });
          },
        }['useSevenRcUpdateVenueSettingsMutation.useMutation'],
      });
    }
    _s8(useSevenRcUpdateVenueSettingsMutation, 'YK0wzM21ECnncaq5SECwU+/SVdQ=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQueryClient'
        ],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useMutation'
        ],
      ];
    });
    function useSevenRcConfigurePitchPricingMutation(api, pitchId, venueId) {
      _s9();
      const queryClient = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQueryClient'
      ])();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSevenRcConfigurePitchPricingMutation.useMutation': (input) =>
            api.configurePitchPricing(pitchId, input),
        }['useSevenRcConfigurePitchPricingMutation.useMutation'],
        onSuccess: {
          'useSevenRcConfigurePitchPricingMutation.useMutation': () => {
            if (venueId) {
              void queryClient.invalidateQueries({
                queryKey: sevenRcQueryKeys.ownerVenuePitches(venueId),
              });
            }
            void queryClient.invalidateQueries({
              queryKey: sevenRcQueryKeys.pitchAvailabilityBase(pitchId),
            });
          },
        }['useSevenRcConfigurePitchPricingMutation.useMutation'],
      });
    }
    _s9(
      useSevenRcConfigurePitchPricingMutation,
      'YK0wzM21ECnncaq5SECwU+/SVdQ=',
      false,
      function () {
        return [
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'useQueryClient'
          ],
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'useMutation'
          ],
        ];
      },
    );
    /** Owner reservation actions change the agenda, the venue counts and the free slots. */ function useInvalidateOwnerReservation(
      venueId,
    ) {
      _s10();
      const queryClient = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQueryClient'
      ])();
      return (reservation) => {
        const targetVenueId = venueId ?? reservation.venueId;
        void queryClient.invalidateQueries({
          queryKey: sevenRcQueryKeys.ownerVenueReservationsBase(targetVenueId),
        });
        // `exact`: every other owner key nests under `ownerVenues`, so a prefix match
        // would refetch the reservations of all venues after each action.
        void queryClient.invalidateQueries({
          queryKey: sevenRcQueryKeys.ownerVenues,
          exact: true,
        });
        void queryClient.invalidateQueries({
          queryKey: sevenRcQueryKeys.pitchAvailabilityBase(reservation.pitchId),
        });
      };
    }
    _s10(useInvalidateOwnerReservation, '4R+oYVB2Uc11P7bp1KcuhpkfaTw=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQueryClient'
        ],
      ];
    });
    function useSevenRcRecordReservationPaymentMutation(api, venueId) {
      _s11();
      const invalidate = useInvalidateOwnerReservation(venueId);
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSevenRcRecordReservationPaymentMutation.useMutation': ({ reservationId, input }) =>
            api.recordReservationPayment(reservationId, input),
        }['useSevenRcRecordReservationPaymentMutation.useMutation'],
        onSuccess: invalidate,
      });
    }
    _s11(
      useSevenRcRecordReservationPaymentMutation,
      'AzLaC6caUgKB0fgPTVYbDOJBKDk=',
      false,
      function () {
        return [
          useInvalidateOwnerReservation,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'useMutation'
          ],
        ];
      },
    );
    function useSevenRcMarkNoShowMutation(api, venueId) {
      _s12();
      const invalidate = useInvalidateOwnerReservation(venueId);
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSevenRcMarkNoShowMutation.useMutation': (reservationId) =>
            api.markNoShow(reservationId),
        }['useSevenRcMarkNoShowMutation.useMutation'],
        onSuccess: invalidate,
      });
    }
    _s12(useSevenRcMarkNoShowMutation, 'AzLaC6caUgKB0fgPTVYbDOJBKDk=', false, function () {
      return [
        useInvalidateOwnerReservation,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useMutation'
        ],
      ];
    });
    function useSevenRcCompleteReservationMutation(api, venueId) {
      _s13();
      const invalidate = useInvalidateOwnerReservation(venueId);
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSevenRcCompleteReservationMutation.useMutation': (reservationId) =>
            api.completeReservation(reservationId),
        }['useSevenRcCompleteReservationMutation.useMutation'],
        onSuccess: invalidate,
      });
    }
    _s13(useSevenRcCompleteReservationMutation, 'AzLaC6caUgKB0fgPTVYbDOJBKDk=', false, function () {
      return [
        useInvalidateOwnerReservation,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useMutation'
        ],
      ];
    });
    function useSevenRcOwnerCancelReservationMutation(api, venueId) {
      _s14();
      const invalidate = useInvalidateOwnerReservation(venueId);
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSevenRcOwnerCancelReservationMutation.useMutation': (reservationId) =>
            api.ownerCancelReservation(reservationId),
        }['useSevenRcOwnerCancelReservationMutation.useMutation'],
        onSuccess: invalidate,
      });
    }
    _s14(
      useSevenRcOwnerCancelReservationMutation,
      'AzLaC6caUgKB0fgPTVYbDOJBKDk=',
      false,
      function () {
        return [
          useInvalidateOwnerReservation,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'useMutation'
          ],
        ];
      },
    );
    function useSevenRcCreateOwnerReservationMutation(api, venueId) {
      _s15();
      const invalidate = useInvalidateOwnerReservation(venueId);
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSevenRcCreateOwnerReservationMutation.useMutation': (input) =>
            api.createOwnerReservation(venueId, input),
        }['useSevenRcCreateOwnerReservationMutation.useMutation'],
        onSuccess: invalidate,
      });
    }
    _s15(
      useSevenRcCreateOwnerReservationMutation,
      'AzLaC6caUgKB0fgPTVYbDOJBKDk=',
      false,
      function () {
        return [
          useInvalidateOwnerReservation,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'useMutation'
          ],
        ];
      },
    );
    function useSevenRcMyReservationsQuery(api, options) {
      _s16();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQuery'
      ])({
        queryKey: sevenRcQueryKeys.playerReservations,
        queryFn: {
          'useSevenRcMyReservationsQuery.useQuery': () => api.listMyReservations(),
        }['useSevenRcMyReservationsQuery.useQuery'],
        staleTime: 60 * 1000,
        gcTime: 15 * 60 * 1000,
        refetchOnMount: false,
        refetchOnReconnect: false,
        ...options,
      });
    }
    _s16(useSevenRcMyReservationsQuery, '4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQuery'
        ],
      ];
    });
    function useSevenRcPlayerVenuesQuery(api, query) {
      _s17();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQuery'
      ])({
        queryKey: sevenRcQueryKeys.playerVenues(query),
        queryFn: {
          'useSevenRcPlayerVenuesQuery.useQuery': () => api.listVenues(query),
        }['useSevenRcPlayerVenuesQuery.useQuery'],
        staleTime: 60 * 1000,
        gcTime: 15 * 60 * 1000,
        refetchOnMount: false,
        refetchOnReconnect: false,
      });
    }
    _s17(useSevenRcPlayerVenuesQuery, '4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQuery'
        ],
      ];
    });
    function useSevenRcPlayerVenuePitchesQuery(api, venueId) {
      _s18();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQuery'
      ])({
        queryKey: sevenRcQueryKeys.playerVenuePitches(venueId ?? 'missing'),
        queryFn: {
          'useSevenRcPlayerVenuePitchesQuery.useQuery': () => {
            if (!venueId) {
              throw new Error('Venue id is required');
            }
            return api.listVenuePitches(venueId);
          },
        }['useSevenRcPlayerVenuePitchesQuery.useQuery'],
        enabled: Boolean(venueId),
        staleTime: 60 * 1000,
        gcTime: 15 * 60 * 1000,
        refetchOnMount: false,
        refetchOnReconnect: false,
      });
    }
    _s18(useSevenRcPlayerVenuePitchesQuery, '4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQuery'
        ],
      ];
    });
    function useSevenRcPitchAvailabilityQuery(api, pitchId, date) {
      _s19();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQuery'
      ])({
        queryKey: sevenRcQueryKeys.pitchAvailability(pitchId ?? 'missing', date ?? 'missing'),
        queryFn: {
          'useSevenRcPitchAvailabilityQuery.useQuery': () => {
            if (!pitchId || !date) {
              throw new Error('Pitch id and date are required');
            }
            return api.getPitchAvailability(pitchId, date);
          },
        }['useSevenRcPitchAvailabilityQuery.useQuery'],
        enabled: Boolean(pitchId && date),
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnMount: 'always',
        refetchOnReconnect: false,
      });
    }
    _s19(useSevenRcPitchAvailabilityQuery, '4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQuery'
        ],
      ];
    });
    function useSevenRcCreateReservationMutation(api) {
      _s20();
      const queryClient = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQueryClient'
      ])();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSevenRcCreateReservationMutation.useMutation': (input) =>
            api.createReservation(input),
        }['useSevenRcCreateReservationMutation.useMutation'],
        onSuccess: {
          'useSevenRcCreateReservationMutation.useMutation': () => {
            void queryClient.invalidateQueries({
              queryKey: sevenRcQueryKeys.playerReservations,
            });
          },
        }['useSevenRcCreateReservationMutation.useMutation'],
        // Success takes the slot; a conflict means the list on screen is stale. Both refetch.
        onSettled: {
          'useSevenRcCreateReservationMutation.useMutation': (_reservation, _error, input) => {
            void queryClient.invalidateQueries({
              queryKey: sevenRcQueryKeys.pitchAvailabilityBase(input.pitchId),
            });
          },
        }['useSevenRcCreateReservationMutation.useMutation'],
      });
    }
    _s20(useSevenRcCreateReservationMutation, 'YK0wzM21ECnncaq5SECwU+/SVdQ=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQueryClient'
        ],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useMutation'
        ],
      ];
    });
    function useSevenRcCancelReservationMutation(api) {
      _s21();
      const queryClient = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQueryClient'
      ])();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSevenRcCancelReservationMutation.useMutation': (reservationId) =>
            api.cancelReservation(reservationId),
        }['useSevenRcCancelReservationMutation.useMutation'],
        onSuccess: {
          'useSevenRcCancelReservationMutation.useMutation': (reservation) => {
            void queryClient.invalidateQueries({
              queryKey: sevenRcQueryKeys.playerReservations,
            });
            void queryClient.invalidateQueries({
              queryKey: sevenRcQueryKeys.pitchAvailabilityBase(reservation.pitchId),
            });
          },
        }['useSevenRcCancelReservationMutation.useMutation'],
      });
    }
    _s21(useSevenRcCancelReservationMutation, 'YK0wzM21ECnncaq5SECwU+/SVdQ=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQueryClient'
        ],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useMutation'
        ],
      ];
    });
    function useSevenRcPitchBlocksQuery(api, pitchId, from) {
      _s22();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQuery'
      ])({
        queryKey: sevenRcQueryKeys.pitchBlocks(pitchId ?? 'missing'),
        queryFn: {
          'useSevenRcPitchBlocksQuery.useQuery': () => {
            if (!pitchId) {
              throw new Error('Pitch id is required');
            }
            return api.listPitchBlocks(pitchId, from);
          },
        }['useSevenRcPitchBlocksQuery.useQuery'],
        enabled: Boolean(pitchId),
        staleTime: 60 * 1000,
        refetchOnReconnect: false,
      });
    }
    _s22(useSevenRcPitchBlocksQuery, '4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQuery'
        ],
      ];
    });
    /** A block changes which slots are free: refresh the list and the pitch availability. */ function useInvalidatePitchBlocks(
      pitchId,
    ) {
      _s23();
      const queryClient = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useQueryClient'
      ])();
      return () => {
        void queryClient.invalidateQueries({
          queryKey: sevenRcQueryKeys.pitchBlocks(pitchId),
        });
        void queryClient.invalidateQueries({
          queryKey: sevenRcQueryKeys.pitchAvailabilityBase(pitchId),
        });
      };
    }
    _s23(useInvalidatePitchBlocks, '4R+oYVB2Uc11P7bp1KcuhpkfaTw=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useQueryClient'
        ],
      ];
    });
    function useSevenRcCreatePitchBlockMutation(api, pitchId) {
      _s24();
      const invalidate = useInvalidatePitchBlocks(pitchId);
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSevenRcCreatePitchBlockMutation.useMutation': (input) =>
            api.createPitchBlock(pitchId, input),
        }['useSevenRcCreatePitchBlockMutation.useMutation'],
        onSuccess: invalidate,
      });
    }
    _s24(useSevenRcCreatePitchBlockMutation, '3DXOwUR0r6FPE4S8HIdkjCINm/c=', false, function () {
      return [
        useInvalidatePitchBlocks,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useMutation'
        ],
      ];
    });
    function useSevenRcDeletePitchBlockMutation(api, pitchId) {
      _s25();
      const invalidate = useInvalidatePitchBlocks(pitchId);
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMutation'
      ])({
        mutationFn: {
          'useSevenRcDeletePitchBlockMutation.useMutation': (blockId) =>
            api.deletePitchBlock(pitchId, blockId),
        }['useSevenRcDeletePitchBlockMutation.useMutation'],
        onSuccess: invalidate,
      });
    }
    _s25(useSevenRcDeletePitchBlockMutation, '3DXOwUR0r6FPE4S8HIdkjCINm/c=', false, function () {
      return [
        useInvalidatePitchBlocks,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useMutation'
        ],
      ];
    });
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/modules/seven-reservations-club/src/query/useRoleGate.ts [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['useRoleGate', () => useRoleGate]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/onboarding-role.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$role$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/query/role-query.ts [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    ('use client');
    function useRoleGate({ required, router, onboardingPath = '/onboarding/role', ready = true }) {
      _s();
      const { role, isLoading } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$role$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useCurrentUserRoleQuery'
      ])();
      (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useEffect'
      ])(
        {
          'useRoleGate.useEffect': () => {
            if (!ready || isLoading) return;
            if (role === null || role === undefined) {
              if (required === '*') {
                router.replace(onboardingPath);
              }
              return;
            }
            if (role !== required && required !== '*') {
              router.replace(
                (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'getSevenReservationsClubRoleHomePath'
                ])(role),
              );
            }
          },
        }['useRoleGate.useEffect'],
        [isLoading, onboardingPath, ready, required, role, router],
      );
      if (!ready || isLoading) {
        return {
          allowed: false,
          isLoading: true,
        };
      }
      if (role === null || role === undefined) {
        return {
          allowed: required === '*',
          isLoading: false,
        };
      }
      if (required === '*') {
        return {
          allowed: true,
          isLoading: false,
        };
      }
      return {
        allowed: role === required,
        isLoading: false,
      };
    }
    _s(useRoleGate, 'Rc7FEH+jiLC+f8yomOlcaz6sC+A=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$role$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useCurrentUserRoleQuery'
        ],
      ];
    });
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/modules/seven-reservations-club/src/client.ts [app-client] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/onboarding-role.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$sdk$2f$seven$2d$rc$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/sdk/seven-rc-api.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$components$2f$OnboardingRoleSelector$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/components/OnboardingRoleSelector.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$RoleDataSourceProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/query/RoleDataSourceProvider.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$role$2d$data$2d$source$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/query/role-data-source.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$role$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/query/role-query.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$query$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/query/query-client.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$seven$2d$rc$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/query/seven-rc-query.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$useRoleGate$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/query/useRoleGate.ts [app-client] (ecmascript)',
      );
    ('use client');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/apps/seven-rc-web/lib/seven-rc-format.ts [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'DEFAULT_TIMEZONE',
      () => DEFAULT_TIMEZONE,
      'DISPLAY_LOCALE',
      () => DISPLAY_LOCALE,
      'SPORT_OPTIONS',
      () => SPORT_OPTIONS,
      'VENUE_TIMEZONE_OPTIONS',
      () => VENUE_TIMEZONE_OPTIONS,
      'WEEKDAYS',
      () => WEEKDAYS,
      'addDaysToDateKey',
      () => addDaysToDateKey,
      'dateKeyInTimeZone',
      () => dateKeyInTimeZone,
      'formatBeforeTime',
      () => formatBeforeTime,
      'formatDateKey',
      () => formatDateKey,
      'formatDuration',
      () => formatDuration,
      'formatLongDate',
      () => formatLongDate,
      'formatMoneyMinor',
      () => formatMoneyMinor,
      'formatSlotWhen',
      () => formatSlotWhen,
      'formatTime',
      () => formatTime,
      'formatTimeRange',
      () => formatTimeRange,
      'formatUpdatedAgo',
      () => formatUpdatedAgo,
      'hourInTimeZone',
      () => hourInTimeZone,
      'minutesBetween',
      () => minutesBetween,
      'reservationStatus',
      () => reservationStatus,
      'safeTimeZone',
      () => safeTimeZone,
      'sportLabel',
      () => sportLabel,
      'zonedTimeToInstant',
      () => zonedTimeToInstant,
    ]);
    const DISPLAY_LOCALE = 'es-CO';
    const DEFAULT_TIMEZONE = 'America/Bogota';
    const VENUE_TIMEZONE_OPTIONS = [
      {
        value: 'America/Bogota',
        label: 'Colombia (Bogotá)',
      },
      {
        value: 'America/Mexico_City',
        label: 'México (Ciudad de México)',
      },
      {
        value: 'America/Lima',
        label: 'Perú (Lima)',
      },
      {
        value: 'America/Guayaquil',
        label: 'Ecuador (Guayaquil)',
      },
      {
        value: 'America/Panama',
        label: 'Panamá',
      },
      {
        value: 'America/Caracas',
        label: 'Venezuela (Caracas)',
      },
      {
        value: 'America/Santiago',
        label: 'Chile (Santiago)',
      },
      {
        value: 'America/Argentina/Buenos_Aires',
        label: 'Argentina (Buenos Aires)',
      },
      {
        value: 'America/Sao_Paulo',
        label: 'Brasil (São Paulo)',
      },
      {
        value: 'America/Montevideo',
        label: 'Uruguay (Montevideo)',
      },
      {
        value: 'America/Asuncion',
        label: 'Paraguay (Asunción)',
      },
      {
        value: 'America/La_Paz',
        label: 'Bolivia (La Paz)',
      },
      {
        value: 'America/Costa_Rica',
        label: 'Costa Rica',
      },
      {
        value: 'America/Guatemala',
        label: 'Guatemala',
      },
      {
        value: 'America/El_Salvador',
        label: 'El Salvador',
      },
      {
        value: 'America/Tegucigalpa',
        label: 'Honduras (Tegucigalpa)',
      },
      {
        value: 'America/Managua',
        label: 'Nicaragua (Managua)',
      },
      {
        value: 'America/Santo_Domingo',
        label: 'República Dominicana',
      },
      {
        value: 'America/Puerto_Rico',
        label: 'Puerto Rico',
      },
      {
        value: 'America/New_York',
        label: 'Estados Unidos (Nueva York)',
      },
      {
        value: 'America/Chicago',
        label: 'Estados Unidos (Chicago)',
      },
      {
        value: 'America/Los_Angeles',
        label: 'Estados Unidos (Los Ángeles)',
      },
      {
        value: 'Europe/Madrid',
        label: 'España (Madrid)',
      },
    ];
    const WEEKDAYS = [
      {
        value: 1,
        label: 'Lunes',
      },
      {
        value: 2,
        label: 'Martes',
      },
      {
        value: 3,
        label: 'Miércoles',
      },
      {
        value: 4,
        label: 'Jueves',
      },
      {
        value: 5,
        label: 'Viernes',
      },
      {
        value: 6,
        label: 'Sábado',
      },
      {
        value: 0,
        label: 'Domingo',
      },
    ];
    const SPORT_OPTIONS = [
      {
        value: 'futbol-5',
        label: 'Fútbol 5',
      },
      {
        value: 'futbol-7',
        label: 'Fútbol 7',
      },
      {
        value: 'futbol-8',
        label: 'Fútbol 8',
      },
      {
        value: 'futbol-11',
        label: 'Fútbol 11',
      },
      {
        value: 'padel',
        label: 'Pádel',
      },
      {
        value: 'tenis',
        label: 'Tenis',
      },
      {
        value: 'baloncesto',
        label: 'Baloncesto',
      },
      {
        value: 'voleibol',
        label: 'Voleibol',
      },
    ];
    function sportLabel(value) {
      return SPORT_OPTIONS.find((option) => option.value === value)?.label ?? value;
    }
    function safeTimeZone(timeZone) {
      if (!timeZone) return DEFAULT_TIMEZONE;
      try {
        new Intl.DateTimeFormat(DISPLAY_LOCALE, {
          timeZone,
        });
        return timeZone;
      } catch {
        return DEFAULT_TIMEZONE;
      }
    }
    function dateKeyInTimeZone(instant, timeZone) {
      const date = typeof instant === 'string' ? new Date(instant) : instant;
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).formatToParts(date);
      const read = (type) => parts.find((part) => part.type === type)?.value ?? '00';
      return `${read('year')}-${read('month')}-${read('day')}`;
    }
    function dateKeyToUtcNoon(dateKey) {
      const [year = 1970, month = 1, day = 1] = dateKey.split('-').map(Number);
      return new Date(Date.UTC(year, month - 1, day, 12));
    }
    function addDaysToDateKey(dateKey, days) {
      const base = dateKeyToUtcNoon(dateKey);
      base.setUTCDate(base.getUTCDate() + days);
      return base.toISOString().slice(0, 10);
    }
    function formatDateKey(dateKey, options) {
      return new Intl.DateTimeFormat(DISPLAY_LOCALE, {
        ...options,
        timeZone: 'UTC',
      }).format(dateKeyToUtcNoon(dateKey));
    }
    function formatLongDate(dateKey) {
      return formatDateKey(dateKey, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    }
    function formatTime(instant, timeZone) {
      return new Intl.DateTimeFormat(DISPLAY_LOCALE, {
        timeZone,
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(instant));
    }
    function formatBeforeTime(instant, timeZone) {
      const time = formatTime(instant, timeZone);
      return `antes de ${time.startsWith('1:') ? 'la' : 'las'} ${time}`;
    }
    function formatTimeRange(startAt, endAt, timeZone) {
      return `${formatTime(startAt, timeZone)} – ${formatTime(endAt, timeZone)}`;
    }
    function formatSlotWhen(startAt, endAt, timeZone) {
      return `${formatLongDate(dateKeyInTimeZone(startAt, timeZone))} · ${formatTimeRange(startAt, endAt, timeZone)}`;
    }
    function formatDuration(minutes) {
      if (minutes < 60) return `${minutes} min`;
      const hours = Math.floor(minutes / 60);
      const rest = minutes % 60;
      return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
    }
    function minutesBetween(startAt, endAt) {
      return Math.round((new Date(endAt).getTime() - new Date(startAt).getTime()) / 60_000);
    }
    function formatMoneyMinor(amountMinor, currency) {
      const amount = amountMinor / 100;
      try {
        return new Intl.NumberFormat(DISPLAY_LOCALE, {
          style: 'currency',
          currency,
          minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
          maximumFractionDigits: 2,
        }).format(amount);
      } catch {
        return `${amount.toLocaleString(DISPLAY_LOCALE)} ${currency}`;
      }
    }
    const STATUS_COPY = {
      pending_confirmation: {
        label: 'Pendiente de confirmación',
        variant: 'warning',
      },
      confirmed: {
        label: 'Confirmada',
        variant: 'success',
      },
      rejected: {
        label: 'Rechazada',
        variant: 'destructive',
      },
      cancelled: {
        label: 'Cancelada',
        variant: 'neutral',
      },
      completed: {
        label: 'Completada',
        variant: 'info',
      },
      expired: {
        label: 'Vencida',
        variant: 'neutral',
      },
      no_show: {
        label: 'No asistió',
        variant: 'destructive',
      },
    };
    function reservationStatus(status) {
      return (
        STATUS_COPY[status] ?? {
          label: status.replaceAll('_', ' '),
          variant: 'neutral',
        }
      );
    }
    function formatUpdatedAgo(updatedAt, now) {
      if (!updatedAt) return 'Sin actualizar todavía';
      const minutes = Math.floor(Math.max(0, now - updatedAt) / 60_000);
      if (minutes < 1) return 'Actualizado hace un momento';
      if (minutes < 60) return `Actualizado hace ${minutes} min`;
      const hours = Math.floor(minutes / 60);
      return hours === 1 ? 'Actualizado hace 1 h' : `Actualizado hace ${hours} h`;
    }
    function hourInTimeZone(instant, timeZone) {
      const hour = new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        hourCycle: 'h23',
      }).format(new Date(instant));
      return Number(hour) % 24;
    }
    function zonedTimeToInstant(dateKey, time, timeZone) {
      const [year = 1970, month = 1, day = 1] = dateKey.split('-').map(Number);
      const [hour = 0, minute = 0] = time.split(':').map(Number);
      const wall = Date.UTC(year, month - 1, day, hour, minute);
      const offsetAt = (instant) => {
        const parts = new Intl.DateTimeFormat('en-CA', {
          timeZone,
          hourCycle: 'h23',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).formatToParts(new Date(instant));
        const read = (type) => Number(parts.find((part) => part.type === type)?.value ?? 0);
        const asUtc = Date.UTC(
          read('year'),
          read('month') - 1,
          read('day'),
          read('hour'),
          read('minute'),
        );
        return asUtc - instant;
      };
      const first = wall - offsetAt(wall);
      return new Date(wall - offsetAt(first));
    }
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/apps/seven-rc-web/lib/use-now.ts [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['useNow', () => useNow]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    ('use client');
    /**
     * Shared wall-clock tick for relative labels ("hace 3 min"). One interval serves
     * every subscriber and stops when the last one unmounts. Server render reads 0,
     * which callers treat as "just now".
     */ const TICK_MS = 15_000;
    let current = 0;
    let timer = null;
    const listeners = new Set();
    function subscribe(listener) {
      listeners.add(listener);
      current = Date.now();
      timer ??= setInterval(() => {
        current = Date.now();
        for (const notify of listeners) notify();
      }, TICK_MS);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && timer) {
          clearInterval(timer);
          timer = null;
        }
      };
    }
    const getSnapshot = () => current;
    const getServerSnapshot = () => 0;
    function useNow() {
      _s();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useSyncExternalStore'
      ])(subscribe, getSnapshot, getServerSnapshot);
    }
    _s(useNow, 'FpwL93IKMLJZuQQXefVtWynbBPQ=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useSyncExternalStore'
        ],
      ];
    });
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'ChoiceChip',
      () => ChoiceChip,
      'ConfirmDialog',
      () => ConfirmDialog,
      'HintedInput',
      () => HintedInput,
      'InlineError',
      () => InlineError,
      'InlineStatus',
      () => InlineStatus,
      'ListSkeleton',
      () => ListSkeleton,
      'RefreshControl',
      () => RefreshControl,
      'SectionHeader',
      () => SectionHeader,
      'SelectField',
      () => SelectField,
      'TextAreaField',
      () => TextAreaField,
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui/src/index.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/ui-web/src/index.ts [app-client] (ecmascript)');
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$seven$2d$rc$2d$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/lib/seven-rc-format.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$use$2d$now$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/lib/use-now.ts [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature(),
      _s1 = __turbopack_context__.k.signature(),
      _s2 = __turbopack_context__.k.signature(),
      _s3 = __turbopack_context__.k.signature(),
      _s4 = __turbopack_context__.k.signature();
    ('use client');
    function SelectField({
      label,
      name,
      value,
      onChangeValue,
      options,
      hint,
      required,
      disabled,
      placeholder,
    }) {
      _s();
      const id = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useId'
      ])();
      const hintId = `${id}-hint`;
      const classes = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'inputRecipe'
      ])({
        state: disabled ? 'disabled' : 'default',
        platform: 'web',
      });
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          className: classes.root,
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'label',
              {
                htmlFor: id,
                className: classes.fieldLabel,
                children: label,
              },
              void 0,
              false,
              {
                fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                lineNumber: 53,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'select',
              {
                id: id,
                name: name,
                value: value,
                required: required,
                disabled: disabled,
                'aria-describedby': hint ? hintId : undefined,
                onChange: (event) => onChangeValue(event.target.value),
                className: (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'cx'
                ])(classes.control, 'cursor-pointer appearance-auto'),
                children: [
                  placeholder
                    ? /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        'option',
                        {
                          value: '',
                          disabled: true,
                          children: placeholder,
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                          lineNumber: 67,
                          columnNumber: 11,
                        },
                        this,
                      )
                    : null,
                  options.map((option) =>
                    /*#__PURE__*/ (0,
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                      'jsxDEV'
                    ])(
                      'option',
                      {
                        value: option.value,
                        children: option.label,
                      },
                      option.value,
                      false,
                      {
                        fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                        lineNumber: 72,
                        columnNumber: 11,
                      },
                      this,
                    ),
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                lineNumber: 56,
                columnNumber: 7,
              },
              this,
            ),
            hint
              ? /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'p',
                  {
                    id: hintId,
                    className: 'm-0 text-sm leading-[18px] text-muted',
                    children: hint,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                    lineNumber: 78,
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
          fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
          lineNumber: 52,
          columnNumber: 5,
        },
        this,
      );
    }
    _s(SelectField, 'WhsuKpSQZEWeFcB7gWlfDRQktoQ=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useId'
        ],
      ];
    });
    _c = SelectField;
    function InlineError({ message, id }) {
      if (!message) return null;
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'p',
        {
          id: id,
          role: 'alert',
          className:
            'm-0 rounded-[var(--radius-md)] border border-destructive/50 bg-feedback-error-soft px-3 py-2 text-sm leading-[18px] text-text',
          children: message,
        },
        void 0,
        false,
        {
          fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
          lineNumber: 90,
          columnNumber: 5,
        },
        this,
      );
    }
    _c1 = InlineError;
    function InlineStatus({ message }) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'p',
        {
          'aria-live': 'polite',
          className: 'm-0 min-h-[18px] text-sm leading-[18px] text-muted',
          children: message ?? '',
        },
        void 0,
        false,
        {
          fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
          lineNumber: 103,
          columnNumber: 5,
        },
        this,
      );
    }
    _c2 = InlineStatus;
    /** Hint line under a field, tied to the control with aria-describedby. */ function FieldHint({
      id,
      children,
    }) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'p',
        {
          id: id,
          className: 'm-0 text-sm leading-[18px] text-muted',
          children: children,
        },
        void 0,
        false,
        {
          fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
          lineNumber: 112,
          columnNumber: 5,
        },
        this,
      );
    }
    _c3 = FieldHint;
    function HintedInput({ hint, errorMessage = null, ...props }) {
      _s1();
      const hintId = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useId'
      ])();
      const errorId = `${hintId}-error`;
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          className: 'grid content-start gap-xs',
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                'AppInput'
              ],
              {
                ...props,
                error: Boolean(errorMessage),
                'aria-describedby': errorMessage ? `${hintId} ${errorId}` : hintId,
              },
              void 0,
              false,
              {
                fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                lineNumber: 128,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              FieldHint,
              {
                id: hintId,
                children: hint,
              },
              void 0,
              false,
              {
                fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                lineNumber: 133,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              InlineError,
              {
                id: errorId,
                message: errorMessage,
              },
              void 0,
              false,
              {
                fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                lineNumber: 134,
                columnNumber: 7,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
          lineNumber: 127,
          columnNumber: 5,
        },
        this,
      );
    }
    _s1(HintedInput, 'wZ2PiQBNu3bwZKaAaVs617zgYa8=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useId'
        ],
      ];
    });
    _c4 = HintedInput;
    function TextAreaField({
      label,
      name,
      value,
      onChangeValue,
      hint,
      maxLength,
      rows = 3,
      placeholder,
    }) {
      _s2();
      const id = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useId'
      ])();
      const hintId = `${id}-hint`;
      const classes = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'inputRecipe'
      ])({
        state: 'default',
        platform: 'web',
      });
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          className: classes.root,
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'label',
              {
                htmlFor: id,
                className: classes.fieldLabel,
                children: label,
              },
              void 0,
              false,
              {
                fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                lineNumber: 163,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'textarea',
              {
                id: id,
                name: name,
                value: value,
                rows: rows,
                maxLength: maxLength,
                placeholder: placeholder,
                'aria-describedby': hint ? hintId : undefined,
                onChange: (event) => onChangeValue(event.target.value),
                className: (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'cx'
                ])(classes.control, 'h-auto min-h-[88px] resize-y py-2 leading-[1.5]'),
              },
              void 0,
              false,
              {
                fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                lineNumber: 166,
                columnNumber: 7,
              },
              this,
            ),
            hint
              ? /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  FieldHint,
                  {
                    id: hintId,
                    children: hint,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                    lineNumber: 177,
                    columnNumber: 15,
                  },
                  this,
                )
              : null,
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
          lineNumber: 162,
          columnNumber: 5,
        },
        this,
      );
    }
    _s2(TextAreaField, 'WhsuKpSQZEWeFcB7gWlfDRQktoQ=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useId'
        ],
      ];
    });
    _c5 = TextAreaField;
    function SectionHeader({ id, title, description, aside }) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'header',
        {
          className: 'flex flex-wrap items-end justify-between gap-sm',
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'div',
              {
                className: 'grid gap-xs',
                children: [
                  /*#__PURE__*/ (0,
                  __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                    'jsxDEV'
                  ])(
                    'h2',
                    {
                      id: id,
                      className: 'm-0 font-arvo text-xl leading-[1.25] text-text',
                      children: title,
                    },
                    void 0,
                    false,
                    {
                      fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                      lineNumber: 196,
                      columnNumber: 9,
                    },
                    this,
                  ),
                  description
                    ? /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        'p',
                        {
                          className:
                            'm-0 max-w-[var(--container-measure)] text-md leading-[1.5] text-muted',
                          children: description,
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                          lineNumber: 200,
                          columnNumber: 11,
                        },
                        this,
                      )
                    : null,
                ],
              },
              void 0,
              true,
              {
                fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                lineNumber: 195,
                columnNumber: 7,
              },
              this,
            ),
            aside,
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
          lineNumber: 194,
          columnNumber: 5,
        },
        this,
      );
    }
    _c6 = SectionHeader;
    function ListSkeleton({ rows = 3, label }) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          role: 'status',
          'aria-label': label,
          className: 'grid gap-sm',
          children: Array.from(
            {
              length: rows,
            },
            (_, index) =>
              /*#__PURE__*/ (0,
              __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                'jsxDEV'
              ])(
                __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'AppSkeleton'
                ],
                {
                  height: 72,
                  rounded: 'lg',
                },
                index,
                false,
                {
                  fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                  lineNumber: 214,
                  columnNumber: 9,
                },
                this,
              ),
          ),
        },
        void 0,
        false,
        {
          fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
          lineNumber: 212,
          columnNumber: 5,
        },
        this,
      );
    }
    _c7 = ListSkeleton;
    function ConfirmDialog({
      dialogRef,
      title,
      children,
      confirmLabel,
      pendingLabel,
      dismissLabel,
      isPending,
      error,
      onConfirm,
      onClosed,
      tone = 'destructive',
    }) {
      _s3();
      const titleId = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useId'
      ])();
      const bodyId = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useId'
      ])();
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'dialog',
        {
          ref: dialogRef,
          'aria-labelledby': titleId,
          'aria-describedby': bodyId,
          onCancel: (event) => {
            if (isPending) event.preventDefault();
          },
          onClose: onClosed,
          className:
            'm-auto w-[min(92vw,440px)] rounded-[var(--radius-lg)] border border-border-strong bg-surface p-lg text-text shadow-panel-strong backdrop:bg-brand-dark/50',
          children: /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            'div',
            {
              className: 'grid gap-md',
              children: [
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'h2',
                  {
                    id: titleId,
                    className: 'm-0 font-arvo text-lg leading-[1.3]',
                    children: title,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                    lineNumber: 267,
                    columnNumber: 9,
                  },
                  this,
                ),
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'div',
                  {
                    id: bodyId,
                    className: 'grid gap-sm text-md leading-[1.5] text-muted',
                    children: children,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                    lineNumber: 270,
                    columnNumber: 9,
                  },
                  this,
                ),
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  InlineError,
                  {
                    message: error,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                    lineNumber: 273,
                    columnNumber: 9,
                  },
                  this,
                ),
                /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'div',
                  {
                    className: 'flex flex-col-reverse gap-sm sm:flex-row sm:justify-end',
                    children: [
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                          'AppButton'
                        ],
                        {
                          variant: 'neutral',
                          fullWidth: false,
                          disabled: isPending,
                          onPress: () => dialogRef.current?.close(),
                          children: dismissLabel,
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                          lineNumber: 275,
                          columnNumber: 11,
                        },
                        this,
                      ),
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                          'AppButton'
                        ],
                        {
                          variant: tone === 'primary' ? 'primary' : 'destructive',
                          fullWidth: false,
                          disabled: isPending,
                          onPress: onConfirm,
                          children: isPending ? pendingLabel : confirmLabel,
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                          lineNumber: 283,
                          columnNumber: 11,
                        },
                        this,
                      ),
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                    lineNumber: 274,
                    columnNumber: 9,
                  },
                  this,
                ),
              ],
            },
            void 0,
            true,
            {
              fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
              lineNumber: 266,
              columnNumber: 7,
            },
            this,
          ),
        },
        void 0,
        false,
        {
          fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
          lineNumber: 256,
          columnNumber: 5,
        },
        this,
      );
    }
    _s3(ConfirmDialog, 'h4v/waRd18HOoOPfwgXXas9hn2Q=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useId'
        ],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useId'
        ],
      ];
    });
    _c8 = ConfirmDialog;
    function ChoiceChip({
      name,
      value,
      checked,
      disabled,
      onSelect,
      ariaLabel,
      className,
      children,
    }) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'label',
        {
          className: (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'cx'
          ])(
            'relative flex min-h-11 cursor-pointer select-none flex-col justify-center rounded-[var(--radius-md)] border border-border-strong bg-surface px-3 py-2 text-text transition-colors',
            'hover:border-action-primary',
            'has-[:checked]:border-action-primary has-[:checked]:bg-action-primary-soft',
            'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-action-primary/40',
            'has-[:disabled]:cursor-not-allowed has-[:disabled]:border-border-default has-[:disabled]:bg-transparent has-[:disabled]:text-muted has-[:disabled]:hover:border-border-default',
            className,
          ),
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'input',
              {
                type: 'radio',
                name: name,
                value: value,
                checked: checked,
                disabled: disabled,
                'aria-label': ariaLabel,
                onChange: () => onSelect(value),
                className: 'sr-only',
              },
              void 0,
              false,
              {
                fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                lineNumber: 328,
                columnNumber: 7,
              },
              this,
            ),
            children,
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
          lineNumber: 318,
          columnNumber: 5,
        },
        this,
      );
    }
    _c9 = ChoiceChip;
    function RefreshControl({ dataUpdatedAt, isFetching, onRefresh, label = 'Actualizar' }) {
      _s4();
      const now = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$use$2d$now$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useNow'
      ])();
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        'div',
        {
          className: 'flex flex-wrap items-center gap-sm',
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'p',
              {
                className: 'm-0 text-sm leading-[18px] text-muted tabular-nums',
                children: isFetching
                  ? 'Actualizando…'
                  : (0,
                    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$seven$2d$rc$2d$format$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                      'formatUpdatedAgo'
                    ])(dataUpdatedAt, now || dataUpdatedAt),
              },
              void 0,
              false,
              {
                fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                lineNumber: 361,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                'AppButton'
              ],
              {
                variant: 'neutral',
                compact: true,
                fullWidth: false,
                'aria-busy': isFetching,
                onPress: () => {
                  // Stay enabled while fetching so the button keeps keyboard focus.
                  if (!isFetching) onRefresh();
                },
                children: /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'span',
                  {
                    className: 'inline-flex items-center gap-xs',
                    children: [
                      /*#__PURE__*/ (0,
                      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                        'jsxDEV'
                      ])(
                        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                          'RefreshCcw'
                        ],
                        {
                          size: 14,
                          'aria-hidden': true,
                          className: isFetching ? 'motion-safe:animate-spin' : '',
                        },
                        void 0,
                        false,
                        {
                          fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                          lineNumber: 375,
                          columnNumber: 11,
                        },
                        this,
                      ),
                      label,
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                    lineNumber: 374,
                    columnNumber: 9,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
                lineNumber: 364,
                columnNumber: 7,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx',
          lineNumber: 360,
          columnNumber: 5,
        },
        this,
      );
    }
    _s4(RefreshControl, 't70lBptlS54ZF8dxX2pScDbDMW0=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$use$2d$now$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useNow'
        ],
      ];
    });
    _c10 = RefreshControl;
    var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
    __turbopack_context__.k.register(_c, 'SelectField');
    __turbopack_context__.k.register(_c1, 'InlineError');
    __turbopack_context__.k.register(_c2, 'InlineStatus');
    __turbopack_context__.k.register(_c3, 'FieldHint');
    __turbopack_context__.k.register(_c4, 'HintedInput');
    __turbopack_context__.k.register(_c5, 'TextAreaField');
    __turbopack_context__.k.register(_c6, 'SectionHeader');
    __turbopack_context__.k.register(_c7, 'ListSkeleton');
    __turbopack_context__.k.register(_c8, 'ConfirmDialog');
    __turbopack_context__.k.register(_c9, 'ChoiceChip');
    __turbopack_context__.k.register(_c10, 'RefreshControl');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/modules/seven-reservations-club/src/index.ts [app-client] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'SevenReservationsClubEntitySchema',
      () => SevenReservationsClubEntitySchema,
      'SevenReservationsClubFeatureFlags',
      () => SevenReservationsClubFeatureFlags,
      'validateSevenReservationsClubEntity',
      () => validateSevenReservationsClubEntity,
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/onboarding-role.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$sdk$2f$seven$2d$rc$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/sdk/seven-rc-api.ts [app-client] (ecmascript)',
      );
    const SevenReservationsClubEntitySchema =
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
        'z'
      ].object({
        id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
          'z'
        ]
          .string()
          .uuid(),
        tenantId:
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
            'z'
          ]
            .string()
            .min(1),
        createdAt:
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
            'z'
          ]
            .string()
            .datetime(),
        updatedAt:
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$4$2e$4$2e$3$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__[
            'z'
          ]
            .string()
            .datetime(),
      });
    const SevenReservationsClubFeatureFlags = {
      enableV2Flow: 'seven-reservations-club.enable_v2_flow',
      enableAdvancedAnalytics: 'seven-reservations-club.enable_advanced_analytics',
    };
    function validateSevenReservationsClubEntity(input) {
      return SevenReservationsClubEntitySchema.parse(input);
    }
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/apps/seven-rc-web/lib/seven-rc-errors.ts [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'describeError',
      () => describeError,
      'isSlotConflict',
      () => isSlotConflict,
    ]);
    /**
     * Maps server/SDK errors to Spanish copy a player or owner can act on.
     * Known server messages win; otherwise the HTTP status (SevenRcApiError) picks a
     * generic message; otherwise the action-specific fallback. Raw server text is
     * never shown to users (it is English and often internal).
     */ var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/index.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$sdk$2f$seven$2d$rc$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/sdk/seven-rc-api.ts [app-client] (ecmascript)',
      );
    const KNOWN_ERRORS = [
      {
        match: /^Timeslot is unavailable$/i,
        message: () => 'Otra persona acaba de reservar ese horario. Elige otro de la lista.',
      },
      {
        match: /^Timeslot is blocked$/i,
        message: () => 'El complejo bloqueó ese horario. Elige otro de la lista.',
      },
      {
        match: /^Block overlaps active reservations$/i,
        message: () =>
          'Ese bloqueo se cruza con reservas activas. Cancélalas primero o cambia el horario.',
      },
      {
        match: /^Slot has already started$/i,
        message: () => 'Ese horario ya empezó. Elige uno más tarde.',
      },
      {
        match: /^Date is outside the booking window$/i,
        message: () => 'Esa fecha está fuera del periodo en que el complejo recibe reservas.',
      },
      {
        match: /^Reservation must align with configured opening slots$/i,
        message: () =>
          'Ese horario ya no coincide con los turnos de la cancha. Vuelve a elegir un horario.',
      },
      {
        match: /^Reservations can only be cancelled up to (\d+)h before start$/i,
        message: (found) =>
          `Solo se puede cancelar hasta ${found[1]} h antes del inicio. Escribe al complejo si no puedes asistir.`,
      },
      {
        match: /^Only pending or confirmed reservations can be cancelled$/i,
        message: () => 'Esta reserva ya no se puede cancelar.',
      },
      {
        match: /^Only pending reservations can be (confirmed|rejected)$/i,
        message: () => 'Esta solicitud ya fue atendida. La lista se actualizó.',
      },
      {
        match: /^Only confirmed reservations can be (completed|marked as no-show)$/i,
        message: () => 'Solo una reserva confirmada se puede cerrar así. La lista se actualizó.',
      },
      {
        match: /^The reservation has not started yet$/i,
        message: () => 'El turno aún no empieza. Podrás marcarlo cuando haya pasado la hora.',
      },
      {
        match: /^Cannot record a payment on a \w+ reservation$/i,
        message: () =>
          'Esta reserva ya no admite pagos. Si devolviste dinero, regístralo como devolución.',
      },
      {
        match: /^Refund exceeds the amount paid$/i,
        message: () => 'La devolución supera lo que el jugador ha pagado.',
      },
      {
        match: /^endTime must be greater than startTime/i,
        message: () => 'Cada tarifa por horario debe terminar después de empezar.',
      },
      {
        match: /^closeTime must be greater than openTime/i,
        message: () => 'La hora de cierre debe ser posterior a la de apertura.',
      },
      {
        match: /^Invalid date range$/i,
        message: () => 'La fecha final debe ser igual o posterior a la inicial.',
      },
      {
        match: /^(Pitch|Venue|Reservation) not found$/i,
        message: (found) =>
          `${found[1] === 'Pitch' ? 'La cancha' : found[1] === 'Venue' ? 'El complejo' : 'La reserva'} ya no existe. Actualiza la página.`,
      },
      {
        match: /^Only venue owner/i,
        message: () => 'Esta acción solo la puede hacer el dueño del complejo.',
      },
      {
        match: /^Unauthorized$|\(401\)$/i,
        message: () => 'Tu sesión expiró. Vuelve a iniciar sesión.',
      },
      {
        match: /\(403\)$/i,
        message: () => 'Tu cuenta no tiene permiso para esta acción.',
      },
      {
        match: /\(400\)$/i,
        message: () => 'Revisa los datos del formulario e intenta de nuevo.',
      },
      {
        match: /\(429\)$/i,
        message: () => 'Demasiados intentos seguidos. Espera un momento e intenta de nuevo.',
      },
      {
        match: /^Unable to reach API$|aborted|Failed to fetch|NetworkError|\(5\d\d\)$/i,
        message: () =>
          'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.',
      },
    ];
    function describeError(error, fallback) {
      const raw = error instanceof Error ? error.message.trim() : '';
      for (const entry of KNOWN_ERRORS) {
        const found = raw.match(entry.match);
        if (found) return entry.message(found);
      }
      if (
        error instanceof
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$sdk$2f$seven$2d$rc$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'SevenRcApiError'
        ]
      ) {
        const byStatus = describeStatus(error.status);
        if (byStatus) return byStatus;
      }
      return fallback;
    }
    function describeStatus(status) {
      if (status === 401) return 'Tu sesión expiró. Vuelve a iniciar sesión.';
      if (status === 403) return 'Tu cuenta no tiene permiso para esta acción.';
      if (status === 404) return 'Lo que buscas ya no existe. Actualiza la página.';
      if (status === 409)
        return 'Alguien hizo un cambio al mismo tiempo. Actualiza y vuelve a intentar.';
      if (status === 400 || status === 422)
        return 'Revisa los datos del formulario e intenta de nuevo.';
      if (status === 429)
        return 'Demasiados intentos seguidos. Espera un momento e intenta de nuevo.';
      if (status >= 500) return 'El servidor tuvo un problema. Intenta de nuevo en unos minutos.';
      return null;
    }
    function isSlotConflict(error) {
      const raw = error instanceof Error ? error.message : '';
      return /Timeslot is (unavailable|blocked)|Slot has already started|align with configured/i.test(
        raw,
      );
    }
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/apps/seven-rc-web/lib/role.ts [app-client] (ecmascript) <locals>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/index.ts [app-client] (ecmascript) <locals>',
      );
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/packages/modules/seven-reservations-club/src/onboarding-role.ts [app-client] (ecmascript) <export getSevenReservationsClubRoleHomePath as getRoleHomePath>',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s([
      'getRoleHomePath',
      () =>
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'getSevenReservationsClubRoleHomePath'
        ],
    ]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/onboarding-role.ts [app-client] (ecmascript)',
      );
  },
  '[project]/apps/seven-rc-web/components/role-switch.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['RoleSwitch', () => RoleSwitch]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/client.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$role$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/query/role-query.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/ui/src/index.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i('[project]/packages/ui-web/src/index.ts [app-client] (ecmascript)');
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/navigation.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$seven$2d$rc$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/components/seven-rc-ui.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$seven$2d$rc$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/lib/seven-rc-errors.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$role$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/lib/role.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getSevenReservationsClubRoleHomePath__as__getRoleHomePath$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/onboarding-role.ts [app-client] (ecmascript) <export getSevenReservationsClubRoleHomePath as getRoleHomePath>',
      );
    var _s = __turbopack_context__.k.signature();
    ('use client');
    const COPY = {
      OWNER: {
        label: 'Cambiar a modo jugador',
        title: '¿Cambiar a modo jugador?',
        body: 'Verás la búsqueda de canchas y tus reservas como jugador. Tu complejo, canchas y solicitudes siguen guardados; vuelves a ellos cambiando a modo dueño.',
        confirm: 'Cambiar a jugador',
      },
      PLAYER: {
        label: 'Cambiar a modo dueño',
        title: '¿Cambiar a modo dueño?',
        body: 'Verás el panel para administrar un complejo. Tus reservas como jugador siguen guardadas; vuelves a ellas cambiando a modo jugador.',
        confirm: 'Cambiar a dueño',
      },
    };
    function RoleSwitch() {
      _s();
      const router = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useRouter'
      ])();
      const { role } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$role$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useCurrentUserRoleQuery'
      ])();
      const setRoleMutation = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$role$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useSetCurrentUserRoleMutation'
      ])();
      const dialogRef = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useRef'
      ])(null);
      const [error, setError] = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useState'
      ])(null);
      if (role !== 'OWNER' && role !== 'PLAYER') return null;
      const copy = COPY[role];
      const nextRole = role === 'OWNER' ? 'PLAYER' : 'OWNER';
      async function onConfirm() {
        setError(null);
        try {
          await setRoleMutation.mutateAsync(nextRole);
          // The mutation already flipped the cached role, and with it this dialog's copy:
          // close at once, or a second tap would switch straight back.
          dialogRef.current?.close();
          router.replace(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$onboarding$2d$role$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__getSevenReservationsClubRoleHomePath__as__getRoleHomePath$3e$__[
              'getRoleHomePath'
            ])(nextRole),
          );
          router.refresh();
        } catch (caught) {
          setError(
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$seven$2d$rc$2d$errors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'describeError'
            ])(caught, 'No se pudo cambiar de modo. Intenta de nuevo.'),
          );
        }
      }
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'Fragment'
        ],
        {
          children: [
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              'button',
              {
                type: 'button',
                className: (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2d$web$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'buttonRecipe'
                ])({
                  intent: 'secondary',
                  size: 'sm',
                  platform: 'web',
                  fullWidth: false,
                }),
                onClick: () => {
                  setError(null);
                  dialogRef.current?.showModal();
                },
                children: copy.label,
              },
              void 0,
              false,
              {
                fileName: '[project]/apps/seven-rc-web/components/role-switch.tsx',
                lineNumber: 57,
                columnNumber: 7,
              },
              this,
            ),
            /*#__PURE__*/ (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'jsxDEV'
            ])(
              __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$components$2f$seven$2d$rc$2d$ui$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                'ConfirmDialog'
              ],
              {
                dialogRef: dialogRef,
                title: copy.title,
                confirmLabel: copy.confirm,
                pendingLabel: 'Cambiando…',
                dismissLabel: 'Seguir aquí',
                tone: 'primary',
                isPending: setRoleMutation.isPending,
                error: error,
                onConfirm: () => void onConfirm(),
                onClosed: () => setError(null),
                children: /*#__PURE__*/ (0,
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
                  'jsxDEV'
                ])(
                  'p',
                  {
                    className: 'm-0',
                    children: copy.body,
                  },
                  void 0,
                  false,
                  {
                    fileName: '[project]/apps/seven-rc-web/components/role-switch.tsx',
                    lineNumber: 84,
                    columnNumber: 9,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: '[project]/apps/seven-rc-web/components/role-switch.tsx',
                lineNumber: 72,
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
    _s(RoleSwitch, 'nNwdVGnzNdyRlaDSHszEBPFjj+U=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useRouter'
        ],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$role$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useCurrentUserRoleQuery'
        ],
        __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$role$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useSetCurrentUserRoleMutation'
        ],
      ];
    });
    _c = RoleSwitch;
    var _c;
    __turbopack_context__.k.register(_c, 'RoleSwitch');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/apps/seven-rc-web/lib/use-access-token.ts [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['useAccessToken', () => useAccessToken]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$PromisifiedAuthProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__usePromisifiedAuth__as__useAuth$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@clerk+nextjs@6.37.5_next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwrigh_7fc3a0f00d05671a4e13335581eb0f57/node_modules/@clerk/nextjs/dist/esm/client-boundary/PromisifiedAuthProvider.js [app-client] (ecmascript) <export usePromisifiedAuth as useAuth>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    ('use client');
    function useAccessToken() {
      _s();
      const { getToken } = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$PromisifiedAuthProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__usePromisifiedAuth__as__useAuth$3e$__[
        'useAuth'
      ])();
      return (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useCallback'
      ])(
        {
          'useAccessToken.useCallback': () => getToken(),
        }['useAccessToken.useCallback'],
        [getToken],
      );
    }
    _s(useAccessToken, '2jYDBaFE/AQIe4eq3FpzJPq8E7E=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$37$2e$5_next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwrigh_7fc3a0f00d05671a4e13335581eb0f57$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$PromisifiedAuthProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__usePromisifiedAuth__as__useAuth$3e$__[
          'useAuth'
        ],
      ];
    });
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/apps/seven-rc-web/components/seven-rc-client-providers.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['SevenRcClientProviders', () => SevenRcClientProviders]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@tanstack+react-query@5.90.21_react@19.3.0/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/client.ts [app-client] (ecmascript) <locals>',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$RoleDataSourceProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/query/RoleDataSourceProvider.tsx [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$query$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/query/query-client.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$role$2d$data$2d$source$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/packages/modules/seven-reservations-club/src/query/role-data-source.ts [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$use$2d$access$2d$token$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/apps/seven-rc-web/lib/use-access-token.ts [app-client] (ecmascript)',
      );
    var _s = __turbopack_context__.k.signature();
    ('use client');
    function SevenRcClientProviders({ children }) {
      _s();
      const [queryClient] = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useState'
      ])(
        {
          'SevenRcClientProviders.useState': () =>
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$query$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'createSevenRcQueryClient'
            ])(),
        }['SevenRcClientProviders.useState'],
      );
      const getAccessToken = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$use$2d$access$2d$token$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useAccessToken'
      ])();
      const roleDataSource = (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'useMemo'
      ])(
        {
          'SevenRcClientProviders.useMemo[roleDataSource]': () =>
            (0,
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$role$2d$data$2d$source$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'createWebBffRoleDataSource'
            ])({
              getAccessToken,
            }),
        }['SevenRcClientProviders.useMemo[roleDataSource]'],
        [getAccessToken],
      );
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tanstack$2b$react$2d$query$40$5$2e$90$2e$21_react$40$19$2e$3$2e$0$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'QueryClientProvider'
        ],
        {
          client: queryClient,
          children: /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$modules$2f$seven$2d$reservations$2d$club$2f$src$2f$query$2f$RoleDataSourceProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
              'SevenReservationsClubRoleDataSourceProvider'
            ],
            {
              dataSource: roleDataSource,
              children: children,
            },
            void 0,
            false,
            {
              fileName: '[project]/apps/seven-rc-web/components/seven-rc-client-providers.tsx',
              lineNumber: 22,
              columnNumber: 7,
            },
            this,
          ),
        },
        void 0,
        false,
        {
          fileName: '[project]/apps/seven-rc-web/components/seven-rc-client-providers.tsx',
          lineNumber: 21,
          columnNumber: 5,
        },
        this,
      );
    }
    _s(SevenRcClientProviders, 'tL/m60YsuCvJRSdrLzdnjYxxCwU=', false, function () {
      return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$seven$2d$rc$2d$web$2f$lib$2f$use$2d$access$2d$token$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
          'useAccessToken'
        ],
      ];
    });
    _c = SevenRcClientProviders;
    var _c;
    __turbopack_context__.k.register(_c, 'SevenRcClientProviders');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
  '[project]/apps/seven-rc-web/components/sign-out-control.tsx [app-client] (ecmascript)',
  (__turbopack_context__) => {
    'use strict';

    __turbopack_context__.s(['SignOutControl', () => SignOutControl]);
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/next@16.1.6_@babel+core@7.29.0_@opentelemetry+api@1.9.1_@playwright+test@1.61.1_babel-p_8b1e5c06d809c93e09d4919c3480cf89/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)',
      );
    var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$clerk$2d$react$40$5$2e$60$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f40$clerk$2f$clerk$2d$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
      __turbopack_context__.i(
        '[project]/node_modules/.pnpm/@clerk+clerk-react@5.60.2_react-dom@19.3.0_react@19.3.0__react@19.3.0/node_modules/@clerk/clerk-react/dist/index.mjs [app-client] (ecmascript) <locals>',
      );
    ('use client');
    function SignOutControl({ className }) {
      return /*#__PURE__*/ (0,
      __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
        'jsxDEV'
      ])(
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$clerk$2d$react$40$5$2e$60$2e$2_react$2d$dom$40$19$2e$3$2e$0_react$40$19$2e$3$2e$0_$5f$react$40$19$2e$3$2e$0$2f$node_modules$2f40$clerk$2f$clerk$2d$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__[
          'SignOutButton'
        ],
        {
          redirectUrl: '/sign-in?redirect_url=/',
          children: /*#__PURE__*/ (0,
          __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$6_$40$babel$2b$core$40$7$2e$29$2e$0_$40$opentelemetry$2b$api$40$1$2e$9$2e$1_$40$playwright$2b$test$40$1$2e$61$2e$1_babel$2d$p_8b1e5c06d809c93e09d4919c3480cf89$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__[
            'jsxDEV'
          ])(
            'button',
            {
              type: 'button',
              className: className,
              children: 'Cerrar sesión',
            },
            void 0,
            false,
            {
              fileName: '[project]/apps/seven-rc-web/components/sign-out-control.tsx',
              lineNumber: 14,
              columnNumber: 7,
            },
            this,
          ),
        },
        void 0,
        false,
        {
          fileName: '[project]/apps/seven-rc-web/components/sign-out-control.tsx',
          lineNumber: 13,
          columnNumber: 5,
        },
        this,
      );
    }
    _c = SignOutControl;
    var _c;
    __turbopack_context__.k.register(_c, 'SignOutControl');
    if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
      __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
    }
  },
]);

//# sourceMappingURL=_a04cc592._.js.map
