"use client";

import { clientConfig } from "@repo/config/client";
import type { SessionResponse } from "@repo/contracts/response/auth";
import { handleNetworkError } from "../utils/network";

export async function getSession() {
  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/auth/session`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    const result: SessionResponse = await response.json();
    return result;
  } catch (error) {
    return handleNetworkError(error);
  }
}
