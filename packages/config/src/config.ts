import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(8000),
  CORS_ORIGIN: z.url().default('http://localhost:3000'),
  DEFAULT_PAGE_SIZE: z.coerce.number().default(10),
  DEFAULT_PAGE: z.coerce.number().default(1),
  
  APP_NAME: z.string().default('TaskPilot'),
  API_PREFIX: z.string().default("/api/v1"),
  EMAIL_RATE_LIMIT_PER_MINUTE: z.coerce.number().default(50),
  RATE_LIMIT_PER_EMAIL: z.coerce.number().default(5),
  EMAIL_WORKER_CONCURRENCY: z.coerce.number().default(5),
  EMAIL_WORKER_MAX_RETRY: z.coerce.number().default(5),
  EMAIL_WORKER_ATTEMPT_DELAY: z.coerce.number().default(1000 * 10),
  SENDER_EMAIL: z.email(),

  SHUTDOWN_TIMEOUT: z.coerce.number().default(30_000),
  CLEANUP_TIMEOUT: z.coerce.number().default(5_000),

  SESSION_SECRET: z.string(),
  SESSION_LIFESPAN: z.coerce.number().default(1000 * 60 * 60 * 7),
  AUTH_TOKEN_EXPIRY_TIME: z.coerce.number().default(60 * 5),

  DATABASE_URL: z.url(),
  DB_MAX_POOL_SIZE: z.coerce.number().default(10),
  DB_IDLE_TIMEOUT: z.coerce.number().default(30_000),
  DB_CONNECTION_TIMEOUT: z.coerce.number().default(5_000),
  DB_SSL: z.boolean().default(false),

  REDIS_URL: z.url().default('redis://localhost:6379'),

  RESEND_API_KEY: z.string(),
});

const parsedConfig = envSchema.safeParse(process.env);

if (!parsedConfig.success){
    console.error("Invalid environment variables: ", parsedConfig.error.issues.map(iss => ({ [iss.path.join(".")] : iss.message}))) 
    process.exit(1)
}

export const config = parsedConfig.data!;
