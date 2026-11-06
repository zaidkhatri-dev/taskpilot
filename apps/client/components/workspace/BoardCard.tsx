import type { BoardItem } from "@repo/contracts/response/board";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "cn";
import { formatName } from "@/lib/utils/formatting";
import { getBoardCoverImage } from "@/lib/utils/image";

export interface BoardCardProps {
  board?: BoardItem;
  id?: string;
  name?: string;
  description?: string | null;
  className?: string;
}

export const BoardCard = ({
  board,
  id: propId,
  name: propName,
  description: propDescription,
  className,
}: BoardCardProps) => {
  const boardId = board?.id ?? propId ?? "";
  const name = formatName(board?.name ?? propName ?? "");
  const description = board?.description ?? propDescription ?? null;
  const coverImage = getBoardCoverImage(boardId);

  return (
    <Card
      className={cn(
        "h-full overflow-hidden pt-0 transition-all duration-200 hover:shadow-lg",
        className,
      )}
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
    </Card>
  );
};

export default BoardCard;
