import { z } from "zod";
import { nameSchema100, idSchema } from "./shared.js";

export const createBoardSchema = z.object({
  workspaceId: idSchema.shape.id,
  name: nameSchema100,
  description: z
    .string("Invalid description format")
    .trim()
    .transform((v) => v || undefined)
    .optional(),
});
