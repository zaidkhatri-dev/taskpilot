"use client";

import { clientConfig } from "@repo/config/client";
import type {
  GetMyWorkspacesResponse,
  GetWorkspaceUsersResponse,
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

export interface GetWorkspaceUsersParams {
  status?: "accepted" | "pending";
  page?: number;
  limit?: number;
  name?: string;
}

export const getWorkspaceUsers = async (
  workspaceId: string,
  params?: GetWorkspaceUsersParams,
) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.name) searchParams.set("name", params.name);

    const query = searchParams.toString();
    const url = `${clientConfig.NEXT_PUBLIC_API_URL}/workspaces/${workspaceId}/users${query ? `?${query}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    const result: GetWorkspaceUsersResponse = await response.json();
    return result;
  } catch (error) {
    throw new Error("Network error, please try again later.");
  }
};

export const processWorkspaceInvitation = async (
  workspaceId: string,
  accepted: boolean,
) => {
  try {
    const response = await fetch(
      `${clientConfig.NEXT_PUBLIC_API_URL}/workspaces/${workspaceId}/invitations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accepted,
        }),
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

export const removeWorkspaceUser = async (workspaceId: string, userId: string) => {
  try {
    const response = await fetch(`${clientConfig.NEXT_PUBLIC_API_URL}/workspaces/${workspaceId}/remove`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
      credentials: "include",
      cache: "no-store",
    });
    return (await response.json()) as EmptyResponse;
  } catch {
    throw new Error("Network error, please try again later.");
  }
};

export const changeWorkspaceUserRole = async (
  workspaceId: string,
  userId: string,
  role: "admin" | "member",
) => {
  try {
    const response = await fetch(`${clientConfig.NEXT_PUBLIC_API_URL}/workspaces/${workspaceId}/change-role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
      credentials: "include",
      cache: "no-store",
    });
    return (await response.json()) as EmptyResponse;
  } catch {
    throw new Error("Network error, please try again later.");
  }
};

export const transferWorkspaceOwnership = async (workspaceId: string, userId: string) => {
  try {
    const response = await fetch(`${clientConfig.NEXT_PUBLIC_API_URL}/workspaces/${workspaceId}/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
      credentials: "include",
      cache: "no-store",
    });
    return (await response.json()) as EmptyResponse;
  } catch {
    throw new Error("Network error, please try again later.");
  }
};
