/**
 * Typography contract shared by web and native AppTypography / AppTitle.
 *
 * Classes are literal strings on purpose: Tailwind (web) and Uniwind
 * (native) only generate classes they can find in source. The values are
 * derived from `suitTheme.typography.styles`; a parity test fails if this
 * table drifts from tokens.ts.
 *
 * Platform differences, by design:
 * - native loads one font file per weight, so weight is a family class
 *   (`font-arvo-bold`); web uses the base family + `font-bold`.
 * - React Native line-height and letter-spacing are absolute px; web keeps
 *   the unitless line-height and em tracking from the type scale.
 */
import { cx, type SuitPlatform } from './recipes';
import type { suitThemeLight } from './tokens';

export type TypographyVariant = keyof (typeof suitThemeLight)['typography']['styles'];
export type TypographyAlign = 'left' | 'center' | 'right';

interface VariantClasses {
  size: string;
  web: string;
  native: string;
}

export const TYPOGRAPHY_CLASSES: Record<TypographyVariant, VariantClasses> = {
  heading1: {
    size: 'text-x4l',
    web: 'font-arvo font-normal leading-[1.08] tracking-minus1_5',
    native: 'font-arvo leading-[104px] tracking-[-1.44px]',
  },
  heading2: {
    size: 'text-x3l',
    web: 'font-amaranth font-normal leading-[1.1] tracking-minus0_5',
    native: 'font-amaranth leading-[66px] tracking-[-0.3px]',
  },
  heading3: {
    size: 'text-x2l',
    web: 'font-amaranth font-bold leading-[1.16] tracking-zero',
    native: 'font-amaranth-bold leading-[56px] tracking-[0px]',
  },
  subtitle1: {
    size: 'text-xl',
    web: 'font-amaranth font-normal leading-[1.2] tracking-plus0_25',
    native: 'font-amaranth leading-[41px] tracking-[0.085px]',
  },
  subtitle2: {
    size: 'text-lg',
    web: 'font-arvo font-bold leading-[1.25] tracking-zero',
    native: 'font-arvo-bold leading-[30px] tracking-[0px]',
  },
  body: {
    size: 'text-md',
    web: 'font-zilla font-normal leading-[1.5] tracking-zero',
    native: 'font-zilla leading-[24px] tracking-[0px]',
  },
  button: {
    size: 'text-md',
    web: 'font-zilla font-bold leading-[1.4] tracking-plus1_25',
    native: 'font-zilla-bold leading-[22px] tracking-[0.2px]',
  },
  caption: {
    size: 'text-xs',
    web: 'font-zilla font-normal leading-[1.35] tracking-plus0_4',
    native: 'font-zilla leading-[16px] tracking-[0.048px]',
  },
  overline: {
    size: 'text-xs',
    web: 'font-zilla font-light leading-[1.4] tracking-plus1_5',
    native: 'font-zilla-light leading-[17px] tracking-[0.18px]',
  },
};

const ALIGN_CLASSES: Record<TypographyAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export interface TypographyContractProps {
  variant?: TypographyVariant | undefined;
  align?: TypographyAlign | undefined;
  /**
   * Text color class; defaults to the theme-reactive `text-text`. Pass the
   * replacement instead of appending a second color class: two classes for
   * the same property resolve by CSS order, not by order in the string.
   */
  colorClass?: string | undefined;
  /** Extra non-conflicting classes (spacing, layout). */
  className?: string | undefined;
}

export function typographyRecipe({
  variant = 'body',
  align = 'left',
  colorClass = 'text-text',
  platform,
  className,
}: TypographyContractProps & { platform: SuitPlatform }) {
  const classes = TYPOGRAPHY_CLASSES[variant];
  return cx(
    platform === 'web' && 'm-0',
    colorClass,
    classes.size,
    platform === 'web' ? classes.web : classes.native,
    ALIGN_CLASSES[align],
    className,
  );
}

/** AppTitle = subtitle1 with vertical rhythm. */
export function titleRecipe({
  platform,
  className,
}: {
  platform: SuitPlatform;
  className?: string | undefined;
}) {
  return typographyRecipe({ variant: 'subtitle1', platform, className: cx('my-sm', className) });
}
