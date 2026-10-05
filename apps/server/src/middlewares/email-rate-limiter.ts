import { getCounterKey } from "@/utils/redis.js";
import { getValue, incrValue } from "@modules/auth/repository.js";
import { config } from "@repo/config";
import { AppError } from "@repo/errors/app-error";
import type { NextFunction, Request, Response } from "express";

export const emailRateLimiter = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.body.email
        const COUNTER_KEY = getCounterKey(email)

        const val = await getValue(COUNTER_KEY)
    
        if (val === null){
            await incrValue(COUNTER_KEY, config.AUTH_TOKEN_EXPIRY_TIME)
        } 
        else if (Number(val) < config.RATE_LIMIT_PER_EMAIL){
            await incrValue(COUNTER_KEY)
        }
        else {
            throw new AppError(`You have made too many requests. Please try again after some time`, 403)
        }
    } catch (error) {
        next(error)
    }
    next()
}