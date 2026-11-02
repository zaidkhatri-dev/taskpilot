"use client";

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
import { useActionState, useEffect, useRef, useState } from "react";
import AvatarDialog from "@/components/auth/AvatarDialog";
import { getFieldError } from "@/lib/utils/form";
import { completeOnboarding } from "@/lib/actions/user";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/keys";

export default function OnboardingForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const hasActedRef = useRef(false);
  const [state, formAction, isPending] = useActionState(
    completeOnboarding,
    null,
  );

  const [selected, setSelected] = useState<string>(
    state?.values?.avatar ? String(state.values.avatar) : "avatar_01",
  );

  const avatarIdError = getFieldError(state?.errors ?? null, "avatarId");
  const firstNameError = getFieldError(state?.errors ?? null, "firstName");
  const lastNameError = getFieldError(state?.errors ?? null, "lastName");
  const usernameError = getFieldError(state?.errors ?? null, "username");

  useEffect(() => {
    if (!state) return;
    if (state.errors?.length) return;
    // Guard against re-firing on remount with the same state object
    if (hasActedRef.current) return;
    hasActedRef.current = true;

    if (state.success) {
      toast.add({
        description: state.message,
        type: "success",
      });
      // Invalidate the cached session so ProtectedRoute immediately sees
      // isOnboarded: true instead of redirecting back to /onboarding
      queryClient.invalidateQueries({ queryKey: queryKeys.session });
      router.replace("/workspace");
    } else {
      toast.add({
        description: state.message,
        type: "error",
        priority: "high",
      });
    }
  }, [state, router, queryClient]);

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
                defaultValue={
                  state?.values?.firstName ? String(state.values.firstName) : ""
                }
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
                defaultValue={
                  state?.values?.lastName ? String(state.values.lastName) : ""
                }
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
              defaultValue={
                state?.values?.username ? String(state.values.username) : ""
              }
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
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Spinner data-icon="inline-start" />}
            {isPending ? "Submitting..." : "Onboard me"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
