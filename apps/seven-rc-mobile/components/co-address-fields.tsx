import {
  VIA_TIPOS,
  VIA_TIPO_LABEL,
  coAddressFromDraft,
  formatCoAddress,
  type CoAddressDraft,
  type CoAddressErrorKey,
  type CoAddressField,
} from '@17suit/core';
import { useTranslation } from '@17suit/i18n/react';
import { AppInput, AppSelect, GapView } from '@17suit/ui-native';
import { Text } from 'react-native';
import { FormError } from './form-field';

/** Catalog keys (`mobile` namespace) per field and zod error code. */
const ERROR_TEXT: Record<CoAddressField, Partial<Record<CoAddressErrorKey, string>>> = {
  viaTipo: { required: 'address.errors.viaTipoRequired' },
  viaNumero: {
    required: 'address.errors.viaNumeroRequired',
    viaNumero: 'address.errors.viaNumeroFormat',
  },
  cruceNumero: {
    required: 'address.errors.cruceNumeroRequired',
    cruceNumero: 'address.errors.cruceNumeroFormat',
  },
  placaNumero: {
    required: 'address.errors.placaNumeroRequired',
    placaNumero: 'address.errors.placaNumeroFormat',
  },
  complemento: { tooLong: 'address.errors.tooLong' },
  barrio: { tooLong: 'address.errors.tooLong' },
  municipio: {
    required: 'address.errors.municipioRequired',
    tooShort: 'address.errors.tooShort',
    tooLong: 'address.errors.tooLong',
  },
  departamento: {
    required: 'address.errors.departamentoRequired',
    tooShort: 'address.errors.tooShort',
    tooLong: 'address.errors.tooLong',
  },
};

const VIA_OPTIONS = VIA_TIPOS.map((value) => ({ value, label: VIA_TIPO_LABEL[value] }));

interface Props {
  value: CoAddressDraft;
  onChange: (next: CoAddressDraft) => void;
  errors: Partial<Record<CoAddressField, CoAddressErrorKey>>;
}

/** Colombian address as vía, # cruce, - placa plus place fields. Controlled by the screen. */
export function CoAddressFields({ value, onChange, errors }: Props) {
  const { t } = useTranslation('mobile');
  const set = (field: CoAddressField, next: string) => onChange({ ...value, [field]: next });
  const message = (field: CoAddressField) => {
    const key = errors[field];
    const errorKey = key ? ERROR_TEXT[field][key] : undefined;
    return key ? t(errorKey ?? 'address.errors.invalid') : null;
  };
  const address = coAddressFromDraft(value);

  const text = (
    field: Exclude<CoAddressField, 'viaTipo'>,
    labelKey: string,
    placeholderKey: string,
    keyboard?: 'number-pad',
  ) => (
    <>
      <AppInput
        value={value[field]}
        onChangeText={(next) => set(field, next)}
        label={t(labelKey)}
        placeholder={t(placeholderKey)}
        error={Boolean(errors[field])}
        autoCorrect={false}
        {...(keyboard ? { keyboardType: keyboard } : {})}
      />
      <FormError message={message(field)} />
    </>
  );

  return (
    <GapView gap="md">
      <AppSelect
        value={value.viaTipo}
        onChangeValue={(next) => set('viaTipo', next)}
        options={VIA_OPTIONS}
        label={t('address.viaTipoLabel')}
        placeholder={t('address.viaTipoPlaceholder')}
        error={Boolean(errors.viaTipo)}
      />
      <FormError message={message('viaTipo')} />
      {text('viaNumero', 'address.viaNumeroLabel', 'address.viaNumeroPlaceholder')}
      {text('cruceNumero', 'address.cruceNumeroLabel', 'address.cruceNumeroPlaceholder')}
      {text(
        'placaNumero',
        'address.placaNumeroLabel',
        'address.placaNumeroPlaceholder',
        'number-pad',
      )}
      {text('municipio', 'address.municipioLabel', 'address.municipioPlaceholder')}
      {text('departamento', 'address.departamentoLabel', 'address.departamentoPlaceholder')}
      {text('barrio', 'address.barrioLabel', 'address.barrioPlaceholder')}
      {text('complemento', 'address.complementoLabel', 'address.complementoPlaceholder')}
      {address ? (
        <Text accessibilityLiveRegion="polite">
          {t('address.preview', { address: formatCoAddress(address) })}
        </Text>
      ) : null}
    </GapView>
  );
}

export function addressErrorKeys(
  errors: Partial<Record<CoAddressField, { message?: string }>> | undefined,
): Partial<Record<CoAddressField, CoAddressErrorKey>> {
  const out: Partial<Record<CoAddressField, CoAddressErrorKey>> = {};
  for (const [field, error] of Object.entries(errors ?? {})) {
    if (error?.message) out[field as CoAddressField] = error.message as CoAddressErrorKey;
  }
  return out;
}
