import { describe, expect, it } from 'vitest';
import { makeDefaultPanelRecipe } from '../domain/presets';
import { renderAsset } from '../render/render';
import {
  buildGodotExportBundle,
  GodotAxisStretch,
  godotStringLiteral,
  serializeGodotNinePatchScene,
  serializeGodotStyleBoxTexture,
  toNodeName,
  validateGodotDestination,
} from './godot-resources';
import { encodePng } from './png';
import { encodeZip } from './zip';

const DEST = 'res://assets/ui/generated/panel_mine/';

function bundleFor(dest = DEST) {
  const recipe = makeDefaultPanelRecipe();
  const pngBytes = encodePng(renderAsset(recipe, 'normal'));
  return buildGodotExportBundle({ recipe, pngBytes, destination: dest });
}

/** Read entry names from a STORE zip by walking local file headers. */
function zipEntryNames(zip: Uint8Array): string[] {
  const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
  const names: string[] = [];
  let offset = 0;
  while (offset + 4 <= zip.length && view.getUint32(offset, true) === 0x04034b50) {
    const compSize = view.getUint32(offset + 18, true);
    const nameLen = view.getUint16(offset + 26, true);
    const extraLen = view.getUint16(offset + 28, true);
    const nameBytes = zip.slice(offset + 30, offset + 30 + nameLen);
    names.push(String.fromCharCode(...nameBytes));
    offset += 30 + nameLen + extraLen + compSize;
  }
  return names;
}

describe('destination validation', () => {
  it('accepts a well-formed res:// path and derives the asset name', () => {
    const r = validateGodotDestination(DEST);
    expect(r.valid).toBe(true);
    expect(r.destination?.assetName).toBe('panel_mine');
    expect(r.destination?.relativeDir).toBe('assets/ui/generated/panel_mine/');
  });

  it.each([
    ['assets/ui/generated/panel/', 'missing res://'],
    ['res://assets/ui/generated/panel', 'missing trailing slash'],
    ['res://assets/../panel/', 'contains ..'],
    ['res://assets/ui generated/panel/', 'space / unsafe char'],
    ['res://', 'no folder segment'],
  ])('rejects %s (%s)', (path) => {
    expect(validateGodotDestination(path).valid).toBe(false);
  });
});

describe('StyleBoxTexture (.tres)', () => {
  const tres = serializeGodotStyleBoxTexture({
    texturePath: `${DEST}panel_mine.png`,
    margins: { left: 8, top: 8, right: 8, bottom: 8 },
    axisStretchHorizontal: GodotAxisStretch.Tile,
    axisStretchVertical: GodotAxisStretch.Stretch,
  });

  it('uses texture_margin_* names, never patch_margin_*', () => {
    expect(tres).toContain('texture_margin_left = 8.0');
    expect(tres).toContain('texture_margin_bottom = 8.0');
    expect(tres).not.toContain('patch_margin');
  });

  it('emits axis stretch enum integers', () => {
    expect(tres).toContain('axis_stretch_horizontal = 1');
    expect(tres).toContain('axis_stretch_vertical = 0');
  });

  it('references the res:// texture path and declares StyleBoxTexture', () => {
    expect(tres).toContain('[gd_resource type="StyleBoxTexture" load_steps=2 format=3]');
    expect(tres).toContain(`path="${DEST}panel_mine.png"`);
    expect(tres).toContain('draw_center = true');
  });

  it('omits region_rect (own PNG, no atlas)', () => {
    expect(tres).not.toContain('region_rect');
  });

  it('emits content_margin_* only when content padding is provided', () => {
    expect(tres).not.toContain('content_margin');
    const withPadding = serializeGodotStyleBoxTexture({
      texturePath: `${DEST}panel_mine.png`,
      margins: { left: 8, top: 8, right: 8, bottom: 8 },
      axisStretchHorizontal: GodotAxisStretch.Tile,
      axisStretchVertical: GodotAxisStretch.Tile,
      contentPadding: { left: 4, top: 4, right: 4, bottom: 4 },
    });
    expect(withPadding).toContain('content_margin_left = 4.0');
  });
});

describe('NinePatchRect (.tscn)', () => {
  const tscn = serializeGodotNinePatchScene({
    texturePath: `${DEST}panel_mine.png`,
    nodeName: 'PanelMinePreview',
    margins: { left: 8, top: 6, right: 8, bottom: 6 },
    axisStretchHorizontal: GodotAxisStretch.Tile,
    axisStretchVertical: GodotAxisStretch.TileFit,
    customMinimumSize: { width: 320, height: 96 },
  });

  it('uses patch_margin_* names (integers) and Nearest filter', () => {
    expect(tscn).toContain('patch_margin_left = 8');
    expect(tscn).toContain('patch_margin_top = 6');
    expect(tscn).toContain('texture_filter = 1');
    expect(tscn).not.toContain('texture_margin');
  });

  it('declares a NinePatchRect node with enum axis values', () => {
    expect(tscn).toContain('[gd_scene load_steps=2 format=3]');
    expect(tscn).toContain('[node name="PanelMinePreview" type="NinePatchRect"]');
    expect(tscn).toContain('axis_stretch_horizontal = 1');
    expect(tscn).toContain('axis_stretch_vertical = 2');
    expect(tscn).toContain('custom_minimum_size = Vector2(320, 96)');
  });
});

describe('name escaping', () => {
  it('builds PascalCase node names and guards leading digits', () => {
    expect(toNodeName('panel_mine', 'Preview')).toBe('PanelMinePreview');
    expect(toNodeName('16-panel')).toBe('N16Panel');
  });

  it('escapes quotes and backslashes in resource literals', () => {
    expect(godotStringLiteral('a"b\\c')).toBe('"a\\"b\\\\c"');
  });
});

describe('export bundle', () => {
  it('produces exactly the five artifacts under the destination folder', () => {
    const bundle = bundleFor();
    expect(bundle.files.map((f) => f.path)).toEqual([
      'assets/ui/generated/panel_mine/panel_mine.png',
      'assets/ui/generated/panel_mine/panel_mine.stylebox.tres',
      'assets/ui/generated/panel_mine/panel_mine.preview.tscn',
      'assets/ui/generated/panel_mine/panel_mine.recipe.json',
      'assets/ui/generated/panel_mine/panel_mine.godot.json',
    ]);
  });

  it('never emits a .import file', () => {
    const bundle = bundleFor();
    expect(bundle.files.some((f) => f.path.endsWith('.import'))).toBe(false);
    expect(zipEntryNames(encodeZip(bundle.files)).some((n) => n.endsWith('.import'))).toBe(false);
  });

  it('preserves the transparent PNG output unchanged', () => {
    const recipe = makeDefaultPanelRecipe();
    const expected = encodePng(renderAsset(recipe, 'normal'));
    const bundle = bundleFor();
    const png = bundle.files.find((f) => f.path.endsWith('.png'))!;
    expect(Array.from(png.bytes)).toEqual(Array.from(expected));
    // Carved corner stays fully transparent.
    expect(renderAsset(recipe).data[3]).toBe(0);
  });

  it('is deterministic — identical recipes produce identical resources', () => {
    const a = bundleFor();
    const b = bundleFor();
    for (let i = 0; i < a.files.length; i += 1) {
      expect(Array.from(a.files[i]!.bytes)).toEqual(Array.from(b.files[i]!.bytes));
    }
    expect(Array.from(encodeZip(a.files))).toEqual(Array.from(encodeZip(b.files)));
  });

  it('ZIP mirrors the configured destination path after res://', () => {
    const dest = 'res://ui/panels/my_panel/';
    const recipe = makeDefaultPanelRecipe();
    const bundle = buildGodotExportBundle({
      recipe,
      pngBytes: encodePng(renderAsset(recipe, 'normal')),
      destination: dest,
    });
    const names = zipEntryNames(encodeZip(bundle.files));
    expect(names).toContain('ui/panels/my_panel/my_panel.stylebox.tres');
    expect(names).toContain('ui/panels/my_panel/my_panel.png');
    expect(names.every((n) => n.startsWith('ui/panels/my_panel/'))).toBe(true);
  });

  it('rejects an invalid destination', () => {
    const recipe = makeDefaultPanelRecipe();
    expect(() =>
      buildGodotExportBundle({
        recipe,
        pngBytes: encodePng(renderAsset(recipe)),
        destination: 'res://bad/../x/',
      }),
    ).toThrow();
  });
});
