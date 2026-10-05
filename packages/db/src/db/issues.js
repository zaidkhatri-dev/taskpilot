import { integer, pgTable, check } from "drizzle-orm/pg-core";
import { timestamps } from "./shared.js";
import { sql } from "drizzle-orm";
import { text, uuid } from "drizzle-orm/pg-core";
import { sections } from "./sections.js";
import { boards } from "./boards.js";
export const issues = pgTable("issues", {
    id: uuid("id").primaryKey().default(sql `uuidv7()`),
    title: text("title").notNull(),
    description: text("description"),
    sectionId: uuid("section_id").notNull().references(() => sections.id, { onDelete: "restrict" }),
    boardId: uuid("board_id").notNull().references(() => boards.id, { onDelete: "cascade" }),
    order: integer("order").notNull().default(0),
    ...timestamps
}, (table) => [
    check("order_check", sql `${table.order} >= 0`)
]);
