import { check, uniqueIndex, pgTable } from "drizzle-orm/pg-core";
import { timestamps } from "./shared.js";
import { sql } from "drizzle-orm";
import { text, uuid } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
    id: uuid("id").primaryKey().default(sql `uuidv7()`),
    email: text("email").notNull(),
    username: text("username"),
    profilePictureUrl: text("profile_picture_url"),
    ...timestamps
}, (table) => [
    uniqueIndex('email_lower_idx').on(sql `lower(${table.email})`),
    check("valid_email_format", sql `${table.email} ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'`),
    check("valid_username_chars", sql `${table.username} ~* '^[A-Za-z0-9_]+$'`),
    check("username_min_length", sql `${table.username} length >= 3`),
    check("username_max_length", sql `${table.username} length <= 20`)
]);
