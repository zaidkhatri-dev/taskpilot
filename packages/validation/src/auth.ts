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

export const signupSchema = z.object({
    username: z.string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    fieldname: z.string(),
    originalname: z.string(),
    mimetype: z.enum(["image/jpeg", "image/jpg", "image/png", "image/webp"]),
    size: z.number().max(config.IMAGE_FILE_UPLOAD_LIMIT, "File must be under 5MB"),
})