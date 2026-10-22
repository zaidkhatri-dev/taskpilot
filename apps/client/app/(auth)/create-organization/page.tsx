"use client";

import CreateOrganizationDialog from "@/components/auth/CreateOrganizationDialog";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useActionState, useEffect } from "react";
import { createOrganization } from "@/lib/actions/organization";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "@/components/ui/toast";

export default function CreateOrganizationPage() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    createOrganization,
    null,
  );

  useEffect(() => {
    if (!state) return;

    if (state.errors?.length) return;

    if (state.success) {
      toast.add({
        description: state.message,
        type: "success",
      });

      router.replace("/workspace");
    } else {
      toast.add({
        description: state.message,
        type: "error",
        priority: "high",
      });
    }
  }, [state, router]);

  return (
    <ProtectedRoute requireOnboarding={true} requireOrganization={false}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <h1 className="text-xl font-semibold">Join an Organization</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            In order to move forward, you need to join an organization. Please
            check your email for an invitation.
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            Haven&apos;t received one? Create your own organization to get
            started.
          </p>

          <CreateOrganizationDialog
            formAction={formAction}
            isPending={isPending}
            fieldErrors={state?.errors || null}
            values={state?.values || {}}
          />
          <Toaster />
        </div>
      </div>
    </ProtectedRoute>
  );
}
