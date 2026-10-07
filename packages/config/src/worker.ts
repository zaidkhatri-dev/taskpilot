import { z } from "zod";

const workerEnvSchema = z.object({
  EMAIL_RATE_LIMIT_PER_MINUTE: z.coerce.number().default(50),
  EMAIL_WORKER_CONCURRENCY: z.coerce.number().default(5),

  REDIS_URL: z.url().default('redis://localhost:6379'),

  RESEND_API_KEY: z.string(),
});

const parsedWorkerConfig = workerEnvSchema.safeParse(process.env);

if (!parsedWorkerConfig.success) {
  console.error("Invalid environment variables: ", parsedWorkerConfig.error.issues.map(iss => ({ [iss.path.join(".")]: iss.message })));
  process.exit(1);
}

export const workerConfig = parsedWorkerConfig.data!;
