import { z } from "zod";
import { nameSchema100, idSchema, emailSchema } from "./shared.js";

export const createWorkspaceSchema = z.object({
  name: nameSchema100,
});

export const updateWorkspaceSchema = z.object({
  workspaceId: idSchema.shape.id,
  name: nameSchema100,
});

export const inviteUserSchema = z.object({
  workspaceId: idSchema.shape.id,
  email: emailSchema,
  role: z.enum(["admin", "member"]),
});

export const getWorkspaceUsersSchema = z.object({
  workspaceId: idSchema.shape.id,
  status: z.enum(["pending", "accepted"]).default("accepted"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  name: nameSchema100.optional(),
});
