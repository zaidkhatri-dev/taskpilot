import { z } from "zod";
import { nameSchema100 } from "./shared.js";

export const createWorkspaceSchema = z.object({
  name: nameSchema100,
});
