import {
  VIA_TIPOS,
  VIA_TIPO_LABEL,
  coAddressFromDraft,
  formatCoAddress,
  type CoAddressDraft,
  type CoAddressErrorKey,
  type CoAddressField,
} from '@17suit/core';
import { AppInput, AppSelect, GapView } from '@17suit/ui-native';
import { Text } from 'react-native';
import { FormError } from './form-field';

const ERROR_TEXT: Record<CoAddressField, Partial<Record<CoAddressErrorKey, string>>> = {
  viaTipo: { required: 'Elige el tipo de vía.' },
  viaNumero: {
    required: 'Escribe el número de la vía.',
    viaNumero: 'Usa un formato como 72, 72A o 72 Bis Sur.',
  },
  cruceNumero: {
    required: 'Escribe el número después del #.',
    cruceNumero: 'Usa solo el número, p. ej. 10 o 10A.',
  },
  placaNumero: {
    required: 'Escribe el número después del guion.',
    placaNumero: 'Usa solo números, hasta 3 dígitos.',
  },
  complemento: { tooLong: 'Usa máximo 80 caracteres.' },
  barrio: { tooLong: 'Usa máximo 80 caracteres.' },
  municipio: {
    required: 'Escribe el municipio.',
    tooShort: 'Escribe al menos 2 letras.',
    tooLong: 'Usa máximo 80 caracteres.',
  },
  departamento: {
    required: 'Escribe el departamento.',
    tooShort: 'Escribe al menos 2 letras.',
    tooLong: 'Usa máximo 80 caracteres.',
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
  const set = (field: CoAddressField, next: string) => onChange({ ...value, [field]: next });
  const message = (field: CoAddressField) => {
    const key = errors[field];
    return key ? (ERROR_TEXT[field][key] ?? 'Revisa este campo.') : null;
  };
  const address = coAddressFromDraft(value);

  const text = (
    field: Exclude<CoAddressField, 'viaTipo'>,
    label: string,
    placeholder: string,
    keyboard?: 'number-pad',
  ) => (
    <>
      <AppInput
        value={value[field]}
        onChangeText={(next) => set(field, next)}
        label={label}
        placeholder={placeholder}
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
        label="Vía (opcional)"
        placeholder="Tipo de vía"
        error={Boolean(errors.viaTipo)}
      />
      <FormError message={message('viaTipo')} />
      {text('viaNumero', 'Número de la vía', 'Ej. 72, 72A, 72 Bis Sur')}
      {text('cruceNumero', 'Número # (cruce)', 'Lo que va después del #')}
      {text('placaNumero', 'Número - (placa)', 'Lo que va después del guion', 'number-pad')}
      {text('municipio', 'Municipio', 'Ej. Medellín')}
      {text('departamento', 'Departamento', 'Ej. Antioquia')}
      {text('barrio', 'Barrio (opcional)', 'Ej. Chapinero')}
      {text('complemento', 'Complemento (opcional)', 'Local, interior, referencia')}
      {address ? (
        <Text accessibilityLiveRegion="polite">Se verá así: {formatCoAddress(address)}</Text>
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
