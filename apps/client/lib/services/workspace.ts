"use client";

import { clientConfig } from "@repo/config/client";
import type { GetMyWorkspacesResponse } from "@repo/contracts/response/workspace";
import { handleNetworkError } from "../utils/network";

export async function getMyWorkspaces() {
  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/workspaces`,
      {
        method: "GET",
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
