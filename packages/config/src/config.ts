import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(8000),
  CORS_ORIGIN: z.url(),
  DEFAULT_PAGE_SIZE: z.coerce.number().default(10),
  DEFAULT_PAGE: z.coerce.number().default(1),
  API_PREFIX: z.string().default("/api/v1"),
  RATE_LIMIT_PER_EMAIL: z.coerce.number().default(10),
  SHUTDOWN_TIMEOUT: z.coerce.number().default(30_000),
  CLEANUP_TIMEOUT: z.coerce.number().default(5_000),

  DATABASE_URL: z.url(),
  DB_MAX_POOL_SIZE: z.coerce.number().default(10),
  DB_IDLE_TIMEOUT: z.coerce.number().default(30_000),
  DB_CONNECTION_TIMEOUT: z.coerce.number().default(5_000),
  DB_SSL: z.boolean().default(false),

  REDIS_URL: z.url(),
});

const parsedConfig = envSchema.safeParse(process.env);

if (!parsedConfig.success){
    console.error("Invalid environment variables: ", parsedConfig.error.issues.map(iss => ({ [iss.path.join(".")] : iss.message}))) 
    process.exit(1)
}

export const config = parsedConfig.data;
