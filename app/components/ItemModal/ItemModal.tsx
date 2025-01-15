/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMainStore } from "@/app/lib/StoreProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import ItemForm from "./ItemForm";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/app/api/productApi";
import { Loader2 } from "lucide-react";

export default function ItemModal() {
  const { isOpen, type, setIsOpen, productId } = useMainStore((state) => state);

  const { data: productData, isLoading } = useQuery({
    queryKey: ["PRODUCT_ID", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId && type === "update",
  });

  const product = productData?.data || {};

  const defaultValues =
    type === "update" && !isLoading && product
      ? {
          productCode: product.product_code,
          name: product.name,
          category: product.category as "ATK" | "RT" | "MASAK" | "Elektronik",
          price: product.price,
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
            {type === "create" ? "Create New Item" : "Update Item"}
          </DialogTitle>
          <DialogDescription>
            {type === "create"
              ? "Add a new item to your inventory."
              : "Please update item details carefully."}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='flex justify-center items-center h-32'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
          <ItemForm defaultValues={defaultValues} />
        )}
      </DialogContent>
    </Dialog>
  );
}
