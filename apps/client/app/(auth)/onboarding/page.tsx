"use client";

import OnboardingForm from "@/components/auth/OnboardingForm";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useActionState, useEffect } from "react";
import { completeOnboarding } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "@/components/ui/toast";

export default function OnboardingPage() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    completeOnboarding,
    null,
  );

  useEffect(() => {
    if (!state) return;

    if (state.path) return;

    if (state.success) {
      toast.add({
        description: state.message,
        type: "success",
      });

      router.replace("/dashboard");
    } else {
      toast.add({
        description: state.message,
        type: "error",
        priority: "high",
      });
    }
  }, [state, router]);

  return (
    <ProtectedRoute requireOnboarding={true}>
      <div className="flex min-h-screen justify-center items-center">
        <OnboardingForm
          formAction={formAction}
          isPending={isPending}
          errorPath={state?.path || null}
          errorMsg={state?.message || ""}
          values={state?.values || {}}
        />
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}
