"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/actions/auth";
import { Spinner } from "../ui/spinner";

type ProtectedRouteProps = {
  children: ReactNode;
  requireOnboarding: boolean;
};


export default function ProtectedRoute({
  children,
  requireOnboarding,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      const session = await getSession();

      if (cancelled) return;

      if (!session.ok || !session.data) {
        router.replace("/signin");
        return;
      }

      const isOnboarded = session.data.isUserOnboarded;

      if (requireOnboarding && isOnboarded) {
        router.replace("/dashboard");
        return;
      }

      if (!requireOnboarding && !isOnboarded) {
        router.replace("/onboarding");
        return;
      }

      if (!cancelled) {
        setAuthorized(true);
      }
    }

    checkSession();

    return () => {
      cancelled = true;
    };
  }, [router, requireOnboarding]);

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-20" />
      </div>
    );
  }

  return children;
}
