/*
 * Illustrated UI mocks for the home hero and product pages, drawn as code. All
 * names, amounts and places are fictional sample data. The drawing is
 * aria-hidden; the figcaption carries the one-line description for assistive
 * tech and sighted readers alike. `compact` trims rows for the home hero.
 * Server components: copy comes from the `mocks` catalog through the `t` prop.
 */

import type { ReactNode } from 'react';
import { tItems, tList, type LandingT } from '../i18n';

const frameClass =
  'overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface shadow-[0_18px_40px_rgb(0_23_31/0.1)] dark:shadow-[0_10px_24px_rgb(0_0_0/0.3)]';

const chromeClass =
  'flex items-center justify-between gap-[var(--spacing-sm)] border-b border-line px-[var(--spacing-md)] py-[var(--spacing-sm)]';

export interface MockProps {
  t: LandingT;
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

interface Movement {
  sender: string;
  detail: string;
  amount: string;
  category: string;
}

export function FifteenReviewMock({ t, compact = false, caption, className }: MockProps) {
  const movements = tItems<Movement>(t, 'mocks.fifteen.movements');
  const rows = compact ? movements.slice(0, 2) : movements;
  return (
    <MockFigure caption={caption ?? t('mocks.sample')} className={className}>
      <div className={chromeClass}>
        <span className="font-arvo text-md font-bold leading-[1.3] text-text">
          {t('mocks.fifteen.title')}
        </span>
        <span className="rounded-full bg-[color-mix(in_oklab,var(--landing-product)_14%,transparent)] px-2.5 py-0.5 text-sm font-bold leading-[18px] text-product tabular-nums">
          {t('mocks.fifteen.count', { count: movements.length })}
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
              {t('mocks.fifteen.confirm')}
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

const dayDates = ['13', '14', '15'] as const;
const ACTIVE_DAY = '14';

export function SevenSlotMock({ t, compact = false, caption, className }: MockProps) {
  const dayLabels = tList(t, 'mocks.seven.days');
  const days = dayDates.map((date, index) => ({ date, label: dayLabels[index] ?? '' }));
  const visibleSlots = compact ? slots.slice(0, 4) : slots;
  return (
    <MockFigure caption={caption ?? t('mocks.sample')} className={className}>
      <div className={chromeClass}>
        <span className="min-w-0">
          <span className="block truncate text-sm leading-[18px] text-muted">
            {t('mocks.seven.venue')}
          </span>
          <span className="block font-arvo text-md font-bold leading-[1.3] text-text">
            {t('mocks.seven.court')}
          </span>
        </span>
        <span className="shrink-0 text-sm leading-[18px] text-muted">
          {t('mocks.seven.slotLength')}
        </span>
      </div>
      <div className="grid gap-[var(--spacing-md)] p-[var(--spacing-md)]">
        <div className="flex gap-[var(--spacing-xs)]">
          {days.map((day) => (
            <span
              key={day.date}
              className={`grid min-w-14 justify-items-center rounded-[var(--radius-lg)] border px-3 py-1.5 leading-[1.2] ${
                day.date === ACTIVE_DAY ? 'border-product text-product' : 'border-line text-muted'
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
          <span className="text-sm leading-[18px] text-muted">{t('mocks.seven.selected')}</span>
          <span className="rounded-full bg-product px-4 py-1.5 text-sm font-bold leading-[18px] text-on-product">
            {t('mocks.seven.book')}
          </span>
        </div>
      </div>
    </MockFigure>
  );
}

/*
 * Concept sketches for products that have not opened yet. Deliberately
 * wireframe-level (dashed strokes, generic labels) so nobody reads them as a
 * finished screen; the chrome says "Idea in development" and the caption repeats it.
 */

type ConceptKey = 'one' | 'closet' | 'five';

const sketchFrameClass =
  'overflow-hidden rounded-[var(--radius-xl)] border-2 border-dashed border-[color-mix(in_oklab,var(--landing-product)_45%,transparent)] bg-[color-mix(in_oklab,var(--landing-product)_6%,var(--color-surface))]';

const sketchCellClass =
  'rounded-[var(--radius-lg)] border border-dashed border-[color-mix(in_oklab,var(--landing-product)_40%,transparent)] bg-surface';

interface TripDay {
  day: string;
  items: string[];
}

function TripSketch({ t }: { t: LandingT }) {
  const tripDays = tItems<TripDay>(t, 'mocks.concept.trip.days');
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
        <span className="text-sm leading-[18px] text-muted">{t('mocks.concept.trip.shared')}</span>
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

/** Positions of the garments that are part of the sketched look. */
const GARMENTS_IN_LOOK: ReadonlySet<number> = new Set([0, 1, 4]);

function ClosetSketch({ t }: { t: LandingT }) {
  const garments = tList(t, 'mocks.concept.closet.garments');
  return (
    <div className="grid gap-[var(--spacing-sm)] p-[var(--spacing-md)]">
      <div className="grid grid-cols-3 gap-[var(--spacing-xs)]">
        {garments.map((garment, index) => (
          <span
            key={garment}
            className={`${sketchCellClass} flex aspect-[4/3] items-end p-[var(--spacing-xs)] text-sm font-bold leading-[18px] ${
              GARMENTS_IN_LOOK.has(index)
                ? 'border-solid border-product text-product'
                : 'text-muted'
            }`}
          >
            {garment}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between gap-[var(--spacing-sm)] border-t border-dashed border-line pt-[var(--spacing-sm)]">
        <span className="text-sm leading-[18px] text-muted">{t('mocks.concept.closet.look')}</span>
        <span className="rounded-full bg-product px-3 py-1 text-sm font-bold leading-[18px] text-on-product">
          {t('mocks.concept.closet.save')}
        </span>
      </div>
    </div>
  );
}

type BarberService = 'cut' | 'beard' | null;

const barberColumns: ReadonlyArray<{
  slots: ReadonlyArray<{ time: string; service: BarberService }>;
}> = [
  {
    slots: [
      { time: '10:00', service: 'cut' },
      { time: '10:30', service: null },
      { time: '11:00', service: 'beard' },
    ],
  },
  {
    slots: [
      { time: '10:00', service: null },
      { time: '10:30', service: 'cut' },
      { time: '11:00', service: null },
    ],
  },
];

function BarberSketch({ t }: { t: LandingT }) {
  const barbers = tList(t, 'mocks.concept.barber.barbers');
  return (
    <div className="grid gap-[var(--spacing-sm)] p-[var(--spacing-md)]">
      <div className="grid grid-cols-2 gap-[var(--spacing-sm)]">
        {barberColumns.map((column, columnIndex) => (
          <div key={barbers[columnIndex]} className="grid gap-[var(--spacing-xs)]">
            <span className="font-arvo text-md font-bold leading-[1.2] text-text">
              {barbers[columnIndex]}
            </span>
            {column.slots.map((slot) => (
              <span
                key={slot.time}
                className={`${sketchCellClass} flex items-center justify-between gap-[var(--spacing-xs)] px-[var(--spacing-sm)] py-1.5 text-sm leading-[18px] ${
                  slot.service ? 'border-solid border-product' : ''
                }`}
              >
                <span className="tabular-nums text-muted">{slot.time}</span>
                <span className={slot.service ? 'font-bold text-product' : 'text-muted'}>
                  {slot.service
                    ? t(`mocks.concept.barber.${slot.service === 'cut' ? 'cut' : 'beard'}`)
                    : t('mocks.concept.barber.free')}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-[var(--spacing-sm)] border-t border-dashed border-line pt-[var(--spacing-sm)]">
        <span className="text-sm leading-[18px] text-muted">
          {t('mocks.concept.barber.regular')}
        </span>
        <span className="rounded-full border border-product px-3 py-1 text-sm font-bold leading-[18px] text-product">
          {t('mocks.concept.barber.reminder')}
        </span>
      </div>
    </div>
  );
}

const sketches: Record<
  ConceptKey,
  { titleKey: string; Body: (props: { t: LandingT }) => React.JSX.Element }
> = {
  one: { titleKey: 'mocks.concept.trip.title', Body: TripSketch },
  closet: { titleKey: 'mocks.concept.closet.title', Body: ClosetSketch },
  five: { titleKey: 'mocks.concept.barber.title', Body: BarberSketch },
};

export function isConceptKey(key: string): key is ConceptKey {
  return key in sketches;
}

export function ConceptSketch({ concept, t }: { concept: ConceptKey; t: LandingT }) {
  const { titleKey, Body } = sketches[concept];
  return (
    <figure className="m-0 w-full min-w-0">
      <div aria-hidden="true" className={`${sketchFrameClass} select-none`}>
        <div className="flex items-center justify-between gap-[var(--spacing-sm)] border-b border-dashed border-[color-mix(in_oklab,var(--landing-product)_35%,transparent)] px-[var(--spacing-md)] py-[var(--spacing-sm)]">
          <span className="font-arvo text-md font-bold leading-[1.3] text-text">{t(titleKey)}</span>
          <span className="rounded-full border border-dashed border-product px-2.5 py-0.5 text-sm font-bold leading-[18px] text-product">
            {t('mocks.concept.badge')}
          </span>
        </div>
        <Body t={t} />
      </div>
      <figcaption className="mt-[var(--spacing-xs)] text-pretty text-sm leading-[1.4] text-muted">
        {t('mocks.concept.caption')}
      </figcaption>
    </figure>
  );
}
