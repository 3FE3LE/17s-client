import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restablecer contrasena | Nine Care Companion',
};

// TODO: replace with the real forgot-password form once UX lands.
// Day-1 scaffold routes through Clerk's hosted pages via the sign-in flow.
export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-suit-landing-canvas p-[var(--spacing-lg)]">
      <a href="/sign-in?redirect_url=/" className="text-link underline">
        Restablecer contrasena desde el formulario de inicio de sesion.
      </a>
    </main>
  );
}
