import { z } from "zod";
import { nameSchema100, uuidSchema } from "./shared.js";

export const getBoardsSchema = z.object({
  id: uuidSchema,
});

export const createBoardSchema = z.object({
  workspaceId: uuidSchema,
  name: nameSchema100,
  description: z
    .string("Invalid description format")
    .trim()
    .transform((v) => v || undefined)
    .optional(),
});
