"use client";

import { UserMinus } from "lucide-react";

import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { useRemoveWorkspaceUser } from "@/hooks/workspace";
import { formatName } from "@/lib/utils/formatting";

interface RemoveUserProps {
  workspaceId: string;
  userId: string;
  firstName: string;
  lastName: string;
}

export const RemoveUser = ({
  workspaceId,
  userId,
  firstName,
  lastName,
}: RemoveUserProps) => {
  const { mutate, isPending } = useRemoveWorkspaceUser();

  return (
    <ConfirmationDialog
      title="Remove user?"
      confirmLabel="Remove user"
      confirmingLabel="Removing..."
      isPending={isPending}
      trigger={
        <Button variant="destructive" size="sm">
          <UserMinus />
          Remove
        </Button>
      }
      onConfirm={(close) =>
        mutate({ workspaceId, userId }, { onSuccess: close })
      }
    >
      Remove <span className="font-medium text-foreground">{`${formatName(firstName)} ${formatName(lastName)}`}</span> from
      this workspace?
    </ConfirmationDialog>
  );
};

export default RemoveUser;