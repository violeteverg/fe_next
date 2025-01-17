/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMainStore } from "@/app/lib/StoreProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

import { useQuery } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";
import { getTransactionById } from "@/app/api/transactionApi";
import TransactionForm from "./TransactionForm";

export default function TransactionModal() {
  const { isOpen, type, setIsOpen, transactionId } = useMainStore(
    (state) => state
  );

  const {
    data: transactionData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["TRANSACTION_ID"],
    queryFn: () => getTransactionById(transactionId),
    enabled: !!transactionId && type === "update",
  });

  const transaction = transactionData?.data || {};

  const defaultValues =
    type === "update" && !isLoading && transaction
      ? {
          id: transaction.id,
          bill_id: transaction.bill_id,
          date: transaction.date,
          customer_id: transaction.customer_id,
          products: transaction.product_transactions.map((pt: any) => ({
            product_id: pt.product_id,
            quantity: pt.quantity,
          })),
        }
      : {};

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: any) => (open ? handleOpen() : handleClose())}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "create"
              ? "Create New Transaction"
              : "Update Transaction"}
          </DialogTitle>
          <DialogDescription>
            {type === "create"
              ? "Add a new item to your inventory."
              : "Please update item details carefully."}
          </DialogDescription>
        </DialogHeader>

        {isLoading || isFetching ? (
          <div className='flex justify-center items-center h-32'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
          <TransactionForm defaultValues={defaultValues} />
        )}
      </DialogContent>
    </Dialog>
  );
}
