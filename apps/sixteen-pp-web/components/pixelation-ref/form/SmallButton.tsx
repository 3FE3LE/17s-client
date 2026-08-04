'use client';

interface SmallButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  title?: string;
}

export function SmallButton({ children, onClick, active, title }: SmallButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={[
        'rounded border px-2 py-1 text-[11px] transition-colors',
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border hover:border-foreground/40',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
