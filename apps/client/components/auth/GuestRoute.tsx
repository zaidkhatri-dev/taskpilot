"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/actions/auth";
import { Spinner } from "../ui/spinner";

export default function GuestRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      const session = await getSession();

      if (cancelled) return;

      if (!session.ok || !session.data) {
        if (!cancelled) setIsGuest(true);
        return;
      }

      router.replace(
        session.data.isUserOnboarded ? "/dashboard" : "/onboarding",
      );
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        checkSession();
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
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-20" />
      </div>
    );
  }

  return children;
}
