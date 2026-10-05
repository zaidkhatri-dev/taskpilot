import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from "@repo/config";
import { Pool } from 'pg';
const pool = new Pool({
    connectionString: config.DATABASE_URL,
    max: config.DB_MAX_POOL_SIZE,
    connectionTimeoutMillis: config.DB_CONNECTION_TIMEOUT,
    idleTimeoutMillis: config.DB_IDLE_TIMEOUT,
    ssl: config.DB_SSL,
});
export const getDb = () => {
    return drizzle({ client: pool });
};
export const closeDb = async () => {
    await pool.end();
};
