import type { Rgba } from '../domain/recipe';

/**
 * An RGBA pixel buffer at integer coordinates. This is the neutral artifact the
 * pure renderer produces; adapters (PNG encoder, browser preview) consume it.
 * There is no floating-point positioning: every write targets an integer (x, y).
 */
export interface PixelBuffer {
  readonly width: number;
  readonly height: number;
  /** RGBA, row-major, length = width * height * 4. */
  readonly data: Uint8ClampedArray;
}

export function createPixelBuffer(width: number, height: number): PixelBuffer {
  return { width, height, data: new Uint8ClampedArray(width * height * 4) };
}

export function setPixel(buffer: PixelBuffer, x: number, y: number, rgba: Rgba): void {
  // Integer-coordinate invariant: reject non-integer / out-of-bounds writes.
  if (!Number.isInteger(x) || !Number.isInteger(y)) return;
  if (x < 0 || y < 0 || x >= buffer.width || y >= buffer.height) return;
  const i = (y * buffer.width + x) * 4;
  buffer.data[i] = rgba[0];
  buffer.data[i + 1] = rgba[1];
  buffer.data[i + 2] = rgba[2];
  buffer.data[i + 3] = rgba[3];
}

export function fillRect(
  buffer: PixelBuffer,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  rgba: Rgba,
): void {
  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      setPixel(buffer, x, y, rgba);
    }
  }
}

/** Draw a one-pixel-thick rectangular ring at the given inset. */
export function strokeRing(
  buffer: PixelBuffer,
  inset: number,
  rgba: Rgba,
  keep: (x: number, y: number) => boolean,
): void {
  const left = inset;
  const top = inset;
  const right = buffer.width - 1 - inset;
  const bottom = buffer.height - 1 - inset;
  if (right < left || bottom < top) return;
  for (let x = left; x <= right; x += 1) {
    if (keep(x, top)) setPixel(buffer, x, top, rgba);
    if (keep(x, bottom)) setPixel(buffer, x, bottom, rgba);
  }
  for (let y = top; y <= bottom; y += 1) {
    if (keep(left, y)) setPixel(buffer, left, y, rgba);
    if (keep(right, y)) setPixel(buffer, right, y, rgba);
  }
}

export function clearPixel(buffer: PixelBuffer, x: number, y: number): void {
  setPixel(buffer, x, y, [0, 0, 0, 0]);
}
