"use client";

import OnboardingForm from "@/components/auth/OnboardingForm";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useActionState, useEffect } from "react";
import { completeOnboarding } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "@/components/ui/toast";
import { clientConfig } from "@repo/config/client";

export default function OnboardingPage() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    completeOnboarding,
    null,
  );

  useEffect(() => {
    if (!state) return;

    if (state.errors?.length) return;

    if (state.success) {
      toast.add({
        description: `${state.message}, Redirecting...`,
        type: "success",
      });

      setTimeout(() => {
        router.replace("/create-organization");
      }, clientConfig.NEXT_PUBLIC_REDIRECT_DELAY);
    } else {
      toast.add({
        description: state.message,
        type: "error",
        priority: "high",
      });
    }
  }, [state, router]);

  return (
    <ProtectedRoute requireOnboarding={false} requireOrganization={false}>
      <div className="flex min-h-screen justify-center items-center">
        <OnboardingForm
          formAction={formAction}
          isPending={isPending}
          fieldErrors={state?.errors || null}
          values={state?.values || {}}
        />
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}
