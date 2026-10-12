import { ZodObject } from "zod";

export function validateAction(
    formData: FormData | Record<string, unknown>,
    schema: ZodObject
) {
    const rawData =
        formData instanceof FormData
            ? Object.fromEntries(formData.entries())
            : formData;

    const result = schema.safeParse(rawData);

    if (!result.success) {
        return {
            success: false,
            path: result.error.issues[0]?.path.join(".") ?? "",
            message: result.error.issues[0]?.message || "The provided input is invalid",
        };
    }

    return {
        success: true,
        data: result.data,
    };
}