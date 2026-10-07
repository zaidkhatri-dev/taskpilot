import { check, pgTable } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { text, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { issues } from "./issues.js";

export const comments = pgTable("comments", {
    id: uuid("id").primaryKey().default(sql`uuidv7()`),
    content: text("content").notNull(),
    commentedById: uuid("commented_by_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    issueId: uuid("issue_id").notNull().references(() => issues.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    check("content_not_empty", sql`TRIM(${table.content}) <> ''`)
]);
