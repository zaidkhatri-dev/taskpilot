import { createClient } from "redis";

let redis: ReturnType<typeof createClient> | null = null;

export const initRedis = async (url: string) => {
  if (!redis) {
    redis = createClient({ url });
    await redis.connect();
  }
  return redis!;
};

export const getRedis = () => {
  if (!redis) {
    throw new Error("Redis not initialized. Call initRedis first.");
  }
  return redis;
};

export const closeRedis = async () => {
  if (redis) {
    await redis.quit();
    redis = null;
  }
};
