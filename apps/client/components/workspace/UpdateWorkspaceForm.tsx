"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Edit } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getFieldError } from "@/lib/utils/form";
import { useWorkspacePermission, useWorkspaces } from "@/hooks/workspace";
import { queryKeys } from "@/hooks/keys";
import { updateWorkspace } from "@/lib/actions/workspace";
import { formatName } from "@/lib/utils/formatting";
import { toast } from "@/components/ui/toast";

export function UpdateWorkspaceForm({ workspaceId }: { workspaceId: string }) {
  const { data: workspaces, isPending, isError, error } = useWorkspaces();
  const workspace = workspaces?.find((w) => w.id === workspaceId);
  const canUpdateWorkspace = useWorkspacePermission(workspaceId, "workspace:update");
  const [state, formAction, pending] = useActionState(updateWorkspace, null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const handled = useRef<number | undefined>(state?.submissionId);
  useEffect(() => {
    if (!state || state.errors?.length || state.submissionId === handled.current) return;
    handled.current = state.submissionId;
    toast.add({ description: state.message, type: state.success ? "success" : "error", priority: state.success ? undefined : "high" });
    if (state.success) {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all });
    }
  }, [state, queryClient]);

  if (isError && !workspaces) throw error;
  if (!canUpdateWorkspace) return null;
  if (isPending) return <Button variant="ghost" size="icon" disabled aria-label="Edit workspace name"><Edit /></Button>;
  if (!workspace) return null;

  const currentName = formatName(workspace.name);
  const nameError = getFieldError(state?.errors ?? null, "name");
  const isDirty = name.trim() !== currentName;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="ghost" size="icon" aria-label="Edit workspace name" onClick={() => setName(currentName)}><Edit className="size-4" /></Button>} />
      <DialogContent className="sm:max-w-sm">
        <form noValidate action={formAction} className="flex flex-col gap-6">
          <DialogHeader><DialogTitle>Update workspace name</DialogTitle></DialogHeader>
          <input type="hidden" name="workspaceId" value={workspaceId} />
          <FieldGroup>
            <Field data-invalid={!!nameError}>
              <FieldLabel htmlFor="workspace-name">Name</FieldLabel>
              <Input id="workspace-name" name="name" value={name} onChange={(event) => setName(event.target.value)} required autoComplete="off" aria-invalid={!!nameError} aria-describedby={nameError ? "workspace-name-error" : "workspace-name-desc"} />
              <div className="min-h-6">{nameError ? <FieldError id="workspace-name-error">{nameError}</FieldError> : <FieldDescription id="workspace-name-desc">Enter a name for your workspace</FieldDescription>}</div>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={pending || !isDirty}>{pending && <Spinner data-icon="inline-start" />}{pending ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateWorkspaceForm;
