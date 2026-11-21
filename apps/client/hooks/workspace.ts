"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import {
  getMyWorkspaces,
  leaveWorkspace,
  getWorkspaceUsers,
  processWorkspaceInvitation,
  deleteWorkspace,
  removeWorkspaceUser,
  changeWorkspaceUserRole,
  transferWorkspaceOwnership,
} from "@/lib/services/workspace";
import { queryKeys } from "@/hooks/keys";
import type { WorkspaceUsersParams } from "@/hooks/keys";
import { checkPermission, checkTargetPermission } from "@/lib/utils/auth";
import type {
  Permission,
  WorkspaceMembershipRoles,
  TargetedAction,
} from "@repo/contracts/miscellaneous/auth";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

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

export const useWorkspaceUsers = (
  workspaceId: string,
  params?: WorkspaceUsersParams,
) => {
  return useQuery({
    queryKey: queryKeys.workspaces.users(workspaceId, params),

    queryFn: async () => {
      const result = await getWorkspaceUsers(workspaceId, params);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },

    enabled: Boolean(workspaceId),
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

export const useTargetPermission = (
  action: TargetedAction,
  workspaceId: string | undefined,
  targetRole: WorkspaceMembershipRoles,
): boolean => {
  const role = useWorkspaceRole(workspaceId);
  if (!role) return false;
  return checkTargetPermission(action, role, targetRole);
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
      queryClient.removeQueries({ queryKey: queryKeys.workspaces.scope(workspaceId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all });
      toast.add({ description: result.message || "Left workspace successfully", type: "success" });
    },
    onError: (error) => {
      toast.add({
        description: error.message || "Failed to leave workspace",
        type: "error",
      });
    },
  });
};

export const useProcessWorkspaceInvitation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      accepted,
    }: {
      workspaceId: string;
      accepted: boolean;
    }) => {
      const result = await processWorkspaceInvitation(workspaceId, accepted);

      if (!result.success) {
        throw new Error(result.message);
      }

      return { ...result, accepted };
    },
    onSuccess: (result, { workspaceId }) => {
      if (result.accepted) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspaces.all,
        });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.invitations,
      });
      toast.add({
        description:
          result.message ||
          (result.accepted
            ? "Invitation accepted successfully"
            : "Invitation rejected successfully"),
        type: "success",
      });

      if (result.accepted) {
        router.replace(`/w/${workspaceId}`);
      }
    },
    onError: (error) => {
      toast.add({
        description: error.message || "Failed to process workspace invitation",
        type: "error",
      });
    },
  });
};

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const result = await deleteWorkspace(workspaceId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (result, workspaceId) => {
      queryClient.removeQueries({ queryKey: queryKeys.workspaces.scope(workspaceId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all });
      toast.add({
        description: result.message || "Workspace deleted successfully",
        type: "success",
      });

      router.replace("/w");
    },
    onError: (error) => {
      toast.add({
        description: error.message || "Failed to delete workspace",
        type: "error",
      });
    },
  });
};

export const useRemoveWorkspaceUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      userId,
    }: {
      workspaceId: string;
      userId: string;
    }) => {
      const result = await removeWorkspaceUser(workspaceId, userId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (result, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.usersBase(workspaceId),
      });
      // The workspace list (WorkspaceItemWithRole) contains only id/name/role for
      // the current user and has no member count, so no list invalidation needed.
      toast.add({
        description: result.message || "User removed successfully",
        type: "success",
      });
    },
    onError: (error) => {
      toast.add({
        description: error.message || "Failed to remove user",
        type: "error",
      });
    },
  });
};

export const useChangeWorkspaceUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      userId,
      role,
    }: {
      workspaceId: string;
      userId: string;
      role: "admin" | "member";
    }) => {
      const result = await changeWorkspaceUserRole(workspaceId, userId, role);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: (result, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.usersBase(workspaceId),
      });
      // workspaces.all is not invalidated: this mutation changes another user's
      // role, not the current user's, and the list (WorkspaceItemWithRole) holds
      // only the current user's own role.
      toast.add({
        description: result.message || "User role updated successfully",
        type: "success",
      });
    },
    onError: (error) => {
      toast.add({
        description: error.message || "Failed to change user role",
        type: "error",
      });
    },
  });
};

export const useTransferWorkspaceOwnership = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      userId,
    }: {
      workspaceId: string;
      userId: string;
    }) => {
      const result = await transferWorkspaceOwnership(workspaceId, userId);

      if (!result.success) {
        throw new Error(result.message);
      }

      return result;
    },
    onSuccess: async (result, { workspaceId }) => {
      // Invalidate the users list so roles update (new owner + current user's
      // role change from owner → admin/member).
      await queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.usersBase(workspaceId),
      });
      // The current user's own role changed (owner → admin/member); refetch the
      // workspace list so permission checks (canTransfer, canChangeRole) update
      // immediately and the "Transfer Ownership" button disappears.
      await queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.all,
      });
      toast.add({
        description: result.message || "Ownership transferred successfully",
        type: "success",
      });
    },
    onError: (error) => {
      toast.add({
        description: error.message || "Failed to transfer ownership",
        type: "error",
      });
    },
  });
};
