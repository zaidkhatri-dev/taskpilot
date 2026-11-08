"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useDeleteWorkspace, useWorkspaces } from "@/hooks/workspace";
import { queryKeys } from "@/hooks/keys";
import { updateWorkspace } from "@/lib/actions/workspace";
import { formatName } from "@/lib/utils/formatting";
import { getFieldError } from "@/lib/utils/form";

interface UpdateWorkspaceFormProps {
  workspaceId: string;
}

export const UpdateWorkspaceForm = ({
  workspaceId,
}: UpdateWorkspaceFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    data: workspaces,
    isPending: isWorkspacesPending,
    isError,
    error,
  } = useWorkspaces();

  const workspace = workspaces?.find((w) => w.id === workspaceId);

  const [state, formAction, isPending] = useActionState(updateWorkspace, null);
  const { mutate: deleteWorkspaceMutation, isPending: isDeletePending } =
    useDeleteWorkspace();

  const [isEditing, setIsEditing] = useState(false);
  const [prevWorkspaceName, setPrevWorkspaceName] = useState(workspace?.name);
  const [name, setName] = useState<string>(() =>
    workspace ? formatName(workspace.name) : "",
  );

  // Sync local state when workspace data changes
  if (workspace && workspace.name !== prevWorkspaceName) {
    setPrevWorkspaceName(workspace.name);
    setName(formatName(workspace.name));
  }

  // Exit editing mode on successful submission (render-phase sync, no effect)
  const [prevSubmissionId, setPrevSubmissionId] = useState(state?.submissionId);
  if (state?.submissionId !== prevSubmissionId) {
    setPrevSubmissionId(state?.submissionId);
    if (state?.success) {
      setIsEditing(false);
    }
  }

  const nameError = getFieldError(state?.errors ?? null, "name");
  const handledSubmissionIdRef = useRef<number | undefined>(
    state?.submissionId,
  );

  useEffect(() => {
    if (!state) return;
    if (state.errors?.length) return;
    if (state.submissionId === handledSubmissionIdRef.current) return;
    handledSubmissionIdRef.current = state.submissionId;

    if (state.success) {
      toast.add({ description: state.message, type: "success" });
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all });
    } else {
      toast.add({
        description: state.message,
        type: "error",
        priority: "high",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.submissionId, workspaceId]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const formattedWorkspaceName = workspace ? formatName(workspace.name) : "";
  const isDirty = name.trim() !== formattedWorkspaceName;

  // Click outside / blur logic: cancel editing when user clicks elsewhere
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // If the next active focus element is still inside our container, do not exit
    if (
      containerRef.current &&
      e.relatedTarget &&
      containerRef.current.contains(e.relatedTarget as Node)
    ) {
      return;
    }

    if (isEditing && !isPending) {
      setName(formattedWorkspaceName);
      setIsEditing(false);
    }
  };

  const handleDelete = (close: () => void) => {
    deleteWorkspaceMutation(workspaceId, {
      onSuccess: () => {
        close();
        router.replace("/w");
      },
    });
  };

  if (isError && !workspaces) throw error;

  if (isWorkspacesPending) {
    return (
      <div className="flex w-full items-center justify-between gap-4">
        <Skeleton className="h-9 w-64" />
        <div className="flex items-center gap-0.5">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <p className="text-sm text-muted-foreground">Workspace not found.</p>
    );
  }

  return (
    <div
      ref={containerRef}
      onBlur={handleBlur}
      className="flex w-full flex-col gap-2"
    >
      <form
        ref={formRef}
        noValidate
        action={formAction}
        className="flex w-full items-center justify-between gap-4"
      >
        <input type="hidden" name="workspaceId" value={workspaceId} />

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Field data-invalid={!!nameError} className="w-full">
              <Input
                ref={inputRef}
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                className="text-2xl font-semibold tracking-tight h-10 px-2 w-full"
                aria-invalid={!!nameError}
                aria-describedby={nameError ? "name-error" : undefined}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (isDirty && !isPending) {
                      formRef.current?.requestSubmit();
                    } else if (!isDirty) {
                      setIsEditing(false);
                    }
                  } else if (e.key === "Escape") {
                    setName(formattedWorkspaceName);
                    setIsEditing(false);
                  }
                }}
              />
            </Field>
          ) : (
            <h1 className="text-2xl font-semibold tracking-tight text-foreground truncate px-2 py-1">
              {formattedWorkspaceName}
            </h1>
          )}
        </div>

        {/* Action icons docked consistently on the right */}
        <div className="flex items-center gap-0.5 shrink-0">
          {isEditing ? (
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              disabled={isPending || !isDirty}
              onMouseDown={(e) => {
                // Prevent input blur before click / submit registers
                e.preventDefault();
              }}
              aria-label="Save workspace name"
            >
              {isPending ? <Spinner /> : <Check className="size-4" />}
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              aria-label="Edit workspace name"
            >
              <Edit className="size-4" />
            </Button>
          )}

          <ConfirmationDialog
            title="Delete workspace"
            trigger={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Delete workspace"
                disabled={isPending || isDeletePending}
              >
                <Trash2 className="size-4" />
              </Button>
            }
            confirmLabel="Delete Workspace"
            confirmingLabel="Deleting..."
            confirmVariant="destructive"
            isPending={isDeletePending}
            onConfirm={handleDelete}
          >
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {formattedWorkspaceName}
            </span>
            ? This action cannot be undone and will permanently remove all
            associated boards, tasks, and data.
          </ConfirmationDialog>
        </div>
      </form>

      {nameError && (
        <FieldError id="name-error">{nameError}</FieldError>
      )}
    </div>
  );
};

export default UpdateWorkspaceForm;
