/**
 * Worker entry — runs the pure pixelation pipeline off the UI thread.
 *
 * The worker receives a `decode request` (file bytes + mime) followed by
 * `run request`s (already-decoded RGBA + config). It posts `progress` and
 * `result` events back. The pipeline is the same `runFullPipeline` used in
 * module tests, so behaviour is identical to the main thread (modulo an
 * extra decode hop).
 */

import {
  runFullPipeline,
  type PipelineOutput,
  type ProcessingConfig,
} from '@17suit/module-sixteen-pixel-perfect';

type RGBA = { width: number; height: number; data: Uint8ClampedArray };

export type WorkerInbound =
  | { kind: 'decode'; jobId: string; bytes: ArrayBuffer; mime: string }
  | { kind: 'run'; jobId: string; rgba: RGBA; config: ProcessingConfig }
  | { kind: 'abort'; jobId: string };

export type WorkerOutbound =
  | { kind: 'decoded'; jobId: string; rgba: RGBA }
  | { kind: 'result'; jobId: string; output: PipelineOutput }
  | { kind: 'progress'; jobId: string; stage: string }
  | { kind: 'error'; jobId: string; message: string };

const aborters = new Map<string, AbortController>();

self.addEventListener('message', (ev: MessageEvent<WorkerInbound>) => {
  const msg = ev.data;
  if (msg.kind === 'abort') {
    aborters.get(msg.jobId)?.abort();
    aborters.delete(msg.jobId);
    return;
  }
  if (msg.kind === 'decode') {
    decode(msg.bytes)
      .then((rgba) => {
        self.postMessage({ kind: 'decoded', jobId: msg.jobId, rgba } satisfies WorkerOutbound);
      })
      .catch((err: unknown) => {
        self.postMessage({
          kind: 'error',
          jobId: msg.jobId,
          message: err instanceof Error ? err.message : String(err),
        } satisfies WorkerOutbound);
      });
    return;
  }
  // run
  const ac = new AbortController();
  aborters.set(msg.jobId, ac);
  try {
    const src = { width: msg.rgba.width, height: msg.rgba.height, data: msg.rgba.data };
    const output = runFullPipeline({
      source: src,
      config: msg.config,
      signal: ac.signal,
    });
    aborters.delete(msg.jobId);
    if (!output) {
      self.postMessage({
        kind: 'error',
        jobId: msg.jobId,
        message: 'aborted',
      } satisfies WorkerOutbound);
      return;
    }
    self.postMessage({ kind: 'result', jobId: msg.jobId, output } satisfies WorkerOutbound);
  } catch (err) {
    aborters.delete(msg.jobId);
    self.postMessage({
      kind: 'error',
      jobId: msg.jobId,
      message: err instanceof Error ? err.message : String(err),
    } satisfies WorkerOutbound);
  }
});

/**
 * Decode JPEG/PNG/WebP bytes into an RGBA buffer. Pure-Worker decoder via
 * `createImageBitmap` + `OffscreenCanvas`. Falls back to identity-pass
 * for already-decoded buffers (test/dev).
 */
async function decode(bytes: ArrayBuffer): Promise<RGBA> {
  if (typeof createImageBitmap === 'undefined' || typeof OffscreenCanvas === 'undefined') {
    throw new Error('worker cannot decode this environment: missing createImageBitmap');
  }
  const blob = new Blob([bytes]);
  const bm = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(bm.width, bm.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('worker: cannot acquire 2d context');
  ctx.drawImage(bm, 0, 0);
  const imgData = ctx.getImageData(0, 0, bm.width, bm.height);
  bm.close();
  return { width: bm.width, height: bm.height, data: new Uint8ClampedArray(imgData.data) };
}
