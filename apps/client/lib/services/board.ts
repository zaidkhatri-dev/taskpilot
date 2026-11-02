"use client";

import { clientConfig } from "@repo/config/client";
import type { GetWorkspaceBoardsResponse } from "@repo/contracts/response/board";
import { handleNetworkError } from "../utils/network";

export async function getWorkspaceBoards(workspaceId: string) {
  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/boards?workspaceId=${workspaceId}`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    const result: GetWorkspaceBoardsResponse = await response.json();
    return result;
  } catch (error) {
    return handleNetworkError(error);
  }
}
