import { z } from "zod";
import { namePartSchema, userNameSchema } from "./shared.js";

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

export const onboardingSchema = z.object({
  avatarId: z.enum(avatarIds),
  firstName: namePartSchema,
  lastName: namePartSchema,
  username: userNameSchema,
});

export const updateMeSchema = z.object({
  avatarId: z.enum(avatarIds).optional(),
  firstName: namePartSchema.optional(),
  lastName: namePartSchema.optional(),
  username: userNameSchema.optional(),
});

export const checkUsernameAvailabilitySchema = z.object({
  username: userNameSchema,
});
