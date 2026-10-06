import { Request, Response, NextFunction } from "express";
import { AppError } from "@repo/errors/app-error";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.userId) {
        throw new AppError("Unauthorized access", 401);
    }
    
    next();
};