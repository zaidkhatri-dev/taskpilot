import { Request, Response, NextFunction } from "express";
import { AppError } from "@repo/errors/app-error";
import { ProfileNotCompletedResponse } from "@repo/contracts/response";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.userId || !req.session.email) {
        throw new AppError("Unauthorized access", 401);
    }
    
    if (!req.session.isProfileComplete) {
        const response: ProfileNotCompletedResponse = {
            success: false,
            message: "Please complete your profile before proceeding",
            data: {
                isProfileComplete: false
            }
        }
        
        return res.status(403).json(response);
    }
    
    next();
};