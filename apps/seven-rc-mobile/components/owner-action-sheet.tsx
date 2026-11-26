import {
  AppButton,
  AppInput,
  AppModal,
  AppScrollView,
  AppTypography,
  GapView,
  useAppTheme,
} from '@17suit/ui-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { KeyboardAvoidingView, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { confirmAction } from '../lib/confirm';
import { useNow } from '../lib/focus';
import { parseMoneyMinor } from '../lib/money-input';
import type {
  ReservationPaymentKind,
  ReservationPaymentMethod,
  VenueReservation,
} from '../lib/owner-queries';
import { formatMoney, formatVenueRange } from '../lib/reservation-format';
import {
  AGENDA_ACTION_LABELS,
  agendaActionsFor,
  paymentKindsFor,
  reservationPlayerName,
  type OwnerReservationActions,
} from '../lib/use-owner-reservation-actions';
import { ChoiceChip } from './choice-chip';
import { FormError } from './form-field';

const KIND_LABELS: Record<ReservationPaymentKind, string> = {
  deposit: 'Anticipo',
  balance: 'Saldo',
  refund: 'Devolución',
};

const METHOD_OPTIONS: ReadonlyArray<{ value: ReservationPaymentMethod; label: string }> = [
  { value: 'transfer', label: 'Transferencia' },
  { value: 'cash', label: 'Efectivo' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'other', label: 'Otro' },
];

/**
 * Agenda row actions. Render one per screen; it shows whichever reservation
 * `actions.openSheet` was called with.
 */
export function OwnerActionSheet({ actions }: { actions: OwnerReservationActions }) {
  const { sheet } = actions;
  if (!sheet) return null;
  return (
    <ActionSheet
      key={sheet.reservation.id}
      reservation={sheet.reservation}
      timeZone={sheet.timeZone}
      actions={actions}
    />
  );
}

interface ActionSheetProps {
  reservation: VenueReservation;
  timeZone: string | null;
  actions: OwnerReservationActions;
}

function ActionSheet({ reservation, timeZone, actions }: ActionSheetProps) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const now = useNow();
  const [showPayment, setShowPayment] = useState(false);
  const agendaActions = agendaActionsFor(reservation, now);
  const canRecordPayment = paymentKindsFor(reservation, now).length > 0;
  const isSaving = actions.isPending;
  const close = () => {
    if (!isSaving) actions.closeSheet();
  };

  return (
    <AppModal visible animationType="fade" onRequestClose={close}>
      {/* `padding` on Android too: edge-to-edge windows do not resize for the keyboard. */}
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Cerrar acciones"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
          }}
        />
        <View
          accessibilityViewIsModal
          style={{
            maxHeight: '85%',
            backgroundColor: theme.colors.background,
            borderTopLeftRadius: theme.borderRadius.lg,
            borderTopRightRadius: theme.borderRadius.lg,
            paddingTop: theme.spacing.lg,
            paddingBottom: Math.max(insets.bottom, theme.spacing.md),
          }}
        >
          <AppScrollView
            style={{ flexGrow: 0, flexShrink: 1 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: theme.spacing.lg }}
          >
            <GapView gap="sm">
              <AppTypography variant="subtitle2" accessibilityRole="header">
                {reservationPlayerName(reservation) ?? 'Jugador sin nombre'}
              </AppTypography>
              <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18 }}>
                {`${reservation.pitch?.name ?? 'Cancha'} · ${formatVenueRange(
                  reservation.startAt,
                  reservation.endAt,
                  timeZone,
                )}`}
              </Text>

              {showPayment ? (
                <PaymentForm
                  reservation={reservation}
                  now={now}
                  actions={actions}
                  onBack={() => setShowPayment(false)}
                />
              ) : (
                <>
                  {canRecordPayment ? (
                    <AppButton onPress={() => setShowPayment(true)}>Registrar pago</AppButton>
                  ) : null}
                  {agendaActions.map((action) => (
                    <AppButton
                      key={action}
                      variant={action === 'cancel' ? 'destructive' : 'neutral'}
                      disabled={isSaving}
                      onPress={() => actions.askAgendaAction(reservation, action, timeZone)}
                    >
                      {AGENDA_ACTION_LABELS[action]}
                    </AppButton>
                  ))}
                  <AppButton variant="neutral" onPress={close}>
                    Cerrar
                  </AppButton>
                </>
              )}
            </GapView>
          </AppScrollView>
        </View>
      </KeyboardAvoidingView>
    </AppModal>
  );
}

interface PaymentFormProps {
  reservation: VenueReservation;
  now: number;
  actions: OwnerReservationActions;
  onBack: () => void;
}

/** Amount prefill in major units; empty when nothing is due. */
function dueAmount(reservation: VenueReservation, kind: ReservationPaymentKind): string {
  const { depositMinor, priceMinor, paidMinor } = reservation;
  const due =
    kind === 'refund' ? paidMinor : (kind === 'deposit' ? depositMinor : priceMinor) - paidMinor;
  return due > 0 ? String(due / 100) : '';
}

function buildPaymentSchema(paidMinor: number) {
  return z
    .object({
      kind: z.enum(['deposit', 'balance', 'refund']),
      method: z.string().min(1),
      amount: z.string(),
    })
    .superRefine((values, ctx) => {
      const amountMinor = parseMoneyMinor(values.amount);
      if (!amountMinor) {
        ctx.addIssue({
          code: 'custom',
          path: ['amount'],
          message: 'Escribe un monto mayor que cero, por ejemplo 30000.',
        });
      } else if (values.kind === 'refund' && amountMinor > paidMinor) {
        ctx.addIssue({
          code: 'custom',
          path: ['amount'],
          message: 'La devolución supera lo que pagó el jugador.',
        });
      }
    });
}
type PaymentValues = z.infer<ReturnType<typeof buildPaymentSchema>>;

function PaymentForm({ reservation, now, actions, onBack }: PaymentFormProps) {
  const { theme } = useAppTheme();
  const kinds = paymentKindsFor(reservation, now);
  const [error, setError] = useState<string | null>(null);
  const initialKind: ReservationPaymentKind = !kinds.includes('deposit')
    ? 'refund'
    : reservation.depositMinor > reservation.paidMinor
      ? 'deposit'
      : 'balance';
  const { control, handleSubmit, setValue, watch, formState } = useForm<PaymentValues>({
    resolver: zodResolver(buildPaymentSchema(reservation.paidMinor)),
    defaultValues: {
      kind: initialKind,
      method: 'transfer',
      amount: dueAmount(reservation, initialKind),
    },
  });
  const kind = watch('kind');
  const amount = watch('amount');

  const confirmsHold =
    kind !== 'refund' &&
    reservation.status === 'pending_confirmation' &&
    reservation.paidMinor + (parseMoneyMinor(amount) ?? 0) >= reservation.depositMinor;

  const submit = handleSubmit((values) => {
    setError(null);
    const amountMinor = parseMoneyMinor(values.amount) ?? 0;
    const money = formatMoney(amountMinor, reservation.currency) ?? values.amount;
    confirmAction(
      {
        title: `¿Registrar ${KIND_LABELS[values.kind].toLowerCase()} de ${money}?`,
        message: `La app no mueve dinero, solo lo anota.${
          confirmsHold ? ' Este monto cubre el anticipo y confirma la reserva.' : ''
        } El registro no se puede borrar.`,
        confirmText: 'Registrar',
        cancelText: 'Volver',
      },
      () => {
        void actions
          .recordPayment(reservation, {
            kind: values.kind,
            method: values.method as ReservationPaymentMethod,
            amountMinor,
          })
          .then(setError);
      },
    );
  });

  return (
    <>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Concepto"
        style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}
      >
        {kinds.map((option) => (
          <ChoiceChip
            key={option}
            label={KIND_LABELS[option]}
            selected={option === kind}
            onPress={() => {
              setValue('kind', option);
              setValue('amount', dueAmount(reservation, option));
              setError(null);
            }}
          />
        ))}
      </View>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel="Medio de pago"
        style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}
      >
        {METHOD_OPTIONS.map((option) => (
          <ChoiceChip
            key={option.value}
            label={option.label}
            selected={option.value === watch('method')}
            onPress={() => setValue('method', option.value)}
          />
        ))}
      </View>
      <Controller
        control={control}
        name="amount"
        render={({ field }) => (
          <AppInput
            value={field.value}
            onChangeText={(value) => {
              field.onChange(value);
              setError(null);
            }}
            label={`Monto (${reservation.currency})`}
            placeholder="30000"
            keyboardType="decimal-pad"
            error={Boolean(formState.errors.amount ?? error)}
          />
        )}
      />
      <FormError message={formState.errors.amount?.message ?? error} />
      <AppButton
        onPress={() => void submit()}
        disabled={actions.isPending}
        busy={actions.isPending}
      >
        {actions.isPending ? 'Registrando…' : 'Registrar pago'}
      </AppButton>
      <AppButton variant="neutral" onPress={onBack} disabled={actions.isPending}>
        Volver
      </AppButton>
    </>
  );
}
