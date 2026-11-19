"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceInvitations } from "@/hooks/user";
import { formatName } from "@/lib/utils/formatting";
import { AcceptInvitationDialog } from "@/components/workspace/AcceptInvitationDialog";

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
                <Skeleton className="h-8 w-16" />
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
                <div className="shrink-0">
                  <AcceptInvitationDialog
                    workspaceId={invitation.id}
                    workspaceName={formatName(invitation.name)}
                  />
                </div>
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
