# Lineage Themes

Lineage themes are domain presets for World of Goses UI assets. A lineage applies a complete, deterministic recipe configuration: semantic palette, border layers, corner motif, fill pattern, shadow, content padding, 9-slice margins, state treatments, component defaults, icon treatment, and selection effect.

Themes live in `src/domain/lineage-themes.ts`. UI components select a lineage and receive a fully resolved `AssetRecipe`; renderers and exporters do not branch on lineage names.

## Semantic Tokens

Every lineage defines the same semantic color token set:

`background_deep`, `surface_base`, `surface_raised`, `surface_inset`, `border_dark`, `border_mid`, `border_light`, `accent_primary`, `accent_secondary`, `accent_soft`, `text_primary`, `text_secondary`, `text_muted`, `success`, `warning`, `danger`, `information`, `selection`, `focus`, `disabled`.

Components reference token IDs, not raw hex. Raw hex values are confined to lineage theme definitions and palette conversion helpers.

## Corner Motifs

Each lineage owns a distinctive `corner.motif`; corners are treated as high-identity asset features:

- Ardhen: `buttress`
- Eirune: `cellular`
- Kovari: `rivet`
- Myrven: `folded`
- Vaelun: `compass`
- Orveth: `seal`
- Caelith: `constellation`
- Theryn: `pulse`

The renderer reads only `corner.motif` and resolved color tokens. It does not branch on lineage IDs.

## Applying A Preset

Use `applyLineageThemePreset(recipe, lineageThemeId)` to apply another lineage to the current asset. It preserves size and seed, then replaces theme-controlled recipe values from the lineage's component preset.

Use `makeLineageComponentRecipe({ lineageThemeId, componentId })` for a fresh component default. The component catalog currently includes panel, inset panel, buttons, tooltip, modal, status bar, sidebar, tab, resource chip, progress bar, portrait frame, icon container, selection frame, and divider.

## Customizing After Apply

Manual edits update normal recipe fields (`palette`, `border`, `corner`, `fill`, `shadow`, `contentPadding`, etc.). Mark edits with `markRecipeManualOverride(recipe, path)` so the persisted recipe records which values were changed.

Relationship states:

- `linked`: recipe matches the lineage preset.
- `modified`: lineage preset was applied, then one or more values changed.
- `detached`: recipe keeps resolved values but no longer tracks reset/modified behavior.

Explicit actions:

- Reset to lineage preset: `resetRecipeToLineagePreset(recipe)`.
- Apply another lineage preset: `applyLineageThemePreset(recipe, nextId)`.
- Detach from preset: `detachRecipeFromLineagePreset(recipe)`.

## Persistence

Serialized recipes include:

- `lineage_theme_id`
- `lineage_theme_version`
- `preset_relationship`
- `resolved_palette`
- `resolved_ornamentation`
- `manual_overrides`

These fields are optional for backward compatibility. Old recipes without lineage metadata still parse and render.

## Godot Mapping

Godot export receives a fully resolved `AssetRecipe`. `computeNineSlice` uses border and corner values already present on the recipe. `.stylebox.tres`, `.preview.tscn`, recipe JSON, and interchange JSON use resolved values; no lineage-specific serializer logic exists.

Content padding maps to `content_margin_*` in `StyleBoxTexture` when provided.

## Adding A Future Lineage

1. Add the lineage ID to `LineageThemeIdSchema`.
2. Add a complete semantic palette in `PALETTES`.
3. Add shape data in `LINEAGE_SHAPES`.
4. Add or reuse a distinctive `CornerMotif`.
5. Add display name and description.
6. Run lineage tests to validate tokens, component defaults, deterministic render, serialization, and Godot export.
