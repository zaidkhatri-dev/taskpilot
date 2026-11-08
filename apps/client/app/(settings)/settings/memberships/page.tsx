"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import {
  useLeaveWorkspace,
  useWorkspacePermission,
  useWorkspaces,
} from "@/hooks/workspace";
import { formatName } from "@/lib/utils/formatting";
import { MembersListSidebar } from "@/components/workspace/MembersListSidebar";

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
      <span className="font-semibold text-foreground">{workspaceName}</span>? You
      will lose access to all its boards and tasks.
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

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workspace</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-px text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell className="w-px text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : workspaces && workspaces.length > 0 ? (
                workspaces.map((workspace) => (
                  <TableRow key={workspace.id}>
                    <TableCell className="font-medium">
                      {formatName(workspace.name)}
                    </TableCell>
                    <TableCell className="capitalize">
                      {workspace.role ?? "-"}
                    </TableCell>
                    <TableCell className="w-px text-center">
                      <div className="flex items-center justify-center gap-2">
                        <MembersListSidebar
                          workspaceId={workspace.id}
                          workspaceName={formatName(workspace.name)}
                        />
                        <LeaveWorkspaceButton
                          workspaceId={workspace.id}
                          workspaceName={formatName(workspace.name)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No workspaces found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RoutePage;
