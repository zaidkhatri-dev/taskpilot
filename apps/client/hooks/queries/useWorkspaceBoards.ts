"use client";

import { useQuery } from "@tanstack/react-query";

import { getWorkspaceBoards } from "@/lib/services/board";
import { queryKeys } from "@/hooks/queries/keys";

export function useWorkspaceBoards(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.boards.all(workspaceId),

    queryFn: async () => {
      const result = await getWorkspaceBoards(workspaceId);

      if (!result.success || !result.data) {
        throw new Error(result.message);
      }

      return result.data;
    },

    enabled: Boolean(workspaceId),
  });
}
