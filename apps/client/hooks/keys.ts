export const queryKeys = {
  session: ["session"] as const,

  workspaces: {
    all: ["workspaces"] as const,
    members: (workspaceId: string) =>
      ["workspaces", workspaceId, "members"] as const,
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
