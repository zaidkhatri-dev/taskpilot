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
import type { FieldError as FieldErrorType } from "@repo/contracts/response";
import { useState } from "react";
import AvatarDialog from "@/components/auth/AvatarDialog";

interface OnboardingFormProps {
  formAction: (formData: FormData) => void;
  isPending: boolean;
  errorPath: FieldErrorType[] | null;
  errorMsg: string;
  values: Record<string, unknown>;
}

function getFieldError(
  errors: FieldErrorType[] | null,
  path: string,
): string | undefined {
  return errors?.find((e) => e.path === path)?.message;
}

export default function OnboardingForm({
  formAction,
  isPending,
  errorPath: errors,
  values,
}: OnboardingFormProps) {
  const [selected, setSelected] = useState<string>(
    values?.avatar ? String(values.avatar) : "avatar_01",
  );

  const avatarIdError = getFieldError(errors, "avatarId");
  const firstNameError = getFieldError(errors, "firstName");
  const lastNameError = getFieldError(errors, "lastName");
  const usernameError = getFieldError(errors, "username");

  return (
    <form noValidate className="w-full max-w-sm" action={formAction}>
      <FieldSet>
        <Avatar className="mx-auto size-20">
          <AvatarImage
            src={
              selected ? `/avatars/${selected}.svg` : "/avatars/avatar_01.svg"
            }
            alt={selected || "avatar_01"}
            width={175}
            height={175}
            loading="eager"
          />
          <AvatarFallback>{selected || "avatar_01"}</AvatarFallback>
        </Avatar>

        <AvatarDialog selected={selected} setSelected={setSelected} />

        <FieldGroup>
          <Field data-invalid={!!avatarIdError}>
            <Input type="hidden" name="avatarId" value={selected} required />
            <div className="min-h-6">
              {avatarIdError ? (
                <FieldError id="avatarId-error">{avatarIdError}</FieldError>
              ) : (
                <FieldDescription id="avatarId-desc" className="sr-only">
                  Select your avatar
                </FieldDescription>
              )}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field data-invalid={!!firstNameError}>
              <FieldLabel htmlFor="firstName">First name</FieldLabel>
              <Input
                type="text"
                name="firstName"
                id="firstName"
                required
                autoComplete="given-name"
                defaultValue={values?.firstName ? String(values.firstName) : ""}
                aria-describedby={
                  firstNameError ? "firstName-error" : "firstName-desc"
                }
              />
              <div className="min-h-10">
                {firstNameError && (
                  <FieldError id="firstName-error">{firstNameError}</FieldError>
                )}
              </div>
            </Field>

            <Field data-invalid={!!lastNameError}>
              <FieldLabel htmlFor="lastName">Last name</FieldLabel>
              <Input
                type="text"
                name="lastName"
                id="lastName"
                required
                autoComplete="family-name"
                defaultValue={values?.lastName ? String(values.lastName) : ""}
                aria-describedby={
                  lastNameError ? "lastName-error" : "lastName-desc"
                }
              />
              <div className="min-h-10">
                {lastNameError && (
                  <FieldError id="lastName-error">{lastNameError}</FieldError>
                )}
              </div>
            </Field>
          </div>

          <Field data-invalid={!!usernameError}>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              type="text"
              name="username"
              id="username"
              required
              autoComplete="off"
              defaultValue={values?.username ? String(values.username) : ""}
              aria-describedby={
                usernameError ? "username-error" : "username-desc"
              }
            />
            <div className="min-h-6">
              {usernameError && (
                <FieldError id="username-error">{usernameError}</FieldError>
              )}
            </div>
          </Field>
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            {isPending ? "Submitting..." : "Complete onboarding"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
