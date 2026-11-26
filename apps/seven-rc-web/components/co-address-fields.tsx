'use client';

import {
  VIA_TIPOS,
  VIA_TIPO_LABEL,
  coAddressFromDraft,
  formatCoAddress,
  type CoAddressDraft,
  type CoAddressErrorKey,
  type CoAddressField,
} from '@17suit/core';
import { HintedInput, SelectField } from '@/components/seven-rc-ui';

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

export interface CoAddressFieldsProps {
  value: CoAddressDraft;
  onChange: (next: CoAddressDraft) => void;
  errors: Partial<Record<CoAddressField, CoAddressErrorKey>>;
}

/**
 * Colombian address as the three conventional pieces (vía, # cruce, - placa)
 * plus place fields. Controlled: the parent owns the draft and its errors.
 */
export function CoAddressFields({ value, onChange, errors }: CoAddressFieldsProps) {
  const set = <K extends CoAddressField>(field: K, next: CoAddressDraft[K]) =>
    onChange({ ...value, [field]: next });
  const message = (field: CoAddressField) => {
    const key = errors[field];
    return key ? (ERROR_TEXT[field][key] ?? 'Revisa este campo.') : null;
  };
  const preview = (() => {
    const address = coAddressFromDraft(value);
    return address ? formatCoAddress(address) : null;
  })();

  return (
    <fieldset className="m-0 grid gap-sm border-0 p-0">
      <legend className="mb-xs p-0 text-sm text-text">Dirección (opcional)</legend>
      <div className="grid gap-sm md:grid-cols-3">
        <div className="grid content-start gap-sm">
          <SelectField
            label="Vía"
            name="viaTipo"
            value={value.viaTipo}
            onChangeValue={(next) => set('viaTipo', next as CoAddressDraft['viaTipo'])}
            options={VIA_OPTIONS}
            placeholder="Tipo de vía"
          />
          {message('viaTipo') ? (
            <p role="alert" className="m-0 text-sm leading-[18px] text-text">
              {message('viaTipo')}
            </p>
          ) : null}
          <HintedInput
            name="viaNumero"
            label="Número de la vía"
            autoComplete="off"
            spellCheck={false}
            maxLength={20}
            value={value.viaNumero}
            onChangeText={(next) => set('viaNumero', next)}
            hint="Ej. 72, 72A, 72 Bis Sur"
            errorMessage={message('viaNumero')}
          />
        </div>
        <HintedInput
          name="cruceNumero"
          label="Número # (cruce)"
          autoComplete="off"
          spellCheck={false}
          maxLength={10}
          value={value.cruceNumero}
          onChangeText={(next) => set('cruceNumero', next)}
          hint="Lo que va después del #"
          errorMessage={message('cruceNumero')}
        />
        <HintedInput
          name="placaNumero"
          label="Número - (placa)"
          autoComplete="off"
          spellCheck={false}
          inputMode="numeric"
          maxLength={3}
          value={value.placaNumero}
          onChangeText={(next) => set('placaNumero', next)}
          hint="Lo que va después del guion"
          errorMessage={message('placaNumero')}
        />
      </div>
      <div className="grid gap-sm md:grid-cols-2">
        <HintedInput
          name="municipio"
          label="Municipio"
          autoComplete="address-level2"
          maxLength={80}
          value={value.municipio}
          onChangeText={(next) => set('municipio', next)}
          hint="Ciudad o municipio"
          errorMessage={message('municipio')}
        />
        <HintedInput
          name="departamento"
          label="Departamento"
          autoComplete="address-level1"
          maxLength={80}
          value={value.departamento}
          onChangeText={(next) => set('departamento', next)}
          hint="Ej. Antioquia"
          errorMessage={message('departamento')}
        />
        <HintedInput
          name="barrio"
          label="Barrio (opcional)"
          autoComplete="off"
          maxLength={80}
          value={value.barrio}
          onChangeText={(next) => set('barrio', next)}
          hint="Ayuda a ubicar el complejo"
          errorMessage={message('barrio')}
        />
        <HintedInput
          name="complemento"
          label="Complemento (opcional)"
          autoComplete="off"
          maxLength={80}
          value={value.complemento}
          onChangeText={(next) => set('complemento', next)}
          hint="Local, interior, referencia"
          errorMessage={message('complemento')}
        />
      </div>
      {preview ? (
        <p className="m-0 text-sm leading-[18px] text-text-muted" aria-live="polite">
          Se verá así: <strong>{preview}</strong>
        </p>
      ) : null}
    </fieldset>
  );
}

/** Maps react-hook-form address errors (zod message = error key) to the keys the fields render. */
export function addressErrorKeys(
  errors: Partial<Record<CoAddressField, { message?: string }>> | undefined,
): Partial<Record<CoAddressField, CoAddressErrorKey>> {
  const out: Partial<Record<CoAddressField, CoAddressErrorKey>> = {};
  for (const [field, error] of Object.entries(errors ?? {})) {
    if (error?.message) out[field as CoAddressField] = error.message as CoAddressErrorKey;
  }
  return out;
}
