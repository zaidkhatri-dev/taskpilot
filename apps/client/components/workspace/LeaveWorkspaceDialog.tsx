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

interface LeaveWorkspaceDialogProps {
  workspaceId: string;
  workspaceName?: string;
  onLeave?: (workspaceId: string) => void | Promise<void>;
}

export const LeaveWorkspaceDialog = ({
  workspaceId,
  workspaceName,
  onLeave,
}: LeaveWorkspaceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleConfirm = async () => {
    if (onLeave) {
      setIsLeaving(true);
      try {
        await onLeave(workspaceId);
      } finally {
        setIsLeaving(false);
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive" size="sm">
            Leave
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Leave your workspace</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to leave{" "}
          {workspaceName ? (
            <span className="font-medium text-foreground">{workspaceName}</span>
          ) : (
            "this workspace"
          )}
          ? You will lose access to all its boards and tasks.
        </p>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLeaving}
          >
            {isLeaving ? "Leaving..." : "Leave Workspace"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveWorkspaceDialog;

