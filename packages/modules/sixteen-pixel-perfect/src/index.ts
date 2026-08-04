import { z } from 'zod';

// --- Public product API (pixel-art UI asset generation) --------------------
export * from './domain/recipe';
export * from './domain/palettes';
export * from './domain/presets';
export * from './domain/lineage-themes';
export type { PixelBuffer } from './render/pixel-buffer';
export { renderAsset, totalBorderThickness } from './render/render';
export { encodePng, encodePngDataUrl, toBase64 } from './export/png';
export {
  buildGodotMetadata,
  computeNineSlice,
  type GodotExportSettings,
  type GodotNinePatchMetadata,
  type NineSliceMargins,
} from './export/godot';
export { parseRecipe, serializeRecipe, validateRecipe } from './export/recipe-io';
export {
  GodotAxisStretch,
  buildGodotExportBundle,
  godotStringLiteral,
  serializeGodotNinePatchScene,
  serializeGodotStyleBoxTexture,
  toNodeName,
  validateGodotDestination,
  type BuildGodotBundleInput,
  type GodotAxisStretchValue,
  type GodotBundleFile,
  type GodotContentPadding,
  type GodotDestination,
  type GodotDestinationResult,
  type GodotExportBundle,
  type NinePatchSceneInput,
  type StyleBoxTextureInput,
} from './export/godot-resources';
export { encodeZip, type ZipEntry } from './export/zip';
export { encodeUtf8 } from './export/utf8';

// --- Pixelation Reference Tool (web feature) ----------------------------
export * from './pixelation-ref';

/**
 * Sixteen Pixel Perfect — shared business module.
 *
 * MVP is client-only (no backend, no roles beyond the inherited auth shell).
 * The role primitives below exist only to satisfy the monorepo auth-shell
 * contract carried by the web app template; the product itself has a single
 * default user and no role split. Replace as real domain lands.
 */

export const SixteenPixelPerfectRoles = ['USER'] as const;

export type SixteenPixelPerfectRole = (typeof SixteenPixelPerfectRoles)[number];

export type SixteenPixelPerfectRoleSource = 'backend' | 'clerk' | 'none';

export function isSixteenPixelPerfectRole(value: unknown): value is SixteenPixelPerfectRole {
  return (
    typeof value === 'string' && SixteenPixelPerfectRoles.includes(value as SixteenPixelPerfectRole)
  );
}

/** Workspace home for a signed-in user. Single role today ⇒ one workspace route. */
export function getSixteenPixelPerfectRoleHomePath(role: SixteenPixelPerfectRole): '/studio' {
  return role === 'USER' ? '/studio' : '/studio';
}

/** Where to send a user after auth. No role split yet ⇒ always the workspace. */
export function getSixteenPixelPerfectPostAuthPath(
  role: SixteenPixelPerfectRole | null,
): '/studio' {
  return role ? getSixteenPixelPerfectRoleHomePath(role) : '/studio';
}

export function extractSixteenPixelPerfectRoleFromMePayload(
  payload: unknown,
): SixteenPixelPerfectRole | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const asRecord = payload as Record<string, unknown>;
  if (isSixteenPixelPerfectRole(asRecord.role)) {
    return asRecord.role;
  }
  const user = asRecord.user;
  if (user && typeof user === 'object') {
    const role = (user as Record<string, unknown>).role;
    if (isSixteenPixelPerfectRole(role)) {
      return role;
    }
  }
  return null;
}

// --- Domain surface (placeholder; expand with the first vertical slice) ----
// See `.claude/agents/sixteen-pp.md` for the full domain glossary + invariants.

export const SixteenPixelPerfectFeatureFlags = {
  enableGodotExport: 'sixteen-pixel-perfect.enable_godot_export',
  enableStateVariants: 'sixteen-pixel-perfect.enable_state_variants',
} as const;

export const SixteenPixelPerfectEntitySchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type SixteenPixelPerfectEntity = z.infer<typeof SixteenPixelPerfectEntitySchema>;

export function validateSixteenPixelPerfectEntity(input: unknown): SixteenPixelPerfectEntity {
  return SixteenPixelPerfectEntitySchema.parse(input);
}
