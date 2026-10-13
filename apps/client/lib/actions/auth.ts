"use server";

import { generateMagicLinkSchema } from "@repo/validation/auth";
import { cleanFormData, validateAction } from "../utils/form";
import { clientConfig } from "@repo/config/client";
import type {
  FormActionResponse,
  DefaultResponse,
} from "@repo/contracts/response";

export async function generateLink(
  prevState: FormActionResponse | null,
  formData: FormData,
): Promise<FormActionResponse> {
  console.log("Form Data", formData);
  const objFormData = cleanFormData(formData);
  console.log("Object Form Data", objFormData);

  const result = validateAction(objFormData, generateMagicLinkSchema);

  console.log("Result", result);
  if (!result.success) {
    return result;
  }

  const response = await fetch(
    `${clientConfig.NEXT_PUBLIC_API_URL}/auth/link/generate`,
    {
      method: "POST",
      body: JSON.stringify(result.data),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  const data: DefaultResponse = await response.json();

  return {
    ...data,
    path: null,
    values: objFormData,
  };
}

export async function verifyLink() {}
