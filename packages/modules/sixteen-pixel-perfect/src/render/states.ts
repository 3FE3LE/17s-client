import type { ComponentState, Palette, Rgba } from '../domain/recipe';

/**
 * Control-state variants are deterministic color transforms applied at token
 * resolution time. Same state ⇒ same transform ⇒ reproducible output.
 */
interface StateTransform {
  /** Added to R/G/B channels (clamped 0..255). */
  lightness: number;
  /** Multiplies alpha (0..1). */
  alpha: number;
}

const STATE_TRANSFORMS: Record<ComponentState, StateTransform> = {
  normal: { lightness: 0, alpha: 1 },
  hover: { lightness: 18, alpha: 1 },
  pressed: { lightness: -22, alpha: 1 },
  selected: { lightness: 10, alpha: 1 },
  focused: { lightness: 24, alpha: 1 },
  disabled: { lightness: -8, alpha: 0.45 },
};

function clampU8(value: number): number {
  if (value < 0) return 0;
  if (value > 255) return 255;
  return Math.round(value);
}

function applyStateToRgba(rgba: Rgba, state: ComponentState): Rgba {
  const t = STATE_TRANSFORMS[state];
  return [
    clampU8(rgba[0] + t.lightness),
    clampU8(rgba[1] + t.lightness),
    clampU8(rgba[2] + t.lightness),
    clampU8(rgba[3] * t.alpha),
  ];
}

/**
 * Build a token resolver for a palette + state. Throws on unknown token so a
 * malformed recipe fails loudly rather than rendering a silent wrong color.
 */
export function createTokenResolver(
  palette: Palette,
  state: ComponentState,
): (tokenId: string) => Rgba {
  const index = new Map<string, Rgba>();
  for (const token of palette.tokens) {
    index.set(token.id, token.rgba);
  }
  return (tokenId: string): Rgba => {
    const rgba = index.get(tokenId);
    if (!rgba) {
      throw new Error(`Unknown color token: ${tokenId}`);
    }
    return applyStateToRgba(rgba, state);
  };
}
