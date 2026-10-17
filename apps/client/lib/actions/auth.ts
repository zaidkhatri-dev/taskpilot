"use server";

import {
  generateMagicLinkSchema,
  onboardingSchema,
  verifyMagicLinkSchema,
} from "@repo/validation/auth";
import { cleanFormData, validateAction } from "../utils/form";
import { clientConfig } from "@repo/config/client";
import type {
  FormActionResponse,
  DefaultResponse,
  UserOnboardedResponse,
} from "@repo/contracts/response";
import { handleNetworkError, handleUnauthorizedAccess } from "../utils/error";
import { forwardCookieFromServerToBrowser, getCookie } from "../utils/cookie";

export async function generateLink(
  prevState: FormActionResponse | null,
  formData: FormData,
): Promise<FormActionResponse> {
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
  } catch (error) {
    return handleNetworkError(error);
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
          Cookie: `connect.sid=${(await getCookie("connect.sid"))?.value || ""}`,
        },
        credentials: "include",
      },
    );

    const data: UserOnboardedResponse = await response.json();

    if (response.ok) {
      await forwardCookieFromServerToBrowser(response);
    }

    return {
      ...data,
      path: null,
      values: null,
    };
  } catch (error) {
    return handleNetworkError(error);
  }
}

export async function completeOnboarding(
  prevState: FormActionResponse | null,
  formData: FormData,
): Promise<FormActionResponse> {
  const objFormData = cleanFormData(formData);

  const result = validateAction(objFormData, onboardingSchema);

  if (!result.success) {
    return result;
  }

  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/user/onboarding`,
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
      path: null,
      values: objFormData,
    };
  } catch (error) {
    return handleNetworkError(error);
  }
}
