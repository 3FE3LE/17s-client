import { describe, expect, it } from 'vitest';
import {
  maxColorsAutoForLogical,
  validateProcessingConfig,
  PROCESSING_CONFIG_VERSION,
} from '../domain/config';

describe('ProcessingConfig Zod schema', () => {
  const validBase = {
    version: PROCESSING_CONFIG_VERSION,
    canvas: { w: 1280, h: 720, mode: 'fit' as const },
    logical: { w: 320, h: 180, mode: 'manual' as const },
    pixelation: { mode: 'median' as const },
    quantization: { algorithm: 'median-cut' as const, maxColors: 90, seed: 0 },
    normalization: { mode: 'off' as const },
    dithering: { mode: 'none' as const, strength: 1 },
  };

  it('accepts the canonical recipe', () => {
    expect(() => validateProcessingConfig(validBase)).not.toThrow();
  });

  it('rejects invalid canvas mode', () => {
    expect(() =>
      validateProcessingConfig({ ...validBase, canvas: { ...validBase.canvas, mode: 'crop' } }),
    ).toThrow();
  });

  it('rejects logical w < 8', () => {
    expect(() =>
      validateProcessingConfig({ ...validBase, logical: { ...validBase.logical, w: 4 } }),
    ).toThrow();
  });

  it('rejects maxColors out of range', () => {
    expect(() =>
      validateProcessingConfig({
        ...validBase,
        quantization: { ...validBase.quantization, maxColors: 1 },
      }),
    ).toThrow();
    expect(() =>
      validateProcessingConfig({
        ...validBase,
        quantization: { ...validBase.quantization, maxColors: 1000 },
      }),
    ).toThrow();
  });
});

describe('maxColorsAutoForLogical', () => {
  it('320x180 ⇒ 90', () => {
    expect(maxColorsAutoForLogical(320, 180)).toBe(90);
  });

  it('clamps to 256 floor on huge images', () => {
    expect(maxColorsAutoForLogical(2048, 2048)).toBe(256);
  });

  it('clamps to 8 floor on tiny images', () => {
    expect(maxColorsAutoForLogical(8, 8)).toBe(8);
  });

  it('floors odd dimensions', () => {
    expect(maxColorsAutoForLogical(100, 80)).toBe(40);
  });
});
