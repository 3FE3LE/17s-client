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
import { useTranslation } from '@17suit/i18n/react';

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
    .min(1, 'publish.errors.slugRequired')
    .max(SLUG_MAX, 'publish.errors.slugMax')
    .regex(SLUG_PATTERN, 'publish.errors.slugPattern'),
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
  const { t } = useTranslation('venue');
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
        setError('slug', { message: 'publish.slugTaken' });
        return;
      }
      setFormError(describeError(caught, t('publish.saveFailed')));
    }
  }

  const onSubmit = handleSubmit(async (values) => {
    if (values.slug === savedSlug) {
      setNotice(t('publish.sameSlug'));
      return;
    }
    await save({ slug: values.slug }, t('publish.linkSaved'));
  });

  async function copyLink() {
    if (!publicPath) return;
    setFormError(null);
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${publicPath}`);
      setNotice(t('publish.linkCopied'));
    } catch {
      setNotice(null);
      setFormError(t('publish.copyFailed'));
    }
  }

  const toggleDisabled = mutation.isPending || (!published && !canPublish);

  return (
    <section aria-labelledby="publicar-title" className="grid gap-md">
      <div className="grid gap-xs">
        <div className="flex flex-wrap items-center gap-sm">
          <h3 id="publicar-title" className="m-0 font-arvo text-md text-text">
            {t('publish.title')}
          </h3>
          <AppBadge variant={published ? 'success' : 'neutral'}>
            {published ? t('publish.published') : t('publish.unpublished')}
          </AppBadge>
        </div>
        <p className="m-0 max-w-[var(--container-measure)] text-sm leading-[18px] text-muted">
          {t('publish.intro')}
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
              label={t('publish.slug.label')}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={SLUG_MAX}
              placeholder={t('publish.slug.placeholder')}
              errorMessage={
                fieldState.error?.message
                  ? t(fieldState.error.message, {
                      max: SLUG_MAX,
                      defaultValue: fieldState.error.message,
                    })
                  : null
              }
              value={field.value}
              onChangeText={(value) => field.onChange(value.toLowerCase())}
              onBlur={field.onBlur}
              hint={t('publish.slug.hint', { slug: slug.trim() || t('publish.slug.fallback') })}
            />
          )}
        />
        <AppButton type="submit" variant="neutral" fullWidth={false} disabled={mutation.isPending}>
          {mutation.isPending ? t('common.saving') : t('publish.saveLink')}
        </AppButton>
      </form>

      <div className="grid gap-sm rounded-[var(--radius-md)] border border-border-default p-md">
        <div className="flex flex-wrap items-center justify-between gap-sm">
          <p id="publicar-switch-label" className="m-0 font-bold leading-[1.3] text-text">
            {t('publish.showPage')}
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
                published ? t('publish.unpublishedDone') : t('publish.publishedDone'),
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
            <span className="sr-only">
              {published ? t('publish.published') : t('publish.unpublished')}
            </span>
          </button>
        </div>
        <div id="publicar-switch-help" className="grid gap-xs">
          {published ? (
            <p className="m-0 text-sm leading-[18px] text-muted">{t('publish.unpublishHelp')}</p>
          ) : !savedSlug ? (
            <p className="m-0 text-sm leading-[18px] text-muted">{t('publish.saveSlugFirst')}</p>
          ) : missing.length > 0 ? (
            <>
              <p className="m-0 text-sm leading-[18px] text-text">{t('publish.missingIntro')}</p>
              <ul className="m-0 grid list-disc gap-[2px] pl-md text-sm leading-[18px] text-muted">
                {missing.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="m-0 text-sm leading-[18px] text-muted">{t('publish.allReady')}</p>
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
              <span className="sr-only">{t('publish.previewSr')}</span>
            </a>
            <AppButton
              type="button"
              variant="neutral"
              fullWidth={false}
              onPress={() => void copyLink()}
            >
              {t('publish.copyLink')}
            </AppButton>
          </div>
        ) : null}
        {publicPath && !published ? (
          <p className="m-0 text-sm leading-[18px] text-muted">{t('publish.previewNotFound')}</p>
        ) : null}
      </div>

      <InlineError message={formError} />
      <InlineStatus message={notice} />
    </section>
  );
}
