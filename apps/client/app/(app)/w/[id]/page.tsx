"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useWorkspaceBoards } from "@/hooks/board";
import { useWorkspacePermission } from "@/hooks/workspace";
import { BoardCard } from "@/components/workspace/BoardCard";
import { BoardCardSkeleton } from "@/components/board/BoardCardSkeleton";
import { CreateBoardForm } from "@/components/board/CreateBoardForm";
import { Card } from "@/components/ui/card";

export default function RoutePage() {
  const { id } = useParams<{ id: string }>();
  const canCreateBoard = useWorkspacePermission(id, "board:create");

  const { data: boards, isPending, isError, error } = useWorkspaceBoards(id);

  if (isError && !boards) throw error;

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          Boards
        </h1>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6">
        {isPending ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <BoardCardSkeleton key={i} />
            ))}
          </div>
        ) : boards && boards.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {boards.map((board) => (
              <Link
                key={board.id}
                href={`/w/${id}/b/${board.id}`}
                className="cursor-default block rounded-4xl transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <BoardCard board={board} />
              </Link>
            ))}

            {canCreateBoard && (
              <CreateBoardForm
                workspaceId={id}
                triggerIsNativeButton={false}
                trigger={
                  <Card className="flex h-full min-h-60 cursor-default flex-col items-center justify-center gap-3 border-2 border-dashed border-muted-foreground/25 bg-transparent p-6 shadow-none ring-0 transition-all duration-200 hover:-translate-y-1 hover:border-muted-foreground/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <div className="flex size-9 items-center justify-center rounded-full bg-background shadow-xs">
                      <Plus className="size-4 text-muted-foreground" />
                    </div>
                    <span className="font-heading text-base font-medium text-foreground">
                      Add Board
                    </span>
                  </Card>
                }
              />
            )}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-lg font-semibold text-foreground">
                No boards yet
              </h3>
              {canCreateBoard && <CreateBoardForm workspaceId={id} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
