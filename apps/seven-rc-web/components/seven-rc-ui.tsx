'use client';

import {
  AppButton,
  AppInput,
  AppSkeleton,
  RefreshCcw,
  cx,
  inputRecipe,
  type AppInputProps,
} from '@17suit/ui';
import { useId, type ReactNode, type RefObject } from 'react';
import { formatUpdatedAgo } from '@/lib/seven-rc-format';
import { useNow } from '@/lib/use-now';

/**
 * App-local form and feedback primitives for seven-rc-web.
 *
 * SelectField stays on a native <select>: the shared AppSelect does not bind its
 * label to the trigger and keeps its closed options in the tab order, so it
 * fails the "visible + programmatic label" bar for these forms.
 */

export interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChangeValue: (value: string) => void;
  options: ReadonlyArray<{ value: string; label: string }>;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function SelectField({
  label,
  name,
  value,
  onChangeValue,
  options,
  hint,
  required,
  disabled,
  placeholder,
}: SelectFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const classes = inputRecipe({ state: disabled ? 'disabled' : 'default', platform: 'web' });

  return (
    <div className={classes.root}>
      <label htmlFor={id} className={classes.fieldLabel}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        aria-describedby={hint ? hintId : undefined}
        onChange={(event) => onChangeValue(event.target.value)}
        className={cx(classes.control, 'cursor-pointer appearance-auto')}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? (
        <p id={hintId} className="m-0 text-sm leading-[18px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Compact inline error, rendered next to the action that produced it. */
export function InlineError({ message, id }: { message: string | null; id?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="m-0 rounded-[var(--radius-md)] border border-destructive/50 bg-feedback-error-soft px-3 py-2 text-sm leading-[18px] text-text"
    >
      {message}
    </p>
  );
}

/** Polite status line for routine success ("Horarios guardados"). */
export function InlineStatus({ message }: { message: string | null }) {
  return (
    <p aria-live="polite" className="m-0 min-h-[18px] text-sm leading-[18px] text-muted">
      {message ?? ''}
    </p>
  );
}

/** Hint line under a field, tied to the control with aria-describedby. */
function FieldHint({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="m-0 text-sm leading-[18px] text-muted">
      {children}
    </p>
  );
}

/** AppInput plus a persistent hint that says what the value changes. */
export function HintedInput({
  hint,
  errorMessage = null,
  ...props
}: AppInputProps & { hint: ReactNode; errorMessage?: string | null }) {
  const hintId = useId();
  const errorId = `${hintId}-error`;
  return (
    <div className="grid content-start gap-xs">
      <AppInput
        {...props}
        error={Boolean(errorMessage)}
        aria-describedby={errorMessage ? `${hintId} ${errorId}` : hintId}
      />
      <FieldHint id={hintId}>{hint}</FieldHint>
      <InlineError id={errorId} message={errorMessage} />
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  value,
  onChangeValue,
  hint,
  maxLength,
  rows = 3,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChangeValue: (value: string) => void;
  hint?: ReactNode;
  maxLength?: number;
  rows?: number;
  placeholder?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const classes = inputRecipe({ state: 'default', platform: 'web' });
  return (
    <div className={classes.root}>
      <label htmlFor={id} className={classes.fieldLabel}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-describedby={hint ? hintId : undefined}
        onChange={(event) => onChangeValue(event.target.value)}
        className={cx(classes.control, 'h-auto min-h-[88px] resize-y py-2 leading-[1.5]')}
      />
      {hint ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
    </div>
  );
}

export function SectionHeader({
  id,
  title,
  description,
  aside,
}: {
  id: string;
  title: string;
  description?: string;
  aside?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-sm">
      <div className="grid gap-xs">
        <h2 id={id} className="m-0 font-arvo text-xl leading-[1.25] text-text">
          {title}
        </h2>
        {description ? (
          <p className="m-0 max-w-[var(--container-measure)] text-md leading-[1.5] text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {aside}
    </header>
  );
}

export function ListSkeleton({ rows = 3, label }: { rows?: number; label: string }) {
  return (
    <div role="status" aria-label={label} className="grid gap-sm">
      {Array.from({ length: rows }, (_, index) => (
        <AppSkeleton key={index} height={72} rounded="lg" />
      ))}
    </div>
  );
}

export interface ConfirmDialogProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  pendingLabel: string;
  dismissLabel: string;
  isPending: boolean;
  error: string | null;
  onConfirm: () => void;
  onClosed: () => void;
  /** `destructive` (default) for irreversible removals, `primary` for affirmative steps. */
  tone?: 'destructive' | 'primary';
}

/**
 * Native <dialog> confirmation for consequential actions. Open it from the
 * triggering event handler with `dialogRef.current?.showModal()`.
 */
export function ConfirmDialog({
  dialogRef,
  title,
  children,
  confirmLabel,
  pendingLabel,
  dismissLabel,
  isPending,
  error,
  onConfirm,
  onClosed,
  tone = 'destructive',
}: ConfirmDialogProps) {
  const titleId = useId();
  const bodyId = useId();

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      onCancel={(event) => {
        if (isPending) event.preventDefault();
      }}
      onClose={onClosed}
      className="m-auto w-[min(92vw,440px)] rounded-[var(--radius-lg)] border border-border-strong bg-surface p-lg text-text shadow-panel-strong backdrop:bg-brand-dark/50"
    >
      <div className="grid gap-md">
        <h2 id={titleId} className="m-0 font-arvo text-lg leading-[1.3]">
          {title}
        </h2>
        <div id={bodyId} className="grid gap-sm text-md leading-[1.5] text-muted">
          {children}
        </div>
        <InlineError message={error} />
        <div className="flex flex-col-reverse gap-sm sm:flex-row sm:justify-end">
          <AppButton
            variant="neutral"
            fullWidth={false}
            disabled={isPending}
            onPress={() => dialogRef.current?.close()}
          >
            {dismissLabel}
          </AppButton>
          <AppButton
            variant={tone === 'primary' ? 'primary' : 'destructive'}
            fullWidth={false}
            disabled={isPending}
            onPress={onConfirm}
          >
            {isPending ? pendingLabel : confirmLabel}
          </AppButton>
        </div>
      </div>
    </dialog>
  );
}

/** Radio rendered as a selectable chip. Native radios give arrow-key navigation for free. */
export function ChoiceChip({
  name,
  value,
  checked,
  disabled,
  onSelect,
  ariaLabel,
  className,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  onSelect: (value: string) => void;
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label
      className={cx(
        'relative flex min-h-11 cursor-pointer select-none flex-col justify-center rounded-[var(--radius-md)] border border-border-strong bg-surface px-3 py-2 text-text transition-colors',
        'hover:border-action-primary',
        'has-[:checked]:border-action-primary has-[:checked]:bg-action-primary-soft',
        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-action-primary/40',
        'has-[:disabled]:cursor-not-allowed has-[:disabled]:border-border-default has-[:disabled]:bg-transparent has-[:disabled]:text-muted has-[:disabled]:hover:border-border-default',
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      {children}
    </label>
  );
}

/**
 * "Actualizado hace X min" + manual refresh, for lists that poll in the background.
 * The label is not a live region: it ticks every few seconds and would be noise.
 */
export function RefreshControl({
  dataUpdatedAt,
  isFetching,
  onRefresh,
  label = 'Actualizar',
}: {
  dataUpdatedAt: number;
  isFetching: boolean;
  onRefresh: () => void;
  label?: string;
}) {
  const now = useNow();
  return (
    <div className="flex flex-wrap items-center gap-sm">
      <p className="m-0 text-sm leading-[18px] text-muted tabular-nums">
        {isFetching ? 'Actualizando…' : formatUpdatedAgo(dataUpdatedAt, now || dataUpdatedAt)}
      </p>
      <AppButton
        variant="neutral"
        compact
        fullWidth={false}
        aria-busy={isFetching}
        onPress={() => {
          // Stay enabled while fetching so the button keeps keyboard focus.
          if (!isFetching) onRefresh();
        }}
      >
        <span className="inline-flex items-center gap-xs">
          <RefreshCcw
            size={14}
            aria-hidden
            className={isFetching ? 'motion-safe:animate-spin' : ''}
          />
          {label}
        </span>
      </AppButton>
    </div>
  );
}
