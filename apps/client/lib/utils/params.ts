import { idSchema } from "@repo/validation/shared";

export function validateParams(params: string) {
  const result = idSchema.safeParse({ id: params });
  return result.success;
}
