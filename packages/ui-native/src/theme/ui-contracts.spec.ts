import { describe, expect, it } from 'vitest';

import {
  BADGE_VARIANTS,
  TYPOGRAPHY_CLASSES,
  badgeLabelRecipe,
  badgeRecipe,
  suitThemeLight,
  titleRecipe,
  typographyRecipe,
  type TypographyVariant,
} from '@17suit/design-system';

const styles = suitThemeLight.typography.styles;
const variants = Object.keys(styles) as TypographyVariant[];
const sizeKey = (px: number) =>
  Object.entries(suitThemeLight.fontSizes).find(([, value]) => value === px)?.[0];

// Native family per font file, as loaded by ui-native AppProviders.
const NATIVE_FAMILY_CLASS: Record<string, string> = {
  Arvo_400Regular: 'font-arvo',
  Arvo_700Bold: 'font-arvo-bold',
  Amaranth_400Regular: 'font-amaranth',
  Amaranth_700Bold: 'font-amaranth-bold',
  ZillaSlab_300Light: 'font-zilla-light',
  ZillaSlab_400Regular: 'font-zilla',
  ZillaSlab_700Bold: 'font-zilla-bold',
};
const WEB_WEIGHT_CLASS: Record<string, string> = {
  '300': 'font-light',
  '400': 'font-normal',
  '700': 'font-bold',
};

describe('typography contract matches tokens.ts', () => {
  it.each(variants)('%s: size, native line-height/tracking and families', (variant) => {
    const token = styles[variant];
    const classes = TYPOGRAPHY_CLASSES[variant];

    expect(classes.size).toBe(`text-${sizeKey(token.fontSize)}`);

    const lineHeightPx = Math.round(token.fontSize * token.lineHeightRecommended);
    expect(classes.native).toContain(`leading-[${lineHeightPx}px]`);
    expect(classes.native).toContain(`tracking-[${token.letterSpacingPx}px]`);
    expect(classes.native).toContain(NATIVE_FAMILY_CLASS[token.nativeFamily]);

    expect(classes.web).toContain(`leading-[${token.lineHeightRecommended}]`);
    expect(classes.web).toContain(WEB_WEIGHT_CLASS[token.fontWeight]);
  });

  it('defaults to the theme-reactive text color and lets callers replace it', () => {
    expect(typographyRecipe({ platform: 'web' })).toContain('text-text');
    const custom = typographyRecipe({ platform: 'native', colorClass: 'text-muted' });
    expect(custom).toContain('text-muted');
    expect(custom).not.toContain('text-text');
  });

  it('only resets margins on web (RN Text has none)', () => {
    expect(typographyRecipe({ platform: 'web' })).toContain('m-0');
    expect(typographyRecipe({ platform: 'native' })).not.toContain('m-0');
  });

  it('title is subtitle1 with vertical rhythm', () => {
    expect(titleRecipe({ platform: 'native' })).toContain(TYPOGRAPHY_CLASSES.subtitle1.native);
    expect(titleRecipe({ platform: 'web' })).toContain('my-sm');
  });
});

describe('badge contract reproduces the previous inline colors', () => {
  // Previous AppBadge variantStyles (identical in web and native).
  const previous = {
    primary: ['bg-brand-primary', 'text-brand-dark'],
    success: ['bg-success', 'text-brand-dark'],
    destructive: ['bg-destructive', 'text-white', 'dark:text-brand-dark'],
    warning: ['bg-warning', 'text-brand-dark'],
    info: ['bg-info', 'text-white', 'dark:text-brand-dark'],
    neutral: ['bg-neutral', 'text-brand-dark'],
  } as const;

  it.each(BADGE_VARIANTS)('%s', (variant) => {
    const [surface, ...labels] = previous[variant];
    for (const platform of ['web', 'native'] as const) {
      expect(badgeRecipe({ variant, platform })).toContain(surface);
      const labelClasses = badgeLabelRecipe({ variant, platform });
      for (const label of labels) expect(labelClasses).toContain(label);
      expect(labelClasses).not.toContain('text-text');
    }
  });

  it('neutral surface token is grayscale[3]', () => {
    expect(suitThemeLight.colors.neutral).toBe(suitThemeLight.grayscale[3]);
  });

  it('label uses caption typography on both platforms', () => {
    expect(badgeLabelRecipe({ platform: 'native' })).toContain(TYPOGRAPHY_CLASSES.caption.native);
    expect(badgeLabelRecipe({ platform: 'web' })).toContain(TYPOGRAPHY_CLASSES.caption.web);
  });
});
