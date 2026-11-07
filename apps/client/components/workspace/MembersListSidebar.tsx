"use client";

import { useState } from "react";
import { Users } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useWorkspaceMembers } from "@/hooks/workspace";
import { formatName } from "@/lib/utils/formatting";
import type { WorkspaceMember } from "@repo/contracts/response/workspace";

interface MembersListSidebarProps {
  workspaceId: string;
  workspaceName?: string;
}

const MemberItem = ({ member }: { member: WorkspaceMember }) => {
  const avatarSrc = member.avatarId
    ? `/avatars/${member.avatarId}.svg`
    : "/avatars/avatar_01.svg";

  const rawName = `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim();
  const fullName = rawName ? formatName(rawName) : member.email;
  const fallbackChar = (fullName || member.email).charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-8 shrink-0">
        <AvatarImage src={avatarSrc} alt={fullName} width={32} height={32} />
        <AvatarFallback>{fallbackChar}</AvatarFallback>
      </Avatar>

      <div className="grid min-w-0 flex-1 text-left leading-tight">
        <span className="truncate text-sm font-medium">{fullName}</span>
        <span className="truncate text-xs text-muted-foreground">
          {member.email}
        </span>
      </div>
    </div>
  );
};

export const MembersListSidebar = ({
  workspaceId,
  workspaceName,
}: MembersListSidebarProps) => {
  const [open, setOpen] = useState(false);
  const {
    data: members,
    isPending,
    isError,
    error,
  } = useWorkspaceMembers(workspaceId, { enabled: open });

  if (isError && !members) {
    throw error;
  }

  const [admin, ...regularMembers] = members ?? [];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm">
            <Users />
            View Members
          </Button>
        }
      />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="truncate">
            {workspaceName ? `${workspaceName}` : "Workspace Members"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          {isPending ? (
            <div className="flex flex-col gap-3 py-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="size-8 shrink-0 rounded-full" />
                  <div className="grid flex-1 gap-1.5">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : members && members.length > 0 ? (
            <div className="flex flex-col gap-6 py-4">
              {admin && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Admin
                  </span>
                  <MemberItem member={admin} />
                </div>
              )}

              {regularMembers.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Members
                  </span>
                  <div className="flex flex-col gap-3">
                    {regularMembers.map((member) => (
                      <MemberItem key={member.email} member={member} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center py-8 text-sm text-muted-foreground">
              No members found.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MembersListSidebar;
