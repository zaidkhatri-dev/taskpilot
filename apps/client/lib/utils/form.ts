import { ZodObject } from "zod";
import type { FieldError, FormActionState } from "@/types/form";
export function validateAction(
  formData: Record<string, unknown>,
  schema: ZodObject,
): FormActionState {
  const result = schema.safeParse(formData);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    return {
      success: false,
      message: errors[0]?.message || "The provided input is invalid",
      errors,
      data: null,
      values: formData,
    };
  }

  return {
    success: true,
    message: "Validation successful",
    errors: null,
    data: result.data,
    values: formData,
  };
}

export const cleanFormData = (formData: FormData): Record<string, unknown> =>
  Object.fromEntries(
    [...formData].filter(([key]) => !key.startsWith("$ACTION_")),
  );

export function getFieldError(
  errors: FieldError[] | null,
  path: string,
): string | undefined {
  return errors?.find((e) => e.path === path)?.message;
}
