import { getRedis } from "@repo/redis/client";
import { config } from "@repo/config";

export async function setTokenToRedis (token: string, email: string) {
    const KEY = `magic:${token}`
    
    await getRedis()
    .multi()
    .set(KEY, email)
    .expire(KEY, config.AUTH_TOKEN_EXPIRY_TIME)
    .exec()
}