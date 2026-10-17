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
import { useState } from "react";
import type { FormActionResponse } from "@repo/contracts/response";

interface LoginFormProps {
  formAction: (formData: FormData) => void;
  isPending: boolean;
  errorPath: FormActionResponse["path"];
  errorMsg: string;
  values: Record<string, unknown>;
}

export default function LoginForm({
  formAction,
  isPending,
  errorPath,
  errorMsg,
  values,
}: LoginFormProps) {
  const [emailCount, setEmailCount] = useState(0);

  return (
    <form noValidate className="w-full max-w-xs" action={formAction}>
      <FieldSet>
        <FieldLegend className="text-center mb-4">
          What&apos;s your email address?
        </FieldLegend>

        <FieldGroup>
          <Field>
            <Input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              aria-invalid={errorPath === "email"}
              defaultValue={values?.email ? String(values.email) : ""}
              aria-describedby={
                errorPath === "email" ? "email-error" : "email-desc"
              }
            />
            {errorPath === "email" ? (
              <FieldError id="email-error">{errorMsg}</FieldError>
            ) : (
              <FieldDescription id="email-desc">
                We&apos;ll send an email with a one-time secure link to sign in.
              </FieldDescription>
            )}
          </Field>
          <Field>
            <Button
              type="submit"
              disabled={isPending}
              onClick={() =>
                errorPath !== "email" && setEmailCount(emailCount + 1)
              }
            >
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
