"use server";

import { createWorkspaceSchema } from "@repo/validation/workspace";
import { cleanFormData, validateAction } from "../utils/form";
import { clientConfig } from "@repo/config/client";
import type {
  CreateWorkspaceResponse,
  GetMyWorkspacesResponse,
} from "@repo/contracts/response/workspace";
import type { FormActionState } from "@/types/form";
import { handleUnauthorizedAccess } from "../utils/error";
import { handleNetworkError } from "../utils/network";
import { getCookieForServerActions } from "../utils/cookie";

export async function getMyWorkspacesServer() {
  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/workspaces`,
      {
        method: "GET",
        headers: {
          Cookie: `connect.sid=${(await getCookieForServerActions("connect.sid"))?.value || ""}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    const result: GetMyWorkspacesResponse = await response.json();
    return result;
  } catch (error) {
    return handleNetworkError(error);
  }
}

export async function createWorkspace(
  prevState: FormActionState | null,
  formData: FormData,
): Promise<FormActionState> {
  const objFormData = cleanFormData(formData);

  const result = validateAction(objFormData, createWorkspaceSchema);

  if (!result.success) {
    return result;
  }

  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/workspaces`,
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

    const data: CreateWorkspaceResponse = await response.json();

    if (response.status === 401) {
      handleUnauthorizedAccess();
    }

    return {
      success: data.success,
      message: data.message,
      data: {
        id: data.data.id,
        name: data.data.name,
      },
      errors: null,
      values: objFormData,
    };
  } catch (error) {
    return handleNetworkError(error, objFormData);
  }
}
