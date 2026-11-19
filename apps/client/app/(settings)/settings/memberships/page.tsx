"use client";

import { RoleBadge } from "@/components/workspace/RoleBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import {
  useLeaveWorkspace,
  useWorkspacePermission,
  useWorkspaces,
} from "@/hooks/workspace";
import { formatName } from "@/lib/utils/formatting";

interface LeaveWorkspaceButtonProps {
  workspaceId: string;
  workspaceName: string;
}

const LeaveWorkspaceButton = ({
  workspaceId,
  workspaceName,
}: LeaveWorkspaceButtonProps) => {
  const canLeave = useWorkspacePermission(workspaceId, "workspace:leave");
  const { mutate: leave, isPending } = useLeaveWorkspace();

  return (
    <ConfirmationDialog
      title="Leave workspace"
      trigger={
        <Button variant="destructive" size="sm" disabled={!canLeave}>
          Leave
        </Button>
      }
      confirmLabel="Leave Workspace"
      confirmingLabel="Leaving..."
      confirmVariant="destructive"
      isPending={isPending}
      onConfirm={(close) => leave(workspaceId, { onSuccess: close })}
    >
      Are you sure you want to leave{" "}
      <span className="font-semibold text-foreground">{workspaceName}</span>?
      You will lose access to all its boards and tasks.
    </ConfirmationDialog>
  );
};

const RoutePage = () => {
  const { data: workspaces, isPending, isError, error } = useWorkspaces();

  if (isError && !workspaces) {
    throw error;
  }

  return (
    <div className="flex flex-1 flex-col items-center px-6 pt-16 pb-20">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-2xl font-semibold tracking-tight text-foreground">
          Memberships
        </h1>

        <div className="divide-y rounded-md border">
          {isPending ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex gap-3 px-4 py-3 items-center justify-between"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))
          ) : workspaces && workspaces.length > 0 ? (
            workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="flex gap-3 px-4 py-3 items-center justify-between"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <p className="truncate font-medium">
                    {formatName(workspace.name)}
                  </p>
                  <RoleBadge role={workspace.role} />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <LeaveWorkspaceButton
                    workspaceId={workspace.id}
                    workspaceName={formatName(workspace.name)}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
              No workspaces found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutePage;
