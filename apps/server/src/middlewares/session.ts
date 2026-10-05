import { config } from "@repo/config";
import { getRedis } from "@repo/redis/client";
import { RedisStore } from "connect-redis";
import { RequestHandler } from "express";
import session from "express-session";

let redisStore = new RedisStore({
    client: getRedis(),
    prefix: "session:",
    ttl: config.SESSION_LIFESPAN / 1000
})

export const sessionHandler: RequestHandler = session({
    store: redisStore,
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: config.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "none",
        maxAge: config.SESSION_LIFESPAN,
    },
    rolling: true
})