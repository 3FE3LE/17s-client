'use client';

import { AppBadge, AppButton, AppInput } from '@17suit/ui';
import { useState } from 'react';
import { InlineError, ListSkeleton, SectionHeader, SelectField } from '@/components/seven-rc-ui';
import {
  canRecordPayment,
  filterByPayment,
  isPaymentFilter,
  PAYMENT_FILTER_OPTIONS,
  paymentStatusLabel,
  type PaymentFilter,
} from '@/lib/owner-balances';
import { useOwnerVenueReservationsQuery, type VenueReservation } from '@/lib/owner-queries';
import { outstandingMinor, summarizeReservations, validatePeriod } from '@/lib/owner-report';
import { describeError } from '@/lib/seven-rc-errors';
import {
  addDaysToDateKey,
  formatMoneyMinor,
  formatSlotWhen,
  reservationStatus,
} from '@/lib/seven-rc-format';

const DEFAULT_PAST_DAYS = 30;
const DEFAULT_FUTURE_DAYS = 14;

/** Payments and balances per reservation for a period, with a shortcut to record a payment. */
export function OwnerBalances({
  venueId,
  timeZone,
  todayKey,
  onRecordPayment,
}: {
  venueId: string;
  timeZone: string;
  todayKey: string;
  onRecordPayment: (reservation: VenueReservation) => void;
}) {
  const [from, setFrom] = useState(addDaysToDateKey(todayKey, -DEFAULT_PAST_DAYS));
  const [to, setTo] = useState(addDaysToDateKey(todayKey, DEFAULT_FUTURE_DAYS));
  const [filter, setFilter] = useState<PaymentFilter>('all');

  const periodError = validatePeriod(from, to);
  // An invalid period must not hit the API: no venue id disables the query.
  const query = useOwnerVenueReservationsQuery(periodError ? null : venueId, from, to);
  const all = query.data ?? [];
  const rows = filterByPayment(all, filter);
  const totals = summarizeReservations(all);
  const owing = all.filter((reservation) => outstandingMinor(reservation) > 0).length;
  const currency = all[0]?.currency ?? 'COP';
  const loadError = query.error
    ? describeError(query.error, 'No se pudieron cargar los pagos.')
    : null;

  return (
    <section aria-labelledby="saldos-title" className="mt-lg grid gap-md">
      <SectionHeader
        id="saldos-title"
        title="Pagos y saldos"
        description="Saldo pendiente por reserva en el periodo elegido. Cuenta solo reservas por confirmar, confirmadas o completadas."
      />
      <fieldset className="m-0 grid max-w-[var(--container-form)] gap-sm border-0 p-0 sm:grid-cols-2">
        <legend className="mb-xs p-0 text-sm leading-[1.5] text-muted">Periodo</legend>
        <AppInput
          type="date"
          name="saldos-desde"
          label="Desde"
          value={from}
          onChangeText={setFrom}
        />
        <AppInput type="date" name="saldos-hasta" label="Hasta" value={to} onChangeText={setTo} />
      </fieldset>
      <InlineError message={periodError} />
      <div className="max-w-[var(--container-form)]">
        <SelectField
          label="Estado de pago"
          name="estado-pago"
          value={filter}
          onChangeValue={(value) => {
            if (isPaymentFilter(value)) setFilter(value);
          }}
          options={PAYMENT_FILTER_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
        />
      </div>

      {periodError ? null : query.isLoading ? (
        <ListSkeleton rows={2} label="Cargando pagos y saldos" />
      ) : loadError ? (
        <div className="grid gap-sm">
          <InlineError message={loadError} />
          <AppButton variant="neutral" fullWidth={false} onPress={() => void query.refetch()}>
            Reintentar
          </AppButton>
        </div>
      ) : (
        <>
          <p role="status" className="m-0 text-md font-bold leading-[1.5] text-text">
            Pendiente del periodo: {formatMoneyMinor(totals.pendingMinor, currency)} en {owing}{' '}
            {owing === 1 ? 'reserva' : 'reservas'}
          </p>
          {rows.length === 0 ? (
            <p className="m-0 text-md leading-[1.5] text-muted">
              No hay reservas con ese estado de pago en el periodo.
            </p>
          ) : (
            <ul className="m-0 grid list-none gap-sm p-0">
              {rows.map((reservation) => {
                const balance = outstandingMinor(reservation);
                const status = reservationStatus(reservation.status);
                return (
                  <li
                    key={reservation.id}
                    className="grid gap-sm rounded-[var(--radius-lg)] border border-border-strong bg-background p-md md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                  >
                    <div className="grid min-w-0 gap-xs">
                      <div className="flex flex-wrap items-center gap-sm">
                        <p className="m-0 break-words font-bold leading-[1.3] text-text">
                          {reservation.user?.name ??
                            reservation.customerName ??
                            reservation.user?.email ??
                            'Jugador sin nombre'}
                        </p>
                        <AppBadge variant={status.variant}>{status.label}</AppBadge>
                        <AppBadge variant="neutral">
                          {paymentStatusLabel(reservation.paymentStatus)}
                        </AppBadge>
                      </div>
                      <p className="m-0 text-md leading-[1.5] text-text first-letter:uppercase">
                        {reservation.pitch.name} ·{' '}
                        {formatSlotWhen(reservation.startAt, reservation.endAt, timeZone)}
                      </p>
                      <p className="m-0 text-sm leading-[18px] text-text">
                        Precio {formatMoneyMinor(reservation.priceMinor, reservation.currency)} ·
                        pagado {formatMoneyMinor(reservation.paidMinor, reservation.currency)} ·{' '}
                        <span className="font-bold">
                          saldo {formatMoneyMinor(balance, reservation.currency)}
                        </span>
                      </p>
                    </div>
                    {canRecordPayment(reservation) ? (
                      <AppButton
                        variant="neutral"
                        compact
                        fullWidth={false}
                        onPress={() => onRecordPayment(reservation)}
                      >
                        Registrar pago
                      </AppButton>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
