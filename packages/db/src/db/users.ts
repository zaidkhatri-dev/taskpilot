import { check, uniqueIndex, pgTable, pgEnum } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { text, uuid } from "drizzle-orm/pg-core";

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
    email: text("email").notNull(),
    username: text("username"),
    avatarId: avatarIds("avatar_id"),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("email_lower_idx").on(sql`lower(${table.email})`),
    check(
      "valid_email_format",
      sql`${table.email} ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'`,
    ),
    check("valid_username_chars", sql`${table.username} ~* '^[A-Za-z0-9_]+$'`),
    check("username_min_length", sql`length(${table.username}) >= 3`),
    check("username_max_length", sql`length(${table.username}) <= 20`),
  ],
);
