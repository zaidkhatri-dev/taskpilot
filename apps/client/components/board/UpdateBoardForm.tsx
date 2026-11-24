"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Edit } from "lucide-react";
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
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { queryKeys } from "@/hooks/keys";
import { updateBoard } from "@/lib/actions/board";
import { formatName } from "@/lib/utils/formatting";
import { getFieldError } from "@/lib/utils/form";
import { isUnchanged } from "@/lib/utils/miscellaneous";
import type { BoardItem } from "@repo/contracts/response/board";

export interface UpdateBoardFormProps {
  workspaceId: string;
  board: BoardItem;
  trigger?: React.ReactElement;
  triggerIsNativeButton?: boolean;
}

export const UpdateBoardForm = ({
  workspaceId,
  board,
  trigger,
  triggerIsNativeButton = true,
}: UpdateBoardFormProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(updateBoard, null);

  const initialName = formatName(board.name);
  const initialDescription = board.description ?? "";

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  // Sync state whenever the dialog opens or the board prop changes
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setName(initialName);
      setDescription(initialDescription);
    }
    setOpen(nextOpen);
  };

  const nameError = getFieldError(state?.errors ?? null, "name");
  const descriptionError = getFieldError(state?.errors ?? null, "description");

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

  const initialValues = {
    name: initialName,
    description: initialDescription,
  };

  const currentValues = {
    name: name.trim(),
    description: description.trim(),
  };

  const isClean = isUnchanged(currentValues, initialValues);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        nativeButton={triggerIsNativeButton}
        render={
          trigger ?? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Edit board"
            >
              <Edit />
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-sm">
        <form
          noValidate
          action={formAction}
          className="flex flex-col gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          <input type="hidden" name="workspaceId" value={workspaceId} />
          <input type="hidden" name="boardId" value={board.id} />

          <DialogHeader>
            <DialogTitle>Update your board</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field data-invalid={!!nameError}>
              <FieldLabel htmlFor={`board-name-${board.id}`}>Name</FieldLabel>
              <Input
                type="text"
                id={`board-name-${board.id}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="off"
                aria-invalid={!!nameError}
                aria-describedby={
                  nameError
                    ? `board-name-${board.id}-error`
                    : `board-name-${board.id}-desc`
                }
                name={name.trim() !== initialName ? "name" : undefined}
              />
              <div className="min-h-6">
                {nameError ? (
                  <FieldError id={`board-name-${board.id}-error`}>
                    {nameError}
                  </FieldError>
                ) : (
                  <FieldDescription id={`board-name-${board.id}-desc`}>
                    Enter a name for your board
                  </FieldDescription>
                )}
              </div>
            </Field>

            <Field data-invalid={!!descriptionError}>
              <FieldLabel htmlFor={`board-description-${board.id}`}>
                Description (optional)
              </FieldLabel>
              <Input
                type="text"
                id={`board-description-${board.id}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoComplete="off"
                aria-invalid={!!descriptionError}
                aria-describedby={
                  descriptionError
                    ? `board-description-${board.id}-error`
                    : `board-description-${board.id}-desc`
                }
                name={
                  description.trim() !== initialDescription
                    ? "description"
                    : undefined
                }
              />
              <div className="min-h-6">
                {descriptionError ? (
                  <FieldError id={`board-description-${board.id}-error`}>
                    {descriptionError}
                  </FieldError>
                ) : (
                  <FieldDescription id={`board-description-${board.id}-desc`}>
                    Enter a description for your board
                  </FieldDescription>
                )}
              </div>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || isClean || !name.trim()}
            >
              {isPending && <Spinner data-icon="inline-start" />}
              {isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBoardForm;
