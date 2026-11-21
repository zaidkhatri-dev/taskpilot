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
  /** Controlled open state – when provided the dialog is fully controlled */
  open?: boolean;
  /** Called when the dialog requests an open/close transition */
  onOpenChange?: (open: boolean) => void;
  isNativeButton?: boolean;
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
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  isNativeButton = true,
}: ConfirmationDialogProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled
    ? (controlledOnOpenChange ?? (() => {}))
    : setUncontrolledOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {<DialogTrigger render={trigger} nativeButton={isNativeButton} />}
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
