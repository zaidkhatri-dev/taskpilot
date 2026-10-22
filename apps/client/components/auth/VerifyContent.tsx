"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyLink } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";

export default function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [VerificationState, setVerificationState] = useState<
    "idle" | "verifying" | "verified" | "failed"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function verifyEmail() {
      if (!token) {
        setVerificationState("failed");
        setErrorMessage("The link is invalid or missing.");
        return;
      }

      try {
        setVerificationState("verifying");
        const result = await verifyLink(token);

        if (cancelled) return;

        if (result.success) {
          setVerificationState("verified");

          const isOnboarded = result.data?.isUserOnboarded;
          const hasOrganization = result.data?.hasOrganization;

          router.replace(
            isOnboarded
              ? hasOrganization
                ? "/workspace"
                : "/create-organization"
              : "/onboarding",
          );
        } else {
          setVerificationState("failed");
          setErrorMessage(result.message);
        }
      } catch {
        if (!cancelled) {
          setVerificationState("failed");
          setErrorMessage("Failed to verify. Please try again.");
        }
      }
    }

    verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-2">
      {VerificationState === "verifying" && (
        <div className="flex flex-col items-center gap-2">
          <Spinner className="size-15" />
          <p className="text-sm font-medium">Signing you in...</p>
          <p className="text-sm text-muted-foreground">
            Please wait while we complete your sign in.
          </p>
        </div>
      )}
      {VerificationState === "verified" && (
        <div className="flex flex-col items-center gap-2">
          <CheckCircleIcon className="size-15 text-primary" />
          <p className="text-sm font-medium">You&apos;re signed in!</p>
          <p className="text-sm text-muted-foreground">
            Your sign-in was successful. Redirecting you now…
          </p>
        </div>
      )}
      {VerificationState === "failed" && (
        <div className="flex flex-col items-center gap-2">
          <XCircleIcon className="size-15 text-destructive" />
          <p className="text-sm font-medium text-destructive">{errorMessage}</p>
          <p className="text-sm font-medium text-destructive mb-3">
            Request a new sign in link to continue
          </p>
          <Link href="/signin">
            <Button variant="outline">Request New Link</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
