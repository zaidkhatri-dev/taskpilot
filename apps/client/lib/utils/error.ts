"use client";

import { useRouter } from "next/navigation";

export function handleNetworkError(error: unknown) {
  console.error(error);
  return {
    success: false,
    message: "Network error, please try again later.",
    data: null,
    path: null,
    values: null,
  };
}

export function handleUnauthorizedAccess() {
  const router = useRouter();
  router.replace("/login");
}

export function handleNotOnboarded() {
  const router = useRouter();
  router.replace("/onboarding");
}
