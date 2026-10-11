import { ZodObject } from "zod";

export function validateAction(formData: FormData, schema: ZodObject){
    const res = schema.safeParse(formData)

    if (!res.success){
        return {
            success: false,
            message: res.error.issues[0]?.message || "The provided input is invalid"
        }
    }
    
    return {
        success: true,
        data: res.data,
    }
}