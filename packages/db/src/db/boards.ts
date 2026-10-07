import { pgTable } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { text, uuid } from "drizzle-orm/pg-core";
import { organizations } from "./organizations.js";

export const boards = pgTable("boards", {
    id: uuid("id").primaryKey().default(sql`uuidv7()`),
    title: text("title").notNull(),
    description: text("description"),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
