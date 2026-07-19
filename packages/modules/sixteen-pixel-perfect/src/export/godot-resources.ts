import type { AssetRecipe } from '../domain/recipe';
import { buildGodotMetadata, computeNineSlice, type NineSliceMargins } from './godot';
import { serializeRecipe } from './recipe-io';
import { encodeUtf8 } from './utf8';

/**
 * Native Godot 4 text-resource serializers. Pure: inputs are typed domain
 * values, outputs are deterministic strings / bytes. No React, no canvas, no
 * download UI, no browser storage.
 *
 * - `StyleBoxTexture` (.tres) is the primary native export.
 * - `NinePatchRect` (.tscn) is a preview/convenience export only.
 *
 * No `.import` files are generated — Godot writes its own import metadata after
 * the files are copied into the project. For crisp pixel art, configure
 * `Rendering > Textures > Canvas Textures > Default Texture Filter = Nearest`
 * (the preview scene also sets `texture_filter = 1` explicitly).
 */

/** Godot enum integers for axis stretch modes. */
export const GodotAxisStretch = {
  Stretch: 0,
  Tile: 1,
  TileFit: 2,
} as const;
export type GodotAxisStretchValue = (typeof GodotAxisStretch)[keyof typeof GodotAxisStretch];

export interface GodotContentPadding {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

// --- Destination path validation -------------------------------------------

export interface GodotDestination {
  /** The validated `res://…/` path, ending in `/`. */
  path: string;
  /** Path with the `res://` prefix stripped, e.g. `assets/ui/generated/panel/`. */
  relativeDir: string;
  /** Final folder segment, used for file names and the resource node name. */
  assetName: string;
}

export interface GodotDestinationResult {
  valid: boolean;
  error?: string;
  destination?: GodotDestination;
}

const DESTINATION_RE = /^res:\/\/(?:[A-Za-z0-9_-]+\/)+$/;

/**
 * Validate a Godot destination path. Must start with `res://`, end with `/`,
 * contain no `..`, and use only path-safe characters ([A-Za-z0-9_-] segments).
 */
export function validateGodotDestination(input: string): GodotDestinationResult {
  if (!input.startsWith('res://')) {
    return { valid: false, error: 'La ruta debe empezar con res://' };
  }
  if (!input.endsWith('/')) {
    return { valid: false, error: 'La ruta debe terminar con /' };
  }
  if (input.includes('..')) {
    return { valid: false, error: 'La ruta no puede contener ..' };
  }
  if (!DESTINATION_RE.test(input)) {
    return {
      valid: false,
      error: 'Solo se permiten segmentos con letras, números, guion y guion bajo.',
    };
  }
  const relativeDir = input.slice('res://'.length);
  const segments = relativeDir.split('/').filter(Boolean);
  const assetName = segments[segments.length - 1]!;
  return { valid: true, destination: { path: input, relativeDir, assetName } };
}

// --- Text helpers ------------------------------------------------------------

/** Quote a string as a Godot resource literal, escaping backslashes and quotes. */
export function godotStringLiteral(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function godotFloat(n: number): string {
  return Number.isInteger(n) ? `${n}.0` : `${n}`;
}

/** Derive a valid PascalCase Godot node name from an asset name. */
export function toNodeName(assetName: string, suffix = ''): string {
  const pascal = assetName
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  const safe = pascal.replace(/[^A-Za-z0-9_]/g, '');
  const withDigitGuard = /^[0-9]/.test(safe) ? `N${safe}` : safe;
  return `${withDigitGuard || 'Asset'}${suffix}`;
}

// --- StyleBoxTexture (.tres) -------------------------------------------------

export interface StyleBoxTextureInput {
  /** Full `res://…/name.png` path to the texture. */
  texturePath: string;
  margins: NineSliceMargins;
  axisStretchHorizontal: GodotAxisStretchValue;
  axisStretchVertical: GodotAxisStretchValue;
  drawCenter?: boolean;
  /** Optional; when omitted Godot falls back to texture margins for content. */
  contentPadding?: GodotContentPadding;
}

export function serializeGodotStyleBoxTexture(input: StyleBoxTextureInput): string {
  const { texturePath, margins, axisStretchHorizontal, axisStretchVertical } = input;
  const drawCenter = input.drawCenter ?? true;
  const lines: string[] = [
    '[gd_resource type="StyleBoxTexture" load_steps=2 format=3]',
    '',
    `[ext_resource type="Texture2D" path=${godotStringLiteral(texturePath)} id="1_texture"]`,
    '',
    '[resource]',
    'texture = ExtResource("1_texture")',
    `texture_margin_left = ${godotFloat(margins.left)}`,
    `texture_margin_top = ${godotFloat(margins.top)}`,
    `texture_margin_right = ${godotFloat(margins.right)}`,
    `texture_margin_bottom = ${godotFloat(margins.bottom)}`,
    `axis_stretch_horizontal = ${axisStretchHorizontal}`,
    `axis_stretch_vertical = ${axisStretchVertical}`,
    `draw_center = ${drawCenter}`,
  ];
  if (input.contentPadding) {
    const p = input.contentPadding;
    lines.push(
      `content_margin_left = ${godotFloat(p.left)}`,
      `content_margin_top = ${godotFloat(p.top)}`,
      `content_margin_right = ${godotFloat(p.right)}`,
      `content_margin_bottom = ${godotFloat(p.bottom)}`,
    );
  }
  // No region_rect: each asset uses its own PNG (atlas export not implemented).
  return `${lines.join('\n')}\n`;
}

// --- NinePatchRect preview scene (.tscn) ------------------------------------

export interface NinePatchSceneInput {
  texturePath: string;
  nodeName: string;
  margins: NineSliceMargins;
  axisStretchHorizontal: GodotAxisStretchValue;
  axisStretchVertical: GodotAxisStretchValue;
  drawCenter?: boolean;
  customMinimumSize: { width: number; height: number };
  /** 1 = Nearest (crisp pixel art). */
  textureFilter?: number;
}

export function serializeGodotNinePatchScene(input: NinePatchSceneInput): string {
  const { texturePath, nodeName, margins, axisStretchHorizontal, axisStretchVertical } = input;
  const drawCenter = input.drawCenter ?? true;
  const textureFilter = input.textureFilter ?? 1;
  const { width, height } = input.customMinimumSize;
  const lines: string[] = [
    '[gd_scene load_steps=2 format=3]',
    '',
    `[ext_resource type="Texture2D" path=${godotStringLiteral(texturePath)} id="1_texture"]`,
    '',
    `[node name=${godotStringLiteral(nodeName)} type="NinePatchRect"]`,
    `custom_minimum_size = Vector2(${width}, ${height})`,
    `texture_filter = ${textureFilter}`,
    'texture = ExtResource("1_texture")',
    `patch_margin_left = ${margins.left}`,
    `patch_margin_top = ${margins.top}`,
    `patch_margin_right = ${margins.right}`,
    `patch_margin_bottom = ${margins.bottom}`,
    `axis_stretch_horizontal = ${axisStretchHorizontal}`,
    `axis_stretch_vertical = ${axisStretchVertical}`,
    `draw_center = ${drawCenter}`,
  ];
  return `${lines.join('\n')}\n`;
}

// --- Export bundle -----------------------------------------------------------

export interface GodotBundleFile {
  /** Relative path (mirrors destination after `res://`). */
  path: string;
  bytes: Uint8Array;
  /** Present for text artifacts (useful for tests / previews). */
  text?: string;
}

export interface GodotExportBundle {
  destination: GodotDestination;
  texturePath: string;
  margins: NineSliceMargins;
  files: GodotBundleFile[];
}

export interface BuildGodotBundleInput {
  recipe: AssetRecipe;
  /** PNG bytes for the primary (normal-state) texture. */
  pngBytes: Uint8Array;
  /** Validated destination path (`res://…/`). */
  destination: string;
  axisStretchHorizontal?: GodotAxisStretchValue;
  axisStretchVertical?: GodotAxisStretchValue;
  contentPadding?: GodotContentPadding;
}

function textFile(path: string, text: string): GodotBundleFile {
  return { path, text, bytes: encodeUtf8(text) };
}

/**
 * Build the full native Godot export bundle for one asset. Deterministic:
 * identical inputs produce identical files (bytes and order). Throws on an
 * invalid destination.
 */
export function buildGodotExportBundle(input: BuildGodotBundleInput): GodotExportBundle {
  const result = validateGodotDestination(input.destination);
  if (!result.valid || !result.destination) {
    throw new Error(result.error ?? 'Ruta de destino Godot inválida');
  }
  const destination = result.destination;
  const { assetName, relativeDir } = destination;
  const axisH = input.axisStretchHorizontal ?? GodotAxisStretch.Tile;
  const axisV = input.axisStretchVertical ?? GodotAxisStretch.Tile;
  const margins = computeNineSlice(input.recipe);
  const texturePath = `${destination.path}${assetName}.png`;

  const styleBox = serializeGodotStyleBoxTexture({
    texturePath,
    margins,
    axisStretchHorizontal: axisH,
    axisStretchVertical: axisV,
    ...(input.contentPadding ? { contentPadding: input.contentPadding } : {}),
  });
  const scene = serializeGodotNinePatchScene({
    texturePath,
    nodeName: toNodeName(assetName, 'Preview'),
    margins,
    axisStretchHorizontal: axisH,
    axisStretchVertical: axisV,
    customMinimumSize: {
      width: Math.max(160, input.recipe.size.width * 4),
      height: Math.max(96, input.recipe.size.height * 4),
    },
  });
  const recipeJson = serializeRecipe(input.recipe);
  const godotJson = JSON.stringify(
    buildGodotMetadata(input.recipe, { textureFileName: `${assetName}.png` }),
    null,
    2,
  );

  const files: GodotBundleFile[] = [
    { path: `${relativeDir}${assetName}.png`, bytes: input.pngBytes },
    textFile(`${relativeDir}${assetName}.stylebox.tres`, styleBox),
    textFile(`${relativeDir}${assetName}.preview.tscn`, scene),
    textFile(`${relativeDir}${assetName}.recipe.json`, recipeJson),
    textFile(`${relativeDir}${assetName}.godot.json`, godotJson),
  ];

  return { destination, texturePath, margins, files };
}
