// Renders an email so long addresses wrap at the "@" first and, if the domain is
// still too long, inside the domain only. The local part never breaks mid-word.
export function EmailAddress({ email, className }: { email: string; className?: string }) {
  const at = email.lastIndexOf('@');
  if (at <= 0) {
    return <span className={`break-all ${className ?? ''}`}>{email}</span>;
  }
  return (
    <span className={className}>
      {email.slice(0, at)}
      <wbr />
      <span className="break-all">{email.slice(at)}</span>
    </span>
  );
}
