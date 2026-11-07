"use server";

import { onboardingSchema, updateMeSchema } from "@repo/validation/user";
import { cleanFormData, validateAction } from "../utils/form";
import { clientConfig } from "@repo/config/client";
import type { EmptyResponse } from "@repo/contracts/response/common";
import type { GetMeResponse } from "@repo/contracts/response/user";
import type { FormActionState } from "@/types/form";
import { handleUnauthorizedAccess } from "../utils/error";
import { handleNetworkError } from "../utils/network";
import {
  forwardCookieFromServerToBrowser,
  getCookieForServerActions,
} from "../utils/cookie";

export async function completeOnboarding(
  prevState: FormActionState | null,
  formData: FormData,
): Promise<FormActionState> {
  const objFormData = cleanFormData(formData);

  const result = validateAction(objFormData, onboardingSchema);

  if (!result.success) {
    return result;
  }

  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/users/onboarding`,
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
      submissionId: Date.now(),
    };
  } catch (error) {
    return handleNetworkError(error, objFormData);
  }
}

export async function updateMe(
  prevState: FormActionState | null,
  formData: FormData,
): Promise<FormActionState> {
  const objFormData = cleanFormData(formData);

  const result = validateAction(objFormData, updateMeSchema);

  if (!result.success) {
    return result;
  }

  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/users/me`,
      {
        method: "PATCH",
        body: JSON.stringify(result.data),
        headers: {
          "Content-Type": "application/json",
          Cookie: `connect.sid=${(await getCookieForServerActions("connect.sid"))?.value || ""}`,
        },
        credentials: "include",
      },
    );

    const data: EmptyResponse = await response.json();

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
      submissionId: Date.now(),
    };
  } catch (error) {
    return handleNetworkError(error, objFormData);
  }
}

export const updateUser = updateMe;

