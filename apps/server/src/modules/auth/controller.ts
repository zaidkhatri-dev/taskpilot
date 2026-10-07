import { NextFunction, Request, Response } from "express";
import type { GetTypeFromSchema } from "../../types/validation.js"
import { generateMagicLinkSchema, VerifyMagicLinkSchema, ProfileSchema } from "@repo/validation/auth"
import { generateMagicLinkService, verifyMagicLinkService, profileService } from "./services.js";
import { DefaultResponse } from "@repo/contracts/response";
import { regenerateSession, saveSession } from "@/utils/session.js";
import { AppError } from "@repo/errors/app-error";

export const generateMagicLinkController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body as GetTypeFromSchema<typeof generateMagicLinkSchema>

        await generateMagicLinkService(email)

        const response: DefaultResponse = {
            success: true,
            message: "If this email exists then a verification link has been sent on it",
            data: null
        }

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

export const verifyMagicLinkController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { url } = req.body as GetTypeFromSchema<VerifyMagicLinkSchema>

        const sessionData = await verifyMagicLinkService(url!)

        await regenerateSession(req)
        
        req.session.userId = sessionData.userId
        req.session.email = sessionData.email
        req.session.isProfileComplete = sessionData.isProfileComplete
        
        await saveSession(req) 
        
        const response: DefaultResponse = {
            success: true,
            message: "Email verified successfully",
            data: null
        }

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

export const profileController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body as GetTypeFromSchema<ProfileSchema>

        const userId = req.session.userId!
        
        if (!req.file){
            throw new AppError("Profile picture is required", 400)
        }

       const sessionData = await profileService(userId, username, req.file)

       await regenerateSession(req)
        
        req.session.userId = sessionData.userId
        req.session.email = sessionData.email
        req.session.isProfileComplete = true
        
        await saveSession(req) 

        const response: DefaultResponse = {
            success: true,
            message: "Profile updated successfully",
            data: null
        }

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}