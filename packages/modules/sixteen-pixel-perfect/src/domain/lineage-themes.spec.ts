import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildGodotExportBundle } from '../export/godot-resources';
import { encodePng } from '../export/png';
import { parseRecipe, serializeRecipe } from '../export/recipe-io';
import { renderAsset } from '../render/render';
import {
  LINEAGE_COMPONENT_IDS,
  LINEAGE_THEME_PRESETS,
  SEMANTIC_COLOR_TOKEN_IDS,
  applyLineageThemePreset,
  assertValidLineageThemePreset,
  makeLineageComponentRecipe,
  markRecipeManualOverride,
  resetRecipeToLineagePreset,
  validateLineageThemePresets,
  type LineageThemePreset,
} from './lineage-themes';
import { makeDefaultPanelRecipe } from './presets';
import type { AssetRecipe } from './recipe';

describe('lineage theme presets', () => {
  it('defines all eight World of Goses lineages', () => {
    expect(LINEAGE_THEME_PRESETS.map((preset) => preset.id)).toEqual([
      'ardhen',
      'eirune',
      'kovari',
      'myrven',
      'vaelun',
      'orveth',
      'caelith',
      'theryn',
    ]);
  });

  it('defines every required semantic token for each lineage', () => {
    for (const preset of LINEAGE_THEME_PRESETS) {
      for (const tokenId of SEMANTIC_COLOR_TOKEN_IDS) {
        expect(preset.palette[tokenId]).toMatch(/^#[0-9A-F]{6}$/i);
      }
    }
  });

  it('gives each lineage a distinctive corner motif', () => {
    const motifs = LINEAGE_THEME_PRESETS.map(
      (preset) => preset.componentPresets.panel.corner.motif,
    );
    expect(new Set(motifs).size).toBe(LINEAGE_THEME_PRESETS.length);
    expect(motifs).toEqual([
      'buttress',
      'cellular',
      'rivet',
      'folded',
      'compass',
      'seal',
      'constellation',
      'pulse',
    ]);
  });

  it('renders a distinctive corner alpha mask for each lineage', () => {
    const masks = LINEAGE_THEME_PRESETS.map((preset) => {
      const recipe = makeLineageComponentRecipe({
        lineageThemeId: preset.id,
        componentId: 'panel',
      });
      const buffer = renderAsset(recipe);
      const span = Math.min(8, recipe.size.width, recipe.size.height);
      let mask = '';
      for (let y = 0; y < span; y += 1) {
        for (let x = 0; x < span; x += 1) {
          mask += buffer.data[(y * buffer.width + x) * 4 + 3] === 0 ? '0' : '1';
        }
      }
      return mask;
    });
    expect(new Set(masks).size).toBe(LINEAGE_THEME_PRESETS.length);
  });

  it('resolves every preset deterministically', () => {
    validateLineageThemePresets();
    for (const preset of LINEAGE_THEME_PRESETS) {
      const a = makeLineageComponentRecipe({ lineageThemeId: preset.id, componentId: 'panel' });
      const b = makeLineageComponentRecipe({ lineageThemeId: preset.id, componentId: 'panel' });
      expect(serializeRecipe(a)).toEqual(serializeRecipe(b));
      expect(Array.from(renderAsset(a).data)).toEqual(Array.from(renderAsset(b).data));
    }
  });

  it('keeps raw lineage hex values out of UI components', () => {
    const studioSource = readFileSync(
      '../../../apps/sixteen-pp-web/components/studio/studio-client.tsx',
      'utf8',
    );
    for (const preset of LINEAGE_THEME_PRESETS) {
      for (const hex of Object.values(preset.palette)) {
        expect(studioSource).not.toContain(hex);
      }
    }
  });

  it('applying a preset updates all expected recipe categories', () => {
    const recipe = applyLineageThemePreset(makeDefaultPanelRecipe(), 'theryn');
    expect(recipe.lineage_theme_id).toBe('theryn');
    expect(recipe.lineage_theme_version).toBe(1);
    expect(recipe.preset_relationship).toBe('linked');
    expect(recipe.resolved_palette?.id).toBe('lineage-theryn');
    expect(recipe.resolved_ornamentation?.selectionEffect).toBe('contained-pulse');
    expect(recipe.icon_treatment?.colorTokenId).toBe('text_primary');
    expect(recipe.border.layers.length).toBeGreaterThan(0);
    expect(recipe.corner.size).toBeGreaterThan(0);
    expect(recipe.fill.tokenIds.length).toBeGreaterThan(0);
    expect(recipe.shadow?.tokenId).toBe('border_dark');
    expect(recipe.contentPadding?.left).toBeGreaterThan(0);
  });

  it('manual overrides survive unrelated changes', () => {
    const modified = markRecipeManualOverride({ ...makeDefaultPanelRecipe(), seed: 42 }, 'seed');
    const resized = markRecipeManualOverride(
      { ...modified, size: { width: 80, height: 32 } },
      'size.width',
    );
    expect(resized.preset_relationship).toBe('modified');
    expect(resized.manual_overrides?.map((override) => override.path)).toEqual([
      'seed',
      'size.width',
    ]);
  });

  it('reset restores the lineage preset exactly for theme-controlled values', () => {
    const modified = markRecipeManualOverride(
      { ...makeDefaultPanelRecipe(), fill: { kind: 'solid', tokenIds: ['danger'] } },
      'fill',
    );
    const reset = resetRecipeToLineagePreset(modified);
    const expected = makeLineageComponentRecipe({
      lineageThemeId: 'ardhen',
      componentId: 'panel',
      width: modified.size.width,
      height: modified.size.height,
      seed: modified.seed,
    });
    expect(serializeRecipe(reset)).toEqual(serializeRecipe(expected));
  });

  it('recipe serialization includes theme id and version', () => {
    const json = serializeRecipe(makeDefaultPanelRecipe());
    expect(json).toContain('"lineage_theme_id": "ardhen"');
    expect(json).toContain('"lineage_theme_version": 1');
    expect(json).toContain('"preset_relationship": "linked"');
    expect(json).toContain('"resolved_palette"');
    expect(json).toContain('"resolved_ornamentation"');
    expect(json).toContain('"manual_overrides"');
  });

  it('old recipes without lineage theme still load', () => {
    const legacy: AssetRecipe = {
      version: 1,
      preset: 'panel',
      seed: 1,
      size: { width: 48, height: 32 },
      palette: {
        id: 'legacy',
        name: 'Legacy',
        tokens: [
          { id: 'ink', rgba: [0, 0, 0, 255] },
          { id: 'edge', rgba: [64, 64, 64, 255] },
          { id: 'panel', rgba: [128, 128, 128, 255] },
        ],
      },
      border: { layers: [{ thickness: 1, tokenId: 'ink', pattern: 'solid' }] },
      corner: { motif: 'square', size: 0 },
      fill: { kind: 'solid', tokenIds: ['panel'] },
      background: 'transparent',
    };
    expect(parseRecipe(JSON.stringify(legacy)).lineage_theme_id).toBeUndefined();
  });

  it('Godot exports use resolved recipe values', () => {
    const recipe = makeLineageComponentRecipe({
      lineageThemeId: 'vaelun',
      componentId: 'button_primary',
      width: 72,
      height: 24,
    });
    const bundle = buildGodotExportBundle({
      recipe,
      pngBytes: encodePng(renderAsset(recipe)),
      destination: 'res://assets/ui/generated/vaelun_button/',
      ...(recipe.contentPadding ? { contentPadding: recipe.contentPadding } : {}),
    });
    const recipeFile = bundle.files.find((file) => file.path.endsWith('.recipe.json'))!;
    const godotFile = bundle.files.find((file) => file.path.endsWith('.godot.json'))!;
    const styleBox = bundle.files.find((file) => file.path.endsWith('.stylebox.tres'))!;
    expect(recipeFile.text).toContain('"lineage_theme_id": "vaelun"');
    expect(godotFile.text).toContain('"lineage_theme_id": "vaelun"');
    expect(styleBox.text).toContain('content_margin_left');
  });

  it('invalid or incomplete presets fail validation', () => {
    const broken: LineageThemePreset = {
      ...LINEAGE_THEME_PRESETS[0]!,
      palette: { ...LINEAGE_THEME_PRESETS[0]!.palette, focus: '' },
    };
    expect(() => assertValidLineageThemePreset(broken)).toThrow(/missing semantic token focus/);
  });

  it('theme previews render without missing ornament definitions', () => {
    for (const preset of LINEAGE_THEME_PRESETS) {
      for (const componentId of LINEAGE_COMPONENT_IDS) {
        const recipe = makeLineageComponentRecipe({ lineageThemeId: preset.id, componentId });
        expect(recipe.resolved_ornamentation?.borderPreset).toBeTruthy();
        expect(() => renderAsset(recipe)).not.toThrow();
      }
    }
  });
});
