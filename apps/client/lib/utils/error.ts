"use client";

import { useRouter } from "next/navigation";

export function handleUnauthorizedAccess() {
  const router = useRouter();
  router.replace("/login");
}

export function handleNotOnboarded() {
  const router = useRouter();
  router.replace("/onboarding");
}
