'use client';

import {
  coAddressFromDraft,
  draftFromCoAddress,
  parseCoAddress,
  validateCoAddressDraft,
  type CoAddressDraft,
  type CoAddressErrorKey,
  type CoAddressField,
} from '@17suit/core';
import { useState, type FormEvent } from 'react';
import { AppButton } from '@17suit/ui';
import { runAction } from '@17suit/ui/feedback';
import { CoAddressFields } from '@/components/co-address-fields';
import { HintedInput, InlineError, InlineStatus } from '@/components/seven-rc-ui';
import { useUpdateVenueSettingsMutation, type OwnerVenue } from '@/lib/owner-queries';
import { describeError } from '@/lib/seven-rc-errors';

/**
 * Name and address of a saved venue. The address is edited as three
 * pre-filled components; a venue created before structured addresses shows its
 * old text above an empty form until the owner saves the new one.
 */
export function VenueIdentityForm({ venue }: { venue: OwnerVenue }) {
  const mutation = useUpdateVenueSettingsMutation(venue.id);
  const saved = parseCoAddress(venue.addressParts);
  const [name, setName] = useState(venue.name);
  const [address, setAddress] = useState<CoAddressDraft>(() => draftFromCoAddress(saved));
  const [addressErrors, setAddressErrors] = useState<
    Partial<Record<CoAddressField, CoAddressErrorKey>>
  >({});
  const [nameError, setNameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setNotice(null);
    const trimmed = name.trim();
    const nameProblem =
      trimmed.length < 3 ? 'El nombre del complejo necesita al menos 3 caracteres.' : null;
    const nextAddressErrors = validateCoAddressDraft(address);
    setNameError(nameProblem);
    setAddressErrors(nextAddressErrors);
    if (nameProblem || Object.keys(nextAddressErrors).length > 0) {
      setFormError('Revisa los campos marcados.');
      return;
    }
    const addressParts = coAddressFromDraft(address);
    const result = await runAction(
      () =>
        mutation.mutateAsync({
          name: trimmed,
          ...(addressParts ? { addressParts } : {}),
        }),
      { toastError: false, success: 'Datos del complejo guardados.' },
    );
    if (result.ok) {
      setNotice('Datos del complejo guardados.');
    } else {
      setFormError(describeError(result.error, 'No se pudieron guardar los datos del complejo.'));
    }
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      aria-labelledby="datos-complejo-title"
      className="grid gap-sm"
    >
      <h3 id="datos-complejo-title" className="m-0 font-arvo text-md text-text">
        Datos del complejo
      </h3>
      <HintedInput
        name="name"
        label="Nombre del complejo"
        autoComplete="organization"
        required
        minLength={3}
        maxLength={120}
        value={name}
        onChangeText={setName}
        hint="Es el nombre que ven los jugadores."
        errorMessage={nameError}
      />
      {!saved && venue.address ? (
        <p className="m-0 text-sm leading-[18px] text-text-muted">
          Dirección anterior: <strong>{venue.address}</strong>. Completa los campos para
          reemplazarla.
        </p>
      ) : null}
      <CoAddressFields value={address} onChange={setAddress} errors={addressErrors} />
      <div className="grid gap-sm sm:max-w-[280px]">
        <AppButton type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando…' : 'Guardar datos'}
        </AppButton>
      </div>
      <InlineError message={formError} />
      <InlineStatus message={notice} />
    </form>
  );
}
