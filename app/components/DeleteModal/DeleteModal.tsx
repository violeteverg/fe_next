/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { useMainStore } from "@/app/lib/StoreProvider";

interface DeleteModalProps {
  title?: string;
  description?: string;
  onDelete: () => void;
}

export function DeleteModal({
  title,
  description,
  onDelete,
}: DeleteModalProps) {
  const { isDelete, setIsDelete } = useMainStore((state) => state);

  const handleDelete = () => {
    onDelete();
    setIsDelete(false);
  };
  const handleOpen = () => setIsDelete(true);
  const handleClose = () => setIsDelete(false);

  return (
    <Dialog
      open={isDelete}
      onOpenChange={(open: any) => (open ? handleOpen() : handleClose())}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => setIsDelete(false)}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
