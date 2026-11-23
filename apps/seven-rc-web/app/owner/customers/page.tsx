'use client';

import {
  useCurrentUserRoleQuery,
  useRoleGate,
} from '@17suit/module-seven-reservations-club/client';
import { AppBadge, AppFrame, AppButton, AppInput } from '@17suit/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { InlineError, ListSkeleton, SectionHeader, SelectField } from '@/components/seven-rc-ui';
import {
  buildCustomerBook,
  clampInt,
  CUSTOMER_FILTER_OPTIONS,
  DEFAULT_THRESHOLDS,
  filterCustomers,
  isCustomerFilter,
  type CustomerFilter,
} from '@/lib/owner-customers';
import { useOwnerVenueReservationsQuery, useOwnerVenuesQuery } from '@/lib/owner-queries';
import { describeError } from '@/lib/seven-rc-errors';
import {
  addDaysToDateKey,
  dateKeyInTimeZone,
  formatMoneyMinor,
  formatSlotWhen,
  reservationStatus,
  safeTimeZone,
} from '@/lib/seven-rc-format';

const WINDOWS = [
  { value: '90', label: 'Últimos 90 días' },
  { value: '180', label: 'Últimos 180 días' },
  { value: '365', label: 'Último año' },
];
const FUTURE_DAYS = 30;

export default function OwnerCustomersPage() {
  const router = useRouter();
  const { role, isLoading } = useCurrentUserRoleQuery();
  useRoleGate({ required: 'OWNER', router });

  if (isLoading || role !== 'OWNER') {
    return (
      <AppFrame appName="Clientes" subtitle="Cargando tu cuenta…">
        <ListSkeleton rows={3} label="Cargando tu cuenta" />
      </AppFrame>
    );
  }
  return <CustomersWorkspace />;
}

function formatPhone(key: string): string {
  return key.startsWith('57') && key.length === 12
    ? `+57 ${key.slice(2, 5)} ${key.slice(5, 8)} ${key.slice(8)}`
    : `+${key}`;
}

function CustomersWorkspace() {
  const venuesQuery = useOwnerVenuesQuery();
  const venues = venuesQuery.data ?? [];
  const [explicitVenueId, setExplicitVenueId] = useState<string | null>(null);
  const venue = venues.find((item) => item.id === explicitVenueId) ?? venues[0] ?? null;
  const timeZone = safeTimeZone(venue?.timezone);
  const todayKey = dateKeyInTimeZone(new Date(), timeZone);

  const [windowDays, setWindowDays] = useState('365');
  const [filter, setFilter] = useState<CustomerFilter>('all');
  const [frequentMin, setFrequentMin] = useState(String(DEFAULT_THRESHOLDS.frequentMinBookings));
  const [lapsedDays, setLapsedDays] = useState(String(DEFAULT_THRESHOLDS.lapsedAfterDays));
  const [mountedAt] = useState(() => Date.now());

  const query = useOwnerVenueReservationsQuery(
    venue?.id ?? null,
    addDaysToDateKey(todayKey, -Number(windowDays)),
    addDaysToDateKey(todayKey, FUTURE_DAYS),
  );
  const thresholds = {
    frequentMinBookings: clampInt(frequentMin, 1, 100, DEFAULT_THRESHOLDS.frequentMinBookings),
    lapsedAfterDays: clampInt(lapsedDays, 1, 730, DEFAULT_THRESHOLDS.lapsedAfterDays),
  };
  const book = buildCustomerBook(query.data ?? [], mountedAt, thresholds);
  const customers = filterCustomers(book.customers, filter);
  const loadError = query.error
    ? describeError(query.error, 'No se pudieron cargar los clientes.')
    : null;

  return (
    <AppFrame
      appName="Clientes"
      subtitle={venue ? `${venue.name} · agrupados por teléfono` : 'Sin complejo'}
    >
      <p className="m-0">
        <Link href="/owner" className="text-text underline">
          Volver a mi complejo
        </Link>
      </p>

      {venuesQuery.error ? (
        <InlineError
          message={describeError(venuesQuery.error, 'No se pudieron cargar tus complejos.')}
        />
      ) : null}

      <section
        aria-labelledby="clientes-filtros"
        className="grid max-w-[var(--container-form)] gap-sm"
      >
        <SectionHeader id="clientes-filtros" title="Filtros" />
        {venues.length > 1 ? (
          <SelectField
            label="Complejo"
            name="complejo"
            value={venue?.id ?? ''}
            onChangeValue={setExplicitVenueId}
            options={venues.map((item) => ({ value: item.id, label: item.name }))}
          />
        ) : null}
        <SelectField
          label="Periodo"
          name="periodo"
          value={windowDays}
          onChangeValue={setWindowDays}
          options={WINDOWS}
        />
        <SelectField
          label="Mostrar"
          name="mostrar"
          value={filter}
          onChangeValue={(value) => {
            if (isCustomerFilter(value)) setFilter(value);
          }}
          options={CUSTOMER_FILTER_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
        />
        <div className="grid gap-sm sm:grid-cols-2">
          <AppInput
            type="number"
            name="umbral-frecuente"
            label="Frecuente desde (reservas)"
            inputMode="numeric"
            min={1}
            max={100}
            value={frequentMin}
            onChangeText={setFrequentMin}
          />
          <AppInput
            type="number"
            name="umbral-ausente"
            label="Dejó de venir tras (días)"
            inputMode="numeric"
            min={1}
            max={730}
            value={lapsedDays}
            onChangeText={setLapsedDays}
          />
        </div>
      </section>

      {query.isLoading ? (
        <ListSkeleton rows={3} label="Cargando clientes" />
      ) : loadError ? (
        <div className="grid gap-sm">
          <InlineError message={loadError} />
          <AppButton variant="neutral" fullWidth={false} onPress={() => void query.refetch()}>
            Reintentar
          </AppButton>
        </div>
      ) : (
        <section aria-labelledby="clientes-lista" className="grid gap-sm">
          <SectionHeader
            id="clientes-lista"
            title="Clientes"
            description={`${book.customers.length} en el periodo${book.withoutPhone > 0 ? ` · ${book.withoutPhone} reservas sin teléfono no se agrupan` : ''}`}
          />
          {customers.length === 0 ? (
            <p role="status" className="m-0 text-md leading-[1.5] text-muted">
              {book.customers.length === 0
                ? 'Aún no hay reservas con teléfono en este periodo.'
                : 'Ningún cliente cumple ese filtro.'}
            </p>
          ) : (
            <ul className="m-0 grid list-none gap-sm p-0">
              {customers.map((customer) => (
                <li
                  key={customer.phone}
                  className="rounded-[var(--radius-lg)] border border-border-strong bg-background p-md"
                >
                  <details>
                    <summary className="grid cursor-pointer gap-xs">
                      <span className="flex flex-wrap items-center gap-sm">
                        <span className="font-bold text-text">{customer.name}</span>
                        <span className="text-md text-muted">{formatPhone(customer.phone)}</span>
                        {customer.isFrequent ? (
                          <AppBadge variant="success">Frecuente</AppBadge>
                        ) : null}
                        {customer.isLapsed ? (
                          <AppBadge variant="warning">Dejó de venir</AppBadge>
                        ) : null}
                      </span>
                      <span className="text-sm leading-[18px] text-text">
                        {customer.bookings} {customer.bookings === 1 ? 'reserva' : 'reservas'} ·
                        última{' '}
                        {formatSlotWhen(
                          customer.history[0]?.startAt ?? '',
                          customer.history[0]?.endAt ?? '',
                          timeZone,
                        )}{' '}
                        · gastado {formatMoneyMinor(customer.spentMinor, customer.currency)}
                        {customer.noShows > 0 ? ` · ${customer.noShows} no asistió` : ''}
                      </span>
                    </summary>
                    <ul className="m-0 mt-sm grid list-none gap-xs p-0">
                      {customer.history.map((reservation) => {
                        const status = reservationStatus(reservation.status);
                        return (
                          <li
                            key={reservation.id}
                            className="flex flex-wrap items-center gap-sm text-sm leading-[18px] text-text"
                          >
                            <span className="first-letter:uppercase">
                              {formatSlotWhen(reservation.startAt, reservation.endAt, timeZone)}
                            </span>
                            <span>{reservation.pitch.name}</span>
                            <AppBadge variant={status.variant}>{status.label}</AppBadge>
                            <span>
                              pagado {formatMoneyMinor(reservation.paidMinor, reservation.currency)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </AppFrame>
  );
}
