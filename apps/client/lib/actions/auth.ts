'use server'

import { generateMagicLinkSchema } from "@repo/validation/auth"
import { validateAction } from "../utils/validate-action"
import { clientConfig } from "@repo/config/client"
import { type DefaultResponse } from "@repo/contracts/response"

export async function generateLink(formData: FormData): Promise<DefaultResponse> {
    const result = validateAction(formData, generateMagicLinkSchema)

    if (!result.success){
        return {
            success: false,
            message: result.message!,
            data: null
        }
    }
    
    const response = await fetch(`${clientConfig.NEXT_PUBLIC_API_URL}/auth/link/generate`, {
        method: "POST",
        body: JSON.stringify(result.data),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    })

    const data: DefaultResponse = await response.json()

    return data
}