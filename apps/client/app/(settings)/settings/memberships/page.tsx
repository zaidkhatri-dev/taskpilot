"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaces } from "@/hooks/workspace";
import { formatName } from "@/lib/utils/formatting";
import { LeaveWorkspaceDialog } from "@/components/workspace/LeaveWorkspaceDialog";
import { MembersListSidebar } from "@/components/workspace/MembersListSidebar";

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
                        <LeaveWorkspaceDialog
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
