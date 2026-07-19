import { z } from 'zod';

/**
 * Domain types + schemas for a Sixteen Pixel Perfect asset.
 *
 * A recipe is fully self-contained and serializable: it embeds its palette so
 * that reloading a recipe reproduces the exact same asset regardless of which
 * built-in catalogs exist at load time. Combined with a fixed `seed`, rendering
 * is deterministic (same recipe + seed ⇒ byte-identical output).
 *
 * These modules are pure: no React, no browser canvas, no I/O.
 */

const u8 = z.number().int().min(0).max(255);
const dimension = z.number().int().min(1).max(1024);
const nonNegInt = z.number().int().min(0);

export const RgbaSchema = z.tuple([u8, u8, u8, u8]);
export type Rgba = z.infer<typeof RgbaSchema>;

export const ColorTokenSchema = z.object({
  id: z.string().min(1),
  rgba: RgbaSchema,
});
export type ColorToken = z.infer<typeof ColorTokenSchema>;

export const PaletteSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tokens: z.array(ColorTokenSchema).min(1),
});
export type Palette = z.infer<typeof PaletteSchema>;

export const EdgePatternSchema = z.enum(['solid', 'dashed', 'dotted']);
export type EdgePattern = z.infer<typeof EdgePatternSchema>;

export const BorderLayerSchema = z.object({
  thickness: nonNegInt.max(64),
  tokenId: z.string().min(1),
  pattern: EdgePatternSchema.default('solid'),
});
export type BorderLayer = z.infer<typeof BorderLayerSchema>;

export const CornerMotifSchema = z.enum(['square', 'notch', 'bevel', 'round']);
export type CornerMotif = z.infer<typeof CornerMotifSchema>;

export const CornerDefinitionSchema = z.object({
  motif: CornerMotifSchema,
  size: nonNegInt.max(64),
});
export type CornerDefinition = z.infer<typeof CornerDefinitionSchema>;

export const FillKindSchema = z.enum(['solid', 'checker', 'diagonal', 'noise']);
export type FillKind = z.infer<typeof FillKindSchema>;

export const FillPatternSchema = z.object({
  kind: FillKindSchema,
  tokenIds: z.array(z.string().min(1)).min(1),
});
export type FillPattern = z.infer<typeof FillPatternSchema>;

export const ShadowDefinitionSchema = z.object({
  dx: z.number().int().min(-32).max(32),
  dy: z.number().int().min(-32).max(32),
  tokenId: z.string().min(1),
});
export type ShadowDefinition = z.infer<typeof ShadowDefinitionSchema>;

export const BackgroundSchema = z.union([
  z.literal('transparent'),
  z.object({ tokenId: z.string().min(1) }),
]);
export type Background = z.infer<typeof BackgroundSchema>;

export const ComponentStateSchema = z.enum([
  'normal',
  'hover',
  'pressed',
  'selected',
  'focused',
  'disabled',
]);
export type ComponentState = z.infer<typeof ComponentStateSchema>;

export const AssetRecipeSchema = z.object({
  version: z.literal(1),
  preset: z.string().min(1),
  seed: z.number().int().min(0).max(0xffffffff),
  size: z.object({ width: dimension, height: dimension }),
  palette: PaletteSchema,
  border: z.object({ layers: z.array(BorderLayerSchema).max(8) }),
  corner: CornerDefinitionSchema,
  fill: FillPatternSchema,
  background: BackgroundSchema,
  shadow: ShadowDefinitionSchema.optional(),
});
export type AssetRecipe = z.infer<typeof AssetRecipeSchema>;

export const RECIPE_VERSION = 1 as const;
