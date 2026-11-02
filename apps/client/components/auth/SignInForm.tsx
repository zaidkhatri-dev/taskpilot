"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldError,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useActionState, useEffect, useState } from "react";
import { getFieldError } from "@/lib/utils/form";
import { generateLink } from "@/lib/actions/auth";
import { toast } from "@/components/ui/toast";

export default function SignInForm() {
  const [state, formAction, isPending] = useActionState(generateLink, null);
  const [emailCount, setEmailCount] = useState(0);

  const emailError = getFieldError(state?.errors ?? null, "email");

  useEffect(() => {
    if (!state) return;
    if (state.errors?.length) return;

    if (state.success) {
      setEmailCount((prev) => prev + 1);
      toast.add({ description: state.message, type: "success" });
    } else {
      toast.add({ description: state.message, type: "error", priority: "high" });
    }
  }, [state]);

  return (
    <form noValidate className="w-full max-w-xs" action={formAction}>
      <FieldSet>
        <FieldLegend className="text-center mb-4">
          What&apos;s your email address?
        </FieldLegend>

        <FieldGroup>
          <Field data-invalid={!!emailError}>
            <Input
              type="email"
              name="email"
              required
              defaultValue={state?.values?.email ? String(state.values.email) : ""}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : "email-desc"}
            />
            <div className="min-h-10">
              {emailError ? (
                <FieldError id="email-error">{emailError}</FieldError>
              ) : (
                <FieldDescription id="email-desc">
                  We&apos;ll send an email with a one-time secure link to sign
                  in.
                </FieldDescription>
              )}
            </div>
          </Field>
          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              {isPending
                ? "Sending email"
                : emailCount > 0
                  ? "Resend email"
                  : "Send email"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
