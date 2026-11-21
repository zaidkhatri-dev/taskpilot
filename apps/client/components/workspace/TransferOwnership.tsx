"use client";

import { UserKey } from "lucide-react";
import type { WorkspaceMembershipRoles } from "@repo/contracts/miscellaneous/auth";

import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { useTransferWorkspaceOwnership } from "@/hooks/workspace";
import { canTransferOwnershipTo } from "@/lib/utils/workspace";
import { useWorkspacePermission } from "@/hooks/workspace";
import { formatName } from "@/lib/utils/formatting";

interface TransferOwnershipProps {
  workspaceId: string;
  userId: string;
  firstName: string;
  lastName: string;
  currentRole?: WorkspaceMembershipRoles;
}

export const TransferOwnership = ({
  workspaceId,
  userId,
  firstName,
  lastName,
  currentRole,
}: TransferOwnershipProps) => {
  const { mutate, isPending } = useTransferWorkspaceOwnership();
  const canTransfer = useWorkspacePermission(workspaceId, "workspace:transfer");

  if (!canTransfer || !canTransferOwnershipTo(currentRole ?? "")) return null;

  return (
    <ConfirmationDialog
      title="Transfer workspace ownership?"
      confirmLabel="Transfer ownership"
      confirmingLabel="Transferring..."
      confirmVariant="default"
      isPending={isPending}
      trigger={
        <Button variant="outline" size="sm">
          <UserKey />
          Transfer Ownership
        </Button>
      }
      onConfirm={(close) =>
        mutate({ workspaceId, userId }, { onSuccess: close })
      }
    >
      Transfer ownership to{" "}
      <span className="font-medium text-foreground">
        {`${formatName(firstName)} ${formatName(lastName)}`}
      </span>
      ? They will become the workspace owner.
    </ConfirmationDialog>
  );
};

export default TransferOwnership;
