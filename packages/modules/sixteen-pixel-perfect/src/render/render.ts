import type { AssetRecipe, ComponentState, CornerMotif, EdgePattern } from '../domain/recipe';
import { createPixelBuffer, fillRect, setPixel, strokeRing } from './pixel-buffer';
import type { PixelBuffer } from './pixel-buffer';
import { createRng } from './rng';
import { createTokenResolver } from './states';

/** Total border thickness across all layers. */
export function totalBorderThickness(recipe: AssetRecipe): number {
  return recipe.border.layers.reduce((sum, layer) => sum + layer.thickness, 0);
}

function edgeKeep(pattern: EdgePattern): (x: number, y: number) => boolean {
  switch (pattern) {
    case 'dashed':
      return (x, y) => (x + y) % 4 < 2;
    case 'dotted':
      return (x, y) => (x + y) % 2 === 0;
    case 'solid':
    default:
      return () => true;
  }
}

/** True when a corner pixel (local distance lx, ly from the outer corner) is carved away. */
function isCarved(motif: CornerMotif, size: number, lx: number, ly: number): boolean {
  if (size <= 0 || lx >= size || ly >= size) return false;
  switch (motif) {
    case 'bevel':
      return lx + ly < size;
    case 'round': {
      const dx = size - lx;
      const dy = size - ly;
      return dx * dx + dy * dy > size * size;
    }
    case 'notch': {
      const step = Math.max(1, Math.floor(size / 2));
      return lx < step && ly < step;
    }
    case 'square':
    default:
      return false;
  }
}

function carveCorners(buffer: PixelBuffer, motif: CornerMotif, size: number): void {
  if (motif === 'square' || size <= 0) return;
  const { width: w, height: h } = buffer;
  const span = Math.min(size, Math.floor(w / 2), Math.floor(h / 2));
  for (let ly = 0; ly < span; ly += 1) {
    for (let lx = 0; lx < span; lx += 1) {
      if (!isCarved(motif, size, lx, ly)) continue;
      setPixel(buffer, lx, ly, [0, 0, 0, 0]); // top-left
      setPixel(buffer, w - 1 - lx, ly, [0, 0, 0, 0]); // top-right
      setPixel(buffer, lx, h - 1 - ly, [0, 0, 0, 0]); // bottom-left
      setPixel(buffer, w - 1 - lx, h - 1 - ly, [0, 0, 0, 0]); // bottom-right
    }
  }
}

/**
 * Render a recipe to a pixel buffer for one control state. Pure and
 * deterministic: identical (recipe, state) always yields identical bytes.
 */
export function renderAsset(recipe: AssetRecipe, state: ComponentState = 'normal'): PixelBuffer {
  const { width, height } = recipe.size;
  const buffer = createPixelBuffer(width, height);
  const resolve = createTokenResolver(recipe.palette, state);
  const rng = createRng(recipe.seed);

  // 1. Shadow layer (optional), drawn behind the panel.
  if (recipe.shadow) {
    const { dx, dy } = recipe.shadow;
    const shadow = resolve(recipe.shadow.tokenId);
    fillRect(buffer, dx, dy, width + dx, height + dy, shadow);
  }

  // 2. Background fill (solid) or leave transparent.
  if (recipe.background !== 'transparent') {
    fillRect(buffer, 0, 0, width, height, resolve(recipe.background.tokenId));
  }

  // 3. Center fill inside the border band.
  const border = totalBorderThickness(recipe);
  const fx0 = border;
  const fy0 = border;
  const fx1 = width - border;
  const fy1 = height - border;
  const fillTokens = recipe.fill.tokenIds;
  const fillAt = (index: number) => resolve(fillTokens[index % fillTokens.length]!);
  for (let y = fy0; y < fy1; y += 1) {
    for (let x = fx0; x < fx1; x += 1) {
      let idx: number;
      switch (recipe.fill.kind) {
        case 'checker':
          idx = (Math.floor(x / 2) + Math.floor(y / 2)) % 2;
          break;
        case 'diagonal':
          idx = Math.floor((x + y) / 2) % 2;
          break;
        case 'noise':
          idx = rng.nextInt(fillTokens.length);
          break;
        case 'solid':
        default:
          idx = 0;
          break;
      }
      setPixel(buffer, x, y, fillAt(idx));
    }
  }

  // 4. Border layers, outermost first.
  let inset = 0;
  for (const layer of recipe.border.layers) {
    const color = resolve(layer.tokenId);
    const keep = edgeKeep(layer.pattern);
    for (let ring = 0; ring < layer.thickness; ring += 1) {
      strokeRing(buffer, inset + ring, color, keep);
    }
    inset += layer.thickness;
  }

  // 5. Carve the corner silhouette (never distorts — pure integer masking).
  carveCorners(buffer, recipe.corner.motif, recipe.corner.size);

  return buffer;
}
