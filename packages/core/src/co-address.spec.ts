import { describe, expect, it } from 'vitest';

import {
  EMPTY_CO_ADDRESS_DRAFT,
  coAddressFromDraft,
  draftFromCoAddress,
  formatCoAddress,
  parseCoAddress,
  validateCoAddressDraft,
  type CoAddressDraft,
} from './co-address';

const valid: CoAddressDraft = {
  viaTipo: 'calle',
  viaNumero: '72 Bis Sur',
  cruceNumero: '10',
  placaNumero: '25',
  complemento: 'Local 2',
  barrio: 'Chapinero',
  municipio: 'Bogotá',
  departamento: 'Cundinamarca',
};

describe('co-address', () => {
  it('formats exactly like the server', () => {
    const address = coAddressFromDraft(valid);
    expect(address && formatCoAddress(address)).toBe(
      'Calle 72 Bis Sur # 10-25, Local 2, Chapinero, Bogotá, Cundinamarca',
    );
  });

  it('treats an empty draft as valid and produces no address', () => {
    expect(validateCoAddressDraft(EMPTY_CO_ADDRESS_DRAFT)).toEqual({});
    expect(coAddressFromDraft(EMPTY_CO_ADDRESS_DRAFT)).toBeUndefined();
  });

  it('reports each broken field once started', () => {
    expect(
      validateCoAddressDraft({
        ...EMPTY_CO_ADDRESS_DRAFT,
        viaNumero: 'setenta',
        placaNumero: '2A',
        municipio: 'B',
      }),
    ).toEqual({
      viaTipo: 'required',
      viaNumero: 'viaNumero',
      cruceNumero: 'required',
      placaNumero: 'placaNumero',
      municipio: 'tooShort',
      departamento: 'required',
    });
  });

  it('round-trips a saved address into the edit form pre-filled', () => {
    const saved = coAddressFromDraft(valid);
    expect(draftFromCoAddress(saved)).toEqual(valid);
    expect(parseCoAddress(saved)).toEqual(saved);
  });

  it('falls back to the empty form for legacy free-text venues', () => {
    expect(parseCoAddress(null)).toBeNull();
    expect(parseCoAddress({ viaTipo: 'plaza' })).toBeNull();
    expect(draftFromCoAddress(null)).toEqual(EMPTY_CO_ADDRESS_DRAFT);
  });
});
