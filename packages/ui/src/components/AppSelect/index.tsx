import type { SelectHTMLAttributes } from 'react';
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
  const bodyType = suitTheme.typography.styles.body;
  const resolvedLabel = label ?? placeholder;

  return (
    <div
      style={{
        width: '100%',
        display: 'grid',
        gap: suitTheme.spacing.xs,
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
        disabled={disabled}
        onChange={(event) => onChangeValue(event.target.value)}
        style={{
          width: '100%',
          minHeight: suitTheme.sizes.control.md,
          borderRadius: suitTheme.borderRadius.md,
          border: `1px solid ${error ? suitTheme.colors.destructive : suitTheme.colors.surface}`,
          background: suitTheme.colors.brandDark,
          color: disabled ? suitTheme.colors.muted : suitTheme.colors.text,
          opacity: disabled ? 0.75 : 1,
          paddingLeft: suitTheme.sizes.control.inputPaddingX,
          paddingRight: suitTheme.sizes.control.inputPaddingX,
          fontFamily: bodyType.webFamily,
          fontSize: bodyType.fontSize,
          lineHeight: `${bodyType.lineHeightRecommended}`,
          fontWeight: bodyType.fontWeight,
          letterSpacing: bodyType.letterSpacingEm,
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
