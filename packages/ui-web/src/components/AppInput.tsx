'use client';

import { cx, inputRecipe } from '@17suit/design-system';
import { Eye, EyeOff } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { useState } from 'react';

export interface AppInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value' | 'style' | 'placeholder'
> {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  compact?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
  showPasswordToggle?: boolean;
  keyboardType?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: string;
}

export function AppInput({
  value,
  onChangeText,
  label,
  placeholder,
  error = false,
  compact = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  showPasswordToggle = true,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  type,
  ...rest
}: AppInputProps) {
  void keyboardType;
  void autoCapitalize;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = secureTextEntry || type === 'password';
  const shouldShowPasswordToggle = isPasswordField && showPasswordToggle;
  const resolvedType = shouldShowPasswordToggle
    ? isPasswordVisible
      ? 'text'
      : 'password'
    : secureTextEntry && !type
      ? 'password'
      : type;
  const resolvedLabel = label ?? placeholder;
  const hasRightAction = Boolean(shouldShowPasswordToggle || rightIcon);
  const inputClasses = inputRecipe({
    state: error ? 'error' : disabled ? 'disabled' : 'default',
    compact,
    hasLeftAccessory: Boolean(leftIcon),
    hasRightAccessory: hasRightAction,
    platform: 'web',
  });

  return (
    <div className={inputClasses.root}>
      {resolvedLabel ? <label className={inputClasses.fieldLabel}>{resolvedLabel}</label> : null}
      <div className="relative w-full">
        {leftIcon ? (
          <span className="absolute left-3 top-1/2 inline-flex -translate-y-1/2 items-center text-muted">
            {leftIcon}
          </span>
        ) : null}
        <input
          {...rest}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={error}
          type={resolvedType}
          className={cx(inputClasses.control, disabled && 'cursor-not-allowed')}
          onChange={(event) =>
            onChangeText(
              (
                event.target as unknown as {
                  value: string;
                }
              ).value,
            )
          }
        />
        {shouldShowPasswordToggle ? (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((current) => !current)}
            className="absolute right-[10px] top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-muted"
            aria-label={isPasswordVisible ? 'Ocultar contrasena' : 'Mostrar contrasena'}
          >
            {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : null}
        {!shouldShowPasswordToggle && rightIcon ? (
          <button
            type="button"
            onClick={onRightIconPress}
            className="absolute right-[10px] top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center border-0 bg-transparent p-0 text-muted"
            style={{ cursor: onRightIconPress ? 'pointer' : 'default' }}
            aria-label="Input action"
          >
            {rightIcon}
          </button>
        ) : null}
      </div>
    </div>
  );
}
