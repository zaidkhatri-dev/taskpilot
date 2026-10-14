import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { FormActionResponse } from "@repo/contracts/response";
import { useState } from "react";
import AvatarModel from "@/components/auth/AvatarDialog";

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
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <form noValidate className="w-full max-w-xs" action={formAction}>
      <FieldSet>
        <Avatar className="size-22 mx-auto">
          <AvatarImage
            src={
              selected ? `/avatars/${selected}.svg` : "/avatars/avatar_01.svg"
            }
          />
          <AvatarFallback>{selected || "avatar_01"}</AvatarFallback>
        </Avatar>

        <AvatarModel selected={selected} setSelected={setSelected} />

        <FieldGroup>
          <Field>
            <Input
              type="hidden"
              name="avatar"
              value={selected || "avatar_01"}
              required
              aria-invalid={errorPath === "avatar"}
              aria-describedby={
                errorPath === "avatar" ? "avatar-error" : "avatar-error"
              }
            />
            {errorPath === "avatar" && (
              <FieldError id="avatar-error">{errorMsg}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              type="text"
              name="username"
              id="username"
              required
              aria-invalid={errorPath === "username"}
              defaultValue={values?.username ? String(values.username) : ""}
              aria-describedby={
                errorPath === "username" ? "username-error" : "username-desc"
              }
            />
            {errorPath === "username" ? (
              <FieldError id="username-error">{errorMsg}</FieldError>
            ) : (
              <FieldDescription id="username-desc"></FieldDescription>
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
