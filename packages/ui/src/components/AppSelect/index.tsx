import type { SelectHTMLAttributes } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { suitTheme } from '../../theme';

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
  const bodyType = suitTheme.typography.styles.body;
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
    <div
      ref={rootRef}
      style={{
        width: '100%',
        display: 'grid',
        gap: suitTheme.spacing.xs,
        position: 'relative',
      }}
    >
      {resolvedLabel ? (
        <label
          style={{
            color: suitTheme.colors.muted,
            fontFamily: bodyType.webFamily,
            fontSize: suitTheme.fontSizes.sm,
            lineHeight: `${bodyType.lineHeightRecommended}`,
            fontWeight: bodyType.fontWeight,
            letterSpacing: bodyType.letterSpacingEm,
          }}
        >
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
        style={{
          width: '100%',
          minHeight: suitTheme.sizes.control.md,
          borderRadius: suitTheme.borderRadius.md,
          border: `1px solid ${error ? suitTheme.colors.destructive : suitTheme.colors.surface}`,
          background: suitTheme.colors.brandDark,
          color: selectedOption ? suitTheme.colors.text : suitTheme.colors.muted,
          opacity: disabled ? 0.75 : 1,
          paddingLeft: suitTheme.sizes.control.inputPaddingX,
          paddingRight: suitTheme.sizes.control.inputPaddingX,
          fontFamily: bodyType.webFamily,
          fontSize: bodyType.fontSize,
          lineHeight: `${bodyType.lineHeightRecommended}`,
          fontWeight: bodyType.fontWeight,
          letterSpacing: bodyType.letterSpacingEm,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: suitTheme.spacing.sm,
          cursor: disabled ? 'not-allowed' : 'pointer',
          textAlign: 'left',
        }}
      >
        <span
          style={{
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <span aria-hidden>{open ? '▲' : '▼'}</span>
      </button>

      <div
        role="listbox"
        aria-hidden={!open}
        style={{
          borderRadius: suitTheme.borderRadius.lg,
          border: `1px solid ${suitTheme.colors.surface}`,
          background: suitTheme.colors.background,
          overflow: 'hidden',
          maxHeight: open ? 280 : 0,
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'max-height 180ms ease, opacity 140ms ease, transform 180ms ease',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            padding: `${suitTheme.spacing.sm}px ${suitTheme.spacing.md}px`,
            borderBottom: `1px solid ${suitTheme.colors.surface}`,
            color: suitTheme.colors.text,
            fontFamily: bodyType.webFamily,
            fontSize: suitTheme.fontSizes.sm,
            lineHeight: `${bodyType.lineHeightRecommended}`,
            fontWeight: bodyType.fontWeight,
            letterSpacing: bodyType.letterSpacingEm,
          }}
        >
          {resolvedLabel}
        </div>
        <div style={{ maxHeight: 220, overflowY: 'auto', padding: `${suitTheme.spacing.xs}px 0` }}>
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
                style={{
                  width: '100%',
                  minHeight: suitTheme.sizes.control.md,
                  border: 0,
                  background: isSelected ? suitTheme.colors.surface : 'transparent',
                  color: suitTheme.colors.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: suitTheme.spacing.sm,
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: `0 ${suitTheme.spacing.md}px`,
                  fontFamily: bodyType.webFamily,
                  fontSize: bodyType.fontSize,
                  lineHeight: `${bodyType.lineHeightRecommended}`,
                  fontWeight: bodyType.fontWeight,
                  letterSpacing: bodyType.letterSpacingEm,
                }}
              >
                <span>{option.label}</span>
                <span aria-hidden>{isSelected ? '✓' : ''}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
