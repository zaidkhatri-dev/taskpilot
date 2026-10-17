import { index, pgTable, check } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { text, uuid } from "drizzle-orm/pg-core";
import { sections } from "./sections.js";
import { users } from "./users.js";
import { TITLE_LENGTH_CHECK } from "../constraints.js";

export const issues = pgTable(
  "issues",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),
    title: text("title").notNull(),
    description: text("description"),
    sectionId: uuid("section_id")
      .notNull()
      .references(() => sections.id, { onDelete: "restrict" }),
    assignedToId: uuid("assigned_to_id")
      .notNull()
      .references(() => users.id, { onDelete: "set null" }),
    position: text("position").notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(TITLE_LENGTH_CHECK, sql`length(${table.title}) between 1 and 200`),
    index("section_id_position_idx").on(table.sectionId, table.position),
  ],
);
