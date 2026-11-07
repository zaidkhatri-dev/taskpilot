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
import { useAcceptWorkspaceInvitation } from "@/hooks/workspace";

interface AcceptInvitationDialogProps {
  workspaceId: string;
  workspaceName?: string;
}

export const AcceptInvitationDialog = ({
  workspaceId,
  workspaceName = "this workspace",
}: AcceptInvitationDialogProps) => {
  const [open, setOpen] = useState(false);
  const { mutate: accept, isPending } = useAcceptWorkspaceInvitation();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm">Accept</Button>} />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Accept your workspace invitation</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to accept the invitation to join{" "}
          <span className="font-medium text-foreground">{workspaceName}</span>?
        </p>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            disabled={isPending}
            onClick={() =>
              accept(workspaceId, { onSuccess: () => setOpen(false) })
            }
          >
            {isPending ? "Accepting..." : "Accept Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptInvitationDialog;
