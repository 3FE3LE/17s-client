import type {
  AssetRecipe,
  BorderLayer,
  CornerDefinition,
  FillPattern,
  IconTreatment,
  LineageThemeId,
  OrnamentationPreset,
  PaddingDefinition,
  Palette,
  PresetRelationship,
  Rgba,
} from './recipe';
import { AssetRecipeSchema, LineageThemeIdSchema, RECIPE_VERSION } from './recipe';

export const SEMANTIC_COLOR_TOKEN_IDS = [
  'background_deep',
  'surface_base',
  'surface_raised',
  'surface_inset',
  'border_dark',
  'border_mid',
  'border_light',
  'accent_primary',
  'accent_secondary',
  'accent_soft',
  'text_primary',
  'text_secondary',
  'text_muted',
  'success',
  'warning',
  'danger',
  'information',
  'selection',
  'focus',
  'disabled',
] as const;

export type SemanticColorTokenId = (typeof SEMANTIC_COLOR_TOKEN_IDS)[number];
export type SemanticPalette = Record<SemanticColorTokenId, string>;

export const LINEAGE_COMPONENT_IDS = [
  'panel',
  'panel_inset',
  'button',
  'button_primary',
  'button_secondary',
  'tooltip',
  'modal',
  'status_bar',
  'sidebar',
  'tab',
  'resource_chip',
  'progress_bar',
  'portrait_frame',
  'icon_container',
  'selection_frame',
  'divider',
] as const;

export type LineageComponentId = (typeof LINEAGE_COMPONENT_IDS)[number];

export interface InteractionStyle {
  normal: ComponentStateRecipe;
  hover: ComponentStateRecipe;
  pressed: ComponentStateRecipe;
  selected: ComponentStateRecipe;
  focused: ComponentStateRecipe;
  disabled: ComponentStateRecipe;
}

export interface ComponentStateRecipe {
  borderTokenId: SemanticColorTokenId;
  fillTokenIds: readonly SemanticColorTokenId[];
  shadowTokenId?: SemanticColorTokenId;
}

export interface ComponentPresetRecipe {
  id: LineageComponentId;
  displayName: string;
  size: { width: number; height: number };
  border: { layers: readonly BorderLayer[] };
  corner: CornerDefinition;
  fill: FillPattern;
  background: 'transparent' | { tokenId: SemanticColorTokenId };
  shadow?: { dx: number; dy: number; tokenId: SemanticColorTokenId };
  contentPadding: PaddingDefinition;
}

export type ComponentPresetMap = Record<LineageComponentId, ComponentPresetRecipe>;

export interface LineageThemePreset {
  id: LineageThemeId;
  displayName: string;
  description: string;
  version: number;
  palette: SemanticPalette;
  ornamentation: OrnamentationPreset;
  componentPresets: ComponentPresetMap;
  iconTreatment: IconTreatment;
  interactionStyle: InteractionStyle;
  architectureTags: readonly string[];
}

const BASE_COMPONENTS: readonly {
  id: LineageComponentId;
  displayName: string;
  size: { width: number; height: number };
  fillTokens: readonly SemanticColorTokenId[];
  borderTokens: readonly SemanticColorTokenId[];
  background: 'transparent' | { tokenId: SemanticColorTokenId };
  padding: PaddingDefinition;
}[] = [
  {
    id: 'panel',
    displayName: 'Panel',
    size: { width: 64, height: 40 },
    fillTokens: ['surface_base', 'surface_raised'],
    borderTokens: ['border_dark', 'border_mid', 'border_light'],
    background: 'transparent',
    padding: { left: 8, top: 7, right: 8, bottom: 7 },
  },
  {
    id: 'panel_inset',
    displayName: 'Panel inset',
    size: { width: 64, height: 36 },
    fillTokens: ['surface_inset', 'surface_base'],
    borderTokens: ['border_dark', 'border_mid'],
    background: 'transparent',
    padding: { left: 7, top: 6, right: 7, bottom: 6 },
  },
  {
    id: 'button',
    displayName: 'Button',
    size: { width: 56, height: 20 },
    fillTokens: ['surface_raised', 'surface_base'],
    borderTokens: ['border_dark', 'border_light'],
    background: 'transparent',
    padding: { left: 7, top: 4, right: 7, bottom: 5 },
  },
  {
    id: 'button_primary',
    displayName: 'Primary button',
    size: { width: 64, height: 22 },
    fillTokens: ['accent_primary', 'accent_soft'],
    borderTokens: ['border_dark', 'accent_secondary', 'border_light'],
    background: 'transparent',
    padding: { left: 8, top: 4, right: 8, bottom: 5 },
  },
  {
    id: 'button_secondary',
    displayName: 'Secondary button',
    size: { width: 64, height: 22 },
    fillTokens: ['accent_secondary', 'surface_raised'],
    borderTokens: ['border_dark', 'border_mid', 'border_light'],
    background: 'transparent',
    padding: { left: 8, top: 4, right: 8, bottom: 5 },
  },
  {
    id: 'tooltip',
    displayName: 'Tooltip',
    size: { width: 72, height: 24 },
    fillTokens: ['surface_inset', 'surface_base'],
    borderTokens: ['border_dark', 'border_light'],
    background: 'transparent',
    padding: { left: 6, top: 5, right: 6, bottom: 5 },
  },
  {
    id: 'modal',
    displayName: 'Modal',
    size: { width: 96, height: 64 },
    fillTokens: ['surface_base', 'surface_raised'],
    borderTokens: ['border_dark', 'border_mid', 'border_light'],
    background: 'transparent',
    padding: { left: 10, top: 9, right: 10, bottom: 9 },
  },
  {
    id: 'status_bar',
    displayName: 'Status bar',
    size: { width: 96, height: 14 },
    fillTokens: ['surface_inset', 'surface_base'],
    borderTokens: ['border_dark', 'border_mid'],
    background: 'transparent',
    padding: { left: 5, top: 3, right: 5, bottom: 3 },
  },
  {
    id: 'sidebar',
    displayName: 'Sidebar segment',
    size: { width: 32, height: 72 },
    fillTokens: ['surface_base', 'surface_inset'],
    borderTokens: ['border_dark', 'border_mid'],
    background: 'transparent',
    padding: { left: 5, top: 7, right: 5, bottom: 7 },
  },
  {
    id: 'tab',
    displayName: 'Tab',
    size: { width: 44, height: 18 },
    fillTokens: ['surface_raised', 'surface_base'],
    borderTokens: ['border_dark', 'border_light'],
    background: 'transparent',
    padding: { left: 6, top: 4, right: 6, bottom: 3 },
  },
  {
    id: 'resource_chip',
    displayName: 'Resource chip',
    size: { width: 44, height: 16 },
    fillTokens: ['accent_secondary', 'surface_base'],
    borderTokens: ['border_dark', 'border_mid'],
    background: 'transparent',
    padding: { left: 5, top: 3, right: 5, bottom: 3 },
  },
  {
    id: 'progress_bar',
    displayName: 'Progress bar',
    size: { width: 76, height: 12 },
    fillTokens: ['surface_inset', 'accent_primary', 'accent_soft'],
    borderTokens: ['border_dark', 'border_mid'],
    background: 'transparent',
    padding: { left: 4, top: 3, right: 4, bottom: 3 },
  },
  {
    id: 'portrait_frame',
    displayName: 'Portrait frame',
    size: { width: 40, height: 48 },
    fillTokens: ['surface_inset', 'surface_base'],
    borderTokens: ['border_dark', 'border_mid', 'border_light'],
    background: 'transparent',
    padding: { left: 6, top: 6, right: 6, bottom: 6 },
  },
  {
    id: 'icon_container',
    displayName: 'Icon container',
    size: { width: 20, height: 20 },
    fillTokens: ['surface_raised', 'surface_base'],
    borderTokens: ['border_dark', 'border_light'],
    background: 'transparent',
    padding: { left: 4, top: 4, right: 4, bottom: 4 },
  },
  {
    id: 'selection_frame',
    displayName: 'Selection frame',
    size: { width: 48, height: 48 },
    fillTokens: ['surface_inset', 'selection'],
    borderTokens: ['border_dark', 'selection', 'focus'],
    background: 'transparent',
    padding: { left: 5, top: 5, right: 5, bottom: 5 },
  },
  {
    id: 'divider',
    displayName: 'Divider',
    size: { width: 72, height: 8 },
    fillTokens: ['border_mid', 'border_light'],
    borderTokens: ['border_dark'],
    background: 'transparent',
    padding: { left: 2, top: 2, right: 2, bottom: 2 },
  },
];

type LineageShape = {
  borderPreset: string;
  cornerPreset: string;
  fillPreset: string;
  shadowPreset: string;
  corner: CornerDefinition;
  edgePattern: BorderLayer['pattern'];
  fillKind: FillPattern['kind'];
  shadow: { dx: number; dy: number; tokenId: SemanticColorTokenId };
  contentPadding: PaddingDefinition;
  selectionEffect: string;
  tags: readonly string[];
};

const LINEAGE_SHAPES: Record<LineageThemeId, LineageShape> = {
  ardhen: {
    borderPreset: 'structural-plates',
    cornerPreset: 'buttress-corners',
    fillPreset: 'stone-mineral',
    shadowPreset: 'upper-left-highlight-deep-lower-right-shadow',
    corner: { motif: 'buttress', size: 6 },
    edgePattern: 'solid',
    fillKind: 'noise',
    shadow: { dx: 2, dy: 2, tokenId: 'border_dark' },
    contentPadding: { left: 9, top: 8, right: 10, bottom: 10 },
    selectionEffect: 'concentric-impact',
    tags: ['structural-plates', 'buttress-corners', 'stone-mineral-fill'],
  },
  eirune: {
    borderPreset: 'branching-borders',
    cornerPreset: 'cellular-corners',
    fillPreset: 'cellular-membrane',
    shadowPreset: 'soft-capillary',
    corner: { motif: 'cellular', size: 6 },
    edgePattern: 'dotted',
    fillKind: 'checker',
    shadow: { dx: 1, dy: 2, tokenId: 'border_dark' },
    contentPadding: { left: 8, top: 8, right: 8, bottom: 9 },
    selectionEffect: 'growth-ring',
    tags: ['branching-borders', 'cellular-corners', 'contained-pulse'],
  },
  kovari: {
    borderPreset: 'modular-plates',
    cornerPreset: 'riveted-corners',
    fillPreset: 'brushed-metal-carbon',
    shadowPreset: 'mechanical-displacement',
    corner: { motif: 'rivet', size: 5 },
    edgePattern: 'dashed',
    fillKind: 'diagonal',
    shadow: { dx: 2, dy: 2, tokenId: 'border_dark' },
    contentPadding: { left: 8, top: 6, right: 9, bottom: 8 },
    selectionEffect: 'sequential-segments',
    tags: ['modular-plates', 'riveted-corners', 'circuit-hover'],
  },
  myrven: {
    borderPreset: 'layered-frames',
    cornerPreset: 'folded-doubled-corners',
    fillPreset: 'textile-theatrical',
    shadowPreset: 'revealed-secondary-layer',
    corner: { motif: 'folded', size: 6 },
    edgePattern: 'solid',
    fillKind: 'checker',
    shadow: { dx: 1, dy: 3, tokenId: 'border_dark' },
    contentPadding: { left: 10, top: 8, right: 9, bottom: 10 },
    selectionEffect: 'opening-frame',
    tags: ['layered-frames', 'folded-corners', 'progressive-information'],
  },
  vaelun: {
    borderPreset: 'route-borders',
    cornerPreset: 'map-fold-compass-corners',
    fillPreset: 'cartographic-topographic',
    shadowPreset: 'directional-wayfinding',
    corner: { motif: 'compass', size: 6 },
    edgePattern: 'dotted',
    fillKind: 'diagonal',
    shadow: { dx: 2, dy: 1, tokenId: 'border_dark' },
    contentPadding: { left: 9, top: 7, right: 8, bottom: 9 },
    selectionEffect: 'path-drawing',
    tags: ['route-borders', 'node-path-details', 'directional-focus'],
  },
  orveth: {
    borderPreset: 'measured-repeated-borders',
    cornerPreset: 'seal-token-reinforced-box-corners',
    fillPreset: 'ledger-textile-fine-wood',
    shadowPreset: 'transaction-value-transition',
    corner: { motif: 'seal', size: 5 },
    edgePattern: 'dashed',
    fillKind: 'checker',
    shadow: { dx: 2, dy: 2, tokenId: 'border_dark' },
    contentPadding: { left: 8, top: 7, right: 8, bottom: 7 },
    selectionEffect: 'symmetrical-ledger',
    tags: ['measured-borders', 'reinforced-box-corners', 'patterned-risk-states'],
  },
  caelith: {
    borderPreset: 'grid-node-borders',
    cornerPreset: 'polygon-constellation-corners',
    fillPreset: 'diagrammatic',
    shadowPreset: 'layered-information',
    corner: { motif: 'constellation', size: 6 },
    edgePattern: 'dotted',
    fillKind: 'diagonal',
    shadow: { dx: 1, dy: 2, tokenId: 'border_dark' },
    contentPadding: { left: 8, top: 8, right: 8, bottom: 8 },
    selectionEffect: 'connected-nodes',
    tags: ['grid-node-borders', 'constellation-corners', 'relationship-hover'],
  },
  theryn: {
    borderPreset: 'pulse-borders',
    cornerPreset: 'overlapping-circle-corners',
    fillPreset: 'rhythmic-ceremonial',
    shadowPreset: 'synchronized-state-transition',
    corner: { motif: 'pulse', size: 6 },
    edgePattern: 'solid',
    fillKind: 'checker',
    shadow: { dx: 1, dy: 2, tokenId: 'border_dark' },
    contentPadding: { left: 8, top: 7, right: 8, bottom: 8 },
    selectionEffect: 'contained-pulse',
    tags: ['pulse-borders', 'overlapping-circle-corners', 'bounded-intensity'],
  },
};

const PALETTES: Record<LineageThemeId, SemanticPalette> = {
  ardhen: {
    background_deep: '#15191A',
    surface_base: '#232829',
    surface_raised: '#353B3B',
    surface_inset: '#1B2021',
    border_dark: '#0C0F10',
    border_mid: '#705E48',
    border_light: '#B89B6B',
    accent_primary: '#C56F42',
    accent_secondary: '#6E8E79',
    accent_soft: '#D6A378',
    text_primary: '#EEE5D5',
    text_secondary: '#C8BDAA',
    text_muted: '#918B80',
    success: '#719A68',
    warning: '#D2A149',
    danger: '#B84D45',
    information: '#668EA1',
    selection: '#D7B06D',
    focus: '#E3C88D',
    disabled: '#595D5B',
  },
  eirune: {
    background_deep: '#10201C',
    surface_base: '#18312B',
    surface_raised: '#275046',
    surface_inset: '#122720',
    border_dark: '#091512',
    border_mid: '#527966',
    border_light: '#9BC4A5',
    accent_primary: '#69C18B',
    accent_secondary: '#A984BE',
    accent_soft: '#A9D6B4',
    text_primary: '#EBF3E9',
    text_secondary: '#C4D5C8',
    text_muted: '#91A89A',
    success: '#78CE87',
    warning: '#D3B360',
    danger: '#B85D66',
    information: '#62A9B2',
    selection: '#9BE4B2',
    focus: '#C0F0CB',
    disabled: '#52665D',
  },
  kovari: {
    background_deep: '#151515',
    surface_base: '#252525',
    surface_raised: '#393837',
    surface_inset: '#1B1B1A',
    border_dark: '#090909',
    border_mid: '#755F3E',
    border_light: '#C69A58',
    accent_primary: '#E1762C',
    accent_secondary: '#4DA2A4',
    accent_soft: '#E9A75E',
    text_primary: '#F0E7D5',
    text_secondary: '#C9BEA9',
    text_muted: '#938B7D',
    success: '#68A06C',
    warning: '#E1A43C',
    danger: '#D05243',
    information: '#4C9BC2',
    selection: '#F08A3D',
    focus: '#F5B16C',
    disabled: '#595958',
  },
  myrven: {
    background_deep: '#13101D',
    surface_base: '#211A30',
    surface_raised: '#342647',
    surface_inset: '#181222',
    border_dark: '#0A0810',
    border_mid: '#69537A',
    border_light: '#B792C9',
    accent_primary: '#9764CD',
    accent_secondary: '#C45C76',
    accent_soft: '#CFA2E1',
    text_primary: '#F2EBF5',
    text_secondary: '#D1C1D8',
    text_muted: '#9C8BA7',
    success: '#70A487',
    warning: '#D0A05A',
    danger: '#C44F60',
    information: '#718FC5',
    selection: '#CE91E6',
    focus: '#E4BAF2',
    disabled: '#554D5C',
  },
  vaelun: {
    background_deep: '#0E1B25',
    surface_base: '#182B38',
    surface_raised: '#274858',
    surface_inset: '#12222C',
    border_dark: '#071016',
    border_mid: '#5D7A87',
    border_light: '#A1C0CA',
    accent_primary: '#48A2C6',
    accent_secondary: '#D18455',
    accent_soft: '#7AC5DC',
    text_primary: '#EBF3F4',
    text_secondary: '#C4D4D8',
    text_muted: '#91A7AD',
    success: '#70AA80',
    warning: '#D6AF58',
    danger: '#C45A54',
    information: '#59A9D4',
    selection: '#75CFEB',
    focus: '#ADE5F5',
    disabled: '#4D626B',
  },
  orveth: {
    background_deep: '#19170F',
    surface_base: '#29271D',
    surface_raised: '#403B29',
    surface_inset: '#201E16',
    border_dark: '#0D0C08',
    border_mid: '#746338',
    border_light: '#C1A55C',
    accent_primary: '#B88A2D',
    accent_secondary: '#4F7959',
    accent_soft: '#D6B45C',
    text_primary: '#F2E8CF',
    text_secondary: '#D0C19C',
    text_muted: '#9D9174',
    success: '#719B65',
    warning: '#D5A43B',
    danger: '#B74E43',
    information: '#668EA6',
    selection: '#D9B657',
    focus: '#E9CC82',
    disabled: '#5B594A',
  },
  caelith: {
    background_deep: '#101528',
    surface_base: '#1A223D',
    surface_raised: '#2A345A',
    surface_inset: '#141B32',
    border_dark: '#080B15',
    border_mid: '#56699D',
    border_light: '#9CAFE5',
    accent_primary: '#6A85E4',
    accent_secondary: '#76C5BC',
    accent_soft: '#9CB0F2',
    text_primary: '#EEF2FF',
    text_secondary: '#CAD2EA',
    text_muted: '#949EBB',
    success: '#69A587',
    warning: '#D2AE5C',
    danger: '#BC5961',
    information: '#6BA9D5',
    selection: '#9DB2FF',
    focus: '#C5D1FF',
    disabled: '#505971',
  },
  theryn: {
    background_deep: '#211218',
    surface_base: '#321C24',
    surface_raised: '#4A2935',
    surface_inset: '#29171E',
    border_dark: '#11090D',
    border_mid: '#784656',
    border_light: '#C0788D',
    accent_primary: '#C64F6A',
    accent_secondary: '#D29748',
    accent_soft: '#E27A94',
    text_primary: '#F6EBEE',
    text_secondary: '#D7BDC5',
    text_muted: '#A78C94',
    success: '#70A278',
    warning: '#D7A548',
    danger: '#D04753',
    information: '#6D91B6',
    selection: '#EC7B98',
    focus: '#F3A7BA',
    disabled: '#624D54',
  },
};

const DESCRIPTIONS: Record<LineageThemeId, string> = {
  ardhen: 'Structural mineral plates with buttress corners and impact selection.',
  eirune: 'Organic branching borders, membrane fills, and slow contained pulse states.',
  kovari: 'Mechanical segmented plates, riveted corners, and circuit-like state details.',
  myrven: 'Layered theatrical frames with textile fills and progressive information reveal.',
  vaelun: 'Cartographic route borders, compass corners, and directional focus cues.',
  orveth: 'Measured ledger borders, reinforced corners, and patterned risk states.',
  caelith: 'Diagrammatic grid borders, constellation corners, and connected-node selection.',
  theryn: 'Rhythmic ceremonial fills, pulse borders, and bounded intensity states.',
};

const DISPLAY_NAMES: Record<LineageThemeId, string> = {
  ardhen: 'Ardhen',
  eirune: 'Eirune',
  kovari: 'Kovari',
  myrven: 'Myrven',
  vaelun: 'Vaelun',
  orveth: 'Orveth',
  caelith: 'Caelith',
  theryn: 'Theryn',
};

function hexToRgba(hex: string): Rgba {
  const match = /^#([0-9A-Fa-f]{6})$/.exec(hex);
  if (!match) throw new Error(`Invalid color: ${hex}`);
  const n = Number.parseInt(match[1]!, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 255];
}

export function semanticPaletteToPalette(id: LineageThemeId, palette: SemanticPalette): Palette {
  return {
    id: `lineage-${id}`,
    name: `${DISPLAY_NAMES[id]} lineage`,
    tokens: SEMANTIC_COLOR_TOKEN_IDS.map((tokenId) => ({
      id: tokenId,
      rgba: hexToRgba(palette[tokenId]),
    })),
  };
}

function ornamentationFor(id: LineageThemeId): OrnamentationPreset {
  const shape = LINEAGE_SHAPES[id];
  return {
    borderPreset: shape.borderPreset,
    cornerPreset: shape.cornerPreset,
    fillPreset: shape.fillPreset,
    shadowPreset: shape.shadowPreset,
    contentPadding: shape.contentPadding,
    nineSliceMargins: shape.contentPadding,
    normalState: 'base-token-resolved',
    hoverState: 'accent-highlight-resolved',
    pressedState: 'two-pixel-contained-displacement',
    selectedState: shape.selectionEffect,
    focusedState: 'visible-focus-ring',
    disabledState: 'muted-alpha-pattern',
    selectionEffect: shape.selectionEffect,
  };
}

function componentPresetsFor(id: LineageThemeId): ComponentPresetMap {
  const shape = LINEAGE_SHAPES[id];
  const map = {} as ComponentPresetMap;
  for (const base of BASE_COMPONENTS) {
    const borderTokens = base.borderTokens.length > 2 ? base.borderTokens : [...base.borderTokens];
    const preset = {
      id: base.id,
      displayName: base.displayName,
      size: base.size,
      border: {
        layers: borderTokens.map((tokenId, index) => ({
          thickness: index === 0 ? 1 : 2,
          tokenId,
          pattern: index === 0 ? 'solid' : shape.edgePattern,
        })),
      },
      corner: base.id === 'divider' ? { motif: 'square', size: 0 } : shape.corner,
      fill: {
        kind: base.id === 'divider' ? 'solid' : shape.fillKind,
        tokenIds: [...base.fillTokens],
      },
      background: base.background,
      contentPadding: base.padding,
      ...(base.id === 'divider' ? {} : { shadow: shape.shadow }),
    } satisfies ComponentPresetRecipe;
    map[base.id] = preset;
  }
  return map;
}

function interactionStyleFor(id: LineageThemeId): InteractionStyle {
  const shape = LINEAGE_SHAPES[id];
  return {
    normal: { borderTokenId: 'border_mid', fillTokenIds: ['surface_base', 'surface_raised'] },
    hover: { borderTokenId: 'border_light', fillTokenIds: ['surface_raised', 'accent_soft'] },
    pressed: { borderTokenId: 'border_dark', fillTokenIds: ['surface_inset', 'surface_base'] },
    selected: { borderTokenId: 'selection', fillTokenIds: ['selection', 'accent_soft'] },
    focused: { borderTokenId: 'focus', fillTokenIds: ['surface_raised', 'focus'] },
    disabled: {
      borderTokenId: 'disabled',
      fillTokenIds: ['surface_inset', 'disabled'],
      shadowTokenId: shape.shadow.tokenId,
    },
  };
}

function iconTreatmentFor(): IconTreatment {
  return {
    colorTokenId: 'text_primary',
    backgroundTokenId: 'surface_inset',
    borderTokenId: 'border_mid',
    selectedTokenId: 'selection',
    disabledTokenId: 'disabled',
  };
}

function buildLineagePreset(id: LineageThemeId): LineageThemePreset {
  return {
    id,
    displayName: DISPLAY_NAMES[id],
    description: DESCRIPTIONS[id],
    version: 1,
    palette: PALETTES[id],
    ornamentation: ornamentationFor(id),
    componentPresets: componentPresetsFor(id),
    iconTreatment: iconTreatmentFor(),
    interactionStyle: interactionStyleFor(id),
    architectureTags: LINEAGE_SHAPES[id].tags,
  };
}

export const LINEAGE_THEME_PRESETS: readonly LineageThemePreset[] =
  LineageThemeIdSchema.options.map(buildLineagePreset);

export function getLineageThemePreset(id: string): LineageThemePreset | undefined {
  return LINEAGE_THEME_PRESETS.find((preset) => preset.id === id);
}

export function assertValidLineageThemePreset(preset: LineageThemePreset): LineageThemePreset {
  for (const tokenId of SEMANTIC_COLOR_TOKEN_IDS) {
    if (!preset.palette[tokenId]) {
      throw new Error(`Lineage theme ${preset.id} missing semantic token ${tokenId}`);
    }
  }
  for (const componentId of LINEAGE_COMPONENT_IDS) {
    if (!preset.componentPresets[componentId]) {
      throw new Error(`Lineage theme ${preset.id} missing component preset ${componentId}`);
    }
  }
  return preset;
}

export function makeLineageComponentRecipe(input: {
  lineageThemeId: LineageThemeId;
  componentId?: LineageComponentId;
  width?: number;
  height?: number;
  seed?: number;
  relationship?: PresetRelationship;
  manualOverrides?: AssetRecipe['manual_overrides'];
}): AssetRecipe {
  const preset = assertValidLineageThemePreset(
    getLineageThemePreset(input.lineageThemeId) ?? buildLineagePreset(input.lineageThemeId),
  );
  const component = preset.componentPresets[input.componentId ?? 'panel'];
  const palette = semanticPaletteToPalette(preset.id, preset.palette);
  return AssetRecipeSchema.parse({
    version: RECIPE_VERSION,
    preset: component.id,
    seed: input.seed ?? 1,
    size: {
      width: input.width ?? component.size.width,
      height: input.height ?? component.size.height,
    },
    lineage_theme_id: preset.id,
    lineage_theme_version: preset.version,
    preset_relationship: input.relationship ?? 'linked',
    resolved_palette: palette,
    resolved_ornamentation: preset.ornamentation,
    manual_overrides: input.manualOverrides ?? [],
    icon_treatment: preset.iconTreatment,
    palette,
    border: { layers: component.border.layers },
    corner: component.corner,
    fill: component.fill,
    background: component.background,
    shadow: component.shadow,
    contentPadding: component.contentPadding,
  });
}

export function applyLineageThemePreset(
  recipe: AssetRecipe,
  lineageThemeId: LineageThemeId,
  componentId: LineageComponentId = recipe.preset as LineageComponentId,
): AssetRecipe {
  const safeComponent = LINEAGE_COMPONENT_IDS.includes(componentId) ? componentId : 'panel';
  return makeLineageComponentRecipe({
    lineageThemeId,
    componentId: safeComponent,
    width: recipe.size.width,
    height: recipe.size.height,
    seed: recipe.seed,
  });
}

export function resetRecipeToLineagePreset(recipe: AssetRecipe): AssetRecipe {
  if (!recipe.lineage_theme_id) return recipe;
  return makeLineageComponentRecipe({
    lineageThemeId: recipe.lineage_theme_id,
    componentId: LINEAGE_COMPONENT_IDS.includes(recipe.preset as LineageComponentId)
      ? (recipe.preset as LineageComponentId)
      : 'panel',
    width: recipe.size.width,
    height: recipe.size.height,
    seed: recipe.seed,
  });
}

export function detachRecipeFromLineagePreset(recipe: AssetRecipe): AssetRecipe {
  if (!recipe.lineage_theme_id) return recipe;
  return { ...recipe, preset_relationship: 'detached' };
}

export function markRecipeManualOverride(recipe: AssetRecipe, path: string): AssetRecipe {
  if (!recipe.lineage_theme_id || recipe.preset_relationship === 'detached') return recipe;
  const existing = recipe.manual_overrides ?? [];
  const manual_overrides = existing.some((override) => override.path === path)
    ? existing
    : [...existing, { path }];
  return { ...recipe, preset_relationship: 'modified', manual_overrides };
}

export function resolvePresetRelationship(recipe: AssetRecipe): PresetRelationship | undefined {
  return recipe.preset_relationship;
}

export function validateLineageThemePresets(): readonly LineageThemePreset[] {
  return LINEAGE_THEME_PRESETS.map(assertValidLineageThemePreset);
}
