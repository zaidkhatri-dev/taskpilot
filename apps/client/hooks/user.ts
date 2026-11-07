"use client";

import { useQuery } from "@tanstack/react-query";

import { getMe, getWorkspaceInvitations } from "@/lib/services/user";
import { queryKeys } from "@/hooks/keys";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.users.me,

    queryFn: async () => {
      const result = await getMe();

      if (!result.success) {
        throw new Error(result.message);
      }

      if (!result.data) {
        throw new Error("Account not found");
      }

      return result.data;
    },
  });
}

export const useWorkspaceInvitations = () => {
  return useQuery({
    queryKey: queryKeys.users.invitations,

    queryFn: async () => {
      const result = await getWorkspaceInvitations();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    },
  });
};
