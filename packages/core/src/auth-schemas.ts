import { z } from 'zod';

/** Shared auth form rules. Messages are stable keys; each app maps them to its catalog. */
export const PASSWORD_MIN_LENGTH = 8;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type AuthErrorKey =
  | 'emailRequired'
  | 'emailInvalid'
  | 'passwordRequired'
  | 'passwordTooShort'
  | 'confirmRequired'
  | 'passwordMismatch'
  | 'codeRequired';

const email = z
  .string()
  .trim()
  .min(1, 'emailRequired' satisfies AuthErrorKey)
  .regex(EMAIL_PATTERN, 'emailInvalid' satisfies AuthErrorKey);

export const emailOnlySchema = z.object({ email });

export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'passwordRequired' satisfies AuthErrorKey),
});

export const signUpSchema = z
  .object({
    email,
    password: z
      .string()
      .min(1, 'passwordRequired' satisfies AuthErrorKey)
      .min(PASSWORD_MIN_LENGTH, 'passwordTooShort' satisfies AuthErrorKey),
    confirmPassword: z.string().min(1, 'confirmRequired' satisfies AuthErrorKey),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'passwordMismatch' satisfies AuthErrorKey,
  });

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'codeRequired' satisfies AuthErrorKey),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;

export const resetPasswordSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, 'codeRequired' satisfies AuthErrorKey),
    password: z
      .string()
      .min(1, 'passwordRequired' satisfies AuthErrorKey)
      .min(PASSWORD_MIN_LENGTH, 'passwordTooShort' satisfies AuthErrorKey),
    confirmPassword: z.string().min(1, 'confirmRequired' satisfies AuthErrorKey),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'passwordMismatch' satisfies AuthErrorKey,
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type EmailOnlyValues = z.infer<typeof emailOnlySchema>;
export type VerifyCodeValues = z.infer<typeof verifyCodeSchema>;
