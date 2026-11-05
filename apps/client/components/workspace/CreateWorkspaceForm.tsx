"use client";

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
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getFieldError } from "@/lib/utils/form";
import { Plus } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { createWorkspace } from "@/lib/actions/workspace";
import { toast } from "@/components/ui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/keys";
import { useRouter } from "next/navigation";

interface CreateWorkspaceFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateWorkspaceForm({
  open: controlledOpen,
  onOpenChange,
}: CreateWorkspaceFormProps = {}) {
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createWorkspace, null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (onOpenChange ?? setInternalOpen)
    : setInternalOpen;

  const nameError = getFieldError(state?.errors ?? null, "name");
  const router = useRouter();

  // Pre-seed with the current submissionId so that stale state carried
  // over when this component remounts (e.g. navigating between workspace
  // routes) does not re-trigger the toast and redirect.
  const handledSubmissionIdRef = useRef<number | undefined>(
    state?.submissionId,
  );

  useEffect(() => {
    if (!state) return;
    if (state.errors?.length) return;
    // Skip if we've already handled this submission (guards against remount replay)
    if (state.submissionId === handledSubmissionIdRef.current) return;
    handledSubmissionIdRef.current = state.submissionId;

    if (state.success) {
      setOpen(false);

      toast.add({
        description: state.message,
        type: "success",
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.all,
      });
      router.replace(`/workspace/${state.data?.id}`);
    } else {
      toast.add({
        description: state.message,
        type: "error",
        priority: "high",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.submissionId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger
          render={
            <Button variant="secondary" size="lg">
              <Plus data-icon="inline-start" />
              Create Workspace
            </Button>
          }
        />
      )}
      <DialogContent className="sm:max-w-sm">
        <form noValidate action={formAction} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Create a new Workspace</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field data-invalid={!!nameError}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                type="text"
                id="name"
                name="name"
                required
                autoComplete="off"
                defaultValue={
                  state?.values?.name ? String(state.values.name) : ""
                }
                aria-invalid={!!nameError}
                aria-describedby={nameError ? "name-error" : "name-desc"}
              />
              <div className="min-h-6">
                {nameError ? (
                  <FieldError id="name-error">{nameError}</FieldError>
                ) : (
                  <FieldDescription id="name-desc">
                    Enter a name for your workspace
                  </FieldDescription>
                )}
              </div>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
