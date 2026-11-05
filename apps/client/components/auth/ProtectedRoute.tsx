"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/hooks/auth";

type ProtectedRouteProps = {
  children: ReactNode;
  requireOnboarding: boolean;
};

export default function ProtectedRoute({
  children,
  requireOnboarding,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    // No valid session → redirect to sign in
    if (!session) {
      router.replace("/signin");
      return;
    }

    if (requireOnboarding && !session.isOnboarded) {
      router.replace("/onboarding");
      return;
    }

    if (!requireOnboarding && session.isOnboarded) {
      router.replace("/workspace");
    }
  }, [isPending, session, requireOnboarding, router]);

  // Show loading spinner while the session query is in-flight or a redirect is pending
  const isAuthorized =
    !isPending &&
    session !== null &&
    session !== undefined &&
    (requireOnboarding ? session.isOnboarded : !session.isOnboarded);

  if (!isAuthorized) {
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
