import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { FormActionResponse } from "@repo/contracts/response";
import { useState } from "react";
import AvatarDialog from "@/components/auth/AvatarDialog";

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
  const [selected, setSelected] = useState<string>(
    values?.avatar ? String(values.avatar) : "avatar_01",
  );

  return (
    <form noValidate className="w-full max-w-xs" action={formAction}>
      <FieldSet>
        <Avatar className="mx-auto size-20">
          <AvatarImage
            src={
              selected ? `/avatars/${selected}.svg` : "/avatars/avatar_01.svg"
            }
            alt={selected || "avatar_01"}
            width={175}
            height={175}
          />
          <AvatarFallback>{selected || "avatar_01"}</AvatarFallback>
        </Avatar>

        <AvatarDialog selected={selected} setSelected={setSelected} />

        <FieldGroup>
          <Field>
            <Input type="hidden" name="avatarId" value={selected} required />
            {errorPath === "avatarId" ? (
              <FieldError id="avatarId-error">{errorMsg}</FieldError>
            ) : (
              <FieldDescription id="avatarId-desc" className="sr-only">
                Select your avatar
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              type="text"
              name="username"
              id="username"
              required
              autoComplete="off"
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
