import { check, pgTable } from "drizzle-orm/pg-core";
import { timestamps } from "./shared.js";
import { sql } from "drizzle-orm";
import { text, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { issues } from "./issues.js";

export const comments = pgTable("comments", {
    id: uuid("id").primaryKey().default(sql`uuidv7()`),
    content: text("content").notNull(),
    commentedById: uuid("commented_by_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    issueId: uuid("issue_id").notNull().references(() => issues.id, { onDelete: "cascade" }),
    ...timestamps
}, (table) => [
    check("content_not_empty", sql`TRIM(${table.content}) <> ''`)
]);