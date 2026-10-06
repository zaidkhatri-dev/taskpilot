import z from "zod"
import { emailSchema, INVALID_URL_MSG } from "./shared.js"
import { config } from "@repo/config"

export const generateMagicLinkSchema = z.object({
    email: emailSchema
})

export const verifyMagicLinkSchema = z.object({
    url: z.url(INVALID_URL_MSG)
    .regex(new RegExp(`^${config.EMAIL_VERIFICATION_BASE_URL}\\?token=[^&]+$` ), INVALID_URL_MSG)
    .transform((url) => {
        const urlObj = new URL(url)
        return urlObj.searchParams.get("token")
    })
    .refine((token) => (token !== null && token.length > 0 && token.length <= 64), INVALID_URL_MSG)
})
