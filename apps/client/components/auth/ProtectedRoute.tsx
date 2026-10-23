"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/actions/auth";
import Image from "next/image";

type ProtectedRouteProps = {
  children: ReactNode;
  requireOnboarding: boolean;
  requireOrganization: boolean;
};

export default function ProtectedRoute({
  children,
  requireOnboarding,
  requireOrganization,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let isChecking = false;

    async function checkSession() {
      if (cancelled || isChecking) return;
      isChecking = true;

      try {
        const session = await getSession();

        if (!session.ok || !session.data) {
          router.replace("/signin");
          return;
        }

        const isOnboarded = session.data.isUserOnboarded;

        if (requireOnboarding && !isOnboarded) {
          router.replace("/onboarding");
          return;
        }

        const hasOrganization = session.data.hasOrganization;
        if (!requireOnboarding && isOnboarded) {
          if (hasOrganization) {
            router.replace("/workspace");
          } else {
            router.replace("/create-organization");
          }

          return;
        }

        if (requireOrganization && !hasOrganization) {
          router.replace("/create-organization");
          return;
        }

        if (!requireOrganization && hasOrganization) {
          router.replace("/workspace");
          return;
        }

        if (!cancelled) {
          setAuthorized(true);
        }
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
  }, [router, requireOnboarding, requireOrganization]);

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
