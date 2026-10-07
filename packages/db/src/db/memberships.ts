import { boolean, pgTable, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { organizations } from "./organizations.js";

export const memberRoles = pgEnum("member_role", ["admin", "member"]);

export const membership = pgTable("membership", {
    id: uuid("id").primaryKey().default(sql`uuidv7()`),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    role: memberRoles("role").notNull().default("member"),
    accepted: boolean("accepted").notNull().default(false),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    uniqueIndex('user_org_idx').on(table.userId, table.organizationId)
]);
