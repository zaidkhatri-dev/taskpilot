"use server";

import {
  generateMagicLinkSchema,
  verifyMagicLinkSchema,
} from "@repo/validation/auth";
import { onboardingSchema } from "@repo/validation/user";
import { cleanFormData, validateAction } from "../utils/form";
import { clientConfig } from "@repo/config/client";
import type {
  DefaultResponse,
  UserOnboardedResponse,
} from "@repo/contracts/response";
import { handleUnauthorizedAccess } from "../utils/error";
import { handleNetworkError } from "../utils/network";
import { forwardCookieFromServerToBrowser, getCookie } from "../utils/cookie";
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
          Cookie: `connect.sid=${(await getCookie("connect.sid"))?.value || ""}`,
        },
        credentials: "include",
      },
    );

    const data: DefaultResponse = await response.json();

    return {
      ...data,
      errors: null,
      values: objFormData,
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
          Cookie: `connect.sid=${(await getCookie("connect.sid"))?.value || ""}`,
        },
        credentials: "include",
      },
    );

    console.log(response.headers.getSetCookie());

    const data: UserOnboardedResponse = await response.json();

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
      errors: null,
      values: objFormData,
    };
  } catch (error) {
    return handleNetworkError(error, objFormData);
  }
}

export async function getSession(): Promise<{
  ok: boolean;
  data: UserOnboardedResponse["data"] | null;
}> {
  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/auth/session`,
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

    const result: UserOnboardedResponse = await response.json();
    return { ok: true, data: result.data };
  } catch {
    return { ok: false, data: null };
  }
}
