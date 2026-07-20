'use client';

import {
  BUILT_IN_PALETTES,
  LINEAGE_COMPONENT_PRESETS,
  LINEAGE_THEME_PRESETS,
  applyLineageThemePreset,
  buildGodotExportBundle,
  buildGodotMetadata,
  computeNineSlice,
  detachRecipeFromLineagePreset,
  encodePng,
  encodePngDataUrl,
  encodeZip,
  getBuiltInPalette,
  getLineageThemePreset,
  GodotAxisStretch,
  makeDefaultPanelRecipe,
  makeLineageComponentRecipe,
  markRecipeManualOverride,
  MVP_STATES,
  parseRecipe,
  renderAsset,
  resetRecipeToLineagePreset,
  serializeRecipe,
  validateGodotDestination,
  type AssetRecipe,
  type CornerMotif,
  type EdgePattern,
  type FillKind,
  type GodotAxisStretchValue,
  type LineageComponentId,
  type LineageThemeId,
  type PaddingDefinition,
  type Rgba,
} from '@17suit/module-sixteen-pixel-perfect';
import { useMemo, useState, type ChangeEvent, type CSSProperties } from 'react';

const SCALES = [1, 2, 4, 8] as const;
const CORNER_MOTIFS: readonly CornerMotif[] = [
  'square',
  'notch',
  'bevel',
  'round',
  'buttress',
  'cellular',
  'rivet',
  'folded',
  'compass',
  'seal',
  'constellation',
  'pulse',
];
const FILL_KINDS: readonly FillKind[] = ['solid', 'checker', 'diagonal', 'noise'];
const EDGE_PATTERNS: readonly EdgePattern[] = ['solid', 'dashed', 'dotted'];
const AXIS_OPTIONS: readonly { value: GodotAxisStretchValue; label: string }[] = [
  { value: GodotAxisStretch.Stretch, label: 'Stretch (0)' },
  { value: GodotAxisStretch.Tile, label: 'Tile (1)' },
  { value: GodotAxisStretch.TileFit, label: 'Tile Fit (2)' },
];
const THEME_PREVIEW_COMPONENTS: readonly LineageComponentId[] = [
  'panel',
  'button_primary',
  'button_secondary',
  'tooltip',
  'status_bar',
  'sidebar',
  'tab',
  'progress_bar',
  'resource_chip',
  'portrait_frame',
  'icon_container',
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

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

function rgbaCss(rgba: Rgba): string {
  return `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3] / 255})`;
}

function paletteToken(recipe: AssetRecipe, tokenId: string): Rgba {
  return recipe.palette.tokens.find((token) => token.id === tokenId)?.rgba ?? [0, 0, 0, 255];
}

function relativeLuminance([r, g, b]: Rgba): number {
  const channel = [r, g, b].map((value) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channel[0]! + 0.7152 * channel[1]! + 0.0722 * channel[2]!;
}

function contrastRatio(a: Rgba, b: Rgba): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

function accessibilityWarnings(recipe: AssetRecipe): string[] {
  const checks: readonly [string, string, string][] = [
    ['text_primary', 'surface_base', 'Texto principal bajo contraste sobre superficie base'],
    ['text_secondary', 'surface_base', 'Texto secundario bajo contraste sobre superficie base'],
    ['focus', 'surface_base', 'Focus poco visible sobre superficie base'],
    ['disabled', 'surface_inset', 'Disabled poco distinguible sobre superficie inset'],
  ];
  return checks
    .filter(([fg, bg]) => contrastRatio(paletteToken(recipe, fg), paletteToken(recipe, bg)) < 3)
    .map(([, , message]) => message);
}

export function StudioClient() {
  const [recipe, setRecipe] = useState<AssetRecipe>(() => makeDefaultPanelRecipe());
  const [scale, setScale] = useState<(typeof SCALES)[number]>(4);
  const [importError, setImportError] = useState<string | null>(null);
  const [godotDest, setGodotDest] = useState('res://assets/ui/generated/panel_mine/');
  const [axisH, setAxisH] = useState<GodotAxisStretchValue>(GodotAxisStretch.Tile);
  const [axisV, setAxisV] = useState<GodotAxisStretchValue>(GodotAxisStretch.Tile);
  const [godotError, setGodotError] = useState<string | null>(null);

  const activeLineage = recipe.lineage_theme_id
    ? getLineageThemePreset(recipe.lineage_theme_id)
    : undefined;
  const tokenIds = recipe.palette.tokens.map((token) => token.id);
  const lineageSlug = recipe.lineage_theme_id ?? 'legacy';
  const baseName = `${lineageSlug}-${recipe.preset}-${recipe.size.width}x${recipe.size.height}`;
  const nineSlice = useMemo(() => computeNineSlice(recipe), [recipe]);
  const recipeJson = useMemo(() => serializeRecipe(recipe), [recipe]);
  const warnings = useMemo(() => accessibilityWarnings(recipe), [recipe]);

  const previews = useMemo(
    () =>
      MVP_STATES.map((state) => ({
        state,
        url: encodePngDataUrl(renderAsset(recipe, state)),
      })),
    [recipe],
  );

  const themePreview = useMemo(() => {
    const lineageThemeId = recipe.lineage_theme_id ?? 'ardhen';
    return THEME_PREVIEW_COMPONENTS.map((componentId) => {
      const previewRecipe = makeLineageComponentRecipe({
        lineageThemeId,
        componentId,
        seed: recipe.seed,
      });
      return {
        componentId,
        label: LINEAGE_COMPONENT_PRESETS.find((preset) => preset.id === componentId)?.name,
        url: encodePngDataUrl(renderAsset(previewRecipe, 'normal')),
        size: previewRecipe.size,
      };
    });
  }, [recipe.lineage_theme_id, recipe.seed]);

  const patchRecipe = (path: string, next: Partial<AssetRecipe>) =>
    setRecipe((prev) => markRecipeManualOverride({ ...prev, ...next }, path));

  const updateLayer = (index: 0 | 1, key: 'thickness' | 'tokenId' | 'pattern', value: unknown) =>
    setRecipe((prev) => {
      const layers = prev.border.layers.map((layer, i) =>
        i === index ? { ...layer, [key]: value } : layer,
      );
      return markRecipeManualOverride({ ...prev, border: { layers } }, `border.layers.${index}`);
    });

  const updatePadding = (side: keyof PaddingDefinition, value: number) =>
    setRecipe((prev) =>
      markRecipeManualOverride(
        {
          ...prev,
          contentPadding: {
            ...(prev.contentPadding ?? { left: 0, top: 0, right: 0, bottom: 0 }),
            [side]: value,
          },
        },
        `contentPadding.${side}`,
      ),
    );

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
      ...(recipe.contentPadding ? { contentPadding: recipe.contentPadding } : {}),
    });
    downloadBlob(
      `${lineageSlug}-${check.destination.assetName}.zip`,
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
  const pageStyle = {
    ...styles.page,
    background: rgbaCss(paletteToken(recipe, 'background_deep')),
    color: rgbaCss(paletteToken(recipe, 'text_primary')),
  };

  return (
    <main style={pageStyle}>
      <header style={styles.header}>
        <h1 style={styles.title}>Sixteen Pixel Perfect</h1>
        <p style={styles.subtitle}>
          Generador determinista de assets UI pixel-art para World of Goses.
        </p>
      </header>

      <div style={styles.layout}>
        <section style={styles.controls} aria-label="Configuración del asset">
          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Linaje</legend>
            <label style={styles.label}>
              Preset World of Goses
              <select
                value={recipe.lineage_theme_id ?? ''}
                onChange={(e) =>
                  setRecipe((prev) =>
                    applyLineageThemePreset(prev, e.target.value as LineageThemeId),
                  )
                }
                style={styles.input}
              >
                {LINEAGE_THEME_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.displayName}
                  </option>
                ))}
              </select>
            </label>
            <label style={styles.label}>
              Componente
              <select
                value={recipe.preset}
                onChange={(e) => {
                  const lineageThemeId = recipe.lineage_theme_id ?? 'ardhen';
                  setRecipe(
                    makeLineageComponentRecipe({
                      lineageThemeId,
                      componentId: e.target.value as LineageComponentId,
                      width: recipe.size.width,
                      height: recipe.size.height,
                      seed: recipe.seed,
                    }),
                  );
                }}
                style={styles.input}
              >
                {LINEAGE_COMPONENT_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </label>
            <p style={styles.hint}>{activeLineage?.description}</p>
            <div style={styles.relationshipRow}>
              <span style={styles.badge}>{recipe.preset_relationship ?? 'legacy'}</span>
              <button
                type="button"
                onClick={() => setRecipe(resetRecipeToLineagePreset)}
                style={styles.smallButton}
              >
                Reset to lineage preset
              </button>
              <button
                type="button"
                onClick={() => setRecipe(detachRecipeFromLineagePreset)}
                style={styles.smallButton}
              >
                Detach from preset
              </button>
            </div>
          </fieldset>

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
                  patchRecipe('size.width', {
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
                  patchRecipe('size.height', {
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
                onChange={(e) =>
                  patchRecipe('seed', { seed: clampInt(e.target.valueAsNumber, 0, 0xffffffff) })
                }
                style={styles.input}
              />
            </label>
          </fieldset>

          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Paleta semántica</legend>
            <label style={styles.label}>
              Set legacy
              <select
                value={recipe.palette.id}
                onChange={(e) => {
                  const palette = getBuiltInPalette(e.target.value);
                  if (palette) patchRecipe('palette', { palette });
                }}
                style={styles.input}
              >
                <option value={recipe.palette.id}>{recipe.palette.name}</option>
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
                  style={{ ...styles.swatch, background: rgbaCss(token.rgba) }}
                />
              ))}
            </div>
            {warnings.map((warning) => (
              <p role="alert" key={warning} style={styles.warn}>
                {warning}
              </p>
            ))}
          </fieldset>

          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Borde</legend>
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
            <legend style={styles.legend}>Esquina y relleno</legend>
            <label style={styles.label}>
              Motivo
              <select
                value={recipe.corner.motif}
                onChange={(e) =>
                  patchRecipe('corner.motif', {
                    corner: { ...recipe.corner, motif: e.target.value as CornerMotif },
                  })
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
              Tamaño esquina
              <input
                type="number"
                min={0}
                max={64}
                value={recipe.corner.size}
                onChange={(e) =>
                  patchRecipe('corner.size', {
                    corner: { ...recipe.corner, size: clampInt(e.target.valueAsNumber, 0, 64) },
                  })
                }
                style={styles.input}
              />
            </label>
            <label style={styles.label}>
              Patrón
              <select
                value={recipe.fill.kind}
                onChange={(e) =>
                  patchRecipe('fill.kind', {
                    fill: { ...recipe.fill, kind: e.target.value as FillKind },
                  })
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
                      patchRecipe(`fill.tokenIds.${slot}`, {
                        fill: { ...recipe.fill, tokenIds: tokens },
                      });
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

          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Padding contenido</legend>
            <div style={styles.row}>
              {(['left', 'top', 'right', 'bottom'] as const).map((side) => (
                <label key={side} style={styles.labelInline}>
                  {side}
                  <input
                    type="number"
                    min={0}
                    max={512}
                    value={recipe.contentPadding?.[side] ?? 0}
                    onChange={(e) => updatePadding(side, clampInt(e.target.valueAsNumber, 0, 512))}
                    style={styles.inputSmall}
                  />
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

          <section style={styles.themePreview} aria-label="Lineage theme preview">
            {themePreview.map((item) => (
              <figure key={item.componentId} style={styles.themePreviewItem}>
                <figcaption style={styles.stateCaption}>{item.label}</figcaption>
                <img
                  src={item.url}
                  width={item.size.width * 2}
                  height={item.size.height * 2}
                  alt={`${item.label} preview`}
                  style={styles.pixelImg}
                />
              </figure>
            ))}
          </section>

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
                Tile Fit puede ajustar el patrón para encajar tiles completos.
              </p>
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
              El <code>.stylebox.tres</code> usa valores resueltos del recipe. No hay lógica de
              linaje dentro del serializer.
            </p>
          </fieldset>
        </section>
      </div>
    </main>
  );
}

const panelChrome = 'rgba(238, 229, 213, 0.24)';

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    padding: '32px 20px',
    color: 'var(--color-text)',
  },
  header: { maxWidth: 1180, margin: '0 auto 24px' },
  title: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.78,
    margin: '6px 0 0',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(280px, 380px) 1fr',
    gap: 24,
    alignItems: 'start',
    maxWidth: 1180,
    margin: '0 auto',
  },
  controls: { display: 'flex', flexDirection: 'column', gap: 16 },
  fieldset: {
    border: `1px solid ${panelChrome}`,
    borderRadius: 6,
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  legend: {
    fontSize: 18,
    letterSpacing: 0,
    opacity: 0.8,
  },
  label: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 },
  labelInline: { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, flex: 1 },
  row: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  relationshipRow: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  input: {
    padding: '6px 8px',
    borderRadius: 4,
    border: `1px solid ${panelChrome}`,
    background: 'rgba(0,0,0,0.18)',
    color: 'inherit',
    font: 'inherit',
  },
  inputSmall: {
    padding: '5px 6px',
    borderRadius: 4,
    border: `1px solid ${panelChrome}`,
    background: 'rgba(0,0,0,0.18)',
    color: 'inherit',
    font: 'inherit',
    width: '100%',
  },
  badge: {
    border: `1px solid ${panelChrome}`,
    borderRadius: 4,
    padding: '4px 8px',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  swatches: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  swatch: {
    width: 22,
    height: 22,
    borderRadius: 3,
    border: '1px solid rgba(0,0,0,0.3)',
    display: 'inline-block',
  },
  preview: { display: 'flex', flexDirection: 'column', gap: 16 },
  scaleRow: { display: 'flex', alignItems: 'center', gap: 8 },
  scaleLabel: {
    fontSize: 18,
    opacity: 0.8,
    marginRight: 4,
  },
  scaleButton: {
    padding: '4px 12px',
    borderRadius: 4,
    border: `1px solid ${panelChrome}`,
    background: 'rgba(0,0,0,0.18)',
    color: 'inherit',
    cursor: 'pointer',
  },
  scaleButtonActive: {
    background: 'rgba(255,255,255,0.18)',
    borderColor: 'currentColor',
  },
  states: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  stateCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, margin: 0 },
  stateCaption: { fontSize: 12, fontWeight: 600, textTransform: 'capitalize', opacity: 0.82 },
  canvasWrap: {
    padding: 12,
    borderRadius: 6,
    border: `1px solid ${panelChrome}`,
    backgroundImage:
      'linear-gradient(45deg, rgba(255,255,255,0.12) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.12) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.12) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.12) 75%)',
    backgroundSize: '16px 16px',
    backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
  },
  pixelImg: { imageRendering: 'pixelated', display: 'block' },
  themePreview: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(116px, 1fr))',
    gap: 12,
  },
  themePreviewItem: {
    minHeight: 86,
    margin: 0,
    padding: 8,
    border: `1px solid ${panelChrome}`,
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  meta: { fontSize: 12, opacity: 0.75, fontFamily: 'monospace' },
  exportRow: { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' },
  button: {
    padding: '8px 14px',
    borderRadius: 4,
    border: `1px solid ${panelChrome}`,
    background: 'rgba(255,255,255,0.18)',
    color: 'inherit',
    cursor: 'pointer',
    fontWeight: 600,
  },
  smallButton: {
    padding: '4px 10px',
    borderRadius: 4,
    border: `1px solid ${panelChrome}`,
    background: 'rgba(0,0,0,0.18)',
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
  error: { color: 'rgb(255, 130, 130)', fontSize: 13, margin: 0 },
  hint: { fontSize: 12, opacity: 0.75, margin: 0, lineHeight: 1.4 },
  warn: { fontSize: 12, color: 'rgb(255, 210, 100)', margin: 0 },
  docNote: { fontSize: 12, opacity: 0.75, margin: 0, lineHeight: 1.5 },
};
