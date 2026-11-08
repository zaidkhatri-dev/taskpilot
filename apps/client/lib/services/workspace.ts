"use client";

import { clientConfig } from "@repo/config/client";
import type {
  GetMyWorkspacesResponse,
  GetWorkspaceMembersResponse,
} from "@repo/contracts/response/workspace";
import type { EmptyResponse } from "@repo/contracts/response/common";

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
    throw new Error("Network error, please try again later.");
  }
}

export async function leaveWorkspace(workspaceId: string) {
  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/workspaces/${workspaceId}/leave`,
      {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      },
    );

    const result: EmptyResponse = await response.json();
    return result;
  } catch (error) {
    throw new Error("Network error, please try again later.");
  }
}

export const getWorkspaceMembers = async (workspaceId: string) => {
  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/workspaces/${workspaceId}/members`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    const result: GetWorkspaceMembersResponse = await response.json();
    return result;
  } catch (error) {
    throw new Error("Network error, please try again later.");
  }
};

export const acceptWorkspaceInvitation = async (workspaceId: string) => {
  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/workspaces/${workspaceId}/accept`,
      {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      },
    );

    const result: EmptyResponse = await response.json();
    return result;
  } catch (error) {
    throw new Error("Network error, please try again later.");
  }
};

export const deleteWorkspace = async (workspaceId: string) => {
  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/workspaces/${workspaceId}`,
      {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
      },
    );

    const result: EmptyResponse = await response.json();
    return result;
  } catch (error) {
    throw new Error("Network error, please try again later.");
  }
};
