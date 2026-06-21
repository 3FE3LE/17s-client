type ClassValue = string | false | null | undefined;

export const cx = (...values: ClassValue[]) => values.filter(Boolean).join(' ');

export type SuitPlatform = 'web' | 'native';

export type ButtonIntent =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'dark'
  | 'success'
  | 'warning'
  | 'info'
  | 'neutral';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'md' | 'pill';

export function buttonRecipe({
  intent = 'primary',
  size = 'md',
  shape = 'pill',
  platform = 'web',
  fullWidth = true,
  disabled = false,
}: {
  intent?: ButtonIntent;
  size?: ButtonSize;
  shape?: ButtonShape;
  platform?: SuitPlatform;
  fullWidth?: boolean;
  disabled?: boolean;
} = {}) {
  const intentClass: Record<ButtonIntent, string> = {
    primary:
      'border-action-primary-border bg-action-primary text-foreground-inverse shadow-action-primary',
    secondary: 'border-border-default bg-surface-control text-brand-dark',
    danger: 'border-destructive/35 bg-feedback-error-soft text-brand-dark',
    dark: 'border-brand-dark bg-brand-dark text-white',
    success: 'border-action-primary/35 bg-action-primary-soft text-brand-dark',
    warning: 'border-warning/35 bg-feedback-warning-soft text-brand-dark',
    info: 'border-info/35 bg-feedback-info-soft text-brand-dark',
    neutral: 'border-border-default bg-brand-light text-brand-dark',
  };
  const sizeClass: Record<ButtonSize, string> = {
    sm: 'min-h-10 px-4 py-2 text-sm',
    md: 'min-h-11 px-md py-sm text-md',
    lg: 'min-h-[52px] px-5 py-[13px] text-md',
  };
  const shapeClass: Record<ButtonShape, string> = {
    md: 'rounded-[var(--radius-md)]',
    pill: 'rounded-full',
  };

  return cx(
    'items-center justify-center border font-zilla font-bold leading-[1.4] tracking-plus1_25',
    platform === 'web' &&
      'inline-flex transition-transform duration-200 enabled:hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action-primary/30',
    platform === 'native' && 'active:opacity-85',
    fullWidth ? 'w-full' : 'w-auto',
    disabled && 'cursor-not-allowed opacity-60',
    shapeClass[shape],
    sizeClass[size],
    intentClass[intent],
  );
}

export function buttonLabelRecipe({ intent = 'primary' }: { intent?: ButtonIntent } = {}) {
  const labelClass: Record<ButtonIntent, string> = {
    primary: 'text-foreground-inverse',
    secondary: 'text-brand-dark',
    danger: 'text-brand-dark',
    dark: 'text-white',
    success: 'text-brand-dark',
    warning: 'text-brand-dark',
    info: 'text-brand-dark',
    neutral: 'text-brand-dark',
  };

  return cx(
    'text-center font-zilla text-md font-bold leading-[22px] tracking-plus1_25',
    labelClass[intent],
  );
}

export type CardVariant = 'panel' | 'list' | 'feature' | 'hero' | 'workspaceHeader' | 'inset';
export type CardShadow = 'none' | 'panel' | 'strong';

export function cardRecipe({
  variant = 'panel',
  shadow = 'none',
}: {
  variant?: CardVariant;
  shadow?: CardShadow;
} = {}) {
  const variantClass: Record<CardVariant, string> = {
    panel: 'rounded-[var(--radius-md)] p-[var(--spacing-md)]',
    list: 'overflow-hidden rounded-[var(--radius-md)] p-0',
    feature: 'rounded-[var(--radius-lg)] p-[var(--spacing-lg)] backdrop-blur-sm',
    hero: 'rounded-[var(--radius-xl)] p-[clamp(24px,4vw,44px)] backdrop-blur-sm',
    workspaceHeader: 'rounded-[var(--radius-xl)] p-[clamp(20px,3vw,36px)] backdrop-blur-sm',
    inset:
      'rounded-[var(--radius-sm)] border-border-hairline bg-surface-inset p-[var(--spacing-sm)]',
  };
  const shadowClass: Record<CardShadow, string> = {
    none: '',
    panel: 'shadow-panel',
    strong: 'shadow-panel-strong',
  };

  return cx(
    'border border-border-default bg-surface-panel',
    variantClass[variant],
    shadowClass[shadow],
  );
}

export type InputState = 'default' | 'error' | 'disabled';

export function inputRecipe({
  state = 'default',
  compact = false,
  hasLeftAccessory = false,
  hasRightAccessory = false,
  platform = 'web',
}: {
  state?: InputState;
  compact?: boolean;
  hasLeftAccessory?: boolean;
  hasRightAccessory?: boolean;
  platform?: SuitPlatform;
} = {}) {
  return {
    root: platform === 'web' ? 'grid w-full gap-xs' : 'w-full',
    label: 'grid gap-1 text-sm font-bold text-brand-dark',
    fieldLabel:
      platform === 'web'
        ? 'font-zilla text-sm leading-[1.5] tracking-normal text-muted'
        : 'mb-xs font-zilla text-sm leading-[21px] text-muted',
    control: cx(
      'w-full rounded-[var(--radius-sm)] border bg-surface font-zilla text-md text-text',
      platform === 'web'
        ? 'outline-none transition-colors placeholder:text-muted'
        : 'leading-[24px]',
      compact ? 'h-10' : 'h-11',
      hasLeftAccessory ? 'pl-10' : 'pl-3',
      hasRightAccessory ? 'pr-10' : 'pr-3',
      state === 'error' ? 'border-destructive' : 'border-border-strong',
      state === 'disabled' && 'opacity-60',
    ),
  } as const;
}

export type PageContainerKind = 'landing' | 'workspace' | 'content';

export function pageContainerRecipe({ kind = 'content' }: { kind?: PageContainerKind } = {}) {
  const kindClass: Record<PageContainerKind, string> = {
    landing:
      'relative z-10 mx-auto max-w-[1080px] px-[var(--spacing-md)] pb-[var(--spacing-x2l)] pt-[var(--spacing-md)] md:px-[var(--spacing-lg)] md:pb-[var(--spacing-x4l)] md:pt-[var(--spacing-lg)]',
    workspace: 'relative z-10 mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[286px_1fr]',
    content:
      'mx-auto w-full max-w-container-content px-[var(--spacing-md)] md:px-[var(--spacing-lg)]',
  };

  return kindClass[kind];
}
