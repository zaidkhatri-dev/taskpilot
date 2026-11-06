"use client";

import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/lib/services/user";
import { queryKeys } from "@/hooks/keys";

export function useMe() {
  return useQuery({
    queryKey: queryKeys.users.me,

    queryFn: async () => {
      const result = await getMe();

      if (!result.success || !result.data) {
        throw new Error(result.message);
      }

      return result.data;
    },
  });
}
