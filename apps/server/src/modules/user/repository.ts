import { users } from "@repo/db/users";
import { initDb } from "@repo/db/client";
import { eq } from "drizzle-orm";
import { serverConfig } from "@repo/config/server";
import { AvatarIds } from "@repo/validation/auth";

const dbClient = initDb({
  DATABASE_URL: serverConfig.DATABASE_URL,
  DB_MAX_POOL_SIZE: serverConfig.DB_MAX_POOL_SIZE,
  DB_CONNECTION_TIMEOUT: serverConfig.DB_CONNECTION_TIMEOUT,
  DB_IDLE_TIMEOUT: serverConfig.DB_IDLE_TIMEOUT,
  DB_SSL: serverConfig.DB_SSL,
});

export async function getUserById(id: string) {
  const [user] = await dbClient
    .select({
      username: users.username,
      avatarId: users.avatarId,
    })
    .from(users)
    .where(eq(users.id, id));
  return user;
}

export async function getUserByUsername(username: string) {
  const [user] = await dbClient
    .select({ id: users.id, username: users.username })
    .from(users)
    .where(eq(users.username, username));
  return user;
}

export async function updateUser(
  id: string,
  username: string,
  avatarId: AvatarIds,
) {
  const [user] = await dbClient
    .update(users)
    .set({
      username,
      avatarId,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning({
      userId: users.id,
      email: users.email,
    });

  return user!;
}
