"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ConfirmationDialogProps {
  title: string;
  children: React.ReactNode;
  trigger: React.ReactElement;
  confirmLabel?: string;
  confirmingLabel?: string;
  confirmVariant?: React.ComponentProps<typeof Button>["variant"];
  isPending?: boolean;
  onConfirm: (close: () => void) => void;
}

export const ConfirmationDialog = ({
  title,
  children,
  trigger,
  confirmLabel = "Confirm",
  confirmingLabel = "Confirming...",
  confirmVariant = "destructive",
  isPending = false,
  onConfirm,
}: ConfirmationDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">{children}</div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button
            variant={confirmVariant}
            disabled={isPending}
            onClick={() => onConfirm(() => setOpen(false))}
          >
            {isPending ? confirmingLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
