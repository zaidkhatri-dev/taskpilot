export const queryKeys = {
  session: ["session"] as const,

  workspaces: {
    all: ["workspaces"] as const,
    detail: (workspaceId: string) => ["workspaces", workspaceId] as const,
  },

  boards: {
    all: (workspaceId: string) =>
      ["workspaces", workspaceId, "boards"] as const,

    detail: (boardId: string) => ["boards", boardId] as const,
  },

  users: {
    all: ["users"] as const,
    detail: (userId: string) => ["users", userId] as const,
    me: ["users", "me"] as const,
  },
};
