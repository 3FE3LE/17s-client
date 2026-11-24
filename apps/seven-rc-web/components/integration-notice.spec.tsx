import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { IntegrationNotice } from './integration-notice';

describe('IntegrationNotice', () => {
  it('flags non-live integrations as pending', () => {
    const html = renderToStaticMarkup(
      <IntegrationNotice
        items={[
          { key: 'payments', label: 'Pagos en línea', mode: 'manual', note: 'A mano.' },
          { key: 'owner_notifications', label: 'Aviso', mode: 'dummy', note: 'Sin correo.' },
          { key: 'x', label: 'Real', mode: 'live', note: 'ok' },
        ]}
      />,
    );
    expect(html).toContain('Pendiente de integración');
    expect(html).toContain('Pagos en línea');
    expect(html).toContain('simulado');
    expect(html).not.toContain('Real');
  });

  it('renders nothing when everything is live', () => {
    const html = renderToStaticMarkup(
      <IntegrationNotice items={[{ key: 'x', label: 'Real', mode: 'live', note: 'ok' }]} />,
    );
    expect(html).toBe('');
  });
});
