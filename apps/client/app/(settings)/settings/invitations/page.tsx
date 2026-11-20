"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useWorkspaceInvitations } from "@/hooks/user";
import { useProcessWorkspaceInvitation } from "@/hooks/workspace";
import { formatName } from "@/lib/utils/formatting";

interface InvitationActionsProps {
  workspaceId: string;
  workspaceName: string;
}

const InvitationActions = ({
  workspaceId,
  workspaceName,
}: InvitationActionsProps) => {
  const { mutate: processInvitation, isPending } =
    useProcessWorkspaceInvitation();

  return (
    <div className="flex shrink-0 items-center gap-2">
      <ConfirmationDialog
        title="Reject invitation"
        trigger={
          <Button variant="outline" size="sm">
            Reject
          </Button>
        }
        confirmLabel="Reject Invitation"
        confirmingLabel="Rejecting..."
        confirmVariant="destructive"
        isPending={isPending}
        onConfirm={(close) =>
          processInvitation(
            { workspaceId, accepted: false },
            { onSuccess: close },
          )
        }
      >
        Are you sure you want to reject the invitation to join{" "}
        <span className="font-semibold text-foreground">{workspaceName}</span>?
      </ConfirmationDialog>

      <ConfirmationDialog
        title="Accept invitation"
        trigger={<Button size="sm">Accept</Button>}
        confirmLabel="Accept Invitation"
        confirmingLabel="Accepting..."
        confirmVariant="default"
        isPending={isPending}
        onConfirm={(close) =>
          processInvitation(
            { workspaceId, accepted: true },
            { onSuccess: close },
          )
        }
      >
        Are you sure you want to accept the invitation to join{" "}
        <span className="font-semibold text-foreground">{workspaceName}</span>?
      </ConfirmationDialog>
    </div>
  );
};

const RoutePage = () => {
  const {
    data: invitations,
    isPending,
    isError,
    error,
  } = useWorkspaceInvitations();

  if (isError && !invitations) {
    throw error;
  }

  return (
    <div className="flex flex-1 flex-col items-center px-6 pt-16 pb-20">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
          Invitations
        </h1>

        <div className="divide-y rounded-md border">
          {isPending ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <Skeleton className="h-5 w-32" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))
          ) : invitations && invitations.length > 0 ? (
            invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <span className="min-w-0 flex-1 truncate font-medium">
                  {formatName(invitation.name)}
                </span>
                <InvitationActions
                  workspaceId={invitation.id}
                  workspaceName={formatName(invitation.name)}
                />
              </div>
            ))
          ) : (
            <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
              No invitations found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutePage;
