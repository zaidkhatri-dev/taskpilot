import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { FormActionResponse } from "@repo/contracts/response";

interface ProfileCardProps {
  formAction: (formData: FormData) => void;
  isPending: boolean;
  errorPath: FormActionResponse["path"];
  errorMsg: string;
  values: Record<string, unknown>;
}

export default function ProfileCard({
  formAction,
  isPending,
  errorPath,
  errorMsg,
  values,
}: ProfileCardProps) {
  const avatarId = values?.avatarId ? String(values.avatarId) : "avatar_01";
  const avatarSrc = `/avatars/${avatarId}.svg`;
  const firstName = values?.firstName ? String(values.firstName) : "";
  const lastName = values?.lastName ? String(values.lastName) : "";
  const initials =
    `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "UN";

  return (
    <form noValidate action={formAction}>
      <Card className="w-full max-w-2xl border-0 shadow-none bg-card/50 py-0">
        <CardContent className="px-6 py-2 divide-y divide-border">
          {/* Avatar */}
          <div className="flex h-14 items-center justify-between">
            <Label className="text-sm font-normal text-foreground">Avatar</Label>
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={avatarSrc}
                alt="Avatar"
                height={36}
                width={36}
              />
              <AvatarFallback className="bg-sky-500 text-white text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Email (Not Editable) */}
          <div className="flex h-14 items-center justify-between">
            <Label className="text-sm font-normal text-foreground">Email</Label>
            <span className="text-sm text-foreground">
              {values?.email ? String(values.email) : ""}
            </span>
          </div>

          {/* First Name */}
          <div className="flex h-14 items-center justify-between gap-4">
            <Label className="text-sm font-normal text-foreground whitespace-nowrap">
              First name
            </Label>
            <div className="flex flex-col items-end gap-1 max-w-xs w-full">
              <Input
                name="firstName"
                key={firstName}
                defaultValue={firstName}
                aria-invalid={errorPath === "firstName"}
                aria-describedby={
                  errorPath === "firstName" ? "firstName-error" : undefined
                }
                className="max-w-xs"
              />
              {errorPath === "firstName" && (
                <p id="firstName-error" className="text-sm text-destructive">
                  {errorMsg}
                </p>
              )}
            </div>
          </div>

          {/* Last Name */}
          <div className="flex h-14 items-center justify-between gap-4">
            <Label className="text-sm font-normal text-foreground whitespace-nowrap">
              Last name
            </Label>
            <div className="flex flex-col items-end gap-1 max-w-xs w-full">
              <Input
                name="lastName"
                key={lastName}
                defaultValue={lastName}
                aria-invalid={errorPath === "lastName"}
                aria-describedby={
                  errorPath === "lastName" ? "lastName-error" : undefined
                }
                className="max-w-xs"
              />
              {errorPath === "lastName" && (
                <p id="lastName-error" className="text-sm text-destructive">
                  {errorMsg}
                </p>
              )}
            </div>
          </div>

          {/* Username */}
          <div className="flex h-14 items-center justify-between gap-4">
            <Label className="text-sm font-normal text-foreground whitespace-nowrap">
              Username
            </Label>
            <div className="flex flex-col items-end gap-1 max-w-xs w-full">
              <Input
                name="username"
                key={values?.username ? String(values.username) : ""}
                defaultValue={values?.username ? String(values.username) : ""}
                aria-invalid={errorPath === "username"}
                aria-describedby={
                  errorPath === "username" ? "username-error" : undefined
                }
                className="max-w-xs"
              />
              {errorPath === "username" && (
                <p id="username-error" className="text-sm text-destructive">
                  {errorMsg}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex h-14 items-center justify-end">
            <Button type="submit" disabled={isPending} size="sm">
              {isPending && <Spinner data-icon="inline-start" />}
              {isPending ? "Saving" : "Save changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
