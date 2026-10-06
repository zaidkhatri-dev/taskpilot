import { NextFunction, Request, Response } from "express";
import type { GetTypeFromSchema } from "../../types/validation.js"
import { generateMagicLinkSchema, signupSchema, verifyMagicLinkSchema } from "@repo/validation/auth"
import { generateMagicLinkService, verifyMagicLinkService, signupService, checkIfSignedUpService } from "./services.js";
import { BaseResponse, IsUserSignedUpResponse } from "@repo/contracts/response";
import { regenerateSession, saveSession } from "@/utils/session.js";
import { AppError } from "@repo/errors/app-error";

export const generateMagicLinkController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body as GetTypeFromSchema<typeof generateMagicLinkSchema>

        await generateMagicLinkService(email)

        const response: BaseResponse = {
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
        const { url } = req.body as GetTypeFromSchema<typeof verifyMagicLinkSchema>

        const sessionData = await verifyMagicLinkService(url!)

        await regenerateSession(req)
        
        req.session.userId = sessionData.userId
        req.session.email = sessionData.email
        
        await saveSession(req) 
        
        const response: BaseResponse = {
            success: true,
            message: "Email verified successfully",
            data: null
        }

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

export const checkIfSignedUpController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.session.userId!
        
        const hasSignedUp = await checkIfSignedUpService(userId)
        
        const response: IsUserSignedUpResponse = {
            success: true,
            message: hasSignedUp ? "User is already signed up" : "Please complete the sign up process before moving forward",
            data: hasSignedUp
        }

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

export const signupController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username } = req.body as GetTypeFromSchema<typeof signupSchema>

        const userId = req.session.userId!
        
        if (!req.file){
            throw new AppError("Profile picture is required", 400)
        }

       const sessionData = await signupService(userId, username, req.file)

       await regenerateSession(req)
        
        req.session.userId = sessionData.userId
        req.session.email = sessionData.email
        
        await saveSession(req) 

        const response: BaseResponse = {
            success: true,
            message: "Profile updated successfully",
            data: null
        }

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}