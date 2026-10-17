import { check, uniqueIndex, pgTable, pgEnum } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { text, uuid } from "drizzle-orm/pg-core";
import {
  EMAIL_FORMAT_CHECK,
  USERNAME_CHARS_CHECK,
  USERNAME_LENGTH_CHECK,
} from "../constraints.js";

export const avatarIds = pgEnum("avatar_id", [
  "avatar_01",
  "avatar_02",
  "avatar_03",
  "avatar_04",
  "avatar_05",
  "avatar_06",
  "avatar_07",
  "avatar_08",
  "avatar_09",
  "avatar_10",
  "avatar_11",
  "avatar_12",
  "avatar_13",
  "avatar_14",
  "avatar_15",
  "avatar_16",
  "avatar_17",
  "avatar_18",
  "avatar_19",
  "avatar_20",
  "avatar_21",
  "avatar_22",
  "avatar_23",
  "avatar_24",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuidv7()`),
    email: text("email").notNull().unique(),
    username: text("username").unique(),
    avatarId: avatarIds("avatar_id"),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check(
      EMAIL_FORMAT_CHECK,
      sql`${table.email} ~* '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$'`,
    ),
    check(USERNAME_CHARS_CHECK, sql`${table.username} ~* '^[a-z0-9_.]+$'`),
    check(
      USERNAME_LENGTH_CHECK,
      sql`length(${table.username}) between 1 and 30`,
    ),
  ],
);
