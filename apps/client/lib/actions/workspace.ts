"use server";

import {
  createWorkspaceSchema,
  inviteUserSchema,
  updateWorkspaceSchema,
  removeUserFromWorkspaceSchema,
  changeUserRoleSchema,
  transferOwnershipSchema,
} from "@repo/validation/workspace";
import { cleanFormData, validateAction } from "../utils/form";
import { clientConfig } from "@repo/config/client";
import type {
  CreateWorkspaceResponse,
  GetMyWorkspacesResponse,
  UpdateWorkspaceResponse,
} from "@repo/contracts/response/workspace";
import type { FormActionState } from "@/types/form";
import { handleServerNetworkError } from "../utils/network";
import { getCookieForServerActions } from "../utils/cookie";
import { EmptyResponse } from "@repo/contracts/response/common";

export async function removeUserFromWorkspace(
  _prevState: FormActionState | null,
  formData: FormData,
): Promise<FormActionState> {
  const objFormData = cleanFormData(formData);

  const result = validateAction(objFormData, removeUserFromWorkspaceSchema);

  if (!result.success) {
    return result;
  }

  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/workspaces/${result?.data?.workspaceId}/remove`,
      {
        method: "POST",
        body: JSON.stringify({ userId: result.data?.userId }),
        headers: {
          "Content-Type": "application/json",
          Cookie: `connect.sid=${(await getCookieForServerActions("connect.sid"))?.value || ""}`,
        },
        credentials: "include",
      },
    );

    const data: EmptyResponse = await response.json();

    return {
      success: data.success,
      message: data.message,
      data: null,
      errors: null,
      values: objFormData,
      submissionId: Date.now(),
    };
  } catch (error) {
    return handleServerNetworkError(error, objFormData);
  }
}

export async function changeWorkspaceUserRole(
  _prevState: FormActionState | null,
  formData: FormData,
): Promise<FormActionState> {
  const objFormData = cleanFormData(formData);

  const result = validateAction(objFormData, changeUserRoleSchema);

  if (!result.success) {
    return result;
  }

  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/workspaces/${result?.data?.workspaceId}/change-role`,
      {
        method: "POST",
        body: JSON.stringify({
          userId: result.data?.userId,
          role: result.data?.role,
        }),
        headers: {
          "Content-Type": "application/json",
          Cookie: `connect.sid=${(await getCookieForServerActions("connect.sid"))?.value || ""}`,
        },
        credentials: "include",
      },
    );

    const data: EmptyResponse = await response.json();

    return {
      success: data.success,
      message: data.message,
      data: null,
      errors: null,
      values: objFormData,
      submissionId: Date.now(),
    };
  } catch (error) {
    return handleServerNetworkError(error, objFormData);
  }
}

export async function transferWorkspaceOwnership(
  _prevState: FormActionState | null,
  formData: FormData,
): Promise<FormActionState> {
  const objFormData = cleanFormData(formData);

  const result = validateAction(objFormData, transferOwnershipSchema);

  if (!result.success) {
    return result;
  }

  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/workspaces/${result?.data?.workspaceId}/transfer`,
      {
        method: "POST",
        body: JSON.stringify({ userId: result.data?.userId }),
        headers: {
          "Content-Type": "application/json",
          Cookie: `connect.sid=${(await getCookieForServerActions("connect.sid"))?.value || ""}`,
        },
        credentials: "include",
      },
    );

    const data: EmptyResponse = await response.json();

    return {
      success: data.success,
      message: data.message,
      data: null,
      errors: null,
      values: objFormData,
      submissionId: Date.now(),
    };
  } catch (error) {
    return handleServerNetworkError(error, objFormData);
  }
}

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
    return handleServerNetworkError(error);
  }
}

export async function createWorkspace(
  _prevState: FormActionState | null,
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

    return {
      success: data.success,
      message: data.message,
      data: {
        id: data.data.id,
        name: data.data.name,
      },
      errors: null,
      values: objFormData,
      submissionId: Date.now(),
    };
  } catch (error) {
    return handleServerNetworkError(error, objFormData);
  }
}

export async function updateWorkspace(
  _prevState: FormActionState | null,
  formData: FormData,
): Promise<FormActionState> {
  const objFormData = cleanFormData(formData);

  const result = validateAction(objFormData, updateWorkspaceSchema);

  if (!result.success) {
    return result;
  }

  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/workspaces/${result?.data?.workspaceId}`,
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

    const data: UpdateWorkspaceResponse = await response.json();

    return {
      success: data.success,
      message: data.message,
      data: {
        id: data.data.id,
        name: data.data.name,
      },
      errors: null,
      values: objFormData,
      submissionId: Date.now(),
    };
  } catch (error) {
    return handleServerNetworkError(error, objFormData);
  }
}

export async function inviteUser(
  _prevState: FormActionState | null,
  formData: FormData,
): Promise<FormActionState> {
  const objFormData = cleanFormData(formData);

  const result = validateAction(objFormData, inviteUserSchema);

  if (!result.success) {
    return result;
  }

  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/workspaces/${result?.data?.workspaceId}/invite`,
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
      success: data.success,
      message: data.message,
      data: null,
      errors: null,
      values: objFormData,
      submissionId: Date.now(),
    };
  } catch (error) {
    return handleServerNetworkError(error, objFormData);
  }
}
