"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyLink } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export default function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [VerificationState, setVerificationState] = useState<
    "idle" | "verifying" | "verified" | "failed"
  >("idle");

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    async function verifyEmail() {
      if (!token) {
        setVerificationState("failed");
        return;
      }

      try {
        setVerificationState("verifying");
        const result = await verifyLink(token);

        if (cancelled) return;

        if (result.success) {
          setVerificationState("verified");
          const isOnboarded = result.data?.isUserOnboarded;

          timeoutId = setTimeout(() => {
            router.replace(isOnboarded ? "/dashboard" : "/onboarding");
          }, 3000);
        } else {
          setVerificationState("failed");
        }
      } catch {
        if (!cancelled) {
          setVerificationState("failed");
        }
      }
    }

    verifyEmail();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [token, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2">
      {VerificationState === "verifying" && <Spinner className="size-15" />}
      {VerificationState === "verifying" && (
        <p className="text-sm font-medium">Verifying...</p>
      )}
      {VerificationState === "verified" && (
        <p className="text-sm font-medium">Verified! Redirecting...</p>
      )}
      {VerificationState === "failed" && (
        <>
          <p className="text-sm font-medium">
            Failed to verify. Please try again.
          </p>
          <Link href="/login">
            <Button variant="link">Login</Button>
          </Link>
        </>
      )}
    </div>
  );
}
