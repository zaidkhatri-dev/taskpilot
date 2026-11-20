export const queryKeys = {
  session: ["session"] as const,

  workspaces: {
    all: ["workspaces"] as const,
    membersBase: (workspaceId: string) =>
      ["workspaces", workspaceId, "members"] as const,
    members: (
      workspaceId: string,
      params?: { status?: string; page?: number; name?: string },
    ) =>
      [
        "workspaces",
        workspaceId,
        "members",
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
