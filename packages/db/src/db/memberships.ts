import { boolean, pgTable, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { workspaces } from "./workspaces.js";
import { USER_WORKSPACE_IDX } from "../constraints.js";

export const WorkspaceMembershipRoles = pgEnum("workspace_role", ["admin", "member"]);

export const workspaceMemberships = pgTable(
  "workspace_memberships",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    accepted: boolean("accepted").notNull().default(false),
    role: WorkspaceMembershipRoles("role").notNull().default("member"),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex(USER_WORKSPACE_IDX).on(table.userId, table.workspaceId),
  ],
);
