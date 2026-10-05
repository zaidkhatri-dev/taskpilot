import { Redis } from "ioredis";
import { config } from "@repo/config";
const redis = new Redis(config.REDIS_URL);
export const getRedis = () => {
    return redis;
};
export const closeRedis = async () => {
    await redis.quit();
};
