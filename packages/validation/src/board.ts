import { z } from "zod";
import {
  nameSchema100,
  idSchema,
  emptyToUndefined,
  descriptionSchema,
} from "./shared.js";

export const createBoardSchema = z.object({
  workspaceId: idSchema.shape.id,
  name: nameSchema100,
  description: descriptionSchema,
});

export const boardParamsSchema = z.object({
  workspaceId: idSchema.shape.id,
  boardId: idSchema.shape.id,
});

export const updateBoardSchema = boardParamsSchema.extend({
  name: z.preprocess(emptyToUndefined, nameSchema100.optional()),
  description: descriptionSchema,
});

export const deleteBoardSchema = boardParamsSchema;
