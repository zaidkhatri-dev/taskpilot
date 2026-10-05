import z from "zod"
import { emailSchema } from "./shared.js"

export const generateLinkSchema = z.object({
    email: emailSchema
})
