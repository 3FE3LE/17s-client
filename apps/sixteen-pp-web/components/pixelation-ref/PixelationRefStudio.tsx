'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  validateProcessingConfig,
  maxColorsAutoForLogical,
  type ProcessingConfig,
  type ResultImageSet,
} from '@17suit/module-sixteen-pixel-perfect';

import { WizardStepper } from './WizardStepper';
import { ConfigStep } from './steps/ConfigStep';
import { FiltersStep } from './steps/FiltersStep';
import { ExportStep } from './steps/ExportStep';
import { PreviewPanel } from './PreviewPanel';
import { PalettePanel } from './PalettePanel';
import { getPixelationWorker, type RGBA } from '@/lib/pixelation-ref-client';

const DEFAULT_CONFIG: ProcessingConfig = validateProcessingConfig({
  version: 1,
  canvas: { w: 640, h: 360, mode: 'fit' },
  logical: { w: 320, h: 180, mode: 'manual' },
  pixelation: { mode: 'median' },
  quantization: {
    algorithm: 'median-cut',
    maxColors: maxColorsAutoForLogical(320, 180),
    seed: 0,
  },
  normalization: { mode: 'off' },
  dithering: { mode: 'none', strength: 1 },
});

interface SourceState {
  fileName: string;
  originalDataUrl: string;
  width: number;
  height: number;
  rgba: RGBA;
}

type PipelineState = 'idle' | 'running' | 'done' | 'error';
type StepId = 1 | 2 | 3;

/**
 * Wizard shell. Owns the persistent state (source, config, result) and
 * the right-column preview + palette. Steps contribute only controls.
 */
export function PixelationRefStudio() {
  const [source, setSource] = useState<SourceState | null>(null);
  const [config, setConfig] = useState<ProcessingConfig>(DEFAULT_CONFIG);
  const [result, setResult] = useState<ResultImageSet | null>(null);
  const [warnings, setWarnings] = useState<readonly string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pipelineState, setPipelineState] = useState<PipelineState>('idle');
  const [step, setStep] = useState<StepId>(1);
  const inFlightRef = useRef<string | null>(null);
  /**
   * Cache of probe dimensions keyed by file name. Both the main-thread
   * `Image` probe and the worker decode populate this; whichever lands
   * first wins for display, the other becomes a sanity cross-check.
   * Refs (not state) so callback ordering can't lose updates.
   */
  const probeDimsRef = useRef<Map<string, { width: number; height: number }>>(new Map());

  const worker = useMemo(() => getPixelationWorker(), []);

  const onFile = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);

      // 1. Main-thread probe — fastest path to display dims. onload fires
      //    for blob URLs within milliseconds for local files; onerror
      //    clears the way for the worker to populate dims.
      const probe = new Image();
      probe.onload = () => {
        const w = probe.naturalWidth;
        const h = probe.naturalHeight;
        if (w > 0 && h > 0) {
          probeDimsRef.current.set(file.name, { width: w, height: h });
          setSource((prev) => {
            if (prev && prev.fileName === file.name) {
              return prev.rgba.data.length > 0 ? prev : { ...prev, width: w, height: h };
            }
            return {
              fileName: file.name,
              originalDataUrl: url,
              width: w,
              height: h,
              rgba: {
                width: w,
                height: h,
                data: new Uint8ClampedArray(0),
              },
            };
          });
          setError(null);
          setStep(1);
        }
      };
      probe.onerror = () => {
        // Worker is the fallback for native dim reads.
      };
      probe.src = url;

      // 2. Worker decode — provides the full RGBA buffer for the pipeline.
      //    Dimensions from the worker are merged with the probe dims so a
      //    buggy worker can never overwrite a known-good 0 → nonzero.
      const reader = new FileReader();
      reader.onload = () => {
        const buf = reader.result as ArrayBuffer;
        const mime = file.type || 'image/png';
        const jobId = worker.nextJobId();
        worker.decode(buf, mime, jobId);
        const off = worker.listen((msg) => {
          if (msg.jobId !== jobId) return;
          if (msg.kind === 'decoded') {
            const probed = probeDimsRef.current.get(file.name);
            const w = probed?.width ?? msg.rgba.width;
            const h = probed?.height ?? msg.rgba.height;
            probeDimsRef.current.set(file.name, { width: w, height: h });
            setSource({
              fileName: file.name,
              originalDataUrl: url,
              width: w,
              height: h,
              rgba: msg.rgba,
            });
            setPipelineState('idle');
            off();
          }
          if (msg.kind === 'error') {
            setError(msg.message);
            setPipelineState('error');
            off();
          }
        });
      };
      reader.readAsArrayBuffer(file);
    },
    [worker],
  );

  const runPipeline = useCallback(
    (cfg: ProcessingConfig) => {
      if (!source) return;
      const previous = inFlightRef.current;
      if (previous) worker.abort(previous);
      const jobId = worker.nextJobId();
      inFlightRef.current = jobId;
      setPipelineState('running');
      const off = worker.listen((msg) => {
        if (msg.jobId !== jobId) return;
        if (msg.kind === 'result') {
          setResult(msg.output.result);
          setWarnings(msg.output.warnings);
          setError(null);
          setPipelineState('done');
          inFlightRef.current = null;
          off();
        }
        if (msg.kind === 'error') {
          setError(msg.message);
          setPipelineState('error');
          inFlightRef.current = null;
          off();
        }
      });
      worker.run(source.rgba, cfg, jobId);
    },
    [source, worker],
  );

  const onConfigChange = useCallback(
    (cfg: ProcessingConfig) => {
      setConfig(cfg);
      // Pipeline runs only when the user is on step 2 or 3 — step 1 stays
      // preview-only and snappy for numeric input handling.
      if (step >= 2) runPipeline(cfg);
    },
    [runPipeline, step],
  );

  const onResetFilters = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      pixelation: { mode: 'median' },
      quantization: {
        ...prev.quantization,
        algorithm: 'median-cut',
        maxColors: maxColorsAutoForLogical(prev.logical.w, prev.logical.h),
      },
      normalization: { mode: 'off' },
      dithering: { mode: 'none', strength: 1 },
    }));
  }, []);

  const onResetAll = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    setResult(null);
    setWarnings([]);
    setError(null);
    setPipelineState('idle');
  }, []);

  const canReachStep2 = Boolean(source);
  const canReachStep3 = canReachStep2 && step >= 2;

  function goNext() {
    if (step === 1 && canReachStep2) {
      setStep(2);
      runPipeline(config);
    } else if (step === 2 && canReachStep3) {
      setStep(3);
    }
  }

  function goBack() {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  }

  const sourceSummary = source
    ? {
        fileName: source.fileName,
        width: source.width,
        height: source.height,
        originalDataUrl: source.originalDataUrl,
      }
    : null;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Pixelation Reference</h1>
          <p className="text-xs text-muted-foreground">
            Image → pixel-art reference with palette + exports. Frontend-only, deterministic.
          </p>
        </div>
        <button
          type="button"
          onClick={onResetAll}
          className="rounded border border-border bg-background px-2 py-1 text-[11px] hover:border-foreground/40"
        >
          reset todo
        </button>
      </header>

      <WizardStepper
        step={step}
        onSelect={setStep}
        canReachStep2={canReachStep2}
        canReachStep3={canReachStep3}
      />

      <PipelineBanner state={pipelineState} warnings={warnings} error={error} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_400px]">
        <main className="flex flex-col gap-4">
          {step === 1 && (
            <ConfigStep
              config={config}
              onChange={onConfigChange}
              source={sourceSummary}
              onFile={onFile}
            />
          )}
          {step === 2 && (
            <FiltersStep config={config} onChange={onConfigChange} onReset={onResetFilters} />
          )}
          {step === 3 && <ExportStep result={result} ready={Boolean(result)} />}
        </main>

        <aside className="flex flex-col gap-4">
          <PreviewPanel
            config={config}
            source={sourceSummary}
            result={result}
            loading={pipelineState === 'running'}
          />
          {step >= 2 && pipelineState !== 'idle' && (
            <div className="rounded-md border border-border p-3">
              <PalettePanel palette={result?.palette ?? []} />
            </div>
          )}
          {step >= 2 && pipelineState === 'idle' && source && (
            <div className="rounded-md border border-border p-3 text-xs text-muted-foreground">
              Avanzá a "filtros →" para ejecutar el pipeline y ver la paleta.
            </div>
          )}
        </aside>
      </div>

      <footer className="sticky bottom-0 z-30 flex items-center justify-between rounded-md border border-border bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="text-xs text-muted-foreground">
          {source ? (
            <>
              fuente:{' '}
              <span className="font-mono">
                {source.width} × {source.height}
              </span>
              {' · '}canvas:{' '}
              <span className="font-mono">
                {config.canvas.w} × {config.canvas.h}
              </span>
              {' · '}logical:{' '}
              <span className="font-mono">
                {config.logical.w} × {config.logical.h}
              </span>
            </>
          ) : (
            <span>cargá una imagen para empezar</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="rounded border border-border bg-background px-3 py-1.5 text-xs disabled:opacity-40"
          >
            ← atrás
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={
              (step === 1 && !canReachStep2) || (step === 2 && !canReachStep3) || step === 3
            }
            className="rounded border border-foreground bg-foreground px-3 py-1.5 text-xs text-background disabled:opacity-40"
          >
            {step === 1 ? 'filtros →' : step === 2 ? 'resultado →' : 'fin'}
          </button>
        </div>
      </footer>
    </div>
  );
}

function PipelineBanner({
  state,
  warnings,
  error,
}: {
  state: PipelineState;
  warnings: readonly string[];
  error: string | null;
}) {
  if (state === 'running') {
    return (
      <div className="flex items-center gap-2 rounded border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs text-sky-700">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-sky-500" />
        pipeline corriendo…
      </div>
    );
  }
  if (state === 'done' && warnings.length === 0) {
    return (
      <div className="rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-700">
        pipeline listo.
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-300">
        {error}
      </div>
    );
  }
  if (warnings.length > 0) {
    return (
      <ul className="rounded border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
        {warnings.map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>
    );
  }
  return null;
}
