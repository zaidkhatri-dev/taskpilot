"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/actions/auth";
import Image from "next/image";
export default function GuestRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let isChecking = false;

    async function checkSession() {
      if (cancelled || isChecking) return;
      isChecking = true;

      try {
        const session = await getSession();

        if (!session.ok || !session.data) {
          if (!cancelled) setIsGuest(true);
          return;
        }

        router.replace(
          session.data.isUserOnboarded ? "/workspace" : "/onboarding",
        );
      } finally {
        isChecking = false;
      }
    }

    async function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        await checkSession();
      }
    }

    checkSession();

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  if (!isGuest) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Image
          src="/logo.webp"
          alt="TaskPilot Logo"
          width={48}
          height={48}
          priority
          className="h-12 w-12 object-contain animate-pulse"
        />
      </div>
    );
  }

  return children;
}
