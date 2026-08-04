'use client';

interface SmallButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  title?: string;
  disabled?: boolean;
  /** Visual hierarchy. `primary` is filled-dark; default is bordered. */
  variant?: 'default' | 'primary' | 'ghost';
  /** Toggle button semantics for screen readers. */
  pressed?: boolean;
}

/**
 * Pill-style button used across controls. Three clearly distinct states:
 *
 *  - idle   — bordered, transparent; subtle hover (border + bg).
 *  - hover  — border darkens, soft background appears.
 *  - focus  — keyboard-visible ring (focus-visible:ring-2).
 *  - active — filled-dark, text inverts (or filled-light for ghost).
 *
 * Disabled dims opacity 40% and removes hover. Active has visual ring to
 * distinguish "selected" from "you moused over this".
 */
export function SmallButton({
  children,
  onClick,
  active,
  title,
  disabled,
  variant = 'default',
  pressed,
}: SmallButtonProps) {
  const base =
    'inline-flex items-center gap-1 rounded border px-3 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40';
  const variants: Record<NonNullable<SmallButtonProps['variant']>, string> = {
    default: active
      ? 'border-foreground bg-foreground text-background shadow-inner'
      : 'border-border bg-background text-foreground hover:border-foreground hover:bg-foreground/10',
    primary: active
      ? 'border-foreground bg-foreground text-background shadow-inner'
      : 'border-foreground bg-foreground/90 text-background hover:bg-foreground',
    ghost: active
      ? 'border-foreground/40 bg-foreground/15 text-foreground shadow-inner'
      : 'border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-pressed={pressed ?? active}
      className={`${base} ${variants[variant]} ${
        disabled ? 'pointer-events-none cursor-not-allowed opacity-40' : ''
      }`}
    >
      {active ? (
        <span aria-hidden className="text-[10px]">
          ●
        </span>
      ) : null}
      {children}
    </button>
  );
}
