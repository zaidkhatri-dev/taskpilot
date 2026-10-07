import { Redis } from "ioredis";

let redis: Redis | null = null;

export const initRedis = (url: string) => {
    if (!redis) {
        redis = new Redis(url);
    }
    return redis!;
};

export const getRedis = () => {
    if (!redis) {
        throw new Error("Redis not initialized. Call initRedis first.");
    }
    return redis;
}

export const closeRedis = async () => {
    if (redis) {
        await redis.quit();
        redis = null;
    }
}