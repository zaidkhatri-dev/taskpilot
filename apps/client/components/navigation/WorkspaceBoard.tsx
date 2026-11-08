"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KanbanIcon, Plus } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceBoards } from "@/hooks/board";
import { useWorkspacePermission } from "@/hooks/workspace";
import { CreateBoardForm } from "@/components/board/CreateBoardForm";
import { formatName } from "@/lib/utils/formatting";

const SKELETON_WIDTHS = ["w-3/5", "w-4/5", "w-2/3"];

interface WorkspaceBoardsProps {
  workspaceId: string;
}

export const WorkspaceBoards = ({ workspaceId }: WorkspaceBoardsProps) => {
  const pathname = usePathname();
  const canCreateBoard = useWorkspacePermission(workspaceId, "board:create");

  const {
    data: boards,
    isPending,
    isError,
    error,
  } = useWorkspaceBoards(workspaceId);

  if (isError && !boards) {
    throw error;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Boards</SidebarGroupLabel>

      {canCreateBoard && (
        <CreateBoardForm
          workspaceId={workspaceId}
          trigger={
            <SidebarGroupAction title="New Board">
              <Plus />
              <span className="sr-only">New Board</span>
            </SidebarGroupAction>
          }
        />
      )}

      <SidebarGroupContent>
        <SidebarMenu>
          {isPending ? (
            SKELETON_WIDTHS.map((width, index) => (
              <SidebarMenuItem key={index}>
                <div className="flex h-8 items-center gap-2 px-2">
                  <Skeleton className="size-4 shrink-0 rounded-md" />
                  <Skeleton className={`h-4 ${width}`} />
                </div>
              </SidebarMenuItem>
            ))
          ) : boards && boards.length > 0 ? (
            boards.map((board) => {
              const boardUrl = `/w/${workspaceId}/b/${board.id}`;

              return (
                <SidebarMenuItem key={board.id}>
                  <SidebarMenuButton
                    render={
                      <Link href={boardUrl} className="cursor-default" />
                    }
                    isActive={
                      pathname === boardUrl ||
                      pathname.startsWith(`${boardUrl}/`)
                    }
                    tooltip={formatName(board.name)}
                  >
                    <KanbanIcon />
                    <span className="truncate">{formatName(board.name)}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })
          ) : (
            <SidebarMenuItem>
              <p className="px-3 py-2 text-xs text-muted-foreground">
                No boards yet
              </p>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
