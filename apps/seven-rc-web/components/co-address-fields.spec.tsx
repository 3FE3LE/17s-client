import { EMPTY_CO_ADDRESS_DRAFT, validateCoAddressDraft } from '@17suit/core';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { CoAddressFields } from './co-address-fields';

const noop = () => undefined;

describe('CoAddressFields', () => {
  it('renders the three conventional pieces with labels', () => {
    const html = renderToStaticMarkup(
      <CoAddressFields value={EMPTY_CO_ADDRESS_DRAFT} onChange={noop} errors={{}} />,
    );
    expect(html).toContain('Número de la vía');
    expect(html).toContain('Número # (cruce)');
    expect(html).toContain('Número - (placa)');
    expect(html).not.toContain('Se verá así');
  });

  it('pre-fills a saved address and previews the concatenated text', () => {
    const html = renderToStaticMarkup(
      <CoAddressFields
        value={{
          ...EMPTY_CO_ADDRESS_DRAFT,
          viaTipo: 'carrera',
          viaNumero: '43A',
          cruceNumero: '5',
          placaNumero: '1',
          municipio: 'Medellín',
          departamento: 'Antioquia',
        }}
        onChange={noop}
        errors={{}}
      />,
    );
    expect(html).toContain('value="43A"');
    expect(html).toContain('Carrera 43A # 5-1, Medellín, Antioquia');
  });

  it('shows an inline alert next to each invalid field', () => {
    const draft = { ...EMPTY_CO_ADDRESS_DRAFT, viaNumero: 'setenta' };
    const html = renderToStaticMarkup(
      <CoAddressFields value={draft} onChange={noop} errors={validateCoAddressDraft(draft)} />,
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain('Usa un formato como 72, 72A o 72 Bis Sur.');
    expect(html).toContain('Escribe el municipio.');
  });
});
