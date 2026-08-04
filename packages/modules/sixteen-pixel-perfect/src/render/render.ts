import type { AssetRecipe, ComponentState, CornerMotif, EdgePattern, Rgba } from '../domain/recipe';
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
  const step = Math.max(1, Math.floor(size / 2));
  switch (motif) {
    case 'bevel':
      return lx + ly < size;
    case 'buttress':
      return lx + ly < size - 1 || (lx < 2 && ly < size - 1) || (ly < 2 && lx < size - 1);
    case 'folded':
      return lx + ly < size || (lx < 2 && ly < size - 2) || (ly < 2 && lx < size - 2);
    case 'compass':
      return lx + ly < size && lx !== step && ly !== step;
    case 'constellation':
      return lx + ly < size || (lx === 1 && ly <= size - 2) || (ly === 1 && lx <= size - 2);
    case 'cellular':
      return (
        (size - lx) * (size - lx) + (size - ly) * (size - ly) > size * size ||
        (lx < 2 && ly < step) ||
        (ly < 2 && lx < step)
      );
    case 'pulse':
      return (
        (size - lx) * (size - lx) + (size - ly) * (size - ly) > size * size ||
        (lx + ly < size && (lx + ly) % 3 === 0)
      );
    case 'round': {
      const dx = size - lx;
      const dy = size - ly;
      return dx * dx + dy * dy > size * size;
    }
    case 'notch':
    case 'rivet': {
      return (lx < step && ly < step) || lx + ly < step;
    }
    case 'seal':
      return (lx < 2 && ly < 2) || (lx === 0 && ly < size - 1) || (ly === 0 && lx < size - 1);
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

function drawSymmetricCornerPixel(buffer: PixelBuffer, lx: number, ly: number, color: Rgba): void {
  const { width: w, height: h } = buffer;
  setPixel(buffer, lx, ly, color);
  setPixel(buffer, w - 1 - lx, ly, color);
  setPixel(buffer, lx, h - 1 - ly, color);
  setPixel(buffer, w - 1 - lx, h - 1 - ly, color);
}

function drawSymmetricCornerLine(
  buffer: PixelBuffer,
  points: readonly [number, number][],
  color: Rgba,
): void {
  for (const [lx, ly] of points) {
    drawSymmetricCornerPixel(buffer, lx, ly, color);
  }
}

function drawCornerOrnaments(
  buffer: PixelBuffer,
  motif: CornerMotif,
  size: number,
  colors: { dark: Rgba; mid: Rgba; light: Rgba; accent: Rgba; selection: Rgba },
): void {
  if (
    size <= 0 ||
    motif === 'square' ||
    motif === 'bevel' ||
    motif === 'notch' ||
    motif === 'round'
  ) {
    return;
  }
  const span = Math.min(size, Math.floor(buffer.width / 2), Math.floor(buffer.height / 2));
  if (span < 4) return;
  const end = span - 1;
  const mid = Math.max(2, Math.floor(span / 2));

  switch (motif) {
    case 'buttress':
      drawSymmetricCornerLine(
        buffer,
        [
          [1, end],
          [2, end],
          [3, end],
          [end, 1],
          [end, 2],
          [end, 3],
        ],
        colors.dark,
      );
      drawSymmetricCornerLine(
        buffer,
        [
          [2, end - 1],
          [3, end - 1],
          [end - 1, 2],
          [end - 1, 3],
        ],
        colors.mid,
      );
      drawSymmetricCornerLine(
        buffer,
        [
          [mid, mid - 1],
          [mid - 1, mid],
          [mid, mid],
        ],
        colors.light,
      );
      break;
    case 'cellular':
      drawSymmetricCornerLine(
        buffer,
        [
          [1, mid],
          [2, mid - 1],
          [mid - 1, 2],
          [mid, 1],
        ],
        colors.light,
      );
      drawSymmetricCornerLine(
        buffer,
        [
          [mid, mid],
          [end - 1, 2],
          [2, end - 1],
        ],
        colors.accent,
      );
      drawSymmetricCornerLine(
        buffer,
        [
          [end, mid],
          [mid, end],
        ],
        colors.mid,
      );
      break;
    case 'rivet':
      drawSymmetricCornerLine(
        buffer,
        [
          [1, end],
          [2, end],
          [end, 1],
          [end, 2],
        ],
        colors.mid,
      );
      drawSymmetricCornerLine(
        buffer,
        [
          [mid, 1],
          [1, mid],
          [mid, mid],
        ],
        colors.light,
      );
      drawSymmetricCornerLine(
        buffer,
        [
          [mid + 1, 2],
          [2, mid + 1],
        ],
        colors.dark,
      );
      break;
    case 'folded':
      drawSymmetricCornerLine(
        buffer,
        [
          [1, end],
          [2, end - 1],
          [3, end - 2],
          [end, 1],
          [end - 1, 2],
          [end - 2, 3],
        ],
        colors.light,
      );
      drawSymmetricCornerLine(
        buffer,
        [
          [2, end],
          [3, end - 1],
          [end, 2],
          [end - 1, 3],
        ],
        colors.mid,
      );
      drawSymmetricCornerLine(
        buffer,
        [
          [mid, mid],
          [mid + 1, mid],
          [mid, mid + 1],
        ],
        colors.accent,
      );
      break;
    case 'compass':
      drawSymmetricCornerLine(
        buffer,
        [
          [1, mid],
          [2, mid],
          [mid, 1],
          [mid, 2],
        ],
        colors.light,
      );
      drawSymmetricCornerLine(
        buffer,
        [
          [mid - 1, mid - 1],
          [mid, mid],
          [mid + 1, mid + 1],
        ],
        colors.accent,
      );
      drawSymmetricCornerLine(
        buffer,
        [
          [end, mid],
          [mid, end],
        ],
        colors.mid,
      );
      break;
    case 'seal':
      drawSymmetricCornerLine(
        buffer,
        [
          [1, 1],
          [2, 1],
          [1, 2],
          [2, 2],
        ],
        colors.dark,
      );
      drawSymmetricCornerLine(
        buffer,
        [
          [1, end],
          [2, end],
          [end, 1],
          [end, 2],
          [end, end],
        ],
        colors.mid,
      );
      drawSymmetricCornerLine(
        buffer,
        [
          [mid, 1],
          [1, mid],
          [mid, mid],
        ],
        colors.selection,
      );
      break;
    case 'constellation':
      drawSymmetricCornerLine(
        buffer,
        [
          [1, end],
          [2, end - 1],
          [3, end - 2],
          [end - 1, 2],
          [end, 1],
        ],
        colors.mid,
      );
      drawSymmetricCornerLine(
        buffer,
        [
          [1, end],
          [3, end - 2],
          [end, 1],
          [mid, mid],
        ],
        colors.light,
      );
      drawSymmetricCornerLine(
        buffer,
        [
          [2, 2],
          [mid, mid],
          [end - 1, end - 1],
        ],
        colors.accent,
      );
      break;
    case 'pulse':
      drawSymmetricCornerLine(
        buffer,
        [
          [1, mid],
          [2, mid - 1],
          [mid - 1, 2],
          [mid, 1],
        ],
        colors.accent,
      );
      drawSymmetricCornerLine(
        buffer,
        [
          [2, end - 1],
          [3, end - 2],
          [end - 2, 3],
          [end - 1, 2],
        ],
        colors.light,
      );
      drawSymmetricCornerLine(
        buffer,
        [
          [mid, mid],
          [mid + 1, mid],
          [mid, mid + 1],
        ],
        colors.selection,
      );
      break;
    default:
      break;
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

  // 6. Draw motif-specific corner pixels from resolved semantic tokens.
  const fallbackDark = recipe.border.layers[0]?.tokenId ?? recipe.fill.tokenIds[0]!;
  const fallbackMid = recipe.border.layers[1]?.tokenId ?? fallbackDark;
  const fallbackLight = recipe.border.layers[2]?.tokenId ?? fallbackMid;
  const resolveOr = (tokenId: string, fallbackTokenId: string): Rgba => {
    try {
      return resolve(tokenId);
    } catch {
      return resolve(fallbackTokenId);
    }
  };
  drawCornerOrnaments(buffer, recipe.corner.motif, recipe.corner.size, {
    dark: resolveOr('border_dark', fallbackDark),
    mid: resolveOr('border_mid', fallbackMid),
    light: resolveOr('border_light', fallbackLight),
    accent: resolveOr('accent_primary', fallbackLight),
    selection: resolveOr('selection', fallbackLight),
  });

  return buffer;
}
