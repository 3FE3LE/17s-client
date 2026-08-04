import type { AssetRecipe } from '../domain/recipe';
import { totalBorderThickness } from '../render/render';

export interface NineSliceMargins {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * 9-slice margins. Each margin covers the full decorated corner (border band +
 * corner motif) so corners are never scaled — the invariant for NinePatchRect.
 * Margins are clamped so opposing pairs never overlap on a small asset.
 */
export function computeNineSlice(recipe: AssetRecipe): NineSliceMargins {
  const { width, height } = recipe.size;
  const decorated = totalBorderThickness(recipe) + recipe.corner.size;
  const base = Math.max(1, decorated);
  const maxH = Math.max(0, Math.floor((width - 1) / 2));
  const maxV = Math.max(0, Math.floor((height - 1) / 2));
  const h = Math.min(base, maxH);
  const v = Math.min(base, maxV);
  return { left: h, right: h, top: v, bottom: v };
}

export interface GodotExportSettings {
  /** Filename the metadata references (the exported PNG). */
  textureFileName: string;
  axisStretchHorizontal?: 'stretch' | 'tile' | 'tile_fit';
  axisStretchVertical?: 'stretch' | 'tile' | 'tile_fit';
}

export interface GodotNinePatchMetadata {
  type: 'NinePatchRect';
  texture: string;
  region_rect: { x: number; y: number; w: number; h: number };
  patch_margin: NineSliceMargins;
  axis_stretch_horizontal: string;
  axis_stretch_vertical: string;
  /** Echoed back so the metadata is self-describing / reproducible. */
  source: {
    preset: string;
    seed: number;
    size: { width: number; height: number };
    lineage_theme_id?: string;
    lineage_theme_version?: number;
    preset_relationship?: string;
  };
}

/** Build Godot-compatible NinePatchRect metadata for a recipe. */
export function buildGodotMetadata(
  recipe: AssetRecipe,
  settings: GodotExportSettings,
): GodotNinePatchMetadata {
  const { width, height } = recipe.size;
  return {
    type: 'NinePatchRect',
    texture: settings.textureFileName,
    region_rect: { x: 0, y: 0, w: width, h: height },
    patch_margin: computeNineSlice(recipe),
    axis_stretch_horizontal: settings.axisStretchHorizontal ?? 'stretch',
    axis_stretch_vertical: settings.axisStretchVertical ?? 'stretch',
    source: {
      preset: recipe.preset,
      seed: recipe.seed,
      size: { width, height },
      ...(recipe.lineage_theme_id ? { lineage_theme_id: recipe.lineage_theme_id } : {}),
      ...(recipe.lineage_theme_version
        ? { lineage_theme_version: recipe.lineage_theme_version }
        : {}),
      ...(recipe.preset_relationship ? { preset_relationship: recipe.preset_relationship } : {}),
    },
  };
}
