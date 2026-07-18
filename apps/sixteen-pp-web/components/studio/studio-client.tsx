'use client';

import {
  BUILT_IN_PALETTES,
  buildGodotExportBundle,
  buildGodotMetadata,
  computeNineSlice,
  encodePng,
  encodePngDataUrl,
  encodeZip,
  getBuiltInPalette,
  GodotAxisStretch,
  makeDefaultPanelRecipe,
  MVP_STATES,
  parseRecipe,
  renderAsset,
  serializeRecipe,
  validateGodotDestination,
  type AssetRecipe,
  type CornerMotif,
  type EdgePattern,
  type FillKind,
  type GodotAxisStretchValue,
  type GodotContentPadding,
} from '@17suit/module-sixteen-pixel-perfect';
import { useMemo, useState, type ChangeEvent, type CSSProperties } from 'react';

const SCALES = [1, 2, 4, 8] as const;
const CORNER_MOTIFS: readonly CornerMotif[] = ['square', 'notch', 'bevel', 'round'];
const FILL_KINDS: readonly FillKind[] = ['solid', 'checker', 'diagonal', 'noise'];
const EDGE_PATTERNS: readonly EdgePattern[] = ['solid', 'dashed', 'dotted'];
const AXIS_OPTIONS: readonly { value: GodotAxisStretchValue; label: string }[] = [
  { value: GodotAxisStretch.Stretch, label: 'Stretch (0)' },
  { value: GodotAxisStretch.Tile, label: 'Tile (1)' },
  { value: GodotAxisStretch.TileFit, label: 'Tile Fit (2)' },
];

function clampInt(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, Math.trunc(value)));
}

function downloadBlob(fileName: string, mime: string, data: BlobPart): void {
  const url = URL.createObjectURL(new Blob([data], { type: mime }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

/** Copy PNG bytes into a plain ArrayBuffer (a valid BlobPart). */
function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

export function StudioClient() {
  const [recipe, setRecipe] = useState<AssetRecipe>(() => makeDefaultPanelRecipe());
  const [scale, setScale] = useState<(typeof SCALES)[number]>(4);
  const [importError, setImportError] = useState<string | null>(null);
  const [godotDest, setGodotDest] = useState('res://assets/ui/generated/panel_mine/');
  const [axisH, setAxisH] = useState<GodotAxisStretchValue>(GodotAxisStretch.Tile);
  const [axisV, setAxisV] = useState<GodotAxisStretchValue>(GodotAxisStretch.Tile);
  const [contentPadding, setContentPadding] = useState<GodotContentPadding | null>(null);
  const [godotError, setGodotError] = useState<string | null>(null);

  // Derived, pure: one PNG data URL per MVP state. Recomputed only when the
  // recipe changes — no effects, no canvas.
  const previews = useMemo(
    () =>
      MVP_STATES.map((state) => ({
        state,
        url: encodePngDataUrl(renderAsset(recipe, state)),
      })),
    [recipe],
  );
  const nineSlice = useMemo(() => computeNineSlice(recipe), [recipe]);
  const recipeJson = useMemo(() => serializeRecipe(recipe), [recipe]);

  const tokenIds = recipe.palette.tokens.map((token) => token.id);
  const baseName = `${recipe.preset}-${recipe.size.width}x${recipe.size.height}`;

  const patch = (next: Partial<AssetRecipe>) => setRecipe((prev) => ({ ...prev, ...next }));

  const updateLayer = (index: 0 | 1, key: 'thickness' | 'tokenId' | 'pattern', value: unknown) =>
    setRecipe((prev) => {
      const layers = prev.border.layers.map((layer, i) =>
        i === index ? { ...layer, [key]: value } : layer,
      );
      return { ...prev, border: { layers } };
    });

  const exportPng = (state: (typeof MVP_STATES)[number]) =>
    downloadBlob(
      `${baseName}-${state}.png`,
      'image/png',
      toArrayBuffer(encodePng(renderAsset(recipe, state))),
    );

  const exportRecipe = () =>
    downloadBlob(`${baseName}.recipe.json`, 'application/json', recipeJson);

  const exportGodot = () =>
    downloadBlob(
      `${baseName}.godot.json`,
      'application/json',
      JSON.stringify(
        buildGodotMetadata(recipe, { textureFileName: `${baseName}-normal.png` }),
        null,
        2,
      ),
    );

  const destResult = validateGodotDestination(godotDest);
  const tileFitWarning = axisH === GodotAxisStretch.TileFit || axisV === GodotAxisStretch.TileFit;

  const exportGodotBundle = () => {
    const check = validateGodotDestination(godotDest);
    if (!check.valid || !check.destination) {
      setGodotError(check.error ?? 'Ruta de destino inválida');
      return;
    }
    setGodotError(null);
    const bundle = buildGodotExportBundle({
      recipe,
      pngBytes: encodePng(renderAsset(recipe, 'normal')),
      destination: godotDest,
      axisStretchHorizontal: axisH,
      axisStretchVertical: axisV,
      ...(contentPadding ? { contentPadding } : {}),
    });
    downloadBlob(
      `${check.destination.assetName}.zip`,
      'application/zip',
      toArrayBuffer(encodeZip(bundle.files)),
    );
  };

  const importRecipe = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      setRecipe(parseRecipe(await file.text()));
      setImportError(null);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Recipe inválido');
    }
  };

  const layer0 = recipe.border.layers[0];
  const layer1 = recipe.border.layers[1];

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Sixteen Pixel Perfect — Estudio</h1>
        <p style={styles.subtitle}>
          Generador determinista de assets de UI en pixel-art. Configura, previsualiza y exporta.
        </p>
      </header>

      <div style={styles.layout}>
        <section style={styles.controls} aria-label="Configuración del asset">
          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Dimensiones</legend>
            <label style={styles.label}>
              Ancho (px)
              <input
                type="number"
                min={1}
                max={1024}
                value={recipe.size.width}
                onChange={(e) =>
                  patch({
                    size: { ...recipe.size, width: clampInt(e.target.valueAsNumber, 1, 1024) },
                  })
                }
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Alto (px)
              <input
                type="number"
                min={1}
                max={1024}
                value={recipe.size.height}
                onChange={(e) =>
                  patch({
                    size: { ...recipe.size, height: clampInt(e.target.valueAsNumber, 1, 1024) },
                  })
                }
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Seed
              <input
                type="number"
                min={0}
                value={recipe.seed}
                onChange={(e) => patch({ seed: clampInt(e.target.valueAsNumber, 0, 0xffffffff) })}
                style={styles.input}
              />
            </label>
          </fieldset>

          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Paleta</legend>
            <label style={styles.label}>
              Set de colores
              <select
                value={recipe.palette.id}
                onChange={(e) => {
                  const palette = getBuiltInPalette(e.target.value);
                  if (palette) patch({ palette });
                }}
                style={styles.input}
              >
                {BUILT_IN_PALETTES.map((palette) => (
                  <option key={palette.id} value={palette.id}>
                    {palette.name}
                  </option>
                ))}
              </select>
            </label>
            <div style={styles.swatches}>
              {recipe.palette.tokens.map((token) => (
                <span
                  key={token.id}
                  title={token.id}
                  style={{
                    ...styles.swatch,
                    background: `rgba(${token.rgba[0]},${token.rgba[1]},${token.rgba[2]},${token.rgba[3] / 255})`,
                  }}
                />
              ))}
            </div>
          </fieldset>

          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Borde (2 capas)</legend>
            {[layer0, layer1].map((layer, i) =>
              !layer ? null : (
                <div key={i} style={styles.row}>
                  <label style={styles.labelInline}>
                    Grosor {i + 1}
                    <input
                      type="number"
                      min={0}
                      max={64}
                      value={layer.thickness}
                      onChange={(e) =>
                        updateLayer(
                          i as 0 | 1,
                          'thickness',
                          clampInt(e.target.valueAsNumber, 0, 64),
                        )
                      }
                      style={styles.inputSmall}
                    />
                  </label>
                  <label style={styles.labelInline}>
                    Color
                    <select
                      value={layer.tokenId}
                      onChange={(e) => updateLayer(i as 0 | 1, 'tokenId', e.target.value)}
                      style={styles.inputSmall}
                    >
                      {tokenIds.map((id) => (
                        <option key={id} value={id}>
                          {id}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label style={styles.labelInline}>
                    Patrón
                    <select
                      value={layer.pattern}
                      onChange={(e) => updateLayer(i as 0 | 1, 'pattern', e.target.value)}
                      style={styles.inputSmall}
                    >
                      {EDGE_PATTERNS.map((pattern) => (
                        <option key={pattern} value={pattern}>
                          {pattern}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ),
            )}
          </fieldset>

          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Esquina</legend>
            <label style={styles.label}>
              Motivo
              <select
                value={recipe.corner.motif}
                onChange={(e) =>
                  patch({ corner: { ...recipe.corner, motif: e.target.value as CornerMotif } })
                }
                style={styles.input}
              >
                {CORNER_MOTIFS.map((motif) => (
                  <option key={motif} value={motif}>
                    {motif}
                  </option>
                ))}
              </select>
            </label>
            <label style={styles.label}>
              Tamaño
              <input
                type="number"
                min={0}
                max={64}
                value={recipe.corner.size}
                onChange={(e) =>
                  patch({
                    corner: { ...recipe.corner, size: clampInt(e.target.valueAsNumber, 0, 64) },
                  })
                }
                style={styles.input}
              />
            </label>
          </fieldset>

          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Relleno central</legend>
            <label style={styles.label}>
              Patrón
              <select
                value={recipe.fill.kind}
                onChange={(e) =>
                  patch({ fill: { ...recipe.fill, kind: e.target.value as FillKind } })
                }
                style={styles.input}
              >
                {FILL_KINDS.map((kind) => (
                  <option key={kind} value={kind}>
                    {kind}
                  </option>
                ))}
              </select>
            </label>
            <div style={styles.row}>
              {[0, 1].map((slot) => (
                <label key={slot} style={styles.labelInline}>
                  Color {slot === 0 ? 'A' : 'B'}
                  <select
                    value={recipe.fill.tokenIds[slot] ?? recipe.fill.tokenIds[0]}
                    onChange={(e) => {
                      const tokens = [...recipe.fill.tokenIds];
                      tokens[slot] = e.target.value;
                      patch({ fill: { ...recipe.fill, tokenIds: tokens } });
                    }}
                    style={styles.inputSmall}
                  >
                    {tokenIds.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section style={styles.preview} aria-label="Previsualización y exportación">
          <div style={styles.scaleRow}>
            <span style={styles.scaleLabel}>Zoom</span>
            {SCALES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setScale(s)}
                aria-pressed={scale === s}
                style={{ ...styles.scaleButton, ...(scale === s ? styles.scaleButtonActive : {}) }}
              >
                {s}x
              </button>
            ))}
          </div>

          <div style={styles.states}>
            {previews.map(({ state, url }) => (
              <figure key={state} style={styles.stateCard}>
                <figcaption style={styles.stateCaption}>{state}</figcaption>
                <div style={styles.canvasWrap}>
                  <img
                    src={url}
                    width={recipe.size.width * scale}
                    height={recipe.size.height * scale}
                    alt={`Panel ${state} a ${scale}x`}
                    style={styles.pixelImg}
                  />
                </div>
                <button type="button" onClick={() => exportPng(state)} style={styles.smallButton}>
                  PNG {state}
                </button>
              </figure>
            ))}
          </div>

          <div style={styles.meta}>
            9-slice · left {nineSlice.left} · top {nineSlice.top} · right {nineSlice.right} · bottom{' '}
            {nineSlice.bottom}
          </div>

          <div style={styles.exportRow}>
            <button type="button" onClick={exportRecipe} style={styles.button}>
              Exportar recipe JSON
            </button>
            <button type="button" onClick={exportGodot} style={styles.button}>
              Exportar Godot 9-slice
            </button>
            <label style={styles.importLabel}>
              Cargar recipe
              <input
                type="file"
                accept="application/json,.json"
                onChange={importRecipe}
                style={styles.fileInput}
              />
            </label>
          </div>
          {importError ? (
            <p role="alert" style={styles.error}>
              {importError}
            </p>
          ) : null}

          <fieldset style={styles.fieldset} aria-label="Exportación nativa Godot 4">
            <legend style={styles.legend}>Exportación Godot 4 (nativa)</legend>
            <label style={styles.label}>
              Ruta de destino Godot
              <input
                type="text"
                value={godotDest}
                onChange={(e) => {
                  setGodotDest(e.target.value);
                  setGodotError(null);
                }}
                placeholder="res://assets/ui/generated/panel_mine/"
                style={styles.input}
                aria-invalid={!destResult.valid}
              />
            </label>
            <p style={styles.hint}>
              {destResult.valid
                ? `Asset: ${destResult.destination?.assetName} · el ZIP refleja ${destResult.destination?.relativeDir}`
                : destResult.error}
            </p>

            <div style={styles.row}>
              <label style={styles.labelInline}>
                Axis horizontal
                <select
                  value={axisH}
                  onChange={(e) => setAxisH(Number(e.target.value) as GodotAxisStretchValue)}
                  style={styles.inputSmall}
                >
                  {AXIS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label style={styles.labelInline}>
                Axis vertical
                <select
                  value={axisV}
                  onChange={(e) => setAxisV(Number(e.target.value) as GodotAxisStretchValue)}
                  style={styles.inputSmall}
                >
                  {AXIS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {tileFitWarning ? (
              <p style={styles.warn}>
                ⚠ Tile Fit puede distorsionar ligeramente el patrón para encajar tiles completos.
              </p>
            ) : null}

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={contentPadding !== null}
                onChange={(e) =>
                  setContentPadding(
                    e.target.checked ? { left: 0, top: 0, right: 0, bottom: 0 } : null,
                  )
                }
              />
              Padding de contenido propio (si se omite, usa los márgenes de textura)
            </label>
            {contentPadding ? (
              <div style={styles.row}>
                {(['left', 'top', 'right', 'bottom'] as const).map((side) => (
                  <label key={side} style={styles.labelInline}>
                    {side}
                    <input
                      type="number"
                      min={0}
                      max={512}
                      value={contentPadding[side]}
                      onChange={(e) =>
                        setContentPadding((prev) => ({
                          ...(prev ?? { left: 0, top: 0, right: 0, bottom: 0 }),
                          [side]: clampInt(e.target.valueAsNumber, 0, 512),
                        }))
                      }
                      style={styles.inputSmall}
                    />
                  </label>
                ))}
              </div>
            ) : null}

            <button type="button" onClick={exportGodotBundle} style={styles.button}>
              Exportar bundle Godot (.zip)
            </button>
            {godotError ? (
              <p role="alert" style={styles.error}>
                {godotError}
              </p>
            ) : null}
            <p style={styles.docNote}>
              Config del proyecto para pixel-art crudo:{' '}
              <strong>
                Rendering › Textures › Canvas Textures › Default Texture Filter = Nearest
              </strong>
              . No se generan archivos <code>.import</code> — Godot escribe su propia metadata al
              copiar los archivos al proyecto. El <code>.stylebox.tres</code> es el export nativo
              primario; el <code>.preview.tscn</code> (NinePatchRect) es solo previsualización.
            </p>
          </fieldset>
        </section>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '32px 20px',
    color: 'var(--color-text, #0b1020)',
  },
  header: { marginBottom: 24 },
  title: { fontSize: 26, fontWeight: 700, margin: 0 },
  subtitle: { fontSize: 14, opacity: 0.75, margin: '6px 0 0' },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(260px, 360px) 1fr',
    gap: 24,
    alignItems: 'start',
  },
  controls: { display: 'flex', flexDirection: 'column', gap: 16 },
  fieldset: {
    border: '1px solid rgba(120,140,180,0.35)',
    borderRadius: 10,
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  legend: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    opacity: 0.7,
  },
  label: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 },
  labelInline: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, flex: 1 },
  row: { display: 'flex', gap: 8 },
  input: {
    padding: '6px 8px',
    borderRadius: 6,
    border: '1px solid rgba(120,140,180,0.5)',
    background: 'transparent',
    color: 'inherit',
    font: 'inherit',
  },
  inputSmall: {
    padding: '5px 6px',
    borderRadius: 6,
    border: '1px solid rgba(120,140,180,0.5)',
    background: 'transparent',
    color: 'inherit',
    font: 'inherit',
    width: '100%',
  },
  swatches: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  swatch: {
    width: 22,
    height: 22,
    borderRadius: 4,
    border: '1px solid rgba(0,0,0,0.25)',
    display: 'inline-block',
  },
  preview: { display: 'flex', flexDirection: 'column', gap: 16 },
  scaleRow: { display: 'flex', alignItems: 'center', gap: 8 },
  scaleLabel: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    opacity: 0.7,
    marginRight: 4,
  },
  scaleButton: {
    padding: '4px 12px',
    borderRadius: 6,
    border: '1px solid rgba(120,140,180,0.5)',
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
  },
  scaleButtonActive: {
    background: 'var(--color-accent, #2f6fed)',
    color: '#fff',
    borderColor: 'transparent',
  },
  states: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  stateCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, margin: 0 },
  stateCaption: { fontSize: 12, fontWeight: 600, textTransform: 'capitalize', opacity: 0.8 },
  canvasWrap: {
    padding: 12,
    borderRadius: 10,
    border: '1px solid rgba(120,140,180,0.35)',
    backgroundImage:
      'linear-gradient(45deg, rgba(120,140,180,0.18) 25%, transparent 25%), linear-gradient(-45deg, rgba(120,140,180,0.18) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(120,140,180,0.18) 75%), linear-gradient(-45deg, transparent 75%, rgba(120,140,180,0.18) 75%)',
    backgroundSize: '16px 16px',
    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
  },
  pixelImg: { imageRendering: 'pixelated', display: 'block' },
  meta: { fontSize: 12, opacity: 0.7, fontFamily: 'monospace' },
  exportRow: { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' },
  button: {
    padding: '8px 14px',
    borderRadius: 8,
    border: '1px solid rgba(120,140,180,0.5)',
    background: 'var(--color-accent, #2f6fed)',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
  },
  smallButton: {
    padding: '4px 10px',
    borderRadius: 6,
    border: '1px solid rgba(120,140,180,0.5)',
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    fontSize: 12,
  },
  importLabel: {
    display: 'inline-flex',
    flexDirection: 'column',
    fontSize: 12,
    gap: 2,
    cursor: 'pointer',
  },
  fileInput: { fontSize: 12 },
  error: { color: '#c0392b', fontSize: 13, margin: 0 },
  hint: { fontSize: 12, opacity: 0.7, margin: 0, fontFamily: 'monospace' },
  warn: { fontSize: 12, color: '#b8860b', margin: 0 },
  checkboxRow: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 },
  docNote: { fontSize: 12, opacity: 0.75, margin: 0, lineHeight: 1.5 },
};
