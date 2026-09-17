import { boolean, pgTable, uniqueIndex } from "drizzle-orm/pg-core";
import { timestamps, memberRoles } from "./shared.js";
import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { organizations } from "./organizations.js";

export const membership = pgTable("membership", {
    id: uuid("id").primaryKey().default(sql`uuidv7()`),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    role: memberRoles("role").notNull().default("member"),
    accepted: boolean("accepted").notNull().default(false),
    ...timestamps
}, (table) => [
    uniqueIndex('user_org_idx').on(table.userId, table.organizationId)
]);