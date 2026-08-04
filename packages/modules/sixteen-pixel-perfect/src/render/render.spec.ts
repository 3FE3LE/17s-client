import { describe, expect, it } from 'vitest';
import { makeDefaultPanelRecipe, MVP_STATES } from '../domain/presets';
import { computeNineSlice } from '../export/godot';
import { encodePng } from '../export/png';
import { parseRecipe, serializeRecipe } from '../export/recipe-io';
import { renderAsset } from './render';

describe('deterministic rendering', () => {
  it('same recipe + seed ⇒ byte-identical pixel buffer', () => {
    const recipe = makeDefaultPanelRecipe();
    const a = renderAsset(recipe, 'normal');
    const b = renderAsset(recipe, 'normal');
    expect(Array.from(a.data)).toEqual(Array.from(b.data));
  });

  it('same recipe ⇒ byte-identical PNG bytes', () => {
    const recipe = makeDefaultPanelRecipe();
    expect(Array.from(encodePng(renderAsset(recipe)))).toEqual(
      Array.from(encodePng(renderAsset(recipe))),
    );
  });

  it('reloading an exported recipe reproduces the exact same asset', () => {
    const recipe = makeDefaultPanelRecipe();
    const json = serializeRecipe(recipe);
    const reloaded = parseRecipe(json);
    // Re-serialization is stable (round-trips identically).
    expect(serializeRecipe(reloaded)).toEqual(json);
    // Rendered output is identical across every MVP state.
    for (const state of MVP_STATES) {
      expect(Array.from(encodePng(renderAsset(reloaded, state)))).toEqual(
        Array.from(encodePng(renderAsset(recipe, state))),
      );
    }
  });

  it('states diverge (normal ≠ hover ≠ pressed)', () => {
    const recipe = makeDefaultPanelRecipe();
    const normal = Array.from(renderAsset(recipe, 'normal').data);
    const hover = Array.from(renderAsset(recipe, 'hover').data);
    const pressed = Array.from(renderAsset(recipe, 'pressed').data);
    expect(hover).not.toEqual(normal);
    expect(pressed).not.toEqual(normal);
  });

  it('output has the recipe dimensions and integer 9-slice margins', () => {
    const recipe = makeDefaultPanelRecipe();
    const buffer = renderAsset(recipe);
    expect(buffer.width).toBe(recipe.size.width);
    expect(buffer.height).toBe(recipe.size.height);
    const slice = computeNineSlice(recipe);
    for (const m of [slice.left, slice.top, slice.right, slice.bottom]) {
      expect(Number.isInteger(m)).toBe(true);
      expect(m).toBeGreaterThanOrEqual(1);
    }
  });

  it('bevel corners are carved to transparent at the extreme corner', () => {
    const recipe = makeDefaultPanelRecipe();
    const buffer = renderAsset(recipe);
    // Top-left pixel (0,0) is inside the bevel cut ⇒ transparent alpha.
    expect(buffer.data[3]).toBe(0);
  });

  it('produces a valid PNG signature', () => {
    const png = encodePng(renderAsset(makeDefaultPanelRecipe()));
    expect(Array.from(png.slice(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  });
});
