import z from "zod";
import { emailSchema, userNameSchema } from "./shared.js";

export const generateMagicLinkSchema = z.object({
  email: emailSchema,
});

export const verifyMagicLinkSchema = z.object({
  token: z.string().length(64, "The provided URL is invalid"),
});

const avatarIds = [
  "avatar_01",
  "avatar_02",
  "avatar_03",
  "avatar_04",
  "avatar_05",
  "avatar_06",
  "avatar_07",
  "avatar_08",
  "avatar_09",
  "avatar_10",
  "avatar_11",
  "avatar_12",
  "avatar_13",
  "avatar_14",
  "avatar_15",
  "avatar_16",
  "avatar_17",
  "avatar_18",
  "avatar_19",
  "avatar_20",
  "avatar_21",
  "avatar_22",
  "avatar_23",
  "avatar_24",
] as const;

export type AvatarIds = (typeof avatarIds)[number];

export const checkUsernameAvailabilitySchema = z.object({
  username: userNameSchema,
});

export const onboardingSchema = z.object({
  username: userNameSchema,
  avatarId: z.enum(avatarIds),
});
