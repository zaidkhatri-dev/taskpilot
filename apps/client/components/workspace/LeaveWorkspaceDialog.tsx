"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLeaveWorkspace, useWorkspacePermission } from "@/hooks/workspace";

interface LeaveWorkspaceDialogProps {
  workspaceId: string;
  workspaceName?: string;
}

export const LeaveWorkspaceDialog = ({
  workspaceId,
  workspaceName = "this workspace",
}: LeaveWorkspaceDialogProps) => {
  const [open, setOpen] = useState(false);
  const canLeave = useWorkspacePermission(workspaceId, "workspace:leave");
  const { mutate: leave, isPending } = useLeaveWorkspace();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive" size="sm" disabled={!canLeave}>
            Leave
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Leave workspace</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to leave{" "}
          <span className="font-medium text-foreground">{workspaceName}</span>?
          You will lose access to all its boards and tasks.
        </p>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() =>
              leave(workspaceId, { onSuccess: () => setOpen(false) })
            }
          >
            {isPending ? "Leaving..." : "Leave Workspace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveWorkspaceDialog;
