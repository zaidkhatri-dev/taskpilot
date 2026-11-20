import { z } from "zod";
import { nameSchema100, idSchema, emailSchema, workspaceMembershipRoles } from "./shared.js";

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
  role: workspaceMembershipRoles,
});

export const getWorkspaceUsersSchema = z.object({
  workspaceId: idSchema.shape.id,
  status: z.enum(["pending", "accepted"]).default("accepted"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  name: nameSchema100.optional(),
});

export const workspaceInvitationSchema = z.object({
  workspaceId: idSchema.shape.id,
  accepted: z.boolean(),
});

export const removeUserFromWorkspaceSchema = z.object({
  workspaceId: idSchema.shape.id,
  userId: idSchema.shape.id,
});

export const changeUserRoleSchema = z.object({
  workspaceId: idSchema.shape.id,
  userId: idSchema.shape.id,
  role: workspaceMembershipRoles,
});

export const transferOwnershipSchema = z.object({
  workspaceId: idSchema.shape.id,
  userId: idSchema.shape.id,
});
