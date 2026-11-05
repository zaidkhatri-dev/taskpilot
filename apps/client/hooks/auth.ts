"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { logout } from "@/lib/services/auth";
import { getSession } from "@/lib/services/auth";
import { queryKeys } from "@/hooks/keys";
import { useRouter } from "next/navigation";

export function useSession() {
  return useQuery({
    queryKey: queryKeys.session,

    queryFn: async () => {
      const result = await getSession();

      if (!result.success || !result.data) {
        // Return null so consumers can distinguish "no session" from an error
        return null;
      }

      return result.data;
    },

    // Re-fetch on window focus so session state stays in sync
    // (e.g. user signs out in another tab)
    refetchOnWindowFocus: true,
    staleTime: 30_000, // 30 s — avoid hammering the endpoint on every render
  });
}

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      router.replace("/signin");
    },
  });
};
