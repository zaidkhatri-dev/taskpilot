"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteBoard, getBoards } from "@/lib/services/board";
import { queryKeys } from "@/hooks/keys";
import { toast } from "@/components/ui/toast";

export const useWorkspaceBoards = (workspaceId: string) => {
  return useQuery({
    queryKey: queryKeys.boards.all(workspaceId),

    queryFn: async () => {
      const result = await getBoards(workspaceId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },

    enabled: Boolean(workspaceId),
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      boardId,
    }: {
      workspaceId: string;
      boardId: string;
    }) => {
      const result = await deleteBoard(workspaceId, boardId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (result, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.boards.all(workspaceId),
      });
      toast.add({
        description: result.message || "Board deleted successfully",
        type: "success",
      });
    },
    onError: (error) => {
      toast.add({
        description: error.message || "Failed to delete board",
        type: "error",
      });
    },
  });
};

