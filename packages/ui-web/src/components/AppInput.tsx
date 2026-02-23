import { Eye, EyeOff } from 'lucide-react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { useState } from 'react';
import { useAppTheme } from '../theme/theme-context';

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
  const { theme } = useAppTheme();
  const bodyType = theme.typography.styles.body;
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
  const inputPaddingLeft = leftIcon ? 40 : theme.sizes.control.inputPaddingX;
  const hasRightAction = Boolean(shouldShowPasswordToggle || rightIcon);
  const inputPaddingRight = hasRightAction ? 40 : theme.sizes.control.inputPaddingX;

  return (
    <div
      style={{
        width: '100%',
        display: 'grid',
        gap: theme.spacing.xs,
      }}
    >
      {resolvedLabel ? (
        <label
          style={{
            color: theme.colors.muted,
            fontFamily: bodyType.webFamily,
            fontSize: theme.fontSizes.sm,
            lineHeight: `${bodyType.lineHeightRecommended}`,
            fontWeight: bodyType.fontWeight,
            letterSpacing: bodyType.letterSpacingEm,
          }}
        >
          {resolvedLabel}
        </label>
      ) : null}
      <div
        style={{
          position: 'relative',
          width: '100%',
        }}
      >
        {leftIcon ? (
          <span
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'inline-flex',
              alignItems: 'center',
              color: theme.colors.muted,
            }}
          >
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
          onChange={(event) =>
            onChangeText(
              (
                event.target as unknown as {
                  value: string;
                }
              ).value,
            )
          }
          style={{
            width: '100%',
            height: compact ? theme.sizes.control.sm : theme.sizes.control.md,
            borderRadius: theme.borderRadius.md,
            border: `1px solid ${error ? theme.colors.destructive : theme.grayscale[3]}`,
            background: theme.colors.surface,
            color: disabled ? theme.colors.muted : theme.colors.text,
            opacity: disabled ? 0.75 : 1,
            paddingLeft: inputPaddingLeft,
            paddingRight: inputPaddingRight,
            fontFamily: bodyType.webFamily,
            fontSize: bodyType.fontSize,
            lineHeight: `${bodyType.lineHeightRecommended}`,
            fontWeight: bodyType.fontWeight,
            letterSpacing: bodyType.letterSpacingEm,
          }}
        />
        {shouldShowPasswordToggle ? (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((current) => !current)}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 24,
              height: 24,
              border: 'none',
              background: 'transparent',
              padding: 0,
              margin: 0,
              cursor: 'pointer',
              color: theme.colors.muted,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={isPasswordVisible ? 'Ocultar contrasena' : 'Mostrar contrasena'}
          >
            {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : null}
        {!shouldShowPasswordToggle && rightIcon ? (
          <button
            type="button"
            onClick={onRightIconPress}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 24,
              height: 24,
              border: 'none',
              background: 'transparent',
              padding: 0,
              margin: 0,
              cursor: onRightIconPress ? 'pointer' : 'default',
              color: theme.colors.muted,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Input action"
          >
            {rightIcon}
          </button>
        ) : null}
      </div>
    </div>
  );
}
