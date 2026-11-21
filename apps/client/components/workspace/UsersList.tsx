"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleBadge } from "@/components/workspace/RoleBadge";
import { useDebounce } from "@/hooks/use-debounce";
import { formatName, formatDate } from "@/lib/utils/formatting";
import { useWorkspacePermission, useWorkspaceUsers } from "@/hooks/workspace";
import { RemoveUser } from "@/components/workspace/RemoveUser";
import { ChangeRole } from "@/components/workspace/ChangeRole";
import { TransferOwnership } from "@/components/workspace/TransferOwnership";
import {
  canTransferOwnershipTo,
  isRoleChangeValid,
} from "@/lib/utils/workspace";

type UserStatus = "accepted" | "pending";

interface UsersListProps {
  workspaceId: string;
}

const PAGE_SIZE = 10;

export const UsersList = ({ workspaceId }: UsersListProps) => {
  const [status, setStatus] = useState<UserStatus>("accepted");
  const [page, setPage] = useState(1);
  const [nameInput, setNameInput] = useState("");
  const debouncedName = useDebounce(nameInput, 400);
  const canChangeRole = useWorkspacePermission(workspaceId, "user:change-role");
  const canTransfer = useWorkspacePermission(workspaceId, "workspace:transfer");

  const { data, isPending, isError, error } = useWorkspaceUsers(workspaceId, {
    status,
    page,
    limit: PAGE_SIZE,
    name: debouncedName || undefined,
  });

  if (isError) throw error;

  const totalPages = data?.totalPages ?? 1;
  const users = data?.users ?? [];

  const handleTabChange = (newStatus: UserStatus) => {
    setStatus(newStatus);
    setPage(1);
    setNameInput("");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name…"
            className="pl-9"
            value={nameInput}
            onChange={handleNameChange}
          />
        </div>

        {/* Tabs */}
        <div className="flex shrink-0 items-center gap-1 rounded-4xl border border-border bg-muted/40 p-1">
          {(["accepted", "pending"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={`rounded-3xl px-4 py-1.5 text-sm font-medium capitalize transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                status === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>
              {status === "accepted" ? "Joined On" : "Invited On"}
            </TableHead>
            {status === "accepted" && <TableHead />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-9 shrink-0 rounded-full" />
                    <div className="flex flex-col gap-1.5">
                      <Skeleton className="h-3.5 w-28" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-3.5 w-24" />
                </TableCell>
                {status === "accepted" && <TableCell />}
              </TableRow>
            ))
          ) : users.length > 0 ? (
            users.map((user, i) => {
              const fullName = formatName(
                `${user.firstName ?? ""} ${user.lastName ?? ""}`,
              );
              const avatarSrc = user.avatarId
                ? `/avatars/${user.avatarId}.svg`
                : "/avatars/avatar_01.svg";
              const displayDate =
                status === "accepted"
                  ? formatDate(user.joinedOn)
                  : formatDate(user.invitedOn);

              const canChangeRoleForUser =
                canChangeRole && isRoleChangeValid(
                  user.role,
                  user.role === "admin" ? "member" : "admin",
                );
              const canTransferToUser =
                canTransfer && canTransferOwnershipTo(user.role);

              return (
                <TableRow key={`${user.email}-${i}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9 shrink-0">
                        <AvatarImage
                          src={avatarSrc}
                          alt={fullName || user.email}
                          width={36}
                          height={36}
                        />
                        <AvatarFallback>
                          {(fullName || user.email).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid min-w-0 leading-tight">
                        {fullName && (
                          <span className="truncate text-sm font-medium">
                            {fullName}
                          </span>
                        )}
                        <span className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {displayDate}
                  </TableCell>
                  {status === "accepted" && (
                    <TableCell>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <RemoveUser
                          workspaceId={workspaceId}
                          userId={user.userId}
                          firstName={user.firstName || ""}
                          lastName={user.lastName || ""}
                        />
                        {canChangeRoleForUser && (
                          <ChangeRole
                            workspaceId={workspaceId}
                            userId={user.userId}
                            currentRole={user.role}
                            firstName={user.firstName || ""}
                            lastName={user.lastName || ""}
                          />
                        )}
                        {canTransferToUser && (
                          <TransferOwnership
                            workspaceId={workspaceId}
                            userId={user.userId}
                            currentRole={user.role}
                            firstName={user.firstName || ""}
                            lastName={user.lastName || ""}
                          />
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={status === "accepted" ? 4 : 3}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                {debouncedName
                  ? `No ${status} members match "${debouncedName}".`
                  : `No ${status} members found.`}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isPending}
              aria-label="Previous page"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isPending}
              aria-label="Next page"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
