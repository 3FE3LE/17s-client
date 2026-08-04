'use client';

import type { FitMode, ProcessingConfig } from '@17suit/module-sixteen-pixel-perfect';

import { ImageDropzone } from '../ImageDropzone';
import { Step1Dropzone } from './Step1Dropzone';
import { DimensionField } from '../form/DimensionField';
import { RadioRow } from '../form/RadioRow';
import { SmallButton } from '../form/SmallButton';
import { AspectRatio } from '../AspectRatio';
import { FocalPointPicker } from '../FocalPointPicker';
import {
  deriveLogicalPresets,
  lossTier,
  sourceToLogicalLoss,
  type LogicalPreset,
} from './deriveLogicalPresets';

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

function snapValue(v: number, min: number, max: number, step: number): number {
  return Math.min(max, Math.max(min, Math.round(v / step) * step));
}

const FIT_MODES: ReadonlyArray<{ value: FitMode; label: string; hint: string }> = [
  { value: 'fit', label: 'Fit', hint: 'encaja con padding transparente alrededor de la imagen' },
  { value: 'cover', label: 'Cover', hint: 'llena el canvas recortando el excedente' },
  { value: 'stretch', label: 'Stretch', hint: 'deforma la imagen para llenar' },
];

const lossToneClass: Record<'emerald' | 'amber' | 'red', string> = {
  emerald: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  amber: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  red: 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-400',
};

/**
 * Step 1 — Configuración. Three concerns, three cards:
 *
 *   1. **Canvas** (frame): aspect ratio + W/H + orientation. Independent of
 *      the source image: the canvas is the preview frame.
 *
 *   2. **Imagen** (mounted on canvas): fit mode + focal point. Even when
 *      image aspect disagrees with canvas aspect, transparent padding or
 *      crop resolves it; the canvas stays authoritative.
 *
 *   3. **Logical grid** (pixel-art output): derived from canvas — only
 *      integer subsamples are offered. Source-vs-logical info-loss warning
 *      shows the actual downscale ratio.
 */
export function ConfigStep({ config, onChange, source, onFile }: ConfigStepProps) {
  const currentFocal = config.canvas.focalPoint ?? { x: 0.5, y: 0.5 };
  const showFocalPicker = config.canvas.mode === 'cover';

  const presets = useMemo(
    () => deriveLogicalPresets(config.canvas.w, config.canvas.h),
    [config.canvas.w, config.canvas.h],
  );

  const loss = sourceToLogicalLoss(source ? { w: source.width, h: source.height } : null, {
    w: config.logical.w,
    h: config.logical.h,
  });
  const lossInfo = loss > 0 ? lossTier(loss) : null;

  function setLogical(p: LogicalPreset) {
    onChange({ ...config, logical: { ...config.logical, w: p.w, h: p.h } });
  }

  function setFocal(next: { x: number; y: number }) {
    onChange({ ...config, canvas: { ...config.canvas, focalPoint: next } });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card title="Lienzo (frame de preview)">
        <p className="font-mono text-[11px] text-muted-foreground">
          definí el marco donde se va a mostrar el pixel-art. No depende de la imagen — la imagen se
          adapta.
        </p>
        <AspectRatio config={config} onChange={onChange} />
        <div className="grid grid-cols-2 gap-3">
          <DimensionField
            label="W"
            value={config.canvas.w}
            min={64}
            max={4096}
            step={8}
            onChange={(v) =>
              onChange({
                ...config,
                canvas: { ...config.canvas, w: snapValue(v, 64, 4096, 8) },
              })
            }
          />
          <DimensionField
            label="H"
            value={config.canvas.h}
            min={64}
            max={4096}
            step={8}
            onChange={(v) =>
              onChange({
                ...config,
                canvas: { ...config.canvas, h: snapValue(v, 64, 4096, 8) },
              })
            }
          />
        </div>
      </Card>

      <Card title="Imagen (cómo encaja en el lienzo)">
        {source ? (
          <ImageDropzone onFile={onFile} filename={source.fileName} hasImage compact />
        ) : (
          <Step1Dropzone onFile={onFile} />
        )}
        {source && (
          <p className="font-mono text-[11px] text-muted-foreground">
            fuente:{' '}
            <span className="font-semibold text-foreground">
              {source.width} × {source.height}
            </span>{' '}
            px
          </p>
        )}
        <RadioRow
          label="Ajuste"
          options={FIT_MODES}
          value={config.canvas.mode}
          onChange={(v) => onChange({ ...config, canvas: { ...config.canvas, mode: v } })}
        />
        {showFocalPicker && (
          <div className="flex items-end gap-4">
            <FocalPointPicker value={currentFocal} onChange={setFocal} />
            <p className="flex-1 text-[11px] text-muted-foreground">
              Si la imagen tiene aspect distinto al lienzo y elegiste cover, esto define la parte
              que queda visible (también se aplica al export final).
            </p>
          </div>
        )}
      </Card>

      <Card title="Logical grid (submuestreo del lienzo)">
        {presets.length === 0 ? (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Canvas demasiado chico para derivar grids lógicos. Subí W o H al menos a 64 px.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {presets.map((p) => {
              const active = p.w === config.logical.w && p.h === config.logical.h;
              const sourceRatio = source ? (source.width * source.height) / (p.w * p.h) : 0;
              const tier = source && sourceRatio > 1.5 ? lossTier(sourceRatio) : null;
              const baseLoss: 'emerald' | 'amber' | 'red' = tier?.tone ?? 'emerald';
              return (
                <SmallButton
                  key={`${p.w}x${p.h}`}
                  active={active}
                  pressed={active}
                  onClick={() => setLogical(p)}
                  title={`canvas / ${p.factor} = ${p.w}×${p.h}`}
                >
                  <span>
                    {p.w}×{p.h}
                    <span className="ml-1 font-mono text-[10px] opacity-70">/{p.factor}</span>
                  </span>
                  {tier && (
                    <span
                      className={`ml-2 inline-block rounded border px-1.5 py-px text-[9px] ${
                        lossToneClass[baseLoss]
                      }`}
                      title={`~${sourceRatio.toFixed(1)}× downscaling vs fuente`}
                    >
                      {tier.label}
                    </span>
                  )}
                </SmallButton>
              );
            })}
          </div>
        )}
        <LogicalReadout
          lossInfo={lossInfo}
          loss={loss}
          canvas={config.canvas}
          logical={config.logical}
        />
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

function LogicalReadout({
  lossInfo,
  loss,
  canvas,
  logical,
}: {
  lossInfo: ReturnType<typeof lossTier> | null;
  loss: number;
  canvas: { w: number; h: number };
  logical: { w: number; h: number };
}) {
  const scaleX = canvas.w / logical.w;
  const scaleY = canvas.h / logical.h;
  const integerScale = Number.isInteger(scaleX) && Number.isInteger(scaleY);
  const aspect =
    Math.abs(canvas.w / canvas.h - logical.w / logical.h) > 0.01 ? 'mismatch' : 'match';

  if (!integerScale) {
    return (
      <p className="text-[11px] text-amber-600 dark:text-amber-400">
        ⚠ selección inválida — logical no divide exactamente al canvas. Elegí otro preset.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
        canvas = {scaleX.toFixed(0)}× logical · aspect {aspect} · logical {logical.w}×{logical.h}
      </p>
      {lossInfo && (
        <p
          className={`inline-flex w-fit items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-medium ${lossToneClass[lossInfo.tone]}`}
        >
          ~{loss.toFixed(1)}× downscale · {lossInfo.label} ({lossInfo.detail})
        </p>
      )}
    </div>
  );
}

// Re-export for type consumers.
import { useMemo } from 'react';
