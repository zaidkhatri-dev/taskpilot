'use server'

import { generateMagicLinkSchema } from "@repo/validation/auth"
import { validateAction } from "../utils/validate-action"
import { clientConfig } from "@repo/config/client"

export async function generateLink(formData: FormData) {
    const result = validateAction(formData, generateMagicLinkSchema)

    if (!result.success){
        return result.message
    }
    
    const response = await fetch(`${clientConfig.NEXT_PUBLIC_API_URL}/auth/link/generate`, {
        method: "POST",
        body: JSON.stringify(result.data),
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    })

    const data = await response.json()

    return {
        success: response.ok,
        message: data.message
    }
}