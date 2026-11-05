"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "@/hooks/auth";

export default function GuestRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;

    // If session exists, authenticated users shouldn't be on guest routes
    if (session) {
      router.replace(session.isOnboarded ? "/w" : "/onboarding");
    }
  }, [isPending, session, router]);

  // While loading session or when a user is logged in (about to redirect), show loader
  const isGuest = !isPending && !session;

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
