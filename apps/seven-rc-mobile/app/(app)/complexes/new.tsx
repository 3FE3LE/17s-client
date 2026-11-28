import {
  EMPTY_CO_ADDRESS_DRAFT,
  applyServerFieldErrors,
  coAddressDraftSchema,
  coAddressFromDraft,
} from '@17suit/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCurrentUserRoleQuery } from '@17suit/module-seven-reservations-club/client';
import { AppButton, AppInput, AppSelect, AppSkeleton, GapView } from '@17suit/ui-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from '@17suit/i18n/react';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { addressErrorKeys, CoAddressFields } from '../../../components/co-address-fields';
import { Screen } from '../../../components/screen';
import { FormError } from '../../../components/form-field';
import { humanizeError } from '../../../lib/error-messages';
import { feedback } from '../../../lib/feedback';
import { IANA_TIMEZONES } from '../../../lib/iana-timezones';
import { timeZoneCity } from '../../../lib/timezone-label';
import { useCreateVenueMutation } from '../../../lib/owner-queries';

/** Schema messages are `venueNew.errors.*` catalog keys; the screen translates them. */
const createComplexSchema = z.object({
  name: z.string().trim().min(3, 'nameMin'),
  timezone: z.string().trim().max(80, 'timezoneMax').optional().or(z.literal('')),
  address: coAddressDraftSchema,
});

type CreateComplexFormValues = z.infer<typeof createComplexSchema>;

function toOptionalValue(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function detectLocalTimezone(): string {
  try {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detected && detected.trim().length > 0) {
      return detected;
    }
  } catch {
    // fallback handled below
  }
  return 'UTC';
}

/** Server DTO property to form field. Address parts have no single inline field. */
const SERVER_FIELD_MAP = { name: 'name' } as const;

export default function CreateComplexScreen() {
  const router = useRouter();
  const { t } = useTranslation('mobile');
  const errorText = (code?: string) =>
    code ? (code.includes(':') ? t(code) : t(`venueNew.errors.${code}`)) : null;
  const { user } = useUser();
  const { role, isLoading } = useCurrentUserRoleQuery({
    userId: user?.id,
    enabled: Boolean(user?.id),
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const detectedTimezone = useMemo(() => detectLocalTimezone(), []);
  const timezoneOptions = useMemo(() => {
    const unique = new Set<string>([detectedTimezone, ...IANA_TIMEZONES]);
    return Array.from(unique).map((value) => ({
      value,
      label: `${timeZoneCity(value, t)} · ${value}`,
    }));
  }, [detectedTimezone, t]);
  const createVenueMutation = useCreateVenueMutation();
  const { control, handleSubmit, formState, setError } = useForm<CreateComplexFormValues>({
    resolver: zodResolver(createComplexSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      timezone: detectedTimezone,
      address: { ...EMPTY_CO_ADDRESS_DRAFT },
    },
  });

  if (isLoading || !user) {
    return (
      <Screen title={t('venueNew.title')}>
        <AppSkeleton height={180} rounded="lg" />
      </Screen>
    );
  }

  if (role !== 'OWNER') {
    return (
      <Screen title={t('venueNew.title')} subtitle={t('venueNew.forbidden')}>
        <GapView gap="md">
          <AppButton onPress={() => router.replace('/home')}>{t('common.backHome')}</AppButton>
        </GapView>
      </Screen>
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const addressParts = coAddressFromDraft(values.address);
      const timezone = toOptionalValue(values.timezone);

      const created = await createVenueMutation.mutateAsync({
        name: values.name.trim(),
        ...(addressParts ? { addressParts } : {}),
        ...(timezone ? { timezone } : {}),
      });
      feedback.success(t('venueNew.createdTitle'), t('venueNew.createdMessage'));
      router.replace(`/complexes/${created.id}`);
    } catch (error) {
      if (!applyServerFieldErrors(error, setError, SERVER_FIELD_MAP)) {
        setSubmitError(humanizeError(error, t, 'save'));
      }
    }
  });

  return (
    <Screen
      title={t('venueNew.title')}
      subtitle={t('venueNew.subtitle')}
      footer={
        <>
          <FormError message={submitError} />
          <AppButton
            onPress={onSubmit}
            disabled={!formState.isValid || formState.isSubmitting}
            busy={formState.isSubmitting}
          >
            {formState.isSubmitting ? t('common.creating') : t('venueNew.save')}
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
                label={t('venueNew.nameLabel')}
                placeholder={t('venueNew.namePlaceholder')}
                error={fieldState.invalid}
              />
              <FormError message={errorText(fieldState.error?.message)} />
            </>
          )}
        />
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
        <Controller
          control={control}
          name="timezone"
          render={({ field, fieldState }) => (
            <>
              <AppSelect
                value={field.value ?? ''}
                onChangeValue={field.onChange}
                options={timezoneOptions}
                label={t('venueNew.timezoneLabel')}
                placeholder={t('venueNew.timezonePlaceholder')}
                searchable
                searchPlaceholder={t('venueNew.timezoneSearch')}
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
