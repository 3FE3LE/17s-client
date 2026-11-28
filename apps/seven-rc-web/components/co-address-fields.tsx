'use client';

import {
  VIA_TIPOS,
  coAddressFromDraft,
  formatCoAddress,
  type CoAddressDraft,
  type CoAddressErrorKey,
  type CoAddressField,
} from '@17suit/core';
import { HintedInput, SelectField } from '@/components/seven-rc-ui';
import { useTranslation } from '@17suit/i18n/react';

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
  const { t } = useTranslation('venue');
  const viaOptions = VIA_TIPOS.map((value) => ({ value, label: t(`format:viaTipo.${value}`) }));
  const set = <K extends CoAddressField>(field: K, next: CoAddressDraft[K]) =>
    onChange({ ...value, [field]: next });
  const message = (field: CoAddressField) => {
    const key = errors[field];
    return key
      ? t(`address.errors.${field}.${key}`, { defaultValue: t('address.errors.fallback') })
      : null;
  };
  const preview = (() => {
    const address = coAddressFromDraft(value);
    return address ? formatCoAddress(address) : null;
  })();

  return (
    <fieldset className="m-0 grid gap-sm border-0 p-0">
      <legend className="mb-xs p-0 text-sm text-text">{t('address.legend')}</legend>
      <div className="grid gap-sm md:grid-cols-3">
        <div className="grid content-start gap-sm">
          <SelectField
            label={t('address.viaTipo.label')}
            name="viaTipo"
            value={value.viaTipo}
            onChangeValue={(next) => set('viaTipo', next as CoAddressDraft['viaTipo'])}
            options={viaOptions}
            placeholder={t('address.viaTipo.placeholder')}
          />
          {message('viaTipo') ? (
            <p role="alert" className="m-0 text-sm leading-[18px] text-text">
              {message('viaTipo')}
            </p>
          ) : null}
          <HintedInput
            name="viaNumero"
            label={t('address.viaNumero.label')}
            autoComplete="off"
            spellCheck={false}
            maxLength={20}
            value={value.viaNumero}
            onChangeText={(next) => set('viaNumero', next)}
            hint={t('address.viaNumero.hint')}
            errorMessage={message('viaNumero')}
          />
        </div>
        <HintedInput
          name="cruceNumero"
          label={t('address.cruceNumero.label')}
          autoComplete="off"
          spellCheck={false}
          maxLength={10}
          value={value.cruceNumero}
          onChangeText={(next) => set('cruceNumero', next)}
          hint={t('address.cruceNumero.hint')}
          errorMessage={message('cruceNumero')}
        />
        <HintedInput
          name="placaNumero"
          label={t('address.placaNumero.label')}
          autoComplete="off"
          spellCheck={false}
          inputMode="numeric"
          maxLength={3}
          value={value.placaNumero}
          onChangeText={(next) => set('placaNumero', next)}
          hint={t('address.placaNumero.hint')}
          errorMessage={message('placaNumero')}
        />
      </div>
      <div className="grid gap-sm md:grid-cols-2">
        <HintedInput
          name="municipio"
          label={t('address.municipio.label')}
          autoComplete="address-level2"
          maxLength={80}
          value={value.municipio}
          onChangeText={(next) => set('municipio', next)}
          hint={t('address.municipio.hint')}
          errorMessage={message('municipio')}
        />
        <HintedInput
          name="departamento"
          label={t('address.departamento.label')}
          autoComplete="address-level1"
          maxLength={80}
          value={value.departamento}
          onChangeText={(next) => set('departamento', next)}
          hint={t('address.departamento.hint')}
          errorMessage={message('departamento')}
        />
        <HintedInput
          name="barrio"
          label={t('address.barrio.label')}
          autoComplete="off"
          maxLength={80}
          value={value.barrio}
          onChangeText={(next) => set('barrio', next)}
          hint={t('address.barrio.hint')}
          errorMessage={message('barrio')}
        />
        <HintedInput
          name="complemento"
          label={t('address.complemento.label')}
          autoComplete="off"
          maxLength={80}
          value={value.complemento}
          onChangeText={(next) => set('complemento', next)}
          hint={t('address.complemento.hint')}
          errorMessage={message('complemento')}
        />
      </div>
      {preview ? (
        <p className="m-0 text-sm leading-[18px] text-text-muted" aria-live="polite">
          {t('address.preview')} <strong>{preview}</strong>
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
