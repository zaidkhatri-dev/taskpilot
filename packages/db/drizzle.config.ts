import { defineConfig } from 'drizzle-kit';
import { config } from "@repo/config"

export default defineConfig({
  out: './drizzle',
  schema: './src/db/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.DATABASE_URL,
  },
});
