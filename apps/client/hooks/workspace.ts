"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import {
  getMyWorkspaces,
  leaveWorkspace,
  getWorkspaceMembers,
  acceptWorkspaceInvitation,
} from "@/lib/services/workspace";
import { queryKeys } from "@/hooks/keys";
import { checkPermission } from "@/lib/utils/auth";
import type {
  Permission,
  WorkspaceMembershipRoles,
} from "@repo/contracts/miscellaneous/auth";
import { toast } from "@/components/ui/toast";

export const useWorkspaces = () => {
  return useQuery({
    queryKey: queryKeys.workspaces.all,

    queryFn: async () => {
      const result = await getMyWorkspaces();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
  });
};

export const useWorkspaceMembers = (
  workspaceId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: queryKeys.workspaces.members(workspaceId),

    queryFn: async () => {
      const result = await getWorkspaceMembers(workspaceId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },

    enabled: Boolean(workspaceId) && (options?.enabled ?? true),
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
      const result = await leaveWorkspace(workspaceId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (result, workspaceId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.boards.all(workspaceId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.all,
      });
      toast.add({
        description: result.message || "Left workspace successfully",
        type: "success",
      });
    },
    onError: (error) => {
      toast.add({
        description: error.message || "Failed to leave workspace",
        type: "error",
      });
    },
  });
};

export const useAcceptWorkspaceInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const result = await acceptWorkspaceInvitation(workspaceId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.invitations,
      });
      toast.add({
        description: result.message || "Invitation accepted successfully",
        type: "success",
      });
    },
    onError: (error) => {
      toast.add({
        description: error.message || "Failed to accept workspace invitation",
        type: "error",
      });
    },
  });
};
