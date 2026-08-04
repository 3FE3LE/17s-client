'use client';

import type { FitMode, ProcessingConfig } from '@17suit/module-sixteen-pixel-perfect';

import { ImageDropzone } from '../ImageDropzone';
import { Step1Dropzone } from './Step1Dropzone';
import { NumField } from '../form/NumField';
import { RadioRow } from '../form/RadioRow';
import { SmallButton } from '../form/SmallButton';
import { AspectRatio } from '../AspectRatio';
import { FocalPointPicker } from '../FocalPointPicker';

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

/**
 * Canvas presets expressed as (canvas,logical) pairs so picking any pair
 * guarantees an integer scale. The list is small and curated to cover the
 * common use cases for World-of-Goses-style asset work.
 */
const CANVAS_LOGICAL_PAIRS: ReadonlyArray<{
  label: string;
  cw: number;
  ch: number;
  lw: number;
  lh: number;
}> = [
  { label: '1280×720 / 320×180', cw: 1280, ch: 720, lw: 320, lh: 180 },
  { label: '1280×720 / 160×90', cw: 1280, ch: 720, lw: 160, lh: 90 },
  { label: '640×360 / 320×180', cw: 640, ch: 360, lw: 320, lh: 180 },
  { label: '640×360 / 160×90', cw: 640, ch: 360, lw: 160, lh: 90 },
  { label: '320×180 / 160×90', cw: 320, ch: 180, lw: 160, lh: 90 },
  { label: '256×256 / 128×128', cw: 256, ch: 256, lw: 128, lh: 128 },
  { label: '256×256 / 64×64', cw: 256, ch: 256, lw: 64, lh: 64 },
];

const FIT_MODES: ReadonlyArray<{ value: FitMode; label: string; hint: string }> = [
  { value: 'fit', label: 'Fit', hint: 'encaja con padding transparente' },
  { value: 'cover', label: 'Cover', hint: 'llena recortando el excedente (con focal point)' },
  { value: 'stretch', label: 'Stretch', hint: 'deforma para llenar' },
];

/**
 * Step 1 — Configuración. Provides: image dropzone, aspect-ratio presets,
 * canvas logical-compatible pairs, fit mode, focal point picker (cover
 * only), and a logical grid picker. The actual visual preview now lives
 * in a persistent right-column panel; this step is controls-only.
 */
export function ConfigStep({ config, onChange, source, onFile }: ConfigStepProps) {
  const scaleX = config.canvas.w / config.logical.w;
  const scaleY = config.canvas.h / config.logical.h;
  const integerScale = Number.isInteger(scaleX) && Number.isInteger(scaleY);
  const aspectMismatch =
    Math.abs(config.canvas.w / config.canvas.h - config.logical.w / config.logical.h) > 0.01;

  const currentFocal = config.canvas.focalPoint ?? { x: 0.5, y: 0.5 };
  const showFocalPicker = config.canvas.mode === 'cover';

  function applyPair(pair: { cw: number; ch: number; lw: number; lh: number }) {
    onChange({
      ...config,
      canvas: { ...config.canvas, w: pair.cw, h: pair.ch },
      logical: { ...config.logical, w: pair.lw, h: pair.lh },
    });
  }

  function snapCanvasToLogical(multiple: 2 | 4 | 8) {
    onChange({
      ...config,
      canvas: {
        ...config.canvas,
        w: config.logical.w * multiple,
        h: config.logical.h * multiple,
      },
    });
  }

  function setFocal(next: { x: number; y: number }) {
    onChange({
      ...config,
      canvas: {
        ...config.canvas,
        focalPoint: next,
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card title="Imagen">
        {source ? (
          <ImageDropzone onFile={onFile} filename={source.fileName} hasImage compact />
        ) : (
          <Step1Dropzone onFile={onFile} />
        )}
        {source && (
          <p className="font-mono text-[11px] text-muted-foreground">
            fuente: {source.width} × {source.height} px
          </p>
        )}
      </Card>

      <Card title="Aspect ratio">
        <AspectRatio config={config} onChange={onChange} />
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
        <RadioRow
          label="Fit"
          options={FIT_MODES}
          value={config.canvas.mode}
          onChange={(v) => onChange({ ...config, canvas: { ...config.canvas, mode: v } })}
        />
        {showFocalPicker && (
          <div className="flex items-end gap-4">
            <FocalPointPicker value={currentFocal} onChange={setFocal} />
            <p className="flex-1 text-[11px] text-muted-foreground">
              El focal point define qué parte de la imagen queda visible cuando se recorta para
              llenar el canvas. Se aplica tanto al preview como al export final.
            </p>
          </div>
        )}
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
        <ScaleReadout
          sx={scaleX}
          sy={scaleY}
          integerScale={integerScale}
          aspectMismatch={aspectMismatch}
        />
      </Card>

      <Card title="Pares canvas+logical (escala entera garantizada)">
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {CANVAS_LOGICAL_PAIRS.map((p) => {
            const active =
              p.cw === config.canvas.w &&
              p.ch === config.canvas.h &&
              p.lw === config.logical.w &&
              p.lh === config.logical.h;
            return (
              <SmallButton
                key={p.label}
                active={active}
                onClick={() => applyPair(p)}
                title={`canvas ${p.cw}×${p.ch} = ${p.cw / p.lw}× logical ${p.lw}×${p.lh}`}
              >
                {p.label}
              </SmallButton>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-1">
          <SmallButton onClick={() => snapCanvasToLogical(2)}>snap canvas = 2× logical</SmallButton>
          <SmallButton onClick={() => snapCanvasToLogical(4)}>snap canvas = 4× logical</SmallButton>
          <SmallButton onClick={() => snapCanvasToLogical(8)}>snap canvas = 8× logical</SmallButton>
        </div>
      </Card>
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
