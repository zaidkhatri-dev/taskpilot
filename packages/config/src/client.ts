import { z } from "zod";

const clientEnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    NEXT_PUBLIC_API_URL: z.url().default('http://localhost:8000/api/v1'),
})

const parsedClientConfig = clientEnvSchema.safeParse(process.env)

if (!parsedClientConfig.success) {
    console.error("Invalid environment variables: ", parsedClientConfig.error.issues.map(iss => ({ [iss.path.join(".")]: iss.message })))
    process.exit(1);
}

export const clientConfig = parsedClientConfig.data!
