import { pgEnum, timestamp } from "drizzle-orm/pg-core";

export const memberRoles = pgEnum("member_role", ["admin", "member"]);

export const timestamps = {
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
}