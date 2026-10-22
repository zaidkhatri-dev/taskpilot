import { initRedis } from "@repo/redis/client";
import type { MagicLinkPayload } from "@/types/redis.js";
import { users } from "@repo/db/users";
import { initDb } from "@repo/db/client";
import { eq } from "drizzle-orm";
import { serverConfig } from "@repo/config/server";
import { teamMemberships } from "@repo/db/memberships";

// Connect before using Redis.
// Requires top-level await support in your module.
const redisClient = await initRedis(serverConfig.REDIS_URL);

export async function setHValue(
  key: string,
  payload: MagicLinkPayload,
  expireIn: number,
) {
  await redisClient
    .multi()
    .hSet(key, {
      token: payload.token,
      count: String(payload.count),
    })
    .expire(key, expireIn)
    .exec();
}

export async function getHValue(key: string) {
  return await redisClient.hGetAll(key);
}

export async function getHValueByToken(token: string) {
  let cursor = "0";

  do {
    const result = await redisClient.scan(cursor, {
      MATCH: "link:*",
      COUNT: 100,
    });

    cursor = result.cursor;

    for (const key of result.keys) {
      const value = await redisClient.hGetAll(key);

      if (value.token === token) {
        return {
          key,
          value: value as unknown as MagicLinkPayload,
        };
      }
    }
  } while (cursor !== "0");

  return null;
}

export async function delKey(key: string) {
  await redisClient.del(key);
}

const dbClient = initDb({
  DATABASE_URL: serverConfig.DATABASE_URL,
  DB_MAX_POOL_SIZE: serverConfig.DB_MAX_POOL_SIZE,
  DB_CONNECTION_TIMEOUT: serverConfig.DB_CONNECTION_TIMEOUT,
  DB_IDLE_TIMEOUT: serverConfig.DB_IDLE_TIMEOUT,
  DB_SSL: serverConfig.DB_SSL,
});

export async function getUserByEmail(email: string) {
  const [user] = await dbClient
    .select({
      userId: users.id,
      email: users.email,
      avatarId: users.avatarId,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(users)
    .where(eq(users.email, email));

  return user;
}

export async function createUser(email: string) {
  const [user] = await dbClient.insert(users).values({ email }).returning({
    userId: users.id,
    email: users.email,
  });

  return user!;
}

export async function getUserOrganizationStatus(userId: string) {
  const [row] = await dbClient
    .select({ membershipId: teamMemberships.id })
    .from(teamMemberships)
    .where(eq(teamMemberships.userId, userId))
    .limit(1);

  return { hasOrganization: !!row };
}
