import { NextFunction, Request, Response } from "express";
import type { GetTypeFromSchema } from "../../types/validation.js"
import { generateLinkSchema } from "@repo/validation/auth"
import { generateLinkService } from "./services.js";
import { BaseResponse } from "@repo/contracts/response";

export const generateLinkController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body as GetTypeFromSchema<typeof generateLinkSchema>

        await generateLinkService(email)

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