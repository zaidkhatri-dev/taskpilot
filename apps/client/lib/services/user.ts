"use client";

import { clientConfig } from "@repo/config/client";
import type {
  GetMeResponse,
  GetWorkspaceInvitationsResponse,
} from "@repo/contracts/response/user";

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
    throw new Error("Network error, please try again later.");
  }
}

export const getWorkspaceInvitations = async () => {
  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/users/me/invitations`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    const result: GetWorkspaceInvitationsResponse = await response.json();
    return result;
  } catch (error) {
    throw new Error("Network error, please try again later.");
  }
};
