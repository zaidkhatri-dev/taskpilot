"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { inviteUser } from "@/lib/actions/workspace";
import { getFieldError } from "@/lib/utils/form";
import { queryKeys } from "@/hooks/keys";
import { useTargetPermission, useWorkspaceRole } from "@/hooks/workspace";
import { TARGET_PERMISSIONS, type WorkspaceMembershipRoles } from "@repo/contracts/miscellaneous/auth";

interface InvitationDialogProps {
  workspaceId: string;
}

export function InvitationDialog({ workspaceId }: InvitationDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(inviteUser, null);
  const queryClient = useQueryClient();
  const currentUserRole = useWorkspaceRole(workspaceId);
  const canInvite = useTargetPermission("user:invite", workspaceId, "member");

  const availableRoles =
    currentUserRole && TARGET_PERMISSIONS["user:invite"][currentUserRole]
      ? TARGET_PERMISSIONS["user:invite"][currentUserRole]
      : [];

  const [selectedRole, setSelectedRole] = useState<WorkspaceMembershipRoles>("member");

  // Keep selectedRole valid if availableRoles changes
  useEffect(() => {
    if (!availableRoles.includes(selectedRole)) {
      setSelectedRole(availableRoles[0] ?? "member");
    }
  }, [availableRoles, selectedRole]);

  const emailError = getFieldError(state?.errors ?? null, "email");
  const roleError = getFieldError(state?.errors ?? null, "role");

  const handledSubmissionIdRef = useRef<number | undefined>(
    state?.submissionId,
  );

  useEffect(() => {
    if (!state) return;
    if (state.errors?.length) return;
    if (state.submissionId === handledSubmissionIdRef.current) return;
    handledSubmissionIdRef.current = state.submissionId;

    if (state.success) {
      setOpen(false);
      toast.add({
        description: state.message,
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.usersBase(workspaceId),
      });
    } else {
      toast.add({
        description: state.message,
        type: "error",
        priority: "high",
      });
    }
  }, [state?.submissionId, workspaceId, queryClient]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!canInvite) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <Plus data-icon="inline-start" />
            Invite
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form noValidate action={formAction} className="flex flex-col gap-6">
          <input type="hidden" name="workspaceId" value={workspaceId} />
          <input type="hidden" name="role" value={selectedRole} />

          <DialogHeader>
            <DialogTitle>Invite to Workspace</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            <Field data-invalid={!!emailError}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="name@example.com"
                required
                autoComplete="email"
                defaultValue={
                  state?.values?.email ? String(state.values.email) : ""
                }
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : "email-desc"}
              />
              <div className="min-h-6">
                {emailError ? (
                  <FieldError id="email-error">{emailError}</FieldError>
                ) : (
                  <FieldDescription id="email-desc">
                    Enter the email address of the person you want to invite
                  </FieldDescription>
                )}
              </div>
            </Field>

            <Field data-invalid={!!roleError}>
              <FieldLabel htmlFor="role-select">Role</FieldLabel>
              <DropdownMenu>
                <DropdownMenuTrigger
                  id="role-select"
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full justify-between rounded-3xl border border-input/50 bg-input/50 px-3.5 py-1.5 font-normal hover:bg-input/70 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
                    />
                  }
                >
                  <span className="capitalize">{selectedRole}</span>
                  <ChevronDown className="size-4 shrink-0 opacity-60" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="w-(--anchor-width) min-w-48 border border-sidebar-border bg-sidebar p-1.5 shadow-lg"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      Roles
                    </DropdownMenuLabel>
                    {availableRoles.map((role) => {
                      const isSelected = role === selectedRole;
                      return (
                        <DropdownMenuItem
                          key={role}
                          className="flex items-center justify-between gap-2 cursor-pointer capitalize"
                          onClick={() => setSelectedRole(role)}
                        >
                          <span className={isSelected ? "font-medium" : ""}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </span>
                          {isSelected && <Check className="size-4 shrink-0" />}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="min-h-6">
                {roleError ? (
                  <FieldError id="role-error">{roleError}</FieldError>
                ) : (
                  <FieldDescription id="role-desc">
                    Select a role for the invited user
                  </FieldDescription>
                )}
              </div>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              {isPending ? "Inviting..." : "Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default InvitationDialog;
