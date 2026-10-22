import z from "zod";
import { emailSchema } from "./shared.js";

export const generateMagicLinkSchema = z.object({
  email: emailSchema,
});

export const verifyMagicLinkSchema = z.object({
  token: z.string().length(64, "The provided URL is invalid"),
});
