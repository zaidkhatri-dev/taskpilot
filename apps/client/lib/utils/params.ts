import { z } from "zod";
import { uuidSchema } from "@repo/validation/shared";

export function validateParams(params: string) {
  const result = uuidSchema.safeParse(params);
  return result.success;
}
