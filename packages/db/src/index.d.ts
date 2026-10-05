import { Pool } from 'pg';
export declare const getDb: () => import("drizzle-orm/node-postgres").NodePgDatabase<import("drizzle-orm").EmptyRelations> & {
    $client: Pool;
};
export declare const closeDb: () => Promise<void>;
//# sourceMappingURL=index.d.ts.map