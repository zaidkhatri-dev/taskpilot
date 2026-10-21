import { users } from "@repo/db/users";
import { memberships } from "@repo/db/memberships";
import { organizations } from "@repo/db/organizations";
import { initDb } from "@repo/db/client";
import { eq, and, isNull } from "drizzle-orm";
import { serverConfig } from "@repo/config/server";
import type { AvatarIds } from "@repo/contracts/response";

const dbClient = initDb({
  DATABASE_URL: serverConfig.DATABASE_URL,
  DB_MAX_POOL_SIZE: serverConfig.DB_MAX_POOL_SIZE,
  DB_CONNECTION_TIMEOUT: serverConfig.DB_CONNECTION_TIMEOUT,
  DB_IDLE_TIMEOUT: serverConfig.DB_IDLE_TIMEOUT,
  DB_SSL: serverConfig.DB_SSL,
});

export async function getUserById(userId: string) {
  const [user] = await dbClient
    .select({
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      username: users.username,
      avatarId: users.avatarId,
    })
    .from(users)
    .where(eq(users.id, userId));
  return user;
}

export async function getUserByUsername(username: string) {
  const [user] = await dbClient
    .select({ id: users.id, username: users.username })
    .from(users)
    .where(eq(users.username, username));
  return user;
}

export async function getUserAndOrganization(userId: string) {
  const result = await dbClient
    .select({
      username: users.username,
      firstname: users.firstName,
      lastname: users.lastName,
      email: users.email,
      avatarId: users.avatarId,
      organizationName: organizations.name,
      joiningStatus: memberships.accepted,
    })
    .from(users)
    .innerJoin(memberships, eq(memberships.userId, users.id))
    .innerJoin(organizations, eq(memberships.organizationId, organizations.id))
    .where(and(eq(users.id, userId), eq(memberships.role, "member")));

  return result;
}

export async function getUserRole(userId: string) {
  const [user] = await dbClient
    .select({ role: memberships.role })
    .from(memberships)
    .where(eq(memberships.userId, userId));
  return user;
}

export async function onboardUser(
  userId: string,
  username: string,
  avatarId: AvatarIds,
  firstName: string,
  lastName: string,
) {
  const [user] = await dbClient
    .update(users)
    .set({
      username,
      avatarId,
      firstName,
      lastName,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(users.id, userId),
        isNull(users.username),
        isNull(users.avatarId),
        isNull(users.firstName),
        isNull(users.lastName),
      ),
    )
    .returning({
      userId: users.id,
      email: users.email,
    });

  return user;
}

export async function updateUser(
  userId: string,
  username?: string,
  avatarId?: AvatarIds,
  firstName?: string,
  lastName?: string,
) {
  const [user] = await dbClient
    .update(users)
    .set({
      username,
      avatarId,
      firstName,
      lastName,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId))
    .returning({
      userId: users.id,
      email: users.email,
    });

  return user;
}
