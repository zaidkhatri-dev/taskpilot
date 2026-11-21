"use client";

import { useState } from "react";
import { MoreHorizontal, UserMinus, ArrowUp, ArrowDown, UserKey } from "lucide-react";
import type { WorkspaceMembershipRoles } from "@repo/contracts/miscellaneous/auth";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { useRemoveWorkspaceUser, useChangeWorkspaceUserRole, useTransferWorkspaceOwnership } from "@/hooks/workspace";
import { formatName } from "@/lib/utils/formatting";
import { isRoleChangeValid, canTransferOwnershipTo } from "@/lib/utils/workspace";

type ActiveDialog = "remove" | "changeRole" | "transfer" | null;

interface UserActionsMenuProps {
  workspaceId: string;
  userId: string;
  firstName: string;
  lastName: string;
  currentRole: WorkspaceMembershipRoles;
  canChangeRole: boolean;
  canTransfer: boolean;
}

export function UserActionsMenu({
  workspaceId,
  userId,
  firstName,
  lastName,
  currentRole,
  canChangeRole,
  canTransfer,
}: UserActionsMenuProps) {
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);

  const { mutate: removeUser, isPending: isRemoving } = useRemoveWorkspaceUser();
  const { mutate: changeRole, isPending: isChangingRole } = useChangeWorkspaceUserRole();
  const { mutate: transferOwnership, isPending: isTransferring } = useTransferWorkspaceOwnership();

  const targetRole: "admin" | "member" = currentRole === "admin" ? "member" : "admin";
  const isPromotion = targetRole === "admin";
  const changeRoleLabel = isPromotion ? "Promote to Admin" : "Demote to Member";

  const canChangeRoleForUser =
    canChangeRole && isRoleChangeValid(currentRole, targetRole);
  const canTransferToUser = canTransfer && canTransferOwnershipTo(currentRole);

  const fullName = `${formatName(firstName)} ${formatName(lastName)}`.trim();

  return (
    <>
      {/* ── Desktop dropdown (md+) ───────────────────────────────────── */}
      <div className="hidden md:flex md:justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" aria-label="User actions">
                <MoreHorizontal />
              </Button>
            }
          />

          <DropdownMenuContent align="end">
            {/* Remove – closeOnClick=false keeps the menu mounted so the
                dialog (rendered outside the menu) can open without flicker */}
            <DropdownMenuItem
              variant="destructive"
              closeOnClick={false}
              onClick={() => setActiveDialog("remove")}
            >
              <UserMinus />
              Remove user
            </DropdownMenuItem>

            {/* Change role */}
            {canChangeRoleForUser && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  closeOnClick={false}
                  onClick={() => setActiveDialog("changeRole")}
                >
                  {isPromotion ? <ArrowUp /> : <ArrowDown />}
                  {changeRoleLabel}
                </DropdownMenuItem>
              </>
            )}

            {/* Transfer ownership */}
            {canTransferToUser && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  closeOnClick={false}
                  onClick={() => setActiveDialog("transfer")}
                >
                  <UserKey />
                  Transfer ownership
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── Mobile inline buttons (< md) ────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 md:hidden">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setActiveDialog("remove")}
        >
          <UserMinus />
          Remove
        </Button>

        {canChangeRoleForUser && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveDialog("changeRole")}
          >
            {isPromotion ? <ArrowUp /> : <ArrowDown />}
            {isPromotion ? "Promote" : "Demote"}
          </Button>
        )}

        {canTransferToUser && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveDialog("transfer")}
          >
            <UserKey />
            Transfer Ownership
          </Button>
        )}
      </div>

      {/* ── Dialogs rendered OUTSIDE the dropdown tree ──────────────── */}

      {/* Remove user dialog */}
      <ConfirmationDialog
        title="Remove user?"
        confirmLabel="Remove user"
        confirmingLabel="Removing..."
        isPending={isRemoving}
        trigger={<span className="hidden" />}
        open={activeDialog === "remove"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        onConfirm={(close) =>
          removeUser({ workspaceId, userId }, { onSuccess: close })
        }
        isNativeButton={false}
      >
        Remove{" "}
        <span className="font-medium text-foreground">{fullName || "this user"}</span>{" "}
        from this workspace?
      </ConfirmationDialog>

      {/* Change role dialog */}
      {canChangeRoleForUser && (
        <ConfirmationDialog
          title={`${isPromotion ? "Promote" : "Demote"} user?`}
          confirmLabel={isPromotion ? "Promote" : "Demote"}
          confirmingLabel="Updating role..."
          confirmVariant="default"
          isPending={isChangingRole}
          trigger={<span className="hidden" />}
          open={activeDialog === "changeRole"}
          onOpenChange={(open) => !open && setActiveDialog(null)}
          onConfirm={(close) =>
            changeRole(
              { workspaceId, userId, role: targetRole },
              { onSuccess: close },
            )
          }
          isNativeButton={false}
        >
          This will change{" "}
          <span className="font-medium text-foreground">{fullName || "this user"}</span>
          &apos;s role to{" "}
          <span className="font-medium text-foreground">{formatName(targetRole)}</span>.
        </ConfirmationDialog>
      )}

      {/* Transfer ownership dialog */}
      {canTransferToUser && (
        <ConfirmationDialog
          title="Transfer workspace ownership?"
          confirmLabel="Transfer ownership"
          confirmingLabel="Transferring..."
          confirmVariant="default"
          isPending={isTransferring}
          trigger={<span className="hidden" />}
          open={activeDialog === "transfer"}
          onOpenChange={(open) => !open && setActiveDialog(null)}
          onConfirm={(close) =>
            transferOwnership({ workspaceId, userId }, { onSuccess: close })
          }
          isNativeButton={false}
        >
          Transfer ownership to{" "}
          <span className="font-medium text-foreground">{fullName || "this user"}</span>
          ? They will become the workspace owner.
        </ConfirmationDialog>
      )}
    </>
  );
}
