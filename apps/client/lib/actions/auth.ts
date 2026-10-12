'use server'

import { generateMagicLinkSchema } from "@repo/validation/auth"
import { validateAction } from "../utils/validate-action"
import { clientConfig } from "@repo/config/client"
import { type FormActionResponse } from "@repo/contracts/response"

export async function generateLink(
    prevState: FormActionResponse | null | FormData,
    formData?: FormData
): Promise<FormActionResponse> {
    const rawFormData =
        formData instanceof FormData
            ? formData
            : prevState instanceof FormData
            ? prevState
            : new FormData()

    const result = validateAction(rawFormData, generateMagicLinkSchema)

    if (!result.success) {
        // Forward the field `path` so the client form can show an inline error
        // below the exact input that failed validation.
        return {
            success: false,
            message: result.message!,
            data: null,
            path: result.path,
        }
    }

    try {
        const response = await fetch(`${clientConfig.NEXT_PUBLIC_API_URL}/auth/link/generate`, {
            method: "POST",
            body: JSON.stringify(result.data),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        })

        const data: FormActionResponse = await response.json()
        return data
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to send magic link. Please try again.",
            data: null,
        }
    }
}

export async function verifyLink() {
    
}