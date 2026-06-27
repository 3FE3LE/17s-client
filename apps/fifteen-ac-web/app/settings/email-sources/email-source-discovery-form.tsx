'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from '@17suit/ui';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useGmailSync } from './gmail-sync-controls';

const DEFAULT_FINANCE_KEYWORDS =
  'davibank davivienda nu nubank rappicard rappi pse extracto compra pago factura transaccion transferencia tarjeta abono debito credito';

function buildGmailSearchQuery(days: number, keywords: string): string {
  const terms = keywords.trim() || DEFAULT_FINANCE_KEYWORDS;
  const keywordQuery = `{${terms
    .split(/\s+/)
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .join(' ')}}`;
  return `newer_than:${days}d ${keywordQuery}`;
}

const discoveryFormSchema = z.object({
  days: z.coerce
    .number()
    .int('Days must be a whole number.')
    .min(1, 'Days must be at least 1.')
    .max(365, 'Days must be 365 or less.'),
  targetSenderCount: z.coerce
    .number()
    .int('Queue target must be a whole number.')
    .min(1, 'Queue target must be at least 1.')
    .max(100, 'Queue target must be 100 or less.'),
  keywords: z.string().trim().max(500, 'Keywords must be 500 characters or less.').optional(),
});

const discoveryQueryParsers = {
  days: parseAsInteger.withDefault(90),
  targetSenderCount: parseAsInteger.withDefault(50),
  keywords: parseAsString.withDefault(''),
};

type DiscoveryFormValues = z.infer<typeof discoveryFormSchema>;

export function EmailSourceDiscoveryForm() {
  const [queryValues, setQueryValues] = useQueryStates(discoveryQueryParsers, {
    history: 'replace',
    shallow: true,
  });
  const { isSyncing, runSync } = useGmailSync();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<DiscoveryFormValues>({
    resolver: zodResolver(discoveryFormSchema),
    defaultValues: queryValues,
    mode: 'onSubmit',
  });

  const submit = handleSubmit((values) => {
    const keywords = values.keywords?.trim() ?? '';
    void setQueryValues({
      days: values.days,
      targetSenderCount: values.targetSenderCount,
      keywords: keywords || null,
    });
    runSync('recent', {
      searchQuery: buildGmailSearchQuery(values.days, keywords),
      maxResults: 100,
      targetSenderCount: values.targetSenderCount,
    });
  });

  const disabled = isSyncing;

  return (
    <form
      onSubmit={submit}
      className="relative mt-[var(--spacing-lg)] grid gap-3 md:grid-cols-[110px_110px_1fr_auto] md:items-start"
    >
      <label className="grid gap-1 text-sm font-bold text-brand-dark">
        Days
        <input
          {...register('days', { valueAsNumber: true })}
          type="number"
          min="1"
          max="365"
          className="rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.18)] bg-white px-3 py-2 text-sm font-normal text-brand-dark"
        />
        {errors.days ? <FieldError message={errors.days.message} /> : null}
      </label>
      <label className="grid gap-1 text-sm font-bold text-brand-dark">
        Pending senders
        <input
          {...register('targetSenderCount', { valueAsNumber: true })}
          type="number"
          min="1"
          max="100"
          className="rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.18)] bg-white px-3 py-2 text-sm font-normal text-brand-dark"
        />
        {errors.targetSenderCount ? (
          <FieldError message={errors.targetSenderCount.message} />
        ) : null}
      </label>
      <label className="grid gap-1 text-sm font-bold text-brand-dark">
        Keywords
        <input
          {...register('keywords')}
          className="rounded-[var(--radius-md)] border border-[rgba(0,23,31,0.18)] bg-white px-3 py-2 text-sm font-normal text-brand-dark"
          placeholder="Optional keywords"
        />
        {errors.keywords ? <FieldError message={errors.keywords.message} /> : null}
      </label>
      <button
        type="submit"
        disabled={disabled}
        className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[#01695b] bg-[linear-gradient(95deg,#00916e,#007666)] px-4 py-[10px] text-sm font-bold text-white shadow-[0_12px_26px_rgba(0,145,110,0.22)] transition-transform duration-200 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70 md:mt-[22px]"
      >
        <Search size={16} strokeWidth={2.2} aria-hidden />
        {disabled ? 'Discovering' : 'Discover'}
      </button>
    </form>
  );
}

function FieldError({ message }: { message: string | undefined }) {
  if (!message) return null;
  return (
    <p role="alert" className="m-0 text-xs font-medium leading-[1.25] text-[#b42318]">
      {message}
    </p>
  );
}
