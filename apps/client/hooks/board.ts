"use client";

import { useQuery } from "@tanstack/react-query";

import { getBoards } from "@/lib/services/board";
import { queryKeys } from "@/hooks/keys";

export function useWorkspaceBoards(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.boards.all(workspaceId),

    queryFn: async () => {
      const result = await getBoards(workspaceId);

      if (!result.success || !result.data) {
        throw new Error(result.message);
      }

      return result.data;
    },

    enabled: Boolean(workspaceId),
  });
}
