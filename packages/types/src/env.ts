import { z } from 'zod';

export const EnvSchema = z.object({
  // Database & Cache
  DATABASE_URL: z.string().url().default('postgresql://simplifypdf:password@localhost:5432/simplifypdf_db'),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),

  // S3 / MinIO Storage
  S3_ENDPOINT: z.string().url().default('http://localhost:9000'),
  S3_BUCKET_NAME: z.string().default('simplifypdf-files'),
  S3_ACCESS_KEY: z.string().default('minioadmin'),
  S3_SECRET_KEY: z.string().default('minioadmin'),
  AWS_REGION: z.string().default('us-east-1'),

  // ClamAV
  CLAMAV_HOST: z.string().default('localhost'),
  CLAMAV_PORT: z.coerce.number().default(3310),

  // Auth & Security
  NEXTAUTH_SECRET: z.string().min(16).default('simplifypdf_production_nextauth_secret_key_2026'),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  QUOTA_SALT: z.string().default('simplifypdf_daily_guest_salt'),

  // Payment Gateways (Optional in dev, required in prod)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
});

export type Env = z.infer<typeof EnvSchema>;

declare const process: any;

export function validateEnv(env: Record<string, any> = (typeof process !== 'undefined' ? process.env : {})): Env {
  const result = EnvSchema.safeParse(env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Environment variable validation failed');
  }
  return result.data;
}
