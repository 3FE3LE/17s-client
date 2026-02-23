const letterSpacingFromPercent = (percent: number) => `${percent / 100}em`;
const letterSpacingPx = (fontSize: number, percent: number) =>
  Number(((fontSize * percent) / 100).toFixed(3));

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
} as const;

const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  bold: '700',
} as const;

const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 24,
  xl: 34,
  x2l: 48,
  x3l: 60,
  x4l: 96,
} as const;

const letterSpacings = {
  minus1_5: letterSpacingFromPercent(-1.5),
  minus0_5: letterSpacingFromPercent(-0.5),
  zero: letterSpacingFromPercent(0),
  plus0_25: letterSpacingFromPercent(0.25),
  plus0_4: letterSpacingFromPercent(0.4),
  plus1_25: letterSpacingFromPercent(1.25),
  plus1_5: letterSpacingFromPercent(1.5),
} as const;

const baseTheme = {
  palette: ['#35a7ff', '#00916e', '#ff495c', '#eeeeee', '#00171f'] as const,
  grayscale: ['#00151c', '#394448', '#717171', '#cfcfcf', '#f0f0f0'] as const,
  semantic: ['#44af69', '#f8333c', '#f3863d', '#edd83d', '#1e91d6'] as const,
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
} as const;

const darkColors = {
  background: '#00151c',
  surface: '#394448',
  accent: '#35a7ff',
  text: '#f0f0f0',
  muted: '#cfcfcf',
  success: '#44af69',
  destructive: '#f8333c',
  warning: '#f3863d',
  caution: '#edd83d',
  info: '#1e91d6',
  brandPrimary: '#35a7ff',
  brandSecondary: '#00916e',
  brandAccent: '#ff495c',
  brandLight: '#eeeeee',
  brandDark: '#00171f',
} as const;

const lightColors = {
  background: '#f7f8fa',
  surface: '#ffffff',
  accent: '#35a7ff',
  text: '#00151c',
  muted: '#394448',
  success: '#44af69',
  destructive: '#f8333c',
  warning: '#f3863d',
  caution: '#edd83d',
  info: '#1e91d6',
  brandPrimary: '#35a7ff',
  brandSecondary: '#00916e',
  brandAccent: '#ff495c',
  brandLight: '#f0f0f0',
  brandDark: '#00171f',
} as const;

export const suitThemeDark = {
  ...baseTheme,
  colors: darkColors,
} as const;

export const suitThemeLight = {
  ...baseTheme,
  colors: lightColors,
} as const;

export type SuitTheme = typeof suitThemeDark;
export type ThemeMode = 'light' | 'dark';

export const getSuitTheme = (mode: ThemeMode) =>
  mode === 'light' ? suitThemeLight : suitThemeDark;

export const suitTheme = suitThemeDark;
