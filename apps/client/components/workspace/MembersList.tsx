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
import { useWorkspaceMembers } from "@/hooks/workspace";
import { useDebounce } from "@/hooks/use-debounce";
import { formatName } from "@/lib/utils/formatting";

type MemberStatus = "accepted" | "pending";

interface MembersListProps {
  workspaceId: string;
}

const PAGE_SIZE = 10;

const formatDate = (date?: Date | string): string => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const MembersList = ({ workspaceId }: MembersListProps) => {
  const [status, setStatus] = useState<MemberStatus>("accepted");
  const [page, setPage] = useState(1);
  const [nameInput, setNameInput] = useState("");
  const debouncedName = useDebounce(nameInput, 400);

  const { data: members, isPending, isError, error } = useWorkspaceMembers(
    workspaceId,
    { status, page, limit: PAGE_SIZE, name: debouncedName || undefined },
  );

  if (isError) throw error;

  const totalPages = members?.[0]?.totalPages ?? 1;

  const handleTabChange = (newStatus: MemberStatus) => {
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
            <TableHead>{status === "accepted" ? "Joined On" : "Invited On"}</TableHead>
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
              </TableRow>
            ))
          ) : members && members.length > 0 ? (
            members.map((member, i) => {
              const fullName = formatName(
                `${member.firstName ?? ""} ${member.lastName ?? ""}`,
              );
              const avatarSrc = member.avatarId
                ? `/avatars/${member.avatarId}.svg`
                : "/avatars/avatar_01.svg";
              const displayDate =
                status === "accepted"
                  ? formatDate(member.joinedOn)
                  : formatDate(member.invitedOn);

              return (
                <TableRow key={`${member.email}-${i}`}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9 shrink-0">
                        <AvatarImage
                          src={avatarSrc}
                          alt={fullName || member.email}
                          width={36}
                          height={36}
                        />
                        <AvatarFallback>
                          {(fullName || member.email)
                            .charAt(0)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid min-w-0 leading-tight">
                        {fullName && (
                          <span className="truncate text-sm font-medium">
                            {fullName}
                          </span>
                        )}
                        <span className="truncate text-xs text-muted-foreground">
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={member.role} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {displayDate}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={3}
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
