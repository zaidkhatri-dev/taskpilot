"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import AvatarDialog from "@/components/auth/AvatarDialog";
import { useMe } from "@/hooks/user";
import { queryKeys } from "@/hooks/keys";
import { updateUser } from "@/lib/actions/user";
import { formatName } from "@/lib/utils/formatting";
import { getFieldError } from "@/lib/utils/form";
import { isUnchanged } from "@/lib/utils/miscellaneous";

export const UpdateUserForm = () => {
  const queryClient = useQueryClient();
  const { data: user, isPending: isUserPending, isError, error } = useMe();

  const [state, formAction, isPending] = useActionState(updateUser, null);

  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  // Sync local state with fetched user data (once loaded)
  useEffect(() => {
    if (!user) return;
    setSelectedAvatar(user.avatarId ?? "avatar_01");
    setFirstName(formatName(user.firstName));
    setLastName(formatName(user.lastName));
    setUsername(user.username ?? "");
  }, [user]);

  const firstNameError = getFieldError(state?.errors ?? null, "firstName");
  const lastNameError = getFieldError(state?.errors ?? null, "lastName");
  const usernameError = getFieldError(state?.errors ?? null, "username");
  const avatarIdError = getFieldError(state?.errors ?? null, "avatarId");

  const handledSubmissionIdRef = useRef<number | undefined>(
    state?.submissionId,
  );

  useEffect(() => {
    if (!state) return;
    if (state.errors?.length) return;
    if (state.submissionId === handledSubmissionIdRef.current) return;
    handledSubmissionIdRef.current = state.submissionId;

    if (state.success) {
      toast.add({
        description: state.message,
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.session });
    } else {
      toast.add({
        description: state.message,
        type: "error",
        priority: "high",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.submissionId]);

  if (isError && !user) throw error;

  if (isUserPending) {
    return (
      <div className="flex w-full max-w-2xl flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="size-24 rounded-full" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
        <Card className="w-full">
          <CardContent className="space-y-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </CardContent>
        </Card>
        <div className="flex w-full justify-center sm:justify-end">
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    );
  }

  const initialValues = {
    avatarId: user?.avatarId ?? "avatar_01",
    firstName: formatName(user?.firstName),
    lastName: formatName(user?.lastName),
    username: user?.username ?? "",
  };

  const currentValues = {
    avatarId: selectedAvatar,
    firstName,
    lastName,
    username,
  };

  const isClean = isUnchanged(currentValues, initialValues);

  return (
    <form
      noValidate
      action={formAction}
      className="flex w-full max-w-2xl flex-col items-center gap-6"
    >
      {/* Big avatar outside of card at the center */}
      <div className="flex flex-col items-center gap-3">
        <Avatar className="size-24">
          <AvatarImage
            src={`/avatars/${selectedAvatar}.svg`}
            alt={selectedAvatar || "avatar_01"}
            width={96}
            height={96}
            loading="eager"
          />
        </Avatar>
        <AvatarDialog
          selected={selectedAvatar || "avatar_01"}
          setSelected={setSelectedAvatar}
        />
        <Field data-invalid={!!avatarIdError}>
          <Input
            type="hidden"
            name="avatarId"
            value={selectedAvatar}
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
      </div>

      <Card className="w-full">
        <CardContent className="space-y-6">
          <FieldGroup className="gap-6">
            {/* 1. First name */}
            <Field
              orientation="responsive"
              className="justify-between gap-2 sm:flex-row sm:items-center sm:gap-4"
              data-invalid={!!firstNameError}
            >
              <div className="space-y-0.5">
                <FieldLabel htmlFor="firstName">First name</FieldLabel>
                <FieldDescription
                  id="firstName-desc"
                  className="hidden sm:block"
                >
                  Your name
                </FieldDescription>
              </div>
              <div className="w-full sm:max-w-sm space-y-1">
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  aria-invalid={!!firstNameError}
                  aria-describedby={
                    firstNameError ? "firstName-error" : "firstName-desc"
                  }
                />
                <div className="min-h-6 sm:hidden">
                  {firstNameError ? (
                    <FieldError id="firstName-error">
                      {firstNameError}
                    </FieldError>
                  ) : (
                    <FieldDescription id="firstName-desc-mobile">
                      Your name
                    </FieldDescription>
                  )}
                </div>
                {firstNameError && (
                  <FieldError
                    id="firstName-error-desktop"
                    className="hidden sm:block"
                  >
                    {firstNameError}
                  </FieldError>
                )}
              </div>
            </Field>

            {/* 2. Last name */}
            <Field
              orientation="responsive"
              className="justify-between gap-2 sm:flex-row sm:items-center sm:gap-4"
              data-invalid={!!lastNameError}
            >
              <div className="space-y-0.5">
                <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                <FieldDescription
                  id="lastName-desc"
                  className="hidden sm:block"
                >
                  Your surname
                </FieldDescription>
              </div>
              <div className="w-full sm:max-w-sm space-y-1">
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  aria-invalid={!!lastNameError}
                  aria-describedby={
                    lastNameError ? "lastName-error" : "lastName-desc"
                  }
                />
                <div className="min-h-6 sm:hidden">
                  {lastNameError ? (
                    <FieldError id="lastName-error">{lastNameError}</FieldError>
                  ) : (
                    <FieldDescription id="lastName-desc-mobile">
                      Your surname
                    </FieldDescription>
                  )}
                </div>
                {lastNameError && (
                  <FieldError
                    id="lastName-error-desktop"
                    className="hidden sm:block"
                  >
                    {lastNameError}
                  </FieldError>
                )}
              </div>
            </Field>

            {/* 3. Username */}
            <Field
              orientation="responsive"
              className="justify-between gap-2 sm:flex-row sm:items-center sm:gap-4"
              data-invalid={!!usernameError}
            >
              <div className="space-y-0.5">
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <FieldDescription
                  id="username-desc"
                  className="hidden sm:block"
                >
                  Your unique username handle
                </FieldDescription>
              </div>
              <div className="w-full sm:max-w-sm space-y-1">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-invalid={!!usernameError}
                  aria-describedby={
                    usernameError ? "username-error" : "username-desc"
                  }
                />
                <div className="min-h-6 sm:hidden">
                  {usernameError ? (
                    <FieldError id="username-error">{usernameError}</FieldError>
                  ) : (
                    <FieldDescription id="username-desc-mobile">
                      Your unique username handle
                    </FieldDescription>
                  )}
                </div>
                {usernameError && (
                  <FieldError
                    id="username-error-desktop"
                    className="hidden sm:block"
                  >
                    {usernameError}
                  </FieldError>
                )}
              </div>
            </Field>

            {/* 4. Email (plain non-form display) */}
            <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="text-sm font-medium text-foreground">Email</span>
              <span className="text-sm text-foreground">
                {user?.email ?? ""}
              </span>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <div className="flex w-full justify-center sm:justify-end">
        <Button type="submit" disabled={isPending || isClean}>
          {isPending && <Spinner data-icon="inline-start" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default UpdateUserForm;
