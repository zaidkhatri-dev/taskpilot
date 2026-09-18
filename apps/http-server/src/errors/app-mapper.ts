import { AppError } from "@repo/errors/app-error";
import type { ErrorMapper } from "@/types/error.js";

export const appErrorMapper = (err: AppError): ErrorMapper => {
    return {
        message: err.message,
        statusCode: err.statusCode
    }
}