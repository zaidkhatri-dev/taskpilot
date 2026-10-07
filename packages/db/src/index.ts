import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export const initDb = (config: {
    DATABASE_URL: string;
    DB_MAX_POOL_SIZE: number;
    DB_CONNECTION_TIMEOUT: number;
    DB_IDLE_TIMEOUT: number;
    DB_SSL: boolean;
}) => {
    if (!pool) {
        pool = new Pool({
            connectionString: config.DATABASE_URL,
            max: config.DB_MAX_POOL_SIZE,
            connectionTimeoutMillis: config.DB_CONNECTION_TIMEOUT,
            idleTimeoutMillis: config.DB_IDLE_TIMEOUT,
            ssl: config.DB_SSL,
        });
        db = drizzle({ client: pool });
    }
    return db!;
};

export const getDb = () => {
    if (!db) {
        throw new Error("Database not initialized. Call initDb first.");
    }
    return db;
}

export const closeDb = async () => {
    if (pool) {
        await pool.end();
        pool = null;
        db = null;
    }
}
