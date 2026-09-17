import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from "@repo/config"
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: config.DATABASE_URL,
    max: config.DB_MAX_POOL_SIZE,
    idleTimeoutMillis: config.DB_IDLE_TIMEOUT,
    connectionTimeoutMillis: config.DB_CONNECTION_TIMEOUT,
});

export const getDb = () => {
    return drizzle({ client: pool });
}

export const closeDB = async () => {
    await pool.end();
    return true
}