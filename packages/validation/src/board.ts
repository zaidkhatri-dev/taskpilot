import { z } from "zod";
import { uuidSchema } from "./shared.js";

export const getWorkspaceBoardsSchema = z.object({
  workspaceId: uuidSchema,
});
