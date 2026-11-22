/*
 * Illustrated UI mocks for product pages, drawn as code. All names, amounts
 * and places are fictional sample data. The drawing is aria-hidden; the
 * figcaption carries the one-line description for assistive tech and sighted
 * readers alike.
 */

import type { ReactNode } from 'react';

const frameClass =
  'overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface shadow-[0_18px_40px_rgb(0_23_31/0.1)] dark:shadow-[0_10px_24px_rgb(0_0_0/0.3)]';

const chromeClass =
  'flex items-center justify-between gap-[var(--spacing-sm)] border-b border-line px-[var(--spacing-md)] py-[var(--spacing-sm)]';

function MockFigure({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="m-0 w-full min-w-0">
      <div aria-hidden="true" className={`${frameClass} select-none`}>
        {children}
      </div>
      <figcaption className="mt-[var(--spacing-xs)] text-sm leading-[1.4] text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}

const movements = [
  {
    sender: 'Banco Andino',
    detail: 'Compra en Café Lumbre',
    amount: '−$245.00',
    category: 'Comida',
  },
  {
    sender: 'PagaFácil',
    detail: 'Suscripción Musicbox',
    amount: '−$129.00',
    category: 'Suscripciones',
  },
  {
    sender: 'Banco Andino',
    detail: 'Transferencia recibida',
    amount: '+$3,200.00',
    category: 'Ingresos',
  },
] as const;

export function FifteenReviewMock() {
  return (
    <MockFigure caption="Vista de ejemplo con datos ficticios.">
      <div className={chromeClass}>
        <span className="font-arvo text-md font-bold leading-[1.3] text-text">Por revisar</span>
        <span className="rounded-full bg-[color-mix(in_oklab,var(--color-product)_14%,transparent)] px-2.5 py-0.5 text-sm font-bold leading-[18px] text-product tabular-nums">
          3 movimientos
        </span>
      </div>
      <ul className="m-0 grid list-none p-0">
        {movements.map((movement, index) => (
          <li
            key={movement.detail}
            className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-[var(--spacing-md)] gap-y-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] ${
              index > 0 ? 'border-t border-line' : ''
            } ${index === 0 ? 'bg-[color-mix(in_oklab,var(--color-product)_6%,transparent)]' : ''}`}
          >
            <span className="min-w-0">
              <span className="block truncate text-sm leading-[18px] text-muted">
                {movement.sender}
              </span>
              <span className="block truncate font-bold leading-[1.35] text-text">
                {movement.detail}
              </span>
            </span>
            <span className="text-right font-bold leading-[1.35] text-text tabular-nums">
              {movement.amount}
            </span>
            <span className="w-fit rounded-full border border-line px-2 py-px text-sm leading-[18px] text-muted">
              {movement.category}
            </span>
            <span
              className={`justify-self-end rounded-full px-3 py-1 text-sm font-bold leading-[18px] ${
                index === 0 ? 'bg-product text-on-product' : 'border border-product text-product'
              }`}
            >
              Confirmar
            </span>
          </li>
        ))}
      </ul>
    </MockFigure>
  );
}

const slots = [
  { time: '08:00', state: 'free' },
  { time: '09:00', state: 'taken' },
  { time: '10:00', state: 'selected' },
  { time: '11:00', state: 'free' },
  { time: '17:00', state: 'taken' },
  { time: '18:00', state: 'free' },
  { time: '19:00', state: 'free' },
  { time: '20:00', state: 'taken' },
] as const;

const slotTone: Record<(typeof slots)[number]['state'], string> = {
  free: 'border-line text-text',
  taken:
    'border-transparent bg-[color-mix(in_oklab,var(--color-text)_6%,transparent)] text-muted line-through',
  selected: 'border-product bg-product text-on-product',
};

const days = [
  { label: 'Vie', date: '13' },
  { label: 'Sáb', date: '14', active: true },
  { label: 'Dom', date: '15' },
] as const;

export function SevenSlotMock() {
  return (
    <MockFigure caption="Vista de ejemplo con datos ficticios.">
      <div className={chromeClass}>
        <span className="min-w-0">
          <span className="block truncate text-sm leading-[18px] text-muted">
            Complejo Los Álamos
          </span>
          <span className="block font-arvo text-md font-bold leading-[1.3] text-text">
            Cancha 2 · Fútbol 7
          </span>
        </span>
        <span className="shrink-0 text-sm leading-[18px] text-muted">Turnos de 1 h</span>
      </div>
      <div className="grid gap-[var(--spacing-md)] p-[var(--spacing-md)]">
        <div className="flex gap-[var(--spacing-xs)]">
          {days.map((day) => (
            <span
              key={day.date}
              className={`grid min-w-14 justify-items-center rounded-[var(--radius-lg)] border px-3 py-1.5 leading-[1.2] ${
                'active' in day && day.active
                  ? 'border-product text-product'
                  : 'border-line text-muted'
              }`}
            >
              <span className="text-sm">{day.label}</span>
              <span className="font-arvo text-lg font-bold tabular-nums">{day.date}</span>
            </span>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-[var(--spacing-xs)]">
          {slots.map((slot) => (
            <span
              key={slot.time}
              className={`rounded-full border py-1.5 text-center text-sm font-bold leading-[18px] tabular-nums ${slotTone[slot.state]}`}
            >
              {slot.time}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between gap-[var(--spacing-sm)] border-t border-line pt-[var(--spacing-sm)]">
          <span className="text-sm leading-[18px] text-muted">Sábado 14 · 10:00</span>
          <span className="rounded-full bg-product px-4 py-1.5 text-sm font-bold leading-[18px] text-on-product">
            Enviar reserva
          </span>
        </div>
      </div>
    </MockFigure>
  );
}
