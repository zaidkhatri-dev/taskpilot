import { getRedis } from "@repo/redis/client";
import type { MagicLinkPayload } from "../../types/redis.js";
import { users } from "@repo/db/users";
import { getDb } from "@repo/db/client";
import { eq } from "drizzle-orm";

const redisClient = getRedis()

export async function setHValue(key: string, payload: MagicLinkPayload, expireIn: number) {
    const transaction = redisClient
    .multi()
    .hset(key, payload)
    .expire(key, expireIn)
    
    await transaction.exec()
}

export async function getHValue(key: string) {
    const value = await redisClient.hgetall(key)
    return value
}

export async function getHValueByToken(token: string) {
    let cursor = "0";
    do {
        const [nextCursor, keys] = await redisClient.scan(cursor, "MATCH", "link:*", "COUNT", 100);
        cursor = nextCursor;
        
        for (const key of keys) {
            const value = await redisClient.hgetall(key);
            if (value && value.token === token) {
                return { key, value: value as unknown as MagicLinkPayload };
            }
        }
    } while (cursor !== "0");
    
    return null;
}

export async function delKey(key: string) {
    await redisClient.del(key)
}

const dbClient = getDb()

export async function getUserByEmail(email: string){
    let [user] = await dbClient.select({
        userId: users.id,
        email: users.email
    }).from(users).where(
        eq(users.email, email)
    )
    return user
}

export async function createUser(email: string) {
    const [user] = await dbClient.insert(users).values({
        email
    }).returning({
        userId: users.id,
        email: users.email
    })
    return user!
}

export async function getUserById(id: string) {
    const [user] = await dbClient.select({
        username: users.username,
        profilePictureUrl: users.profilePictureUrl
    }).from(users).where(
        eq(users.id, id)
    )
    return user
}

export async function updateUser(id: string, username: string, profilePictureUrl: string) {
    const [user] = await dbClient.update(users).set({
        username,
        profilePictureUrl
    }).where(
        eq(users.id, id)
    ).returning({
        userId: users.id,
        email: users.email
    })

    return user!
}