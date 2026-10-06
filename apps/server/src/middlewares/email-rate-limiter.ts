import { getMagicLinkKey } from "@/utils/redis.js";
import { getHValue } from "@modules/auth/repository.js";
import { config } from "@repo/config";
import { AppError } from "@repo/errors/app-error";
import type { NextFunction, Request, Response } from "express";

export const emailRateLimiter = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.body.email
        const LINK_KEY = getMagicLinkKey(email)

        const val = await getHValue(LINK_KEY)
    
        if (val && Object.keys(val).length > 0){
            if (Number(val.count) >= config.RATE_LIMIT_PER_EMAIL){
                throw new AppError("You have requested too many emails, please try again later", 400)
            }
        }
    } catch (error) {
        next(error)
    }
    next()
}