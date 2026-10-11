import { ZodObject } from "zod";

export function validateAction(formData: FormData, schema: ZodObject){
    const result = schema.safeParse(formData)

    if (!result.success){
        return {
            success: false,
            message: result.error.issues[0]?.message || "The provided input is invalid"
        }
    }
    
    return {
        success: true,
        data: result.data,
    }
}