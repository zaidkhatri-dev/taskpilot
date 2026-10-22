"use server";

import { createOrganizationSchema } from "@repo/validation/organization";
import { cleanFormData, validateAction } from "../utils/form";
import { clientConfig } from "@repo/config/client";
import type { DefaultResponse } from "@repo/contracts/response";
import { handleUnauthorizedAccess } from "../utils/error";
import { handleNetworkError } from "../utils/network";
import { forwardCookieFromServerToBrowser, getCookie } from "../utils/cookie";
import type { FormActionState } from "@/types/form";

export async function createOrganization(
  prevState: FormActionState | null,
  formData: FormData,
): Promise<FormActionState> {
  const objFormData = cleanFormData(formData);

  const result = validateAction(objFormData, createOrganizationSchema);

  if (!result.success) {
    return result;
  }

  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/organization`,
      {
        method: "POST",
        body: JSON.stringify(result.data),
        headers: {
          "Content-Type": "application/json",
          Cookie: `connect.sid=${(await getCookie("connect.sid"))?.value || ""}`,
        },
        credentials: "include",
      },
    );

    const data: DefaultResponse = await response.json();

    if (response.status === 401) {
      handleUnauthorizedAccess();
    }

    if (response.ok) {
      await forwardCookieFromServerToBrowser(response);
    }

    return {
      ...data,
      errors: null,
      values: objFormData,
    };
  } catch (error) {
    return handleNetworkError(error, objFormData);
  }
}
