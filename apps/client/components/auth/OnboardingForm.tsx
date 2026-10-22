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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import type { FormProps } from "@/types/form";
import { useState } from "react";
import AvatarDialog from "@/components/auth/AvatarDialog";
import { getFieldError } from "@/lib/utils/form";

export default function OnboardingForm({
  formAction,
  isPending,
  fieldErrors,
  values,
}: FormProps) {
  const [selected, setSelected] = useState<string>(
    values?.avatar ? String(values.avatar) : "avatar_01",
  );

  const avatarIdError = getFieldError(fieldErrors, "avatarId");
  const firstNameError = getFieldError(fieldErrors, "firstName");
  const lastNameError = getFieldError(fieldErrors, "lastName");
  const usernameError = getFieldError(fieldErrors, "username");

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
        </Avatar>

        <AvatarDialog selected={selected} setSelected={setSelected} />

        <FieldGroup>
          <Field data-invalid={!!avatarIdError}>
            <Input
              type="hidden"
              name="avatarId"
              value={selected}
              required
              aria-invalid={!!avatarIdError}
              aria-describedby={
                avatarIdError ? "avatarId-error" : "avatarId-desc"
              }
            />
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
                aria-invalid={!!firstNameError}
                aria-describedby={
                  firstNameError ? "firstName-error" : "firstName-desc"
                }
              />
              <div className="min-h-10">
                {firstNameError ? (
                  <FieldError id="firstName-error">{firstNameError}</FieldError>
                ) : (
                  <FieldDescription id="firstName-desc">
                    Enter your name
                  </FieldDescription>
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
                aria-invalid={!!lastNameError}
                aria-describedby={
                  lastNameError ? "lastName-error" : "lastName-desc"
                }
              />
              <div className="min-h-10">
                {lastNameError ? (
                  <FieldError id="lastName-error">{lastNameError}</FieldError>
                ) : (
                  <FieldDescription id="lastName-desc">
                    Enter your surname
                  </FieldDescription>
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
              aria-invalid={!!usernameError}
              aria-describedby={
                usernameError ? "username-error" : "username-desc"
              }
            />
            <div className="min-h-6">
              {usernameError ? (
                <FieldError id="username-error">{usernameError}</FieldError>
              ) : (
                <FieldDescription id="username-desc">
                  Choose a unique username
                </FieldDescription>
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
