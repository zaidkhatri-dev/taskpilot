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
