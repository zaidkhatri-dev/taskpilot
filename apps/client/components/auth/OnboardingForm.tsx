import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { FormActionResponse } from "@repo/contracts/response";

interface OnboardingFormProps {
  formAction: (formData: FormData) => void;
  isPending: boolean;
  errorPath: FormActionResponse["path"];
  errorMsg: string;
  values: Record<string, unknown>;
}

export default function OnboardingForm({
  formAction,
  isPending,
  errorPath,
  errorMsg,
  values,
}: OnboardingFormProps) {
  return (
    <form noValidate className="w-full max-w-xs" action={formAction}>
      <FieldSet>
        <FieldLegend className="text-center mb-4">
          Complete your profile
        </FieldLegend>

        <FieldGroup>
          <Field>
            <Input
              type="text"
              name="username"
              required
              placeholder="Username"
              aria-invalid={errorPath === "username"}
              defaultValue={values?.username ? String(values.username) : ""}
              aria-describedby={
                errorPath === "username" ? "username-error" : "username-desc"
              }
            />
            {errorPath === "username" ? (
              <FieldError id="username-error">{errorMsg}</FieldError>
            ) : (
              <FieldDescription id="username-desc">
                Must be 3-20 characters long and can only contain letters, numbers, and underscores.
              </FieldDescription>
            )}
          </Field>

          <Field>
            <Input
              type="file"
              name="avatar"
              required
              accept="image/jpeg,image/jpg,image/png,image/webp"
              aria-invalid={errorPath === "avatar"}
              aria-describedby={
                errorPath === "avatar" ? "avatar-error" : "avatar-desc"
              }
            />
            {errorPath === "avatar" ? (
              <FieldError id="avatar-error">{errorMsg}</FieldError>
            ) : (
              <FieldDescription id="avatar-desc">
                Upload your profile picture
              </FieldDescription>
            )}
          </Field>

          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              {isPending ? "Submitting..." : "Complete onboarding"}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
