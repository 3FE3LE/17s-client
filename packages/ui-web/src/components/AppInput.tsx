'use client';

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
  const inputClassName = [
    'h-11 w-full rounded-md border bg-surface px-3 font-zilla text-md leading-[1.5] tracking-normal text-text outline-none transition-colors',
    'placeholder:text-muted',
    compact ? 'h-10' : 'h-11',
    leftIcon ? 'pl-10' : 'pl-3',
    hasRightAction ? 'pr-10' : 'pr-3',
    error ? 'border-destructive' : 'border-black/20',
    disabled ? 'cursor-not-allowed opacity-75' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="grid w-full gap-xs">
      {resolvedLabel ? (
        <label className="font-zilla text-sm leading-[1.5] tracking-normal text-muted">
          {resolvedLabel}
        </label>
      ) : null}
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
          className={inputClassName}
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
