import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const AVATARS = Array.from(
  { length: 24 },
  (_, i) => `avatar_${String(i + 1).padStart(2, "0")}`,
);

interface AvatarDialogProps {
  selected: string | null;
  setSelected: (selected: string) => void;
}

export default function AvatarDialog({
  selected,
  setSelected,
}: AvatarDialogProps) {
  const [open, setOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState(selected || "avatar_01");

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setTempSelected(selected || "avatar_01");
    }
  };

  const handleConfirm = () => {
    setSelected(tempSelected);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              onClick={() => setTempSelected(name)}
              aria-pressed={tempSelected === name}
              className={cn(
                "rounded-full p-1 transition",
                "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                tempSelected === name && "ring-2 ring-primary bg-muted",
              )}
            >
              <Avatar className="size-15">
                <AvatarImage
                  src={`/avatars/${name}.svg`}
                  width={56}
                  height={56}
                  alt={name}
                />
                <AvatarFallback>{name}</AvatarFallback>
              </Avatar>
            </button>
          ))}
        </div>
        <DialogFooter className="sm:justify-end">
          <Button type="button" onClick={handleConfirm}>
            Okay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
