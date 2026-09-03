"use client";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dragonName?: string;
  onConfirm: () => Promise<void> | void;
  isDeleting?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  dragonName,
  onConfirm,
  isDeleting = false,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-destructive/20 border border-destructive/30 flex items-center justify-center text-destructive">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <DialogTitle>Banir Dragão do Santuário?</DialogTitle>
        </div>
        <DialogDescription>
          Você está prestes a remover{" "}
          <strong className="text-foreground font-semibold">
            {dragonName ? `"${dragonName}"` : "este dragão"}
          </strong>{" "}
          permanentemente dos registros do santuário. Esta ação não poderá ser desfeita.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isDeleting}
        >
          Cancelar
        </Button>
        <Button
          variant="destructive"
          onClick={onConfirm}
          isLoading={isDeleting}
        >
          Confirmar Banimento
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
