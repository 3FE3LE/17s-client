const nativeThemeExtension = {
  colors: {
    background: 'var(--suit-color-background)',
    surface: 'var(--suit-color-surface)',
    accent: 'var(--suit-color-accent)',
    text: 'var(--suit-color-text)',
    muted: 'var(--suit-color-muted)',
    success: 'var(--suit-color-success)',
    destructive: 'var(--suit-color-destructive)',
    warning: 'var(--suit-color-warning)',
    caution: 'var(--suit-color-caution)',
    info: 'var(--suit-color-info)',
    brand: {
      primary: 'var(--suit-color-brand-primary)',
      secondary: 'var(--suit-color-brand-secondary)',
      accent: 'var(--suit-color-brand-accent)',
      light: 'var(--suit-color-brand-light)',
      dark: 'var(--suit-color-brand-dark)',
    },
  },
  fontFamily: {
    arvo: ['Arvo', 'serif'],
    amaranth: ['Amaranth', 'sans-serif'],
    zilla: ['Zilla Slab', 'serif'],
  },
  spacing: {
    xs: 'var(--suit-spacing-xs)',
    sm: 'var(--suit-spacing-sm)',
    md: 'var(--suit-spacing-md)',
    lg: 'var(--suit-spacing-lg)',
    xl: 'var(--suit-spacing-xl)',
    x2l: 'var(--suit-spacing-x2l)',
    x3l: 'var(--suit-spacing-x3l)',
    x4l: 'var(--suit-spacing-x4l)',
  },
  borderRadius: {
    sm: 'var(--suit-radius-sm)',
    md: 'var(--suit-radius-md)',
    lg: 'var(--suit-radius-lg)',
    xl: 'var(--suit-radius-xl)',
    full: 'var(--suit-radius-full)',
  },
  letterSpacing: {
    minus1_5: 'var(--suit-tracking-minus1_5)',
    minus0_5: 'var(--suit-tracking-minus0_5)',
    zero: 'var(--suit-tracking-zero)',
    plus0_25: 'var(--suit-tracking-plus0_25)',
    plus0_4: 'var(--suit-tracking-plus0_4)',
    plus1_25: 'var(--suit-tracking-plus1_25)',
    plus1_5: 'var(--suit-tracking-plus1_5)',
  },
};

module.exports = {
  nativeThemeExtension,
};
