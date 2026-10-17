import { check, pgTable } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { text, uuid } from "drizzle-orm/pg-core";
import { boards } from "./boards.js";
import { TITLE_LENGTH_CHECK } from "../constraints.js";

export const sections = pgTable(
  "sections",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),
    title: text("title").notNull(),
    boardId: uuid("board_id")
      .notNull()
      .references(() => boards.id, { onDelete: "cascade" }),
    position: text("position").notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(TITLE_LENGTH_CHECK, sql`length(${table.title}) between 1 and 200`),
  ],
);
