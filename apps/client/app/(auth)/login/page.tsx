"use client";

import LoginForm from "@/components/auth/LoginForm";
import { useActionState, useEffect } from "react";
import { generateLink } from "@/lib/actions/auth";
import { toast, Toaster } from "@/components/ui/toast";

export default function Login() {
  const [state, formAction, isPending] = useActionState(generateLink, null);

  useEffect(() => {
    if (!state) return;

    if (state.path) return;

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
    <div className="flex min-h-screen items-center justify-center">
      <LoginForm
        formAction={formAction}
        isPending={isPending}
        errorPath={state?.path || null}
        errorMsg={state?.message || ""}
        values={state?.values || {}}
      />
      <Toaster />
    </div>
  );
}
