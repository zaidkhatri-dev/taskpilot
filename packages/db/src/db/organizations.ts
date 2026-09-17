import { uniqueIndex, pgTable } from "drizzle-orm/pg-core";
import { timestamps } from "./shared.js";
import { sql } from "drizzle-orm";
import { text, uuid } from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
    id: uuid("id").primaryKey().default(sql`uuidv7()`),
    name: text("name").notNull(),
    description: text("description"),
    ...timestamps
});