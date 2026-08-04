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
import { ResultStep } from './steps/ResultStep';
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

export function PixelationRefStudio() {
  const [source, setSource] = useState<SourceState | null>(null);
  const [config, setConfig] = useState<ProcessingConfig>(DEFAULT_CONFIG);
  const [result, setResult] = useState<ResultImageSet | null>(null);
  const [warnings, setWarnings] = useState<readonly string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pipelineState, setPipelineState] = useState<PipelineState>('idle');
  const [step, setStep] = useState<StepId>(1);
  const inFlightRef = useRef<string | null>(null);

  const worker = useMemo(() => getPixelationWorker(), []);

  const onFile = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onload = () => {
        const buf = reader.result as ArrayBuffer;
        const mime = file.type || 'image/png';
        const jobId = worker.nextJobId();
        worker.decode(buf, mime, jobId);
        const off = worker.listen((msg) => {
          if (msg.jobId !== jobId) return;
          if (msg.kind === 'decoded') {
            setSource({
              fileName: file.name,
              originalDataUrl: url,
              width: msg.rgba.width,
              height: msg.rgba.height,
              rgba: msg.rgba,
            });
            setError(null);
            setPipelineState('idle');
            // Once the image lands the user is auto-advanced to step 1 where
            // they can configure. Step gating inside the stepper prevents
            // jumping ahead without first picking grid + canvas.
            setStep(1);
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
      // Config changes only trigger the pipeline run when on step 2+ —
      // step 1 is preview-only and stays snappy. This keeps typing in
      // numeric inputs from flashing the worker on every keystroke.
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
      // Fire first pipeline run now that filters are at their defaults.
      runPipeline(config);
    } else if (step === 2 && canReachStep3) {
      setStep(3);
    }
  }

  function goBack() {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Pixelation Reference</h1>
          <p className="text-xs text-muted-foreground">
            Image → pixel-art reference with palette + exports. Frontend-only, deterministic.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetAll}
            className="rounded border border-border bg-background px-2 py-1 text-[11px] hover:border-foreground/40"
          >
            reset todo
          </button>
        </div>
      </header>

      <WizardStepper
        step={step}
        onSelect={setStep}
        canReachStep2={canReachStep2}
        canReachStep3={canReachStep3}
      />

      <div className="flex flex-col gap-4">
        {step === 1 && (
          <ConfigStep config={config} onChange={onConfigChange} source={source} onFile={onFile} />
        )}
        {step === 2 && (
          <FiltersStep config={config} onChange={onConfigChange} onReset={onResetFilters} />
        )}
        {step === 3 && (
          <ResultStep
            source={source}
            result={result}
            pipelineState={pipelineState}
            warnings={warnings}
            error={error}
          />
        )}
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
