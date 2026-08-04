/**
 * Main-thread wrapper around the pixelation-ref worker. Owns job IDs and
 * keeps a single long-lived worker alive across runs. Cancellation is
 * cooperative: each new run is given a fresh jobId; older jobs are aborted
 * before posting so the worker discards their results.
 */

import type { PipelineOutput, ProcessingConfig } from '@17suit/module-sixteen-pixel-perfect';

export type RGBA = { width: number; height: number; data: Uint8ClampedArray };

type DecodedMessage = { kind: 'decoded'; jobId: string; rgba: RGBA };
type ResultMessage = { kind: 'result'; jobId: string; output: PipelineOutput };
type ProgressMessage = { kind: 'progress'; jobId: string; stage: string };
type ErrorMessage = { kind: 'error'; jobId: string; message: string };

export type WorkerResponse = DecodedMessage | ResultMessage | ProgressMessage | ErrorMessage;

export class PixelationWorkerClient {
  private worker: Worker | null = null;
  private listeners = new Set<(msg: WorkerResponse) => void>();
  private jobCounter = 0;

  ensureWorker(): Worker {
    if (this.worker) return this.worker;
    if (typeof Worker === 'undefined') {
      throw new Error('Web Workers are not available in this environment');
    }
    const w = new Worker(new URL('./pixelation-ref-worker.ts', import.meta.url), {
      type: 'module',
    });
    w.addEventListener('message', (ev: MessageEvent<WorkerResponse>) => {
      for (const l of this.listeners) l(ev.data);
    });
    this.worker = w;
    return w;
  }

  listen(cb: (msg: WorkerResponse) => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  nextJobId(): string {
    this.jobCounter += 1;
    return `${Date.now()}-${this.jobCounter}`;
  }

  decode(bytes: ArrayBuffer, mime: string, jobId: string): void {
    this.ensureWorker().postMessage({ kind: 'decode', jobId, bytes, mime });
  }

  run(rgba: RGBA, config: ProcessingConfig, jobId: string): void {
    this.ensureWorker().postMessage({ kind: 'run', jobId, rgba, config });
  }

  abort(jobId: string): void {
    if (!this.worker) return;
    this.worker.postMessage({ kind: 'abort', jobId });
  }

  terminate(): void {
    if (this.worker) this.worker.terminate();
    this.worker = null;
  }
}

let clientInstance: PixelationWorkerClient | null = null;

/** Process-wide singleton so React state can read/use a stable client. */
export function getPixelationWorker(): PixelationWorkerClient {
  if (!clientInstance) clientInstance = new PixelationWorkerClient();
  return clientInstance;
}
