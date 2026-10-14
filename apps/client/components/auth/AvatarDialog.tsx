import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// ["avatar_01", "avatar_02", ..., "avatar_24"]
const AVATARS = Array.from(
  { length: 24 },
  (_, i) => `avatar_${String(i + 1).padStart(2, "0")}`,
);

export default function AvatarDialog({
  selected,
  setSelected,
}: {
  selected: string | null;
  setSelected: (selected: string) => void;
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline">
            <PencilIcon data-icon="inline-start" /> Select Avatar
          </Button>
        }
      />
      <DialogContent>
        <div className="grid grid-cols-4 gap-4 max-h-70 overflow-y-scroll no-scrollbar p-4 justify-items-center">
          {AVATARS.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setSelected(name)}
              aria-pressed={selected === name}
              className={cn(
                "rounded-full p-1 transition",
                "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected === name && "ring-2 ring-primary bg-muted",
              )}
            >
              <Avatar className="size-14">
                <AvatarImage src={`/avatars/${name}.svg`} />
                <AvatarFallback>{name}</AvatarFallback>
              </Avatar>
            </button>
          ))}
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose render={<Button type="button">Okay</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
