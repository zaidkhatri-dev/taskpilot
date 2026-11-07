"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { getMyWorkspaces } from "@/lib/services/workspace";
import { queryKeys } from "@/hooks/keys";
import { checkPermission } from "@/lib/utils/auth";
import type {
  Permission,
  WorkspaceMembershipRoles,
} from "@repo/contracts/miscellaneous/auth";

export const useWorkspaces = () => {
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
};

export const useWorkspaceRole = (
  workspaceId?: string,
): WorkspaceMembershipRoles | undefined => {
  const { data: workspaces } = useWorkspaces();
  return workspaces?.find((workspace) => workspace.id === workspaceId)?.role;
};

export const useWorkspacePermission = (
  workspaceId: string | undefined,
  permission: Permission,
): boolean => {
  const role = useWorkspaceRole(workspaceId);
  return checkPermission(permission, role);
};

export const useLeaveWorkspace = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (workspaceId: string) => {
      // TODO: Implement leave workspace API call
      
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all });
    },
  });

}