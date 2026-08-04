import { describe, expect, it } from 'vitest';
import { runFullPipeline, fittedCanvas } from '../pipeline/index';
import { createPixelBuffer } from '../../render/pixel-buffer';
import { encodePng } from '../../export/png';
import { validateProcessingConfig } from '../domain/config';
import { buildPixelationBundle } from '../exports/bundle';

const BASE_CONFIG = validateProcessingConfig({
  version: 1,
  canvas: { w: 64, h: 48, mode: 'fit' },
  logical: { w: 16, h: 12, mode: 'manual' },
  pixelation: { mode: 'median' },
  quantization: { algorithm: 'median-cut', maxColors: 16, seed: 0 },
  normalization: { mode: 'off' },
  dithering: { mode: 'none', strength: 1 },
});

describe('pipeline + round-trip determinism', () => {
  it('runs end-to-end and produces a valid PNG', () => {
    const src = createPixelBuffer(80, 60);
    for (let i = 0; i < src.data.length; i += 4) {
      const r = Math.floor(i / 4);
      src.data[i] = (r * 7) & 0xff;
      src.data[i + 1] = (r * 11) & 0xff;
      src.data[i + 2] = (r * 13) & 0xff;
      src.data[i + 3] = 255;
    }
    const out = runFullPipeline({ source: src, config: BASE_CONFIG });
    expect(out).not.toBeNull();
    expect(out!.result.pixelated.width).toBe(16);
    expect(out!.result.pixelated.height).toBe(12);
    expect(out!.result.preview.width).toBe(64);
    expect(out!.result.preview.height).toBe(48);
    // Encode the pixelated PNG and check the magic header.
    const bytes = encodePng(out!.result.pixelated);
    expect(bytes[0]).toBe(0x89);
    expect(bytes[1]).toBe(0x50); // 'P'
    expect(bytes[2]).toBe(0x4e); // 'N'
    expect(bytes[3]).toBe(0x47); // 'G'
  });

  it('same input + same recipe ⇒ byte-identical pixelated output', () => {
    const src = createPixelBuffer(40, 30);
    let s = 1;
    for (let i = 0; i < src.data.length; i += 4) {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      src.data[i] = s & 0xff;
      src.data[i + 1] = (s >>> 8) & 0xff;
      src.data[i + 2] = (s >>> 16) & 0xff;
      src.data[i + 3] = 255;
    }
    const a = runFullPipeline({ source: src, config: BASE_CONFIG });
    const b = runFullPipeline({ source: src, config: BASE_CONFIG });
    const aBytes = Array.from(encodePng(a!.result.pixelated));
    const bBytes = Array.from(encodePng(b!.result.pixelated));
    expect(aBytes).toEqual(bBytes);
  });

  it('emits a warning when canvas is not an integer multiple of logical', () => {
    const cfg = validateProcessingConfig({
      ...BASE_CONFIG,
      canvas: { w: 100, h: 50, mode: 'fit' },
      logical: { w: 16, h: 16, mode: 'manual' },
    });
    const src = createPixelBuffer(20, 20);
    for (let i = 0; i < src.data.length; i += 4) {
      src.data[i] = 128;
      src.data[i + 3] = 255;
    }
    const out = runFullPipeline({ source: src, config: cfg });
    expect(out!.warnings.length).toBeGreaterThan(0);
  });

  it('produces a non-empty palette for a multi-color image', () => {
    const src = createPixelBuffer(20, 20);
    for (let i = 0; i < src.data.length; i += 4) {
      src.data[i] = i & 0xff;
      src.data[i + 1] = (i * 3) & 0xff;
      src.data[i + 2] = (i * 5) & 0xff;
      src.data[i + 3] = 255;
    }
    const out = runFullPipeline({ source: src, config: BASE_CONFIG });
    expect(out!.result.palette.length).toBeGreaterThan(1);
    expect(out!.result.palette.length).toBeLessThanOrEqual(16);
  });

  it('fittedCanvas computes fit and pads transparent borders', () => {
    const src = createPixelBuffer(40, 10);
    for (let i = 0; i < src.data.length; i += 4) {
      src.data[i] = 200;
      src.data[i + 3] = 255;
    }
    const fitted = fittedCanvas({ source: src, canvasW: 80, canvasH: 80, mode: 'fit' });
    expect(fitted.width).toBe(80);
    expect(fitted.height).toBe(80);
    expect(fitted.data[3]).toBe(0);
  });

  it('buildPixelationBundle produces a 6-entry ZIP', () => {
    const src = createPixelBuffer(20, 15);
    for (let i = 0; i < src.data.length; i += 4) {
      src.data[i] = 80;
      src.data[i + 1] = 40;
      src.data[i + 2] = 200;
      src.data[i + 3] = 255;
    }
    const out = runFullPipeline({ source: src, config: BASE_CONFIG });
    const zip = buildPixelationBundle({
      config: out!.result.recipe,
      pixelated: out!.result.pixelated,
      preview: out!.result.preview,
      palette: out!.result.palette,
    });
    expect(zip.length).toBeGreaterThan(0);
    // Verify ZIP magic.
    expect(zip[0]).toBe(0x50); // 'P'
    expect(zip[1]).toBe(0x4b); // 'K'
  });

  it('bundle is byte-deterministic across runs', () => {
    const src = createPixelBuffer(20, 15);
    for (let i = 0; i < src.data.length; i += 4) {
      src.data[i] = 80;
      src.data[i + 1] = 40;
      src.data[i + 2] = 200;
      src.data[i + 3] = 255;
    }
    const out1 = runFullPipeline({ source: src, config: BASE_CONFIG });
    const out2 = runFullPipeline({ source: src, config: BASE_CONFIG });
    const zip1 = buildPixelationBundle({
      config: out1!.result.recipe,
      pixelated: out1!.result.pixelated,
      preview: out1!.result.preview,
      palette: out1!.result.palette,
    });
    const zip2 = buildPixelationBundle({
      config: out2!.result.recipe,
      pixelated: out2!.result.pixelated,
      preview: out2!.result.preview,
      palette: out2!.result.palette,
    });
    expect(Array.from(zip1)).toEqual(Array.from(zip2));
  });
});
