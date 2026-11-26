'use client';

import { useId } from 'react';
import { LOCALE_LABELS, SUPPORTED_LOCALES, isLocale, type Locale } from '@17suit/i18n';
import { cx } from '@17suit/design-system';

import { ChevronDown, Languages } from '../icons';

export interface LanguageSelectProps {
  value: Locale;
  onChange: (locale: Locale) => void;
  /** Accessible label (translated by the caller). */
  label: string;
  showLabel?: boolean;
  className?: string;
  /** Restrict the offered locales; defaults to every supported one. */
  locales?: readonly Locale[];
}

/**
 * Native `<select>` so keyboard, screen readers and mobile pickers work
 * without ARIA. Options are endonyms ("English", "Español"), never translated.
 */
export function LanguageSelect({
  value,
  onChange,
  label,
  showLabel = false,
  className,
  locales = SUPPORTED_LOCALES,
}: LanguageSelectProps) {
  const id = useId();

  return (
    <div className={cx('grid gap-xs', className)}>
      <label htmlFor={id} className={showLabel ? 'font-zilla text-xs text-muted' : 'sr-only'}>
        {label}
      </label>
      <div className="relative inline-flex items-center">
        <Languages
          aria-hidden
          size={16}
          className="pointer-events-none absolute left-sm text-muted"
        />
        <select
          id={id}
          name="locale"
          value={value}
          onChange={(event) => {
            const next = event.target.value;
            if (isLocale(next)) onChange(next);
          }}
          className="min-h-11 w-full cursor-pointer appearance-none rounded-[var(--radius-control)] border border-border-strong bg-surface py-0 pl-[2.25rem] pr-[2.25rem] font-zilla text-sm text-text focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {locales.map((locale) => (
            <option key={locale} value={locale} lang={locale}>
              {LOCALE_LABELS[locale]}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          size={16}
          className="pointer-events-none absolute right-sm text-muted"
        />
      </div>
    </div>
  );
}
