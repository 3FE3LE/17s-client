import { applyServerFieldErrors } from '@17suit/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppButton, AppInput, AppSelect, AppSkeleton, GapView } from '@17suit/ui-native';
import { useState } from 'react';
import { useTranslation } from '@17suit/i18n/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Screen } from '../../../../../components/screen';
import { FormError } from '../../../../../components/form-field';
import { humanizeError } from '../../../../../lib/error-messages';
import { feedback } from '../../../../../lib/feedback';
import { findSport, SPORTS } from '../../../../../lib/sports';
import { useCreateVenuePitchMutation } from '../../../../../lib/owner-queries';

/** Server DTO property to form field, only for fields with an inline error. */
const SERVER_FIELD_MAP = {
  name: 'name',
  capacity: 'capacity',
  slotDurationMinutes: 'slotDurationMinutes',
} as const;

/** Schema messages are `courtNew.errors.*` catalog keys; the screen translates them. */
const createCourtSchema = z.object({
  name: z.string().trim().min(2, 'nameMin'),
  sportType: z.string().trim().min(2, 'sportRequired'),
  capacity: z
    .string()
    .trim()
    .refine((value) => {
      const parsed = Number(value);
      return Number.isInteger(parsed) && parsed >= 1 && parsed <= 100;
    }, 'capacityInvalid'),
  slotDurationMinutes: z
    .string()
    .trim()
    .refine((value) => {
      const parsed = Number(value);
      return Number.isInteger(parsed) && parsed >= 30;
    }, 'durationInvalid'),
});

type CreateCourtFormValues = z.infer<typeof createCourtSchema>;

/** The usual sizes, plus whatever each sport defaults to (soccer 7 needs 14). */
const CAPACITY_VALUES = Array.from(
  new Set([2, 4, 6, 8, 10, 12, ...SPORTS.map((sport) => sport.defaultCapacity)]),
).sort((a, b) => a - b);

const DURATION_VALUES = [30, 45, 60, 75, 90, 120] as const;

export default function CreateCourtScreen() {
  const router = useRouter();
  const { t } = useTranslation('mobile');
  const sportOptions = SPORTS.map(({ value, labelKey }) => ({ value, label: t(labelKey) }));
  const capacityOptions = CAPACITY_VALUES.map((count) => ({
    value: String(count),
    label: t('courtNew.players', { count }),
  }));
  const durationOptions = DURATION_VALUES.map((minutes) => ({
    value: String(minutes),
    label: t('common.minutes', { minutes }),
  }));
  const errorText = (code?: string) =>
    code ? (code.includes(':') ? t(code) : t(`courtNew.errors.${code}`)) : null;
  const { user } = useUser();
  const { role, isLoading } = useCurrentUserRoleQuery({
    userId: user?.id,
    enabled: Boolean(user?.id),
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const params = useLocalSearchParams<{ venueId?: string | string[] }>();
  const venueId = Array.isArray(params.venueId)
    ? (params.venueId[0] ?? null)
    : (params.venueId ?? null);
  const createPitchMutation = useCreateVenuePitchMutation(venueId ?? '');
  const initialSport = findSport('padel');
  const { control, handleSubmit, formState, setValue, setError } = useForm<CreateCourtFormValues>({
    resolver: zodResolver(createCourtSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      sportType: 'padel',
      capacity: String(initialSport?.defaultCapacity ?? 4),
      slotDurationMinutes: String(initialSport?.defaultDurationMinutes ?? 90),
    },
  });

  if (isLoading || !user) {
    return (
      <Screen title={t('courtNew.title')}>
        <AppSkeleton height={220} rounded="lg" />
      </Screen>
    );
  }

  if (role !== 'OWNER' || !venueId) {
    return (
      <Screen title={t('courtNew.title')} subtitle={t('courtNew.forbidden')}>
        <GapView gap="md">
          <AppButton onPress={() => router.replace('/home')}>{t('common.backHome')}</AppButton>
        </GapView>
      </Screen>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const created = await createPitchMutation.mutateAsync({
        name: values.name.trim(),
        sportType: values.sportType.trim(),
        capacity: Number(values.capacity),
        slotDurationMinutes: Number(values.slotDurationMinutes),
      });
      feedback.success(t('courtNew.createdTitle'), t('courtNew.createdMessage'));
      router.replace(`/complexes/${venueId}/courts/${created.id}/slots`);
    } catch (error) {
      if (!applyServerFieldErrors(error, setError, SERVER_FIELD_MAP)) {
        setSubmitError(humanizeError(error, t, 'save'));
      }
    }
  });

  return (
    <Screen
      title={t('courtNew.title')}
      subtitle={t('courtNew.subtitle')}
      footer={
        <>
          <FormError message={submitError} />
          <AppButton
            onPress={onSubmit}
            disabled={!formState.isValid || formState.isSubmitting}
            busy={formState.isSubmitting}
          >
            {formState.isSubmitting ? t('common.creating') : t('courtNew.save')}
          </AppButton>
          <AppButton
            variant="neutral"
            onPress={() => router.back()}
            disabled={formState.isSubmitting}
          >
            {t('common.cancel')}
          </AppButton>
        </>
      }
    >
      <GapView gap="md">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <>
              <AppInput
                value={field.value}
                onChangeText={field.onChange}
                label={t('courtNew.nameLabel')}
                placeholder={t('courtNew.namePlaceholder')}
                error={fieldState.invalid}
              />
              <FormError message={errorText(fieldState.error?.message)} />
            </>
          )}
        />
        <Controller
          control={control}
          name="sportType"
          render={({ field, fieldState }) => (
            <>
              <AppSelect
                value={field.value}
                onChangeValue={(value) => {
                  field.onChange(value);
                  const sport = findSport(value);
                  if (!sport) return;
                  setValue('capacity', String(sport.defaultCapacity), { shouldValidate: true });
                  setValue('slotDurationMinutes', String(sport.defaultDurationMinutes), {
                    shouldValidate: true,
                  });
                }}
                options={sportOptions}
                label={t('courtNew.sportLabel')}
                placeholder={t('courtNew.sportPlaceholder')}
                error={fieldState.invalid}
              />
              <FormError message={errorText(fieldState.error?.message)} />
            </>
          )}
        />
        <Controller
          control={control}
          name="capacity"
          render={({ field, fieldState }) => (
            <>
              <AppSelect
                value={field.value}
                onChangeValue={field.onChange}
                options={capacityOptions}
                label={t('courtNew.capacityLabel')}
                placeholder={t('courtNew.capacityPlaceholder')}
                error={fieldState.invalid}
              />
              <FormError message={errorText(fieldState.error?.message)} />
            </>
          )}
        />
        <Controller
          control={control}
          name="slotDurationMinutes"
          render={({ field, fieldState }) => (
            <>
              <AppSelect
                value={field.value}
                onChangeValue={field.onChange}
                options={durationOptions}
                label={t('slots.durationLabel')}
                placeholder={t('slots.durationPlaceholder')}
                error={fieldState.invalid}
              />
              <FormError message={errorText(fieldState.error?.message)} />
            </>
          )}
        />
      </GapView>
    </Screen>
  );
}
