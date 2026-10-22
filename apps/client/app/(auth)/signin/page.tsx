"use client";

import SignInForm from "@/components/auth/SignInForm";
import Image from "next/image";
import { useActionState, useEffect } from "react";
import { generateLink } from "@/lib/actions/auth";
import { toast, Toaster } from "@/components/ui/toast";
import GuestRoute from "@/components/auth/GuestRoute";

export default function Signin() {
  const [state, formAction, isPending] = useActionState(generateLink, null);

  useEffect(() => {
    if (!state) return;

    if (state.errors?.length) return;

    if (state.success) {
      toast.add({
        description: state.message,
        type: "success",
      });
    } else {
      toast.add({
        description: state.message,
        type: "error",
        priority: "high",
      });
    }
  }, [state]);

  return (
    <GuestRoute>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex w-full max-w-xs flex-col items-center">
          <Image
            src="/logo.webp"
            alt="TaskPilot Logo"
            width={48}
            height={48}
            className="mb-6 h-12 w-12 object-contain"
          />
          <SignInForm
            formAction={formAction}
            isPending={isPending}
            errorPath={state?.errors || null}
            errorMsg={state?.message || ""}
            values={state?.values || {}}
            isSuccess={state?.success}
          />
        </div>
        <Toaster />
      </div>
    </GuestRoute>
  );
}
