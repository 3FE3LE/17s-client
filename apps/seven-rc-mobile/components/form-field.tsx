import { Feather } from '@expo/vector-icons';
import { inputRecipe, useAppTheme } from '@17suit/ui-native';
import { useId, useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';

type FieldKind = 'email' | 'password' | 'new-password' | 'code';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  kind: FieldKind;
  placeholder?: string;
  /** Inline error, announced politely by screen readers. */
  error?: string | null;
  onSubmitEditing?: () => void;
  returnKeyType?: TextInputProps['returnKeyType'];
}

const KIND_PROPS: Record<FieldKind, Partial<TextInputProps>> = {
  email: {
    keyboardType: 'email-address',
    textContentType: 'emailAddress',
    autoComplete: 'email',
    autoCapitalize: 'none',
    autoCorrect: false,
    spellCheck: false,
    inputMode: 'email',
  },
  password: {
    textContentType: 'password',
    autoComplete: 'current-password',
    autoCapitalize: 'none',
    autoCorrect: false,
    spellCheck: false,
    secureTextEntry: true,
  },
  'new-password': {
    textContentType: 'newPassword',
    autoComplete: 'new-password',
    autoCapitalize: 'none',
    autoCorrect: false,
    spellCheck: false,
    secureTextEntry: true,
    passwordRules: 'minlength: 8;',
  },
  code: {
    keyboardType: 'number-pad',
    textContentType: 'oneTimeCode',
    autoComplete: 'one-time-code',
    autoCapitalize: 'none',
    autoCorrect: false,
    spellCheck: false,
    inputMode: 'numeric',
  },
};

/**
 * Auth form input with a visible label and the platform autofill hints
 * (`textContentType` / `autoComplete`) that `AppInput` does not expose yet.
 */
export function FormField({
  label,
  value,
  onChangeText,
  kind,
  placeholder,
  error,
  onSubmitEditing,
  returnKeyType,
}: FormFieldProps) {
  const { theme } = useAppTheme();
  const nativeId = useId();
  const [revealed, setRevealed] = useState(false);
  const isSecret = kind === 'password' || kind === 'new-password';
  const classes = inputRecipe({
    state: error ? 'error' : 'default',
    compact: false,
    hasLeftAccessory: false,
    hasRightAccessory: isSecret,
    platform: 'native',
  });
  const { secureTextEntry, ...kindProps } = KIND_PROPS[kind];

  return (
    <View className={classes.root}>
      <Text nativeID={`${nativeId}-label`} className={classes.fieldLabel}>
        {label}
      </Text>
      <View className="relative w-full">
        <TextInput
          {...kindProps}
          secureTextEntry={Boolean(secureTextEntry) && !revealed}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.muted}
          accessibilityLabel={label}
          accessibilityLabelledBy={`${nativeId}-label`}
          {...(error ? { accessibilityHint: error } : {})}
          {...(onSubmitEditing ? { onSubmitEditing } : {})}
          {...(returnKeyType ? { returnKeyType } : {})}
          className={classes.control}
          style={{ color: theme.colors.text }}
        />
        {isSecret ? (
          <Pressable
            onPress={() => setRevealed((current) => !current)}
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            hitSlop={10}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 44,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name={revealed ? 'eye-off' : 'eye'} size={18} color={theme.colors.muted} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
          style={{ color: theme.colors.error, fontSize: 13, lineHeight: 18 }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

/** Form-level error (e.g. wrong password from Clerk), rendered next to the submit button. */
export function FormError({ message }: { message: string | null }) {
  const { theme } = useAppTheme();
  if (!message) return null;
  return (
    <Text
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={{ color: theme.colors.error, fontSize: 13, lineHeight: 18 }}
    >
      {message}
    </Text>
  );
}
