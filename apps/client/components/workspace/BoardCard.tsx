import type { BoardItem } from "@repo/contracts/response/board";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "cn";

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
  const name = board?.name ?? propName ?? "";
  const description = board?.description ?? propDescription ?? null;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-lg",
        className,
      )}
    >
      <img
        src={`https://avatar.vercel.sh/${encodeURIComponent(name)}`}
        alt={name}
        className="aspect-video w-full object-cover grayscale brightness-50"
      />
      <CardHeader>
        <CardTitle className="truncate">{name}</CardTitle>
        {description ? (
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        ) : null}
      </CardHeader>
    </Card>
  );
};

export default BoardCard;

