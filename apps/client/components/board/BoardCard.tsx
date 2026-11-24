"use client";

import type { BoardItem } from "@repo/contracts/response/board";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Trash } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useDeleteBoard } from "@/hooks/board";
import { useWorkspacePermission } from "@/hooks/workspace";
import { formatName } from "@/lib/utils/formatting";
import { getBoardCoverImage } from "@/lib/utils/image";
import { UpdateBoardForm } from "./UpdateBoardForm";

export interface BoardCardProps {
  board?: BoardItem;
  id?: string;
  name?: string;
  description?: string | null;
  className?: string;
  workspaceId?: string;
}

export const BoardCard = ({
  board,
  id: propId,
  name: propName,
  description: propDescription,
  className,
  workspaceId: propWorkspaceId,
}: BoardCardProps) => {
  const params = useParams<{ id: string }>();
  const workspaceId = propWorkspaceId ?? params?.id ?? "";

  const boardId = board?.id ?? propId ?? "";
  const name = formatName(board?.name ?? propName ?? "");
  const description = board?.description ?? propDescription ?? null;
  const coverImage = getBoardCoverImage(boardId);

  const canUpdateBoard = useWorkspacePermission(workspaceId, "board:update");
  const canDeleteBoard = useWorkspacePermission(workspaceId, "board:delete");

  const { mutate: deleteBoardMutation, isPending: isDeleting } =
    useDeleteBoard();

  const boardItem: BoardItem = board ?? {
    id: boardId,
    name,
    description,
  };

  const showActions =
    workspaceId && boardId && (canUpdateBoard || canDeleteBoard);

  return (
    <Card
      className={`relative h-full overflow-hidden pt-0 transition-all duration-200 hover:shadow-lg${
        className ? ` ${className}` : ""
      }`}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-t-4xl">
        <Image
          src={coverImage}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="rounded-t-4xl object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="truncate">{name}</CardTitle>
        <CardDescription className="line-clamp-2 min-h-10">
          {description ?? "\u00A0"}
        </CardDescription>
      </CardHeader>
      {showActions && (
        <div
          className="-mt-3 -mb-2 flex justify-end gap-1 px-6"
          onClick={(e) => {
            // Stop the click from reaching the parent <Link>'s onClick.
            e.stopPropagation();
            // Also cancel the <a> default navigation, but only for clicks
            // that physically happen inside this div. Clicks from portaled
            // dialogs (e.g. a form submit) bubble here through the React
            // tree and must not be cancelled.
            if (e.currentTarget.contains(e.target as Node)) {
              e.preventDefault();
            }
          }}
        >
          {canUpdateBoard && (
            <UpdateBoardForm workspaceId={workspaceId} board={boardItem} />
          )}
          {canDeleteBoard && (
            <ConfirmationDialog
              title="Delete board"
              confirmLabel="Delete Board"
              confirmingLabel="Deleting..."
              confirmVariant="destructive"
              isPending={isDeleting}
              onConfirm={(close) =>
                deleteBoardMutation(
                  { workspaceId, boardId },
                  {
                    onSuccess: () => {
                      close();
                    },
                  },
                )
              }
              trigger={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Delete board"
                  disabled={isDeleting}
                >
                  <Trash className="size-4" />
                </Button>
              }
            >
              Are you sure you want to delete{" "}
              {name && (
                <span className="font-semibold text-foreground">{name}</span>
              )}
              ? This action cannot be undone and will permanently remove all
              associated tasks and data.
            </ConfirmationDialog>
          )}
        </div>
      )}
    </Card>
  );
};

export default BoardCard;
