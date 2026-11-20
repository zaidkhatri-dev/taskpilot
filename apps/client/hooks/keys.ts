export const queryKeys = {
  session: ["session"] as const,

  workspaces: {
    all: ["workspaces"] as const,
    usersBase: (workspaceId: string) =>
      ["workspaces", workspaceId, "users"] as const,
    users: (
      workspaceId: string,
      params?: { status?: string; page?: number; name?: string },
    ) =>
      [
        "workspaces",
        workspaceId,
        "users",
        params?.status ?? "accepted",
        params?.page ?? 1,
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
