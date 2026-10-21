"use server";

import { updateMeSchema } from "@repo/validation/auth";
import { cleanFormData, validateAction } from "../utils/form";
import { clientConfig } from "@repo/config/client";
import type { DefaultResponse, GetMeResponse } from "@repo/contracts/response";
import type { FormActionResponse } from "@repo/contracts/response";
import { handleNetworkError, handleUnauthorizedAccess } from "../utils/error";
import { forwardCookieFromServerToBrowser, getCookie } from "../utils/cookie";

export async function getMe(): Promise<{
  ok: boolean;
  data: GetMeResponse["data"] | null;
}> {
  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/user/me`,
      {
        method: "GET",
        headers: {
          Cookie: `connect.sid=${(await getCookie("connect.sid"))?.value || ""}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return { ok: false, data: null };
    }

    const result: GetMeResponse = await response.json();
    return { ok: true, data: result.data };
  } catch {
    return { ok: false, data: null };
  }
}

export async function updateMe(
  prevState: FormActionResponse | null,
  formData: FormData,
): Promise<FormActionResponse> {
  const objFormData = cleanFormData(formData);

  const result = validateAction(objFormData, updateMeSchema);

  if (!result.success) {
    return result;
  }

  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/user/me`,
      {
        method: "PATCH",
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
      path: null,
      values: objFormData,
    };
  } catch (error) {
    return handleNetworkError(error);
  }
}
