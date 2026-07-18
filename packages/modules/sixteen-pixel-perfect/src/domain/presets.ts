import { BUILT_IN_PALETTES } from './palettes';
import type { AssetRecipe, ComponentState, Palette } from './recipe';
import { RECIPE_VERSION } from './recipe';

/**
 * Component presets. MVP ships one: `panel`. A preset is a factory that
 * produces a complete, valid `AssetRecipe` from a chosen palette + size.
 */
export interface ComponentPreset {
  id: string;
  name: string;
  make(input: { palette: Palette; width: number; height: number; seed: number }): AssetRecipe;
}

const panelPreset: ComponentPreset = {
  id: 'panel',
  name: 'Panel',
  make({ palette, width, height, seed }) {
    return {
      version: RECIPE_VERSION,
      preset: 'panel',
      seed,
      size: { width, height },
      palette,
      border: {
        layers: [
          { thickness: 1, tokenId: 'ink', pattern: 'solid' },
          { thickness: 2, tokenId: 'edge', pattern: 'solid' },
        ],
      },
      corner: { motif: 'bevel', size: 3 },
      fill: { kind: 'checker', tokenIds: ['panel', 'panel-lit'] },
      background: 'transparent',
      shadow: undefined,
    };
  },
};

export const COMPONENT_PRESETS: readonly ComponentPreset[] = [panelPreset] as const;

export function getPreset(id: string): ComponentPreset | undefined {
  return COMPONENT_PRESETS.find((preset) => preset.id === id);
}

/** A ready-to-render default recipe for the studio's initial state. */
export function makeDefaultPanelRecipe(): AssetRecipe {
  return panelPreset.make({
    palette: BUILT_IN_PALETTES[0]!,
    width: 48,
    height: 32,
    seed: 1,
  });
}

/** States exercised by the MVP vertical slice, in generation order. */
export const MVP_STATES: readonly ComponentState[] = ['normal', 'hover', 'pressed'] as const;
