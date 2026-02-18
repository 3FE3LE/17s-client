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

  async isEnabled(flagKey: string): Promise<boolean> {
    return Boolean(this.flags[flagKey]);
  }

  async getValue<TValue extends FlagValue>(flagKey: string, fallback: TValue): Promise<TValue> {
    const value = this.flags[flagKey];
    return (value ?? fallback) as TValue;
  }
}
