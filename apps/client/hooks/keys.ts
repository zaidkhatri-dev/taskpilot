export interface WorkspaceUsersParams {
  status?: "accepted" | "pending";
  page?: number;
  limit?: number;
  name?: string;
}

export const queryKeys = {
  session: ["session"] as const,

  workspaces: {
    all: ["workspaces", "list"] as const,
    scope: (workspaceId: string) => ["workspaces", workspaceId] as const,
    usersBase: (workspaceId: string) =>
      ["workspaces", workspaceId, "users"] as const,
    users: (workspaceId: string, params?: WorkspaceUsersParams) =>
      [
        "workspaces",
        workspaceId,
        "users",
        params?.status ?? "accepted",
        params?.page ?? 1,
        params?.limit ?? 10,
        params?.name ?? "",
      ] as const,
  },

  boards: {
    all: (workspaceId: string) =>
      ["workspaces", workspaceId, "boards"] as const,
  },

  users: {
    me: ["users", "me"] as const,
    invitations: ["users", "me", "invitations"] as const,
  },
};
