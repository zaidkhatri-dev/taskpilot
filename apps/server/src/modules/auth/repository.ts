import { getRedis } from "@repo/redis/client";

const redisClient = getRedis()

export async function setValue (key: string, value: string, expireIn: number) {
    await redisClient
    .multi()
    .set(key, value)
    .expire(key, expireIn)
    .exec()
}

export async function incrValue(key: string, expireIn?: number) {
    const transaction = redisClient.multi().incr(key)
    if (expireIn){
        transaction.expire(key, expireIn)
    }
    await transaction.exec()
}

export async function getValue(key: string) {
    const value = await redisClient.get(key)
    return value
}