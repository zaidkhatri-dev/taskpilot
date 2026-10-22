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
import { useEffect, useState } from "react";
import type { FieldError as FieldErrorType } from "@repo/contracts/response";

interface SignInFormProps {
  formAction: (formData: FormData) => void;
  isPending: boolean;
  errorPath: FieldErrorType[] | null;
  errorMsg: string;
  values: Record<string, unknown>;
  isSuccess?: boolean;
}

export default function SignInForm({
  formAction,
  isPending,
  errorPath: errors,
  errorMsg,
  values,
  isSuccess,
}: SignInFormProps) {
  const [emailCount, setEmailCount] = useState(0);
  const emailError = errors?.find((e) => e.path === "email")?.message;

  useEffect(() => {
    if (isSuccess) {
      setEmailCount((prev) => prev + 1);
    }
  }, [isSuccess]);

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
              placeholder="name@example.com"
              defaultValue={values?.email ? String(values.email) : ""}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : "email-desc"}
            />
            <div className="min-h-10">
              {emailError ? (
                <FieldError id="email-error">{emailError}</FieldError>
              ) : (
                <FieldDescription id="email-desc">
                  We'll send an email with a one-time secure link to sign in.
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
