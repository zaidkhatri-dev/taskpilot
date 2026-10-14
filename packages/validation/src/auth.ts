import z from "zod";
import { emailSchema } from "./shared.js";

export const generateMagicLinkSchema = z.object({
  email: emailSchema,
});

export const verifyMagicLinkSchema = z.object({
  token: z.string().length(64, "The provided URL is invalid"),
});

export const generateOnboardingSchema = (uploadLimit: number) =>
  z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must be at most 20 characters long")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),
    fieldname: z.string(),
    originalname: z.string(),
    mimetype: z.enum(["image/jpeg", "image/jpg", "image/png", "image/webp"]),
    size: z
      .number()
      .max(uploadLimit, "File must be under the allowed size limit"),
  });

export type OnboardingSchema = ReturnType<typeof generateOnboardingSchema>;
