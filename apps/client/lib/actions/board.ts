"use server";

import { createBoardSchema } from "@repo/validation/board";
import { cleanFormData, validateAction } from "../utils/form";
import { clientConfig } from "@repo/config/client";
import type { CreateBoardResponse } from "@repo/contracts/response/board";
import type { FormActionState } from "@/types/form";
import { handleUnauthorizedAccess } from "../utils/error";
import { handleNetworkError } from "../utils/network";
import { getCookieForServerActions } from "../utils/cookie";

export const createBoard = async (
  prevState: FormActionState | null,
  formData: FormData,
): Promise<FormActionState> => {
  const objFormData = cleanFormData(formData);

  const result = validateAction(objFormData, createBoardSchema);

  if (!result.success) {
    return result;
  }

  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/workspaces/${result.data?.workspaceId}/boards`,
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

    const data: CreateBoardResponse = await response.json();

    if (response.status === 401) {
      handleUnauthorizedAccess();
    }

    return {
      success: data.success,
      message: data.message,
      data: data.data
        ? {
            id: data.data.id,
            name: data.data.name,
            description: data.data.description,
          }
        : null,
      errors: null,
      values: objFormData,
      submissionId: Date.now(),
    };
  } catch (error) {
    return handleNetworkError(error, objFormData);
  }
};
