import { pgTable, check } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { text, uuid } from "drizzle-orm/pg-core";
import { teams } from "./teams.js";
import { NAME_LENGTH_CHECK } from "../constraints.js";

export const boards = pgTable(
  "boards",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),
    name: text("title").notNull(),
    description: text("description"),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(NAME_LENGTH_CHECK, sql`length(${table.name}) between 1 and 100`),
  ],
);
