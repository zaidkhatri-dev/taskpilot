import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  CORS_ORIGIN: z.url(),
  DEFAULT_PAGE_SIZE: z.coerce.number().default(10),
  DEFAULT_PAGE: z.coerce.number().default(1),
  API_PREFIX: z.string().default("/api/v1"),
  RATE_LIMIT_PER_EMAIL: z.coerce.number().default(10),
  GRACEFUL_SHUTDOWN_TIMEOUT: z.coerce.number().default(10_000),

  DATABASE_URL: z.url(),
  DB_MAX_POOL_SIZE: z.coerce.number().default(10),
  DB_IDLE_TIMEOUT: z.coerce.number().default(30_000),
  DB_CONNECTION_TIMEOUT: z.coerce.number().default(5_000),

  REDIS_URL: z.url(),
  REDIS_MAX_RETRIES_PER_REQUEST: z.coerce.number().default(3),
  REDIS_CONNECTION_TIMEOUT: z.coerce.number().default(10_000),
  REDIS_KEEP_ALIVE: z.coerce.number().default(30_000),
});

export const config = envSchema.parse(process.env);

