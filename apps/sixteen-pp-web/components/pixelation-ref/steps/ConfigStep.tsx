'use client';

import {
  LOGICAL_PRESETS,
  type FitMode,
  type ProcessingConfig,
} from '@17suit/module-sixteen-pixel-perfect';

import { ImageDropzone } from '../ImageDropzone';
import { Step1Dropzone } from './Step1Dropzone';
import { NumField } from '../form/NumField';
import { RadioRow } from '../form/RadioRow';
import { SmallButton } from '../form/SmallButton';

interface ConfigStepProps {
  config: ProcessingConfig;
  onChange: (cfg: ProcessingConfig) => void;
  source?: {
    fileName: string;
    width: number;
    height: number;
    originalDataUrl: string;
  } | null;
  onFile: (file: File) => void;
}

const CANVAS_PRESETS: ReadonlyArray<{ label: string; w: number; h: number; forLogical: string }> = [
  { label: '1920×1080', w: 1920, h: 1080, forLogical: '960×540 / 480×270' },
  { label: '1280×720', w: 1280, h: 720, forLogical: '640×360 / 320×180 / 160×90' },
  { label: '640×360', w: 640, h: 360, forLogical: '320×180 / 160×90' },
  { label: '320×180', w: 320, h: 180, forLogical: '160×90' },
];

const FIT_MODES: ReadonlyArray<{ value: FitMode; label: string; hint: string }> = [
  { value: 'fit', label: 'Fit', hint: 'encaja con padding transparente' },
  { value: 'cover', label: 'Cover', hint: 'llena recortando el excedente' },
  { value: 'stretch', label: 'Stretch', hint: 'deforma para llenar' },
];

const fitObjectClass: Record<FitMode, string> = {
  fit: 'object-contain',
  cover: 'object-cover',
  stretch: 'object-fill',
};

/**
 * Step 1 — Configuración. Drop image, choose canvas (presets/W·H/fit), choose
 * logical grid. The preview pane shows the source image fitted to the chosen
 * canvas dimensions using CSS object-fit, so changes are instantaneous and
 * require no pipeline run.
 */
export function ConfigStep({ config, onChange, source, onFile }: ConfigStepProps) {
  const canvasAspect = `${config.canvas.w} / ${config.canvas.h}`;
  const scaleX = config.canvas.w / config.logical.w;
  const scaleY = config.canvas.h / config.logical.h;
  const integerScale = Number.isInteger(scaleX) && Number.isInteger(scaleY);
  const aspectMismatch =
    Math.abs(config.canvas.w / config.canvas.h - config.logical.w / config.logical.h) > 0.01;

  function applyCanvasMultipleOf(factor: 2 | 4 | 8) {
    onChange({
      ...config,
      canvas: {
        ...config.canvas,
        w: config.logical.w * factor,
        h: config.logical.h * factor,
      },
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
      <div className="flex flex-col gap-4">
        <Card title="Imagen">
          {source ? (
            <ImageDropzone onFile={onFile} filename={source.fileName} hasImage compact />
          ) : (
            <Step1Dropzone onFile={onFile} />
          )}
          {source && (
            <p className="font-mono text-[11px] text-muted-foreground">
              {source.width} × {source.height} px
            </p>
          )}
        </Card>

        <Card title="Canvas (preview)">
          <div className="grid grid-cols-2 gap-2">
            <NumField
              label="W"
              value={config.canvas.w}
              min={64}
              max={4096}
              onChange={(v) => onChange({ ...config, canvas: { ...config.canvas, w: v } })}
            />
            <NumField
              label="H"
              value={config.canvas.h}
              min={64}
              max={4096}
              onChange={(v) => onChange({ ...config, canvas: { ...config.canvas, h: v } })}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {CANVAS_PRESETS.map((p) => (
              <SmallButton
                key={p.label}
                active={p.w === config.canvas.w && p.h === config.canvas.h}
                title={`Compatible con logical: ${p.forLogical}`}
                onClick={() =>
                  onChange({ ...config, canvas: { ...config.canvas, w: p.w, h: p.h } })
                }
              >
                {p.label}
              </SmallButton>
            ))}
          </div>
          <RadioRow
            label="Fit"
            options={FIT_MODES}
            value={config.canvas.mode}
            onChange={(v) => onChange({ ...config, canvas: { ...config.canvas, mode: v } })}
          />
        </Card>

        <Card title="Logical (grid de píxeles)">
          <div className="grid grid-cols-2 gap-2">
            <NumField
              label="W"
              value={config.logical.w}
              min={8}
              max={2048}
              onChange={(v) => onChange({ ...config, logical: { ...config.logical, w: v } })}
            />
            <NumField
              label="H"
              value={config.logical.h}
              min={8}
              max={2048}
              onChange={(v) => onChange({ ...config, logical: { ...config.logical, h: v } })}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {LOGICAL_PRESETS.map((p) => (
              <SmallButton
                key={p.label}
                active={p.w === config.logical.w && p.h === config.logical.h}
                onClick={() =>
                  onChange({ ...config, logical: { ...config.logical, w: p.w, h: p.h } })
                }
              >
                {p.label}
              </SmallButton>
            ))}
          </div>
          <ScaleReadout
            sx={scaleX}
            sy={scaleY}
            integerScale={integerScale}
            aspectMismatch={aspectMismatch}
          />
          <div className="flex flex-wrap gap-1">
            <SmallButton onClick={() => applyCanvasMultipleOf(2)}>canvas = 2× logical</SmallButton>
            <SmallButton onClick={() => applyCanvasMultipleOf(4)}>canvas = 4× logical</SmallButton>
            <SmallButton onClick={() => applyCanvasMultipleOf(8)}>canvas = 8× logical</SmallButton>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Preview canvas (fit en vivo)
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">{canvasAspect}</span>
        </div>
        <div
          style={{ aspectRatio: canvasAspect }}
          className="relative w-full overflow-hidden rounded-md border border-border bg-[repeating-conic-gradient(hsl(var(--muted))_0%_25%,hsl(var(--background))_0%_50%)] bg-[length:16px_16px]"
        >
          {source ? (
            <img
              src={source.originalDataUrl}
              alt="canvas preview"
              className={`h-full w-full ${fitObjectClass[config.canvas.mode]}`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
              cargá una imagen para ver el fit en vivo
            </div>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          El preview respeta <code>{config.canvas.mode}</code>:<code> object-contain</code> para
          fit, <code>object-cover</code> para cover,
          <code> object-fill</code> para stretch.
        </p>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-md border border-border/60 p-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function ScaleReadout({
  sx,
  sy,
  integerScale,
  aspectMismatch,
}: {
  sx: number;
  sy: number;
  integerScale: boolean;
  aspectMismatch: boolean;
}) {
  let tone = 'text-muted-foreground';
  let message = `scale ${sx.toFixed(2)}× / ${sy.toFixed(2)}×`;
  if (aspectMismatch) {
    tone = 'text-amber-600 dark:text-amber-400';
    message = 'aspect mismatch (canvas ≠ logical) → preview blocks pueden no ser cuadrados';
  } else if (!integerScale) {
    tone = 'text-amber-600 dark:text-amber-400';
    message = `escala no entera (${sx.toFixed(2)}×, ${sy.toFixed(2)}×) → preview blocks pueden no ser cuadrados`;
  } else {
    tone = 'text-emerald-700 dark:text-emerald-400';
    message = `escala entera ${sx.toFixed(2)}× — preview blocks cuadrados`;
  }
  return <p className={`text-[11px] ${tone}`}>{message}</p>;
}
