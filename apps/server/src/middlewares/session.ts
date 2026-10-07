import { serverConfig } from "@repo/config/server";
import { getRedis, initRedis } from "@repo/redis/client";
import { RedisStore } from "connect-redis";
import { getSessionKey } from "@/utils/redis.js";
import { RequestHandler } from "express";
import session from "express-session";

initRedis(serverConfig.REDIS_URL);

let redisStore = new RedisStore({
    client: getRedis(),
    prefix: getSessionKey(""),
    ttl: serverConfig.SESSION_LIFESPAN / 1000
})

export const sessionHandler: RequestHandler = session({
    store: redisStore,
    secret: serverConfig.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: serverConfig.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "none",
        maxAge: serverConfig.SESSION_LIFESPAN,
    },
    rolling: true
})