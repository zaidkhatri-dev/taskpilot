import { boolean, pgTable, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { organizations } from "./organizations.js";
import { USER_ORG_IDX } from "../constraints.js";

export const memberRoles = pgEnum("member_role", ["admin", "member"]);

export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: memberRoles("role").notNull().default("member"),
    accepted: boolean("accepted").notNull().default(false),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex(USER_ORG_IDX).on(table.userId, table.organizationId)],
);
