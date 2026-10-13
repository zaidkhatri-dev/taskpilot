import { ZodObject } from "zod";
import { FormActionResponse } from "@repo/contracts/response";

export function validateAction(
  formData: Record<string, unknown>,
  schema: ZodObject,
): FormActionResponse {
  const result = schema.safeParse(formData);

  if (!result.success) {
    return {
      success: false,
      path: result.error.issues[0]?.path.join(".") ?? "",
      message:
        result.error.issues[0]?.message || "The provided input is invalid",
      data: null,
      values: formData,
    };
  }

  return {
    success: true,
    path: null,
    message: "Validation successful",
    data: result.data,
    values: formData,
  };
}

export const cleanFormData = (formData: FormData): Record<string, unknown> =>
  Object.fromEntries(
    [...formData].filter(([key]) => !key.startsWith("$ACTION_")),
  );
