"use client";

import type { WorkspaceMembershipRoles } from "@repo/contracts/miscellaneous/auth";
import { ArrowDown, ArrowUp } from "lucide-react";

import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { useChangeWorkspaceUserRole } from "@/hooks/workspace";
import { isRoleChangeValid } from "@/lib/utils/workspace";
import { formatName } from "@/lib/utils/formatting";

interface ChangeRoleProps {
  workspaceId: string;
  userId: string;
  firstName: string;
  lastName: string;
  currentRole: WorkspaceMembershipRoles;
}

export const ChangeRole = ({
  workspaceId,
  userId,
  firstName,
  lastName,
  currentRole,
}: ChangeRoleProps) => {
  const { mutate, isPending } = useChangeWorkspaceUserRole();
  const targetRole: "admin" | "member" =
    currentRole === "admin" ? "member" : "admin";

  if (!isRoleChangeValid(currentRole, targetRole)) return null;

  const isPromotion = targetRole === "admin";
  const label = isPromotion ? "Promote" : "Demote";

  return (
    <ConfirmationDialog
      title={`${label} user?`}
      trigger={
        <Button variant="outline" size="sm">
          {isPromotion ? <ArrowUp /> : <ArrowDown />}
          {label}
        </Button>
      }
      isPending={isPending}
      confirmLabel={label}
      confirmingLabel="Updating role..."
      confirmVariant="default"
      onConfirm={(close) =>
        mutate({ workspaceId, userId, role: targetRole }, { onSuccess: close })
      }
    >
      This will change {`${formatName(firstName)} ${formatName(lastName)}`}&apos;s role to <span className="font-medium text-foreground">{targetRole}</span>.
    </ConfirmationDialog>
  );
};

export default ChangeRole;