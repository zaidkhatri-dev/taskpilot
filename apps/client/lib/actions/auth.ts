"use server";

import {
  generateMagicLinkSchema,
  verifyMagicLinkSchema,
} from "@repo/validation/auth";
import { cleanFormData, validateAction } from "../utils/form";
import { clientConfig } from "@repo/config/client";
import type { EmptyResponse } from "@repo/contracts/response/common";
import type { SessionResponse } from "@repo/contracts/response/auth";
import { handleNetworkError } from "../utils/network";
import {
  forwardCookieFromServerToBrowser,
  getCookieForServerActions,
} from "../utils/cookie";
import type { FormActionState } from "@/types/form";

export async function generateLink(
  prevState: FormActionState | null,
  formData: FormData,
): Promise<FormActionState> {
  const objFormData = cleanFormData(formData);

  const result = validateAction(objFormData, generateMagicLinkSchema);

  if (!result.success) {
    return result;
  }

  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/auth/link/generate`,
      {
        method: "POST",
        body: JSON.stringify(result.data),
        headers: {
          "Content-Type": "application/json",
          Cookie: `connect.sid=${(await getCookieForServerActions("connect.sid"))?.value || ""}`,
        },
        credentials: "include",
      },
    );

    const data: EmptyResponse = await response.json();

    return {
      ...data,
      errors: null,
      values: objFormData,
      submissionId: Date.now(),
    };
  } catch (error) {
    return handleNetworkError(error, objFormData);
  }
}

export async function verifyLink(token: string) {
  const result = validateAction({ token }, verifyMagicLinkSchema);

  if (!result.success) {
    return {
      ...result,
      values: null,
    };
  }

  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/auth/link/verify`,
      {
        method: "POST",
        body: JSON.stringify(result.data),
        headers: {
          "Content-Type": "application/json",
          Cookie: `connect.sid=${(await getCookieForServerActions("connect.sid"))?.value || ""}`,
        },
        credentials: "include",
      },
    );

    console.log(response.headers.getSetCookie());

    const data: SessionResponse = await response.json();

    if (response.ok) {
      await forwardCookieFromServerToBrowser(response);
    }

    return {
      ...data,
      errors: null,
      values: null,
    };
  } catch (error) {
    return handleNetworkError(error);
  }
}
