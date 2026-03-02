'use client';

import type { SelectHTMLAttributes } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

export interface AppSelectOption {
  label: string;
  value: string;
}

export interface AppSelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'value' | 'onChange' | 'style'
> {
  value: string;
  onChangeValue: (value: string) => void;
  options: AppSelectOption[];
  label?: string;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}

export function AppSelect({
  value,
  onChangeValue,
  options,
  label,
  placeholder = 'Seleccionar',
  error = false,
  disabled = false,
  ...rest
}: AppSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const resolvedLabel = label ?? placeholder;
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  if (value.trim().length > 0 && selectedOption === null) {
    throw new Error(`[AppSelect] Received value "${value}" that is not present in options.`);
  }

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (!root.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onEscape);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative grid w-full gap-xs">
      {resolvedLabel ? (
        <label className="font-zilla text-sm leading-[1.5] tracking-normal text-muted">
          {resolvedLabel}
        </label>
      ) : null}

      <select
        {...rest}
        value={value}
        onChange={(event) => onChangeValue(event.target.value)}
        tabIndex={-1}
        aria-hidden
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={`hidden-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex min-h-11 w-full items-center justify-between gap-sm rounded-md border bg-surface px-3 text-left font-zilla text-md leading-[1.5] tracking-normal ${
          error ? 'border-destructive' : 'border-black/20'
        } ${disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'} ${
          selectedOption ? 'text-text' : 'text-muted'
        }`}
      >
        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
          {selectedOption?.label ?? placeholder}
        </span>
        <span aria-hidden>{open ? '▲' : '▼'}</span>
      </button>

      <div
        role="listbox"
        aria-hidden={!open}
        className="overflow-hidden rounded-lg border border-black/20 bg-background"
        style={{
          maxHeight: open ? 280 : 0,
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'max-height 180ms ease, opacity 140ms ease, transform 180ms ease',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div className="border-b border-black/20 px-md py-sm font-zilla text-sm leading-[1.5] tracking-normal text-text">
          {resolvedLabel}
        </div>
        <div className="max-h-[220px] overflow-y-auto py-xs">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChangeValue(option.value);
                  setOpen(false);
                }}
                className={`flex min-h-11 w-full items-center justify-between gap-sm border-0 px-md text-left font-zilla text-md leading-[1.5] tracking-normal text-text ${
                  isSelected ? 'bg-surface' : 'bg-transparent'
                }`}
              >
                <span>{option.label}</span>
                {isSelected ? <span aria-hidden>✓</span> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
