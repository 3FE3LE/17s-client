import type { Palette } from './recipe';

/**
 * Built-in palettes. These seed the UI; a recipe embeds a full copy of the
 * chosen palette so it stays self-contained after export/reload.
 */
export const BUILT_IN_PALETTES: readonly Palette[] = [
  {
    id: 'goses-slate',
    name: 'Goses Slate',
    tokens: [
      { id: 'ink', rgba: [22, 26, 37, 255] },
      { id: 'edge', rgba: [58, 68, 92, 255] },
      { id: 'panel', rgba: [38, 45, 66, 255] },
      { id: 'panel-lit', rgba: [52, 61, 88, 255] },
      { id: 'accent', rgba: [120, 190, 255, 255] },
      { id: 'shadow', rgba: [8, 10, 16, 160] },
    ],
  },
  {
    id: 'goses-parchment',
    name: 'Goses Parchment',
    tokens: [
      { id: 'ink', rgba: [74, 52, 34, 255] },
      { id: 'edge', rgba: [120, 90, 58, 255] },
      { id: 'panel', rgba: [214, 188, 142, 255] },
      { id: 'panel-lit', rgba: [232, 210, 168, 255] },
      { id: 'accent', rgba: [176, 84, 52, 255] },
      { id: 'shadow', rgba: [40, 28, 18, 150] },
    ],
  },
  {
    id: 'goses-verdant',
    name: 'Goses Verdant',
    tokens: [
      { id: 'ink', rgba: [18, 34, 24, 255] },
      { id: 'edge', rgba: [44, 78, 52, 255] },
      { id: 'panel', rgba: [32, 58, 40, 255] },
      { id: 'panel-lit', rgba: [46, 82, 56, 255] },
      { id: 'accent', rgba: [156, 220, 120, 255] },
      { id: 'shadow', rgba: [6, 14, 9, 160] },
    ],
  },
] as const;

export function getBuiltInPalette(id: string): Palette | undefined {
  return BUILT_IN_PALETTES.find((palette) => palette.id === id);
}
