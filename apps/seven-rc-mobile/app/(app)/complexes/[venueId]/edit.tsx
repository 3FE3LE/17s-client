import { applyServerFieldErrors, draftFromCoAddress, parseCoAddress } from '@17suit/core';
import { useTranslation } from '@17suit/i18n/react';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import {
  AppAlert,
  AppButton,
  AppInput,
  AppSelect,
  AppSkeleton,
  AppTypography,
  GapView,
} from '@17suit/ui-native';
import { useUser } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Controller, useForm, type Control } from 'react-hook-form';
import { addressErrorKeys, CoAddressFields } from '../../../../components/co-address-fields';
import { FormError } from '../../../../components/form-field';
import { Screen } from '../../../../components/screen';
import { humanizeError } from '../../../../lib/error-messages';
import { feedback } from '../../../../lib/feedback';
import { useOwnerVenuesQuery, useUpdateVenueSettingsMutation } from '../../../../lib/owner-queries';
import type { OwnerVenue } from '../../../../lib/seven-rc-api';
import {
  asDepositPolicy,
  buildVenueEditSchema,
  DEPOSIT_POLICY_VALUES,
  toVenueEditInput,
  VENUE_EDIT_FIELD_MAP,
  type VenueEditValues,
} from '../../../../lib/venue-edit-schema';

type NumberFieldName =
  | 'depositPercent'
  | 'holdMinutes'
  | 'cancellationWindowHours'
  | 'bookingHorizonDays';

/** Role gate: the venue query and the form only mount for an owner. */
export default function EditVenueScreen() {
  const router = useRouter();
  const { t } = useTranslation('mobile');
  const params = useLocalSearchParams<{ venueId?: string | string[] }>();
  const venueId = Array.isArray(params.venueId)
    ? (params.venueId[0] ?? null)
    : (params.venueId ?? null);
  const { user } = useUser();
  const { role, isLoading } = useCurrentUserRoleQuery({
    userId: user?.id ?? null,
    enabled: Boolean(user?.id),
  });

  if (isLoading || !user) {
    return (
      <Screen title={t('venueEdit.title')}>
        <AppSkeleton height={180} rounded="lg" />
      </Screen>
    );
  }

  if (role !== 'OWNER' || !venueId) {
    return (
      <Screen title={t('venueEdit.title')} subtitle={t('venueEdit.forbidden')}>
        <GapView gap="md">
          <AppButton onPress={() => router.replace('/home')}>{t('common.backHome')}</AppButton>
        </GapView>
      </Screen>
    );
  }

  return <EditVenueLoader venueId={venueId} />;
}

function EditVenueLoader({ venueId }: { venueId: string }) {
  const router = useRouter();
  const { t } = useTranslation('mobile');
  const venuesQuery = useOwnerVenuesQuery();
  const venue = (venuesQuery.data ?? []).find((item) => item.id === venueId);

  if (!venue) {
    if (venuesQuery.isLoading) {
      return (
        <Screen title={t('venueEdit.title')}>
          <AppSkeleton height={180} rounded="lg" />
        </Screen>
      );
    }
    return (
      <Screen title={t('venueEdit.title')}>
        <GapView gap="md">
          <AppAlert
            variant="warning"
            title={t('venueOwner.loadError')}
            description={
              venuesQuery.error
                ? humanizeError(venuesQuery.error, t, 'load')
                : t('venueEdit.notFound')
            }
            action={
              <AppButton variant="warning" onPress={() => void venuesQuery.refetch()}>
                {t('common.retry')}
              </AppButton>
            }
          />
          <AppButton variant="neutral" onPress={() => router.back()}>
            {t('common.back')}
          </AppButton>
        </GapView>
      </Screen>
    );
  }

  return <EditVenueForm venue={venue} />;
}

function EditVenueForm({ venue }: { venue: OwnerVenue }) {
  const router = useRouter();
  const { t } = useTranslation('mobile');
  const errorText = (code?: string) =>
    code ? (code.includes(':') ? t(code) : t(`venueEdit.errors.${code}`)) : null;
  const mutation = useUpdateVenueSettingsMutation(venue.id);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const savedAddress = parseCoAddress(venue.addressParts);
  const schema = useMemo(
    () => buildVenueEditSchema(venue.countryCode, Boolean(venue.contactPhone)),
    [venue.countryCode, venue.contactPhone],
  );
  const policyOptions = DEPOSIT_POLICY_VALUES.map((value) => ({
    value,
    label: t(`venueEdit.depositPolicy.${value}`),
  }));
  const { control, handleSubmit, formState, setError } = useForm<VenueEditValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: venue.name,
      address: draftFromCoAddress(savedAddress),
      contactPhone: venue.contactPhone ?? '',
      paymentInstructions: venue.paymentInstructions ?? '',
      depositPercent: String(venue.depositPercent),
      holdMinutes: String(venue.holdMinutes),
      cancellationWindowHours: String(venue.cancellationWindowHours),
      lateCancelDeposit: venue.lateCancelDeposit,
      noShowDeposit: venue.noShowDeposit,
      conditionsText: venue.conditionsText ?? '',
      bookingHorizonDays: String(venue.bookingHorizonDays),
    },
  });

  const onSubmit = handleSubmit(
    async (values) => {
      setSubmitError(null);
      try {
        const saved = await mutation.mutateAsync(toVenueEditInput(values, venue.countryCode));
        const keeping = saved.reservationsKeepingPolicy ?? 0;
        feedback.success(
          t('venueEdit.savedTitle'),
          keeping > 0
            ? t('venueEdit.savedKeeping', { count: keeping })
            : t('venueEdit.savedMessage'),
        );
        router.back();
      } catch (error) {
        if (!applyServerFieldErrors(error, setError, VENUE_EDIT_FIELD_MAP)) {
          setSubmitError(humanizeError(error, t, 'save'));
        }
      }
    },
    () => setSubmitError(t('venueEdit.checkFields')),
  );

  const busy = formState.isSubmitting || mutation.isPending;

  return (
    <Screen
      title={t('venueEdit.title')}
      subtitle={t('venueEdit.subtitle')}
      footer={
        <>
          <FormError message={submitError} />
          <AppButton onPress={onSubmit} disabled={!formState.isValid || busy} busy={busy}>
            {busy ? t('venueEdit.saving') : t('venueEdit.save')}
          </AppButton>
          <AppButton variant="neutral" onPress={() => router.back()} disabled={busy}>
            {t('common.cancel')}
          </AppButton>
        </>
      }
    >
      <GapView gap="md">
        <AppTypography variant="subtitle2" accessibilityRole="header">
          {t('venueEdit.sectionIdentity')}
        </AppTypography>
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <>
              <AppInput
                value={field.value}
                onChangeText={field.onChange}
                label={t('venueEdit.nameLabel')}
                autoComplete="organization"
                error={fieldState.invalid}
              />
              <FormError message={errorText(fieldState.error?.message)} />
            </>
          )}
        />
        {!savedAddress && venue.address ? (
          <AppTypography variant="body">
            {t('venueEdit.previousAddress', { address: venue.address })}
          </AppTypography>
        ) : null}
        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <CoAddressFields
              value={field.value}
              onChange={field.onChange}
              errors={addressErrorKeys(formState.errors.address)}
            />
          )}
        />

        <AppTypography variant="subtitle2" accessibilityRole="header">
          {t('venueEdit.sectionContact')}
        </AppTypography>
        <Controller
          control={control}
          name="contactPhone"
          render={({ field, fieldState }) => (
            <>
              <AppInput
                value={field.value}
                onChangeText={field.onChange}
                label={t('venueEdit.contactPhoneLabel')}
                placeholder={t('venueEdit.contactPhonePlaceholder')}
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
                autoCorrect={false}
                error={fieldState.invalid}
              />
              <FormError message={errorText(fieldState.error?.message)} />
            </>
          )}
        />
        <Controller
          control={control}
          name="paymentInstructions"
          render={({ field, fieldState }) => (
            <>
              <AppInput
                value={field.value}
                onChangeText={field.onChange}
                label={t('venueEdit.paymentInstructionsLabel')}
                placeholder={t('venueEdit.paymentInstructionsPlaceholder')}
                error={fieldState.invalid}
              />
              <FormError message={errorText(fieldState.error?.message)} />
            </>
          )}
        />

        <AppTypography variant="subtitle2" accessibilityRole="header">
          {t('venueEdit.sectionPolicy')}
        </AppTypography>
        <NumberField
          control={control}
          name="depositPercent"
          label={t('venueEdit.depositPercentLabel')}
          errorText={errorText}
        />
        <NumberField
          control={control}
          name="holdMinutes"
          label={t('venueEdit.holdMinutesLabel')}
          errorText={errorText}
        />
        <NumberField
          control={control}
          name="cancellationWindowHours"
          label={t('venueEdit.cancellationWindowHoursLabel')}
          errorText={errorText}
        />
        <Controller
          control={control}
          name="lateCancelDeposit"
          render={({ field }) => (
            <AppSelect
              value={field.value}
              onChangeValue={(value) => field.onChange(asDepositPolicy(value))}
              options={policyOptions}
              label={t('venueEdit.lateCancelDepositLabel')}
            />
          )}
        />
        <Controller
          control={control}
          name="noShowDeposit"
          render={({ field }) => (
            <AppSelect
              value={field.value}
              onChangeValue={(value) => field.onChange(asDepositPolicy(value))}
              options={policyOptions}
              label={t('venueEdit.noShowDepositLabel')}
            />
          )}
        />
        <Controller
          control={control}
          name="conditionsText"
          render={({ field, fieldState }) => (
            <>
              <AppInput
                value={field.value}
                onChangeText={field.onChange}
                label={t('venueEdit.conditionsTextLabel')}
                error={fieldState.invalid}
              />
              <FormError message={errorText(fieldState.error?.message)} />
            </>
          )}
        />
        <NumberField
          control={control}
          name="bookingHorizonDays"
          label={t('venueEdit.bookingHorizonDaysLabel')}
          errorText={errorText}
        />
      </GapView>
    </Screen>
  );
}

function NumberField({
  control,
  name,
  label,
  errorText,
}: {
  control: Control<VenueEditValues>;
  name: NumberFieldName;
  label: string;
  errorText: (code?: string) => string | null;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <>
          <AppInput
            value={field.value}
            onChangeText={field.onChange}
            label={label}
            keyboardType="number-pad"
            autoCorrect={false}
            error={fieldState.invalid}
          />
          <FormError message={errorText(fieldState.error?.message)} />
        </>
      )}
    />
  );
}
