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
import { useActionState, useEffect, useRef, useState } from "react";
import { createBoard } from "@/lib/actions/board";
import { toast } from "@/components/ui/toast";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/keys";

interface CreateBoardFormProps {
  workspaceId: string;
  trigger?: React.ReactElement;
}

export const CreateBoardForm = ({
  workspaceId,
  trigger,
}: CreateBoardFormProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createBoard, null);

  const nameError = getFieldError(state?.errors ?? null, "name");
  const descriptionError = getFieldError(state?.errors ?? null, "description");

  // Pre-seed with the current submissionId so that stale state carried
  // over when this component remounts (e.g. navigating between workspace
  // routes) does not re-trigger the toast.
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
        queryKey: queryKeys.boards.all(workspaceId),
      });
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
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="lg">
              <Plus data-icon="inline-start" />
              Create Board
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form noValidate action={formAction} className="flex flex-col gap-6">
          <input type="hidden" name="workspaceId" value={workspaceId} />

          <DialogHeader>
            <DialogTitle>Create a new Board</DialogTitle>
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
                    Enter a name for your board
                  </FieldDescription>
                )}
              </div>
            </Field>

            <Field data-invalid={!!descriptionError}>
              <FieldLabel htmlFor="description">
                Description (optional)
              </FieldLabel>
              <Input
                type="text"
                id="description"
                name="description"
                autoComplete="off"
                defaultValue={
                  state?.values?.description
                    ? String(state.values.description)
                    : ""
                }
                aria-invalid={!!descriptionError}
                aria-describedby={
                  descriptionError ? "description-error" : "description-desc"
                }
              />
              <div className="min-h-6">
                {descriptionError ? (
                  <FieldError id="description-error">
                    {descriptionError}
                  </FieldError>
                ) : (
                  <FieldDescription id="description-desc">
                    Enter a description for your board
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
};

export default CreateBoardForm;
