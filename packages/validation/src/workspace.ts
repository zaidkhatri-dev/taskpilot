import { z } from "zod";
import { nameSchema100, idSchema } from "./shared.js";

export const createWorkspaceSchema = z.object({
  name: nameSchema100,
});

export const updateWorkspaceSchema = z.object({
  workspaceId: idSchema.shape.id,
  name: nameSchema100,
});
