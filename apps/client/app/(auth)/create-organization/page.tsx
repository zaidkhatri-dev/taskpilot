"use client";

import CreateOrganizationForm from "@/components/auth/CreateOrganizationForm";
import { useActionState, useEffect, useState } from "react";
import { createOrganization } from "@/lib/actions/organization";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "@/components/ui/toast";
import { clientConfig } from "@repo/config/client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CreateOrganizationPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const [state, formAction, isPending] = useActionState(
    createOrganization,
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
        router.replace("/workspace");
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
    <ProtectedRoute requireOnboarding={true} requireOrganization={false}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          {showForm ? (
            <CreateOrganizationForm
              formAction={formAction}
              isPending={isPending}
              fieldErrors={state?.errors || null}
              values={state?.values || {}}
              setShowForm={setShowForm}
            />
          ) : (
            <>
              <h1 className="text-xl font-semibold">Join an Organization</h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                In order to move forward, you need to join an organization.
                Please check your email for an invitation.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Haven&apos;t received one? Create your own organization to get
                started.
              </p>
              <Button
                type="button"
                size="lg"
                className="mt-6"
                onClick={() => setShowForm(true)}
              >
                <PlusIcon data-icon="inline-start" /> Create an Organization
              </Button>
            </>
          )}

          <Toaster />
        </div>
      </div>
    </ProtectedRoute>
  );
}
