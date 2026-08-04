'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  encodePngDataUrl,
  validateProcessingConfig,
  maxColorsAutoForLogical,
  type ProcessingConfig,
  type ResultImageSet,
  type PaletteColor,
} from '@17suit/module-sixteen-pixel-perfect';

import { ImageDropzone } from './ImageDropzone';
import { EmptyState } from './EmptyState';
import { ControlsPanel } from './ControlsPanel';
import { PreviewCanvas } from './PreviewCanvas';
import { PalettePanel } from './PalettePanel';
import { ExportMenu } from './ExportMenu';
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

export function PixelationRefStudio() {
  const [source, setSource] = useState<SourceState | null>(null);
  const [config, setConfig] = useState<ProcessingConfig>(DEFAULT_CONFIG);
  const [result, setResult] = useState<ResultImageSet | null>(null);
  const [warnings, setWarnings] = useState<readonly string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pipelineState, setPipelineState] = useState<PipelineState>('idle');
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
      runPipeline(cfg);
    },
    [runPipeline],
  );

  const onReset = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    runPipeline(DEFAULT_CONFIG);
  }, [runPipeline]);

  const pixelatedDataUrl = useMemo(
    () => (result ? encodePngDataUrl(result.pixelated) : undefined),
    [result],
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">Pixelation Reference</h1>
          <p className="text-xs text-muted-foreground">
            Image → pixel-art reference with palette + exports. Frontend-only, deterministic.
          </p>
        </div>
        {source && (
          <span className="font-mono text-[11px] text-muted-foreground">
            {source.width} × {source.height} source · {config.logical.w} × {config.logical.h}{' '}
            logical
          </span>
        )}
      </header>

      {!source && <EmptyState onFile={onFile} />}

      {source && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr_320px]">
          <aside className="flex flex-col gap-3">
            <ImageDropzone onFile={onFile} filename={source.fileName} hasImage compact />
            <ControlsPanel
              config={config}
              onChange={onConfigChange}
              onReset={onReset}
              pipelineState={pipelineState}
            />
          </aside>

          <main className="flex flex-col gap-3">
            <PreviewCanvas
              originalDataUrl={source.originalDataUrl}
              {...(pixelatedDataUrl ? { pixelatedDataUrl } : {})}
              originalSize={{ w: source.width, h: source.height }}
              pixelatedSize={
                result
                  ? { w: result.pixelated.width, h: result.pixelated.height }
                  : { w: config.logical.w, h: config.logical.h }
              }
              loading={pipelineState === 'running'}
            />
            {warnings.length > 0 && (
              <ul className="rounded border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                {warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            )}
            {error && (
              <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-300">
                {error}
              </div>
            )}
          </main>

          <aside className="flex flex-col gap-3">
            <PalettePanel palette={result?.palette ?? []} />
            {result && (
              <ExportMenu
                pixelated={result.pixelated}
                preview={result.preview}
                palette={result.palette as PaletteColor[]}
                config={result.recipe}
              />
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
