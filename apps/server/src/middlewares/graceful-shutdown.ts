import type { NextFunction, Request, Response } from "express";
import type { HttpResponse } from "@repo/contracts/http";

export const checkIsServerShuttingDown = (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.isShuttingDown){
        const response: HttpResponse<null> = {
            success: false,
            message: "Server is shutting down",
            data: null
        }
        return res.status(503).json(response)
    }

    next()
}