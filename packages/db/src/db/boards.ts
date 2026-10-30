import { pgTable, check, uniqueIndex } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { text, uuid } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces.js";
import { NAME_LENGTH_CHECK, BOARD_NAME_WORKSPACE_IDX } from "../constraints.js";

export const boards = pgTable(
  "boards",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),
    name: text("name").notNull(),
    description: text("description"),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(NAME_LENGTH_CHECK, sql`length(${table.name}) between 1 and 100`),
    uniqueIndex(BOARD_NAME_WORKSPACE_IDX).on(table.name, table.workspaceId),
  ],
);
