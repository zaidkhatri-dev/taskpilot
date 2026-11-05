"use client";

import { clientConfig } from "@repo/config/client";
import type { SessionResponse } from "@repo/contracts/response/auth";
import type { EmptyResponse } from "@repo/contracts/response/common";
import { handleNetworkError } from "../utils/network";

export const getSession = async () => {
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
};

export const logout = async (): Promise<EmptyResponse> => {
  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    const result: EmptyResponse = await response.json();
    return result;
  } catch (error) {
    return handleNetworkError(error);
  }
};
