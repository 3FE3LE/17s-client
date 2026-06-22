interface AuthFormErrorProps {
  message: string | null;
}

export function AuthFormError({ message }: AuthFormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p role="alert" aria-live="polite" className="m-0 text-sm leading-[18px] text-destructive">
      {message}
    </p>
  );
}
