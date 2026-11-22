import Link from 'next/link';
import { needsContactLink } from '../lib/clerk-errors';

interface AuthFormErrorProps {
  message: string | null;
}

export function AuthFormError({ message }: AuthFormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <div role="alert" aria-live="polite" className="grid gap-[2px]">
      <p className="m-0 text-sm leading-[18px] text-destructive">{message}</p>
      {needsContactLink(message) ? (
        <Link
          href="/contacto"
          className="inline-flex min-h-11 w-fit items-center text-sm font-bold leading-[18px] text-text underline underline-offset-4"
        >
          Ir a la página de contacto
        </Link>
      ) : null}
    </div>
  );
}
