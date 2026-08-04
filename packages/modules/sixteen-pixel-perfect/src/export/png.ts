import type { PixelBuffer } from '../render/pixel-buffer';
import { crc32 } from './crc32';

/**
 * Minimal, dependency-free, deterministic PNG encoder (8-bit RGBA).
 *
 * Uses stored (uncompressed) zlib blocks so output is a pure function of the
 * pixel bytes — no compressor heuristics, no environment variance. Same buffer
 * ⇒ byte-identical PNG. This is both the preview source and the export bytes.
 */

const SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function adler32(bytes: Uint8Array): number {
  let a = 1;
  let b = 0;
  for (let i = 0; i < bytes.length; i += 1) {
    a = (a + bytes[i]!) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
}

function u32be(value: number): number[] {
  return [(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff];
}

function chunk(type: string, data: number[]): number[] {
  const typeBytes = [
    type.charCodeAt(0),
    type.charCodeAt(1),
    type.charCodeAt(2),
    type.charCodeAt(3),
  ];
  const body = typeBytes.concat(data);
  const crc = crc32(Uint8Array.from(body));
  return u32be(data.length).concat(body, u32be(crc));
}

/** Wrap raw bytes in a zlib stream using stored (BTYPE=00) deflate blocks. */
function zlibStore(raw: Uint8Array): number[] {
  const out: number[] = [0x78, 0x01]; // zlib header (CM=8, no dict, default level flag)
  const MAX = 0xffff;
  let offset = 0;
  do {
    const len = Math.min(MAX, raw.length - offset);
    const isLast = offset + len >= raw.length;
    out.push(isLast ? 1 : 0);
    out.push(len & 0xff, (len >>> 8) & 0xff);
    const nlen = ~len & 0xffff;
    out.push(nlen & 0xff, (nlen >>> 8) & 0xff);
    for (let i = 0; i < len; i += 1) out.push(raw[offset + i]!);
    offset += len;
  } while (offset < raw.length);
  const adler = adler32(raw);
  out.push(...u32be(adler));
  return out;
}

/** Encode a pixel buffer as PNG bytes. */
export function encodePng(buffer: PixelBuffer): Uint8Array {
  const { width, height, data } = buffer;

  // Filtered scanlines: filter type 0 (None) prefixed to each row.
  const stride = width * 4;
  const raw = new Uint8Array(height * (stride + 1));
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (stride + 1);
    raw[rowStart] = 0;
    for (let x = 0; x < stride; x += 1) {
      raw[rowStart + 1 + x] = data[y * stride + x]!;
    }
  }

  const ihdr = u32be(width).concat(
    u32be(height),
    [8, 6, 0, 0, 0], // bit depth 8, color type 6 (RGBA), deflate, no filter, no interlace
  );

  const bytes = SIGNATURE.concat(
    chunk('IHDR', ihdr),
    chunk('IDAT', zlibStore(raw)),
    chunk('IEND', []),
  );
  return Uint8Array.from(bytes);
}

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** Pure base64 (no Buffer/btoa dependency) — safe in any JS runtime. */
export function toBase64(bytes: Uint8Array): string {
  let out = '';
  const len = bytes.length;
  for (let i = 0; i < len; i += 3) {
    const b0 = bytes[i]!;
    const b1 = i + 1 < len ? bytes[i + 1]! : 0;
    const b2 = i + 2 < len ? bytes[i + 2]! : 0;
    out += B64[b0 >> 2]!;
    out += B64[((b0 & 3) << 4) | (b1 >> 4)]!;
    out += i + 1 < len ? B64[((b1 & 15) << 2) | (b2 >> 6)]! : '=';
    out += i + 2 < len ? B64[b2 & 63]! : '=';
  }
  return out;
}

/** Data URL for use as an <img> src (preview + download). */
export function encodePngDataUrl(buffer: PixelBuffer): string {
  return `data:image/png;base64,${toBase64(encodePng(buffer))}`;
}
