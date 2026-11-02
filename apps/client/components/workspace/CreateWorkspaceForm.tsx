"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useActionState, useEffect, useState } from "react";
import { createWorkspace } from "@/lib/actions/workspace";
import { toast } from "@/components/ui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queries/keys";

export function CreateWorkspaceForm() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createWorkspace, null);

  const nameError = getFieldError(state?.errors ?? null, "name");

  useEffect(() => {
    if (!state) return;
    if (state.errors?.length) return;

    if (state.success) {
      setOpen(false);

      toast.add({
        description: state.message,
        type: "success",
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.all,
      });
    } else {
      toast.add({
        description: state.message,
        type: "error",
        priority: "high",
      });
    }
  }, [state, queryClient]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="secondary" size="lg">
            <Plus data-icon="inline-start" />
            Create a new Workspace
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form noValidate action={formAction} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Create a new Workspace</DialogTitle>
            <DialogDescription>
              Enter the details of your workspace below.
            </DialogDescription>
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
            <Button type="submit" disabled={isPending}>
              {isPending && <Spinner data-icon="inline-start" />}
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
