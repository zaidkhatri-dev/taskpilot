"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/actions/auth";
import Image from "next/image";

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
        router.replace("/workspace");
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
