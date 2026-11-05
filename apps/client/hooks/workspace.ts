"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyWorkspaces } from "@/lib/services/workspace";
import { queryKeys } from "@/hooks/keys";

export function useWorkspaces() {
  return useQuery({
    queryKey: queryKeys.workspaces.all,

    queryFn: async () => {
      const result = await getMyWorkspaces();

      if (!result.success || !result.data) {
        throw new Error(result.message);
      }

      return result.data;
    },
  });
}
