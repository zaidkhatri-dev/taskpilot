"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { KanbanIcon, Plus } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";

import { useWorkspaceBoards } from "@/hooks/board";
import { CreateBoardForm } from "@/components/board/CreateBoardForm";
import { formatName } from "@/lib/utils/formatting";

interface WorkspaceBoardsProps {
  workspaceId: string;
}

export function WorkspaceBoards({ workspaceId }: WorkspaceBoardsProps) {
  const params = useParams<{ boardId?: string }>();

  const {
    data: boards,
    isPending,
    isError,
    error,
  } = useWorkspaceBoards(workspaceId);

  if (isError) {
    throw error;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Boards</SidebarGroupLabel>

      <CreateBoardForm
        workspaceId={workspaceId}
        trigger={
          <SidebarGroupAction title="New Board">
            <Plus />
            <span className="sr-only">New Board</span>
          </SidebarGroupAction>
        }
      />

      <SidebarGroupContent>
        <SidebarMenu>
          {isPending ? (
            Array.from({ length: 3 }).map((_, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            ))
          ) : boards.length > 0 ? (
            boards.map((board) => (
              <SidebarMenuItem key={board.id}>
                <SidebarMenuButton
                  render={
                    <Link
                      href={`/w/${workspaceId}/b/${board.id}`}
                      className="cursor-default"
                    />
                  }
                  isActive={params.boardId === board.id}
                  tooltip={formatName(board.name)}
                >
                  <KanbanIcon />
                  <span className="truncate">{formatName(board.name)}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
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
}
