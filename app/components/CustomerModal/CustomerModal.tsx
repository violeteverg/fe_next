import { useMainStore } from "@/app/lib/StoreProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import CustomerForm from "./CustomerForm";
import { useQuery } from "@tanstack/react-query";
import { getCustomerById } from "@/app/api/customerApi";
import { Loader2 } from "lucide-react";

export default function CustomerModal() {
  const { isOpen, type, setIsOpen, customerId } = useMainStore(
    (state) => state
  );
  const { data: customerData, isLoading } = useQuery({
    queryKey: ["CUSTOMER_ID"],
    queryFn: () => getCustomerById(customerId),
    enabled: !!customerId && type === "update",
  });
  const customer = customerData?.data || {};

  const defaultValues =
    type === "update" && !isLoading && customer
      ? {
          id: customer.id || 0,
          customerId: customer.id_customer || "",
          name: customer.name || "",
          address: customer.address || "",
          gender: customer.gender || "",
        }
      : {};

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? handleOpen() : handleClose())}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "create" ? "Create New Customer" : "Update Customer"}
          </DialogTitle>
          <DialogDescription>
            {type === "create" ? "." : "Please update customer carefully"}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='flex justify-center items-center h-32'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : (
          <CustomerForm defaultValues={defaultValues} />
        )}
      </DialogContent>
    </Dialog>
  );
}
