import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_ENV: z.enum(['local', 'staging', 'production']).default('local'),
  API_BASE_URL: z.string().url().default('http://localhost:4000/api'),
});

export type AppEnv = z.infer<typeof EnvSchema>;

export function loadEnv(source: Record<string, string | undefined> = process.env): AppEnv {
  return EnvSchema.parse(source);
}
