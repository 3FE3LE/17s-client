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

export const CornerMotifSchema = z.enum([
  'square',
  'notch',
  'bevel',
  'round',
  'buttress',
  'cellular',
  'rivet',
  'folded',
  'compass',
  'seal',
  'constellation',
  'pulse',
]);
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

export const PaddingDefinitionSchema = z.object({
  left: nonNegInt.max(512),
  top: nonNegInt.max(512),
  right: nonNegInt.max(512),
  bottom: nonNegInt.max(512),
});
export type PaddingDefinition = z.infer<typeof PaddingDefinitionSchema>;

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

export const LineageThemeIdSchema = z.enum([
  'ardhen',
  'eirune',
  'kovari',
  'myrven',
  'vaelun',
  'orveth',
  'caelith',
  'theryn',
]);
export type LineageThemeId = z.infer<typeof LineageThemeIdSchema>;

export const PresetRelationshipSchema = z.enum(['linked', 'modified', 'detached']);
export type PresetRelationship = z.infer<typeof PresetRelationshipSchema>;

export const OrnamentationPresetSchema = z.object({
  borderPreset: z.string().min(1),
  cornerPreset: z.string().min(1),
  fillPreset: z.string().min(1),
  shadowPreset: z.string().min(1),
  contentPadding: PaddingDefinitionSchema,
  nineSliceMargins: PaddingDefinitionSchema,
  normalState: z.string().min(1),
  hoverState: z.string().min(1),
  pressedState: z.string().min(1),
  selectedState: z.string().min(1),
  focusedState: z.string().min(1),
  disabledState: z.string().min(1),
  selectionEffect: z.string().min(1),
});
export type OrnamentationPreset = z.infer<typeof OrnamentationPresetSchema>;

export const IconTreatmentSchema = z.object({
  colorTokenId: z.string().min(1),
  backgroundTokenId: z.string().min(1),
  borderTokenId: z.string().min(1),
  selectedTokenId: z.string().min(1),
  disabledTokenId: z.string().min(1),
});
export type IconTreatment = z.infer<typeof IconTreatmentSchema>;

export const ManualOverrideSchema = z.object({
  path: z.string().min(1),
  changedAt: z.string().optional(),
});
export type ManualOverride = z.infer<typeof ManualOverrideSchema>;

export const AssetRecipeSchema = z.object({
  version: z.literal(1),
  preset: z.string().min(1),
  seed: z.number().int().min(0).max(0xffffffff),
  size: z.object({ width: dimension, height: dimension }),
  lineage_theme_id: LineageThemeIdSchema.optional(),
  lineage_theme_version: z.number().int().min(1).optional(),
  preset_relationship: PresetRelationshipSchema.optional(),
  resolved_palette: PaletteSchema.optional(),
  resolved_ornamentation: OrnamentationPresetSchema.optional(),
  manual_overrides: z.array(ManualOverrideSchema).optional(),
  icon_treatment: IconTreatmentSchema.optional(),
  palette: PaletteSchema,
  border: z.object({ layers: z.array(BorderLayerSchema).max(8) }),
  corner: CornerDefinitionSchema,
  fill: FillPatternSchema,
  background: BackgroundSchema,
  shadow: ShadowDefinitionSchema.optional(),
  contentPadding: PaddingDefinitionSchema.optional(),
});
export type AssetRecipe = z.infer<typeof AssetRecipeSchema>;

export const RECIPE_VERSION = 1 as const;
