export type FlagValue = boolean | string | number;

export interface FeatureFlagClient {
  isEnabled: (flagKey: string, context?: Record<string, unknown>) => Promise<boolean>;
  getValue: <TValue extends FlagValue>(
    flagKey: string,
    fallback: TValue,
    context?: Record<string, unknown>,
  ) => Promise<TValue>;
}

export class MemoryFeatureFlagClient implements FeatureFlagClient {
  constructor(private readonly flags: Record<string, FlagValue>) {}

  isEnabled(flagKey: string): Promise<boolean> {
    return Promise.resolve(Boolean(this.flags[flagKey]));
  }

  getValue<TValue extends FlagValue>(flagKey: string, fallback: TValue): Promise<TValue> {
    const value = this.flags[flagKey];
    return Promise.resolve((value ?? fallback) as TValue);
  }
}
