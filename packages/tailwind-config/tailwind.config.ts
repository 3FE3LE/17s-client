import type { Config } from 'tailwindcss';
import { suitTheme } from '@17suit/design-system';

const config: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        ...suitTheme.colors,
        brand: {
          primary: suitTheme.colors.brandPrimary,
          secondary: suitTheme.colors.brandSecondary,
          accent: suitTheme.colors.brandAccent,
          light: suitTheme.colors.brandLight,
          dark: suitTheme.colors.brandDark,
        },
      },
      spacing: suitTheme.spacing,
      borderRadius: suitTheme.borderRadius,
      fontFamily: {
        arvo: [suitTheme.fontFamilies.web.arvo],
        amaranth: [suitTheme.fontFamilies.web.amaranth],
        zilla: [suitTheme.fontFamilies.web.zillaSlab],
      },
      fontSize: suitTheme.fontSizes,
      letterSpacing: suitTheme.letterSpacings,
    },
  },
  plugins: [],
};

export default config;
