"use client";

import { clientConfig } from "@repo/config/client";
import type { GetMeResponse } from "@repo/contracts/response/user";
import { handleNetworkError } from "../utils/network";

export async function getMe() {
  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/users/me`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    const result: GetMeResponse = await response.json();
    return result;
  } catch (error) {
    return handleNetworkError(error);
  }
}
