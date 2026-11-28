import { useTranslation } from '@17suit/i18n/react';
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
  AGENDA_ACTION_LABEL_KEYS,
  agendaActionsFor,
  paymentKindsFor,
  reservationPlayerName,
  type OwnerReservationActions,
} from '../lib/use-owner-reservation-actions';
import { ChoiceChip } from './choice-chip';
import { FormError } from './form-field';

/** Catalog keys (`mobile` namespace). */
const KIND_LABEL_KEYS: Record<ReservationPaymentKind, string> = {
  deposit: 'ownerSheet.kinds.deposit',
  balance: 'ownerSheet.kinds.balance',
  refund: 'ownerSheet.kinds.refund',
};

const METHOD_OPTIONS: ReadonlyArray<{ value: ReservationPaymentMethod; labelKey: string }> = [
  { value: 'transfer', labelKey: 'ownerSheet.methods.transfer' },
  { value: 'cash', labelKey: 'ownerSheet.methods.cash' },
  { value: 'card', labelKey: 'ownerSheet.methods.card' },
  { value: 'other', labelKey: 'ownerSheet.methods.other' },
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
  const { t } = useTranslation('mobile');
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
          accessibilityLabel={t('ownerSheet.closeActions')}
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
                {reservationPlayerName(reservation) ?? t('common.unnamedPlayer')}
              </AppTypography>
              <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18 }}>
                {`${reservation.pitch?.name ?? t('common.court')} · ${formatVenueRange(
                  reservation.startAt,
                  reservation.endAt,
                  timeZone,
                  t('intlLocale'),
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
                    <AppButton onPress={() => setShowPayment(true)}>
                      {t('ownerSheet.recordPayment')}
                    </AppButton>
                  ) : null}
                  {agendaActions.map((action) => (
                    <AppButton
                      key={action}
                      variant={action === 'cancel' ? 'destructive' : 'neutral'}
                      disabled={isSaving}
                      onPress={() => actions.askAgendaAction(reservation, action, timeZone)}
                    >
                      {t(AGENDA_ACTION_LABEL_KEYS[action])}
                    </AppButton>
                  ))}
                  <AppButton variant="neutral" onPress={close}>
                    {t('common.close')}
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

/** Messages are catalog codes (`ownerSheet.errors.*`), resolved with `t` at render. */
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
          message: 'amountInvalid',
        });
      } else if (values.kind === 'refund' && amountMinor > paidMinor) {
        ctx.addIssue({
          code: 'custom',
          path: ['amount'],
          message: 'refundTooHigh',
        });
      }
    });
}
type PaymentValues = z.infer<ReturnType<typeof buildPaymentSchema>>;

function PaymentForm({ reservation, now, actions, onBack }: PaymentFormProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation('mobile');
  const locale = t('intlLocale');
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
    const money = formatMoney(amountMinor, reservation.currency, locale) ?? values.amount;
    confirmAction(
      {
        title: t('ownerSheet.askTitle', {
          kind: t(KIND_LABEL_KEYS[values.kind]).toLowerCase(),
          money,
        }),
        message: t(confirmsHold ? 'ownerSheet.askMessageHold' : 'ownerSheet.askMessage'),
        confirmText: t('ownerSheet.record'),
        cancelText: t('common.back'),
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
        accessibilityLabel={t('ownerSheet.kind')}
        style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}
      >
        {kinds.map((option) => (
          <ChoiceChip
            key={option}
            label={t(KIND_LABEL_KEYS[option])}
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
        accessibilityLabel={t('ownerSheet.method')}
        style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}
      >
        {METHOD_OPTIONS.map((option) => (
          <ChoiceChip
            key={option.value}
            label={t(option.labelKey)}
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
            label={t('ownerSheet.amount', { currency: reservation.currency })}
            placeholder="30000"
            keyboardType="decimal-pad"
            error={Boolean(formState.errors.amount ?? error)}
          />
        )}
      />
      <FormError
        message={
          formState.errors.amount?.message
            ? t(`ownerSheet.errors.${formState.errors.amount.message}`)
            : error
        }
      />
      <AppButton
        onPress={() => void submit()}
        disabled={actions.isPending}
        busy={actions.isPending}
      >
        {actions.isPending ? t('ownerSheet.recording') : t('ownerSheet.recordPayment')}
      </AppButton>
      <AppButton variant="neutral" onPress={onBack} disabled={actions.isPending}>
        {t('common.back')}
      </AppButton>
    </>
  );
}
