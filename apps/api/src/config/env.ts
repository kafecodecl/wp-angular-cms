import { config } from 'dotenv';
import { z } from 'zod';

config({ path: ['.env', '../../.env'], quiet: true });

const optionalUrl = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().url().optional(),
);

const optionalString = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().optional(),
);

const DEV_JWT_SECRET = 'dev-only-secret-change-me-in-production-32';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4001),
  CORS_ORIGINS: z.string().default('http://localhost:4200,http://localhost:4000'),
  JWT_SECRET: z.string().min(32).default(DEV_JWT_SECRET),
  AUTH_COOKIE_NAME: z.string().default('cms_session'),
  AUTH_TOKEN_TTL_HOURS: z.coerce.number().int().positive().default(8),
  ADMIN_USERNAME: z.string().default('admin'),
  ADMIN_DISPLAY_NAME: optionalString,
  ADMIN_PASSWORD_HASH: optionalString,
  WP_URL: optionalUrl,
  WP_USER: optionalString,
  WP_APP_PASSWORD: optionalString,
  WP_REST_PATH: optionalString,
  WP_API: z.enum(['rest', 'graphql']).default('rest'),
  WP_GRAPHQL_URL: optionalUrl,
  REDIS_URL: optionalString,
  DATABASE_URL: optionalString,
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variables de entorno invalidas:', parsed.error.issues);
  process.exit(1);
}

const data = parsed.data;

if (data.NODE_ENV === 'production' && data.JWT_SECRET === DEV_JWT_SECRET) {
  console.error('JWT_SECRET inseguro en produccion. Configura un secreto propio.');
  process.exit(1);
}

export const env = {
  ...data,
  corsOrigins: data.CORS_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export const isWordPressConfigured = Boolean(data.WP_URL);
