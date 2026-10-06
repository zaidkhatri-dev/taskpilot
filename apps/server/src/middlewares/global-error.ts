import { appErrorMapper } from "@/errors/app-mapper.js";
import { dbErrorMapper } from "@/errors/db-mapper.js";
import { validationErrorMapper } from "@/errors/validation-mapper.js";
import type { ErrorMapper } from "@/types/error.js";
import { AppError } from "@repo/errors/app-error";
import type { NextFunction, Request, Response } from "express";
import { DatabaseError } from "pg";
import { ZodError } from "zod";
import type { BaseResponse } from "@repo/contracts/response";

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err)
    }

    let mappedError: ErrorMapper
    
    if (err instanceof ZodError) {
        console.error("[Validation Error]: ", err.issues.map(iss => ({ [iss.path.join(".")] : iss.message})))
        mappedError = validationErrorMapper(err)
    }
    
    else if (err instanceof DatabaseError){
        console.error("[Database Error]: ", err.message)
        mappedError = dbErrorMapper(err)
    }

    else if (err instanceof AppError){
        console.error("[App Error]: ", err.message)
        mappedError = appErrorMapper(err)
    }

    else {
        console.error("[Unknown Error]: ", err)
        mappedError = {
            message: "Something went wrong",
            statusCode: 500
        }
    }

    const response: BaseResponse = {
        success: false,
        message: mappedError.message,
        data: null
    }

    res.status(mappedError.statusCode).json(response)
}