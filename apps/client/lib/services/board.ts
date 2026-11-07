"use client";

import { clientConfig } from "@repo/config/client";
import type { GetBoardsResponse } from "@repo/contracts/response/board";

export async function getBoards(workspaceId: string) {
  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/workspaces/${workspaceId}/boards`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    const result: GetBoardsResponse = await response.json();
    return result;
  } catch (error) {
    throw new Error("Network error, please try again later.");
  }
}
