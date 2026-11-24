import type { IntegrationStatus } from '@17suit/module-seven-reservations-club/client';

/** Lists integrations that are not live so owners know what is manual or simulated. */
export function IntegrationNotice({ items }: { items: readonly IntegrationStatus[] }) {
  const pending = items.filter((item) => item.mode !== 'live');
  if (pending.length === 0) return null;

  return (
    <aside
      aria-labelledby="integraciones-title"
      className="grid gap-xs rounded-md border border-dashed p-md"
    >
      <h2 id="integraciones-title" className="m-0 text-sm font-semibold">
        Pendiente de integración
      </h2>
      <ul className="m-0 grid list-none gap-xs p-0 text-sm leading-[18px] text-muted">
        {pending.map((item) => (
          <li key={item.key}>
            <strong>{item.label}</strong> ({item.mode === 'dummy' ? 'simulado' : 'manual'}):{' '}
            {item.note}
          </li>
        ))}
      </ul>
    </aside>
  );
}
