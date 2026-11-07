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

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workspace</TableHead>
                <TableHead className="w-px text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell className="w-px text-center">
                      <div className="flex items-center justify-center">
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : invitations && invitations.length > 0 ? (
                invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">
                      {formatName(invitation.name)}
                    </TableCell>
                    <TableCell className="w-px text-center">
                      <div className="flex items-center justify-center">
                        <AcceptInvitationDialog
                          workspaceId={invitation.id}
                          workspaceName={formatName(invitation.name)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No invitations found.
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
