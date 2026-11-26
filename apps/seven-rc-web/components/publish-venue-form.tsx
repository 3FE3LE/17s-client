'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { SevenRcApiError } from '@17suit/module-seven-reservations-club';
import { AppBadge, AppButton, cx } from '@17suit/ui';
import { HintedInput, InlineError, InlineStatus } from '@/components/seven-rc-ui';
import { useUpdateVenueSettingsMutation, type OwnerVenue } from '@/lib/owner-queries';
import { describeError } from '@/lib/seven-rc-errors';

/** Mirrors the server rule (`VENUE_SLUG_PATTERN`, max 60). */
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const SLUG_MAX = 60;

function suggestSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX)
    .replace(/-+$/g, '');
}

const slugSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, 'Escribe el enlace de tu complejo.')
    .max(SLUG_MAX, `Usa máximo ${SLUG_MAX} caracteres.`)
    .regex(
      SLUG_PATTERN,
      'Usa solo minúsculas, números y guiones, sin guiones al inicio, al final ni repetidos.',
    ),
});
type SlugValues = z.infer<typeof slugSchema>;

function isSlugTaken(error: unknown): boolean {
  if (error instanceof SevenRcApiError && error.status === 409) return true;
  return error instanceof Error && /^Slug already taken/i.test(error.message);
}

export interface PublishVenueFormProps {
  venue: OwnerVenue;
  /** What the venue still lacks to be bookable; empty when it can be published. */
  missing: string[];
}

export function PublishVenueForm({ venue, missing }: PublishVenueFormProps) {
  const mutation = useUpdateVenueSettingsMutation(venue.id);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { control, handleSubmit, setError, watch } = useForm<SlugValues>({
    resolver: zodResolver(slugSchema),
    defaultValues: { slug: venue.slug ?? suggestSlug(venue.name) },
  });
  const slug = watch('slug');

  const savedSlug = venue.slug ?? null;
  const published = venue.isPublished;
  const publicPath = savedSlug ? `/c/${savedSlug}` : null;
  const canPublish = Boolean(savedSlug) && missing.length === 0;

  async function save(input: { slug?: string; isPublished?: boolean }, success: string) {
    setFormError(null);
    setNotice(null);
    try {
      await mutation.mutateAsync(input);
      setNotice(success);
    } catch (caught) {
      if (input.slug !== undefined && isSlugTaken(caught)) {
        setError('slug', { message: 'Ese enlace ya lo usa otro complejo. Prueba con otro.' });
        return;
      }
      setFormError(describeError(caught, 'No se pudo guardar. Intenta de nuevo.'));
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    if (values.slug === savedSlug) {
      setNotice('Ese ya es el enlace de tu complejo.');
      return;
    }
    await save({ slug: values.slug }, 'Guardaste el enlace.');
  });

  async function copyLink() {
    if (!publicPath) return;
    setFormError(null);
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${publicPath}`);
      setNotice('Enlace copiado.');
    } catch {
      setNotice(null);
      setFormError('No se pudo copiar. Selecciona el enlace y cópialo a mano.');
    }
  }

  const toggleDisabled = mutation.isPending || (!published && !canPublish);

  return (
    <section aria-labelledby="publicar-title" className="grid gap-md">
      <div className="grid gap-xs">
        <div className="flex flex-wrap items-center gap-sm">
          <h3 id="publicar-title" className="m-0 font-arvo text-md text-text">
            Página pública
          </h3>
          <AppBadge variant={published ? 'success' : 'neutral'}>
            {published ? 'Publicada' : 'Sin publicar'}
          </AppBadge>
        </div>
        <p className="m-0 max-w-[var(--container-measure)] text-sm leading-[18px] text-muted">
          Los jugadores ven tus canchas y horarios libres sin crear cuenta. Compártela por WhatsApp
          o redes.
        </p>
      </div>

      <form
        onSubmit={(event) => void onSubmit(event)}
        noValidate
        className="grid gap-sm sm:max-w-[420px]"
      >
        <Controller
          control={control}
          name="slug"
          render={({ field, fieldState }) => (
            <HintedInput
              type="text"
              name="slug"
              label="Enlace de tu complejo"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={SLUG_MAX}
              placeholder="cancha-la-70"
              errorMessage={fieldState.error?.message ?? null}
              value={field.value}
              onChangeText={(value) => field.onChange(value.toLowerCase())}
              onBlur={field.onBlur}
              hint={`Quedará como /c/${slug.trim() || 'tu-enlace'}. Solo minúsculas, números y guiones.`}
            />
          )}
        />
        <AppButton type="submit" variant="neutral" fullWidth={false} disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando…' : 'Guardar enlace'}
        </AppButton>
      </form>

      <div className="grid gap-sm rounded-[var(--radius-md)] border border-border-default p-md">
        <div className="flex flex-wrap items-center justify-between gap-sm">
          <p id="publicar-switch-label" className="m-0 font-bold leading-[1.3] text-text">
            Mostrar mi página a los jugadores
          </p>
          <button
            type="button"
            role="switch"
            aria-checked={published}
            aria-labelledby="publicar-switch-label"
            aria-describedby="publicar-switch-help"
            disabled={toggleDisabled}
            onClick={() =>
              void save(
                { isPublished: !published },
                published
                  ? 'Despublicaste el complejo. El enlace ya no abre.'
                  : 'Publicaste el complejo. Ya pueden verlo y reservar.',
              )
            }
            className={cx(
              'relative inline-flex h-11 w-[72px] shrink-0 cursor-pointer items-center rounded-full border border-border-strong p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50',
              published ? 'bg-success' : 'bg-background',
            )}
          >
            <span
              aria-hidden
              className={cx(
                'h-8 w-8 rounded-full bg-text transition-transform',
                published ? 'translate-x-7' : 'translate-x-0',
              )}
            />
            <span className="sr-only">{published ? 'Publicada' : 'Sin publicar'}</span>
          </button>
        </div>
        <div id="publicar-switch-help" className="grid gap-xs">
          {published ? (
            <p className="m-0 text-sm leading-[18px] text-muted">
              Al despublicar, el enlace deja de abrir (error 404) y no entran reservas nuevas por
              ahí.
            </p>
          ) : !savedSlug ? (
            <p className="m-0 text-sm leading-[18px] text-muted">
              Primero guarda el enlace de tu complejo.
            </p>
          ) : missing.length > 0 ? (
            <>
              <p className="m-0 text-sm leading-[18px] text-text">Para publicar falta:</p>
              <ul className="m-0 grid list-disc gap-[2px] pl-md text-sm leading-[18px] text-muted">
                {missing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="m-0 text-sm leading-[18px] text-muted">
              Todo listo. Al publicar, cualquiera con el enlace verá tus horarios.
            </p>
          )}
        </div>

        {publicPath ? (
          <div className="flex flex-wrap items-center gap-sm border-t border-border-default pt-sm">
            <a
              href={publicPath}
              target="_blank"
              rel="noopener noreferrer"
              className="min-w-0 break-all text-sm text-text underline underline-offset-4"
            >
              {publicPath}
              <span className="sr-only"> (vista previa, se abre en otra pestaña)</span>
            </a>
            <AppButton
              type="button"
              variant="neutral"
              fullWidth={false}
              onPress={() => void copyLink()}
            >
              Copiar enlace
            </AppButton>
          </div>
        ) : null}
        {publicPath && !published ? (
          <p className="m-0 text-sm leading-[18px] text-muted">
            Mientras no publiques, la vista previa muestra “no encontrado”.
          </p>
        ) : null}
      </div>

      <InlineError message={formError} />
      <InlineStatus message={notice} />
    </section>
  );
}
