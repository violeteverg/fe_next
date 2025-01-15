/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createCustomer, updateCustomer } from "@/app/api/customerApi";
import { useMainStore } from "@/app/lib/StoreProvider";

export default function CustomerForm({
  defaultValues,
}: {
  defaultValues: any;
}) {
  const queryClient = useQueryClient();
  const { type, setIsOpen } = useMainStore((state) => state);

  const { handleSubmit, control, reset } = useForm({
    defaultValues,
  });

  const { mutate: createCustomerMutation, isPending: isPendingCreate } =
    useMutation({
      mutationFn: (val: any) => createCustomer(val),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["CUSTOMER"] });
        setIsOpen(false);
        reset();
      },
      onError: () => {
        console.log("Error creating customer");
      },
    });

  const { mutate: updateCustomerMutation, isPending: isPendingUpdate } =
    useMutation({
      mutationFn: ({ id, val }: { id: number; val: any }) =>
        updateCustomer(id, val),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["CUSTOMER"] });
        setIsOpen(false);
        reset();
      },
      onError: () => {
        console.log("Error updating customer");
      },
    });

  const onSubmit = async (val: any) => {
    const customerData = {
      name: val.name,
      address: val.address,
      gender: val.gender,
    };

    if (type === "update") {
      updateCustomerMutation({ id: val.customerId, val: customerData });
    } else {
      createCustomerMutation(customerData);
    }
  };
  const pending = isPendingCreate || isPendingUpdate;

  return (
    <form
      className='grid items-start gap-4 mx-4 my-2'
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='grid gap-2'>
        <Label>Nama</Label>
        <Controller
          control={control}
          name='name'
          render={({ field }) => (
            <Input {...field} placeholder='Masukkan Nama Anda' />
          )}
        />
      </div>

      <div className='grid gap-2'>
        <Label>Domisili</Label>
        <Controller
          control={control}
          name='address'
          render={({ field }) => (
            <Input {...field} placeholder='Masukkan Domisili Anda' />
          )}
        />
      </div>

      <div className='grid gap-2'>
        <Label>Jenis Kelamin</Label>
        <Controller
          control={control}
          name='gender'
          render={({ field: { onChange, value } }) => (
            <Select onValueChange={onChange} value={value || ""}>
              <SelectTrigger className='border rounded px-4 py-2'>
                <SelectValue placeholder='Pilih Jenis Kelamin' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='pria'>Pria</SelectItem>
                <SelectItem value='wanita'>Wanita</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button type='submit' disabled={pending}>
        {type === "update" ? "Update Data" : "Simpan Data"}
      </Button>
    </form>
  );
}
