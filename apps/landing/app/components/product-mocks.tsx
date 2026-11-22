/*
 * Illustrated UI mocks for the home hero and product pages, drawn as code. All
 * names, amounts and places are fictional sample data. The drawing is
 * aria-hidden; the figcaption carries the one-line description for assistive
 * tech and sighted readers alike. `compact` trims rows for the home hero.
 */

import type { ReactNode } from 'react';

const frameClass =
  'overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface shadow-[0_18px_40px_rgb(0_23_31/0.1)] dark:shadow-[0_10px_24px_rgb(0_0_0/0.3)]';

const chromeClass =
  'flex items-center justify-between gap-[var(--spacing-sm)] border-b border-line px-[var(--spacing-md)] py-[var(--spacing-sm)]';

const SAMPLE_CAPTION = 'Vista de ejemplo con datos ficticios.';

export interface MockProps {
  /** Fewer rows, for the home hero. */
  compact?: boolean;
  caption?: string;
  className?: string | undefined;
}

function MockFigure({
  caption,
  className = '',
  children,
}: {
  caption: string;
  className?: string | undefined;
  children: ReactNode;
}) {
  return (
    <figure className={`m-0 w-full min-w-0 ${className}`}>
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

export function FifteenReviewMock({
  compact = false,
  caption = SAMPLE_CAPTION,
  className,
}: MockProps = {}) {
  const rows = compact ? movements.slice(0, 2) : movements;
  return (
    <MockFigure caption={caption} className={className}>
      <div className={chromeClass}>
        <span className="font-arvo text-md font-bold leading-[1.3] text-text">Por revisar</span>
        <span className="rounded-full bg-[color-mix(in_oklab,var(--landing-product)_14%,transparent)] px-2.5 py-0.5 text-sm font-bold leading-[18px] text-product tabular-nums">
          {movements.length} movimientos
        </span>
      </div>
      <ul className="m-0 grid list-none p-0">
        {rows.map((movement, index) => (
          <li
            key={movement.detail}
            className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-[var(--spacing-md)] gap-y-[var(--spacing-xs)] px-[var(--spacing-md)] py-[var(--spacing-sm)] ${
              index > 0 ? 'border-t border-line' : ''
            } ${index === 0 ? 'bg-[color-mix(in_oklab,var(--landing-product)_6%,transparent)]' : ''}`}
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

export function SevenSlotMock({
  compact = false,
  caption = SAMPLE_CAPTION,
  className,
}: MockProps = {}) {
  const visibleSlots = compact ? slots.slice(0, 4) : slots;
  return (
    <MockFigure caption={caption} className={className}>
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
          {visibleSlots.map((slot) => (
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
            Reservar
          </span>
        </div>
      </div>
    </MockFigure>
  );
}

/*
 * Concept sketches for products that have not opened yet. Deliberately
 * wireframe-level (dashed strokes, generic labels) so nobody reads them as a
 * finished screen; the chrome says "Idea en desarrollo" and the caption repeats it.
 */

type ConceptKey = 'one' | 'closet' | 'five';

const sketchFrameClass =
  'overflow-hidden rounded-[var(--radius-xl)] border-2 border-dashed border-[color-mix(in_oklab,var(--landing-product)_45%,transparent)] bg-[color-mix(in_oklab,var(--landing-product)_6%,var(--color-surface))]';

const sketchCellClass =
  'rounded-[var(--radius-lg)] border border-dashed border-[color-mix(in_oklab,var(--landing-product)_40%,transparent)] bg-surface';

const tripDays = [
  { day: 'Día 1', items: ['Vuelo de ida', 'Hotel'] },
  { day: 'Día 2', items: ['Museo', 'Cena reservada'] },
  { day: 'Día 3', items: ['Playa', 'Vuelo de regreso'] },
] as const;

function TripSketch() {
  return (
    <div className="grid gap-[var(--spacing-sm)] p-[var(--spacing-md)]">
      {tripDays.map((entry) => (
        <div
          key={entry.day}
          className={`${sketchCellClass} grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-[var(--spacing-sm)] px-[var(--spacing-md)] py-[var(--spacing-sm)]`}
        >
          <span className="font-arvo text-md font-bold leading-[1.2] text-product">
            {entry.day}
          </span>
          <span className="flex flex-wrap gap-[var(--spacing-xs)]">
            {entry.items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-line px-2.5 py-0.5 text-sm leading-[18px] text-text"
              >
                {item}
              </span>
            ))}
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between gap-[var(--spacing-sm)] pt-[var(--spacing-xs)]">
        <span className="text-sm leading-[18px] text-muted">Plan compartido</span>
        <span className="flex -space-x-2">
          {['A', 'L', 'M'].map((initial) => (
            <span
              key={initial}
              className="flex size-8 items-center justify-center rounded-full border-2 border-surface bg-product text-sm font-bold leading-none text-on-product"
            >
              {initial}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

const garments = [
  { name: 'Camisa', inLook: true },
  { name: 'Pantalón', inLook: true },
  { name: 'Chaqueta', inLook: false },
  { name: 'Vestido', inLook: false },
  { name: 'Zapatos', inLook: true },
  { name: 'Bufanda', inLook: false },
] as const;

function ClosetSketch() {
  return (
    <div className="grid gap-[var(--spacing-sm)] p-[var(--spacing-md)]">
      <div className="grid grid-cols-3 gap-[var(--spacing-xs)]">
        {garments.map((garment) => (
          <span
            key={garment.name}
            className={`${sketchCellClass} flex aspect-[4/3] items-end p-[var(--spacing-xs)] text-sm font-bold leading-[18px] ${
              garment.inLook ? 'border-solid border-product text-product' : 'text-muted'
            }`}
          >
            {garment.name}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between gap-[var(--spacing-sm)] border-t border-dashed border-line pt-[var(--spacing-sm)]">
        <span className="text-sm leading-[18px] text-muted">Look para el trabajo</span>
        <span className="rounded-full bg-product px-3 py-1 text-sm font-bold leading-[18px] text-on-product">
          Guardar look
        </span>
      </div>
    </div>
  );
}

const barberColumns = [
  {
    barber: 'Barbero 1',
    slots: [
      { time: '10:00', label: 'Corte' },
      { time: '10:30', label: null },
      { time: '11:00', label: 'Barba' },
    ],
  },
  {
    barber: 'Barbero 2',
    slots: [
      { time: '10:00', label: null },
      { time: '10:30', label: 'Corte' },
      { time: '11:00', label: null },
    ],
  },
] as const;

function BarberSketch() {
  return (
    <div className="grid gap-[var(--spacing-sm)] p-[var(--spacing-md)]">
      <div className="grid grid-cols-2 gap-[var(--spacing-sm)]">
        {barberColumns.map((column) => (
          <div key={column.barber} className="grid gap-[var(--spacing-xs)]">
            <span className="font-arvo text-md font-bold leading-[1.2] text-text">
              {column.barber}
            </span>
            {column.slots.map((slot) => (
              <span
                key={slot.time}
                className={`${sketchCellClass} flex items-center justify-between gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-1.5 text-sm leading-[18px] ${
                  slot.label ? 'border-solid border-product' : ''
                }`}
              >
                <span className="tabular-nums text-muted">{slot.time}</span>
                <span className={slot.label ? 'font-bold text-product' : 'text-muted'}>
                  {slot.label ?? 'Libre'}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-[var(--spacing-sm)] border-t border-dashed border-line pt-[var(--spacing-sm)]">
        <span className="text-sm leading-[18px] text-muted">Cliente frecuente</span>
        <span className="rounded-full border border-product px-3 py-1 text-sm font-bold leading-[18px] text-product">
          Recordatorio
        </span>
      </div>
    </div>
  );
}

const sketches: Record<ConceptKey, { title: string; Body: () => React.JSX.Element }> = {
  one: { title: 'Itinerario', Body: TripSketch },
  closet: { title: 'Tu clóset', Body: ClosetSketch },
  five: { title: 'Agenda del día', Body: BarberSketch },
};

export function isConceptKey(key: string): key is ConceptKey {
  return key in sketches;
}

export function ConceptSketch({ concept }: { concept: ConceptKey }) {
  const { title, Body } = sketches[concept];
  return (
    <figure className="m-0 w-full min-w-0">
      <div aria-hidden="true" className={`${sketchFrameClass} select-none`}>
        <div className="flex items-center justify-between gap-[var(--spacing-sm)] border-b border-dashed border-[color-mix(in_oklab,var(--landing-product)_35%,transparent)] px-[var(--spacing-md)] py-[var(--spacing-sm)]">
          <span className="font-arvo text-md font-bold leading-[1.3] text-text">{title}</span>
          <span className="rounded-full border border-dashed border-product px-2.5 py-0.5 text-sm font-bold leading-[18px] text-product">
            Idea en desarrollo
          </span>
        </div>
        <Body />
      </div>
      <figcaption className="mt-[var(--spacing-xs)] text-pretty text-sm leading-[1.4] text-muted">
        Boceto de la idea en desarrollo. La app final puede verse distinta.
      </figcaption>
    </figure>
  );
}
