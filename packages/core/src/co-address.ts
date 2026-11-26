import { z } from 'zod';

/**
 * Colombian urban address in three conventional components:
 * `<via tipo> <via número> # <cruce>-<placa>`. Mirrors the server
 * (`domain/co-address.ts`); the server derives the stored display string, this
 * module drives the form: pre-filled fields, per-field validation and preview.
 */
export const VIA_TIPOS = [
  'calle',
  'carrera',
  'avenida',
  'avenida_calle',
  'avenida_carrera',
  'diagonal',
  'transversal',
  'circular',
  'autopista',
] as const;

export type ViaTipo = (typeof VIA_TIPOS)[number];

export const VIA_TIPO_LABEL: Record<ViaTipo, string> = {
  calle: 'Calle',
  carrera: 'Carrera',
  avenida: 'Avenida',
  avenida_calle: 'Avenida Calle',
  avenida_carrera: 'Avenida Carrera',
  diagonal: 'Diagonal',
  transversal: 'Transversal',
  circular: 'Circular',
  autopista: 'Autopista',
};

export interface CoAddress {
  viaTipo: ViaTipo;
  viaNumero: string;
  cruceNumero: string;
  placaNumero: string;
  complemento?: string;
  barrio?: string;
  municipio: string;
  departamento: string;
}

/** Form state: every field is text, `viaTipo` may still be unset. */
export interface CoAddressDraft {
  viaTipo: ViaTipo | '';
  viaNumero: string;
  cruceNumero: string;
  placaNumero: string;
  complemento: string;
  barrio: string;
  municipio: string;
  departamento: string;
}

export type CoAddressField = keyof CoAddressDraft;

/** Stable keys the UI maps to its catalog; no user-facing text lives here. */
export type CoAddressErrorKey =
  | 'required'
  | 'viaNumero'
  | 'cruceNumero'
  | 'placaNumero'
  | 'tooShort'
  | 'tooLong';

export const VIA_NUMERO_PATTERN =
  /^\d{1,3}[A-Za-z]?(?: [Bb]is)?(?: (?:[Nn]orte|[Ss]ur|[Ee]ste|[Oo]este))?$/;
export const CRUCE_NUMERO_PATTERN = /^\d{1,3}[A-Za-z]?(?: [Bb]is)?$/;
export const PLACA_NUMERO_PATTERN = /^\d{1,3}$/;

export const EMPTY_CO_ADDRESS_DRAFT: CoAddressDraft = {
  viaTipo: '',
  viaNumero: '',
  cruceNumero: '',
  placaNumero: '',
  complemento: '',
  barrio: '',
  municipio: '',
  departamento: '',
};

function clean(value: string | null | undefined): string {
  return (value ?? '').trim().replace(/\s+/g, ' ');
}

/** Draft pre-filled from a saved address; `null` (legacy free text) gives the empty draft. */
export function draftFromCoAddress(address: CoAddress | null | undefined): CoAddressDraft {
  if (!address) return { ...EMPTY_CO_ADDRESS_DRAFT };
  return {
    viaTipo: address.viaTipo,
    viaNumero: address.viaNumero,
    cruceNumero: address.cruceNumero,
    placaNumero: address.placaNumero,
    complemento: address.complemento ?? '',
    barrio: address.barrio ?? '',
    municipio: address.municipio,
    departamento: address.departamento,
  };
}

/** True when the owner typed nothing: the address is optional, so this is valid. */
export function isCoAddressDraftEmpty(draft: CoAddressDraft): boolean {
  return (Object.values(draft) as string[]).every((value) => clean(value) === '');
}

export function validateCoAddressDraft(
  draft: CoAddressDraft,
): Partial<Record<CoAddressField, CoAddressErrorKey>> {
  if (isCoAddressDraftEmpty(draft)) return {};
  const errors: Partial<Record<CoAddressField, CoAddressErrorKey>> = {};
  if (!draft.viaTipo) errors.viaTipo = 'required';

  const numeric: [CoAddressField, RegExp, CoAddressErrorKey][] = [
    ['viaNumero', VIA_NUMERO_PATTERN, 'viaNumero'],
    ['cruceNumero', CRUCE_NUMERO_PATTERN, 'cruceNumero'],
    ['placaNumero', PLACA_NUMERO_PATTERN, 'placaNumero'],
  ];
  for (const [field, pattern, key] of numeric) {
    const value = clean(draft[field]);
    if (!value) errors[field] = 'required';
    else if (!pattern.test(value)) errors[field] = key;
  }

  for (const field of ['municipio', 'departamento'] as const) {
    const value = clean(draft[field]);
    if (!value) errors[field] = 'required';
    else if (value.length < 2) errors[field] = 'tooShort';
    else if (value.length > 80) errors[field] = 'tooLong';
  }
  for (const field of ['complemento', 'barrio'] as const) {
    if (clean(draft[field]).length > 80) errors[field] = 'tooLong';
  }
  return errors;
}

/**
 * zod view of the draft for react-hook-form. Rules stay in `validateCoAddressDraft`;
 * each issue carries the stable `CoAddressErrorKey` as its message.
 */
export const coAddressDraftSchema = z
  .object({
    viaTipo: z.union([z.enum(VIA_TIPOS), z.literal('')]),
    viaNumero: z.string(),
    cruceNumero: z.string(),
    placaNumero: z.string(),
    complemento: z.string(),
    barrio: z.string(),
    municipio: z.string(),
    departamento: z.string(),
  })
  .superRefine((draft, ctx) => {
    for (const [field, key] of Object.entries(validateCoAddressDraft(draft))) {
      ctx.addIssue({ code: 'custom', path: [field], message: key });
    }
  });

/** Valid draft to the API shape; `undefined` when empty or invalid. */
export function coAddressFromDraft(draft: CoAddressDraft): CoAddress | undefined {
  if (isCoAddressDraftEmpty(draft) || Object.keys(validateCoAddressDraft(draft)).length > 0) {
    return undefined;
  }
  const complemento = clean(draft.complemento);
  const barrio = clean(draft.barrio);
  return {
    viaTipo: draft.viaTipo as ViaTipo,
    viaNumero: clean(draft.viaNumero),
    cruceNumero: clean(draft.cruceNumero),
    placaNumero: clean(draft.placaNumero),
    ...(complemento ? { complemento } : {}),
    ...(barrio ? { barrio } : {}),
    municipio: clean(draft.municipio),
    departamento: clean(draft.departamento),
  };
}

/** `Calle 72 Bis Sur # 10-25, Local 2, Chapinero, Bogotá, Cundinamarca`. */
export function formatCoAddress(address: CoAddress): string {
  const street = `${VIA_TIPO_LABEL[address.viaTipo]} ${clean(address.viaNumero)} # ${clean(
    address.cruceNumero,
  )}-${clean(address.placaNumero)}`;
  return [
    street,
    clean(address.complemento),
    clean(address.barrio),
    clean(address.municipio),
    clean(address.departamento),
  ]
    .filter((piece) => piece.length > 0)
    .join(', ');
}

/** Narrow the untyped `addressParts` JSON from the API; legacy venues give `null`. */
export function parseCoAddress(value: unknown): CoAddress | null {
  if (!value || typeof value !== 'object') return null;
  const draft = draftFromCoAddress(value as CoAddress);
  const candidate = coAddressFromDraft(draft);
  return candidate ?? null;
}
